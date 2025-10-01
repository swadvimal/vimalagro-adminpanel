import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FaDatabase, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

function ProductBanner() {

    const [tableData, setTableData] = useState([]);
    const [desktopBanner, setDesktopBanner] = useState(null);
    const [mobileBanner, setMobileBanner] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [editId, setEditId] = useState(null);
    const [currentImages, setCurrentImages] = useState({ desktopproductbanner: "", mobileproductbanner: "" });

    const desktopInputRef = useRef(null);
    const mobileInputRef = useRef(null);

    const API_URL = "https://backendvimalagro.onrender.com/productbanner";

    // Fetch existing banners
    const fetchBanners = async () => {
        setFetching(true);
        try {
            const response = await axios.get(API_URL);
            setTableData(response.data);
            if (response.data.length > 0) {
                setIsDisabled(true);
            } else {
                setIsDisabled(false);
            }
        } catch (error) {
            console.error("Error fetching banners:", error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    // Handle form submit for adding new banner
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isDisabled && !editId) {
            Swal.fire({
                icon: "warning",
                title: "Already Exists!",
                text: "Banners already exist! Use Edit button to update.",
            });
            return;
        }

        if (!editId && (!desktopBanner || !mobileBanner)) {
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please upload all banners before submitting.",
            });
            return;
        }

        const formData = new FormData();
        if (desktopBanner) formData.append("desktopproductbanner", desktopBanner);
        if (mobileBanner) formData.append("mobileproductbanner", mobileBanner);

        if (editId) {
            // Update existing banner
            Swal.fire({
                title: 'Updating...',
                text: 'Please wait while your banners are being updated.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                await axios.put(`${API_URL}/${editId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: "Your banners have been updated successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                setEditId(null);
                setIsDisabled(true);
                setDesktopBanner(null);
                setMobileBanner(null);
                if (desktopInputRef.current) desktopInputRef.current.value = "";
                if (mobileInputRef.current) mobileInputRef.current.value = "";
                fetchBanners();

            } catch (error) {
                console.error("Error updating banners:", error);
                Swal.fire({
                    icon: "error",
                    title: "Update Failed!",
                    text: "Something went wrong while updating banners.",
                });
            }
        } else {
            // Add new banner
            Swal.fire({
                title: 'Uploading...',
                text: 'Please wait while your banners are being uploaded.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                await axios.post(API_URL, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                Swal.fire({
                    icon: "success",
                    title: "Added!",
                    text: "Your banners have been uploaded successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                setIsDisabled(true);
                setDesktopBanner(null);
                setMobileBanner(null);
                if (desktopInputRef.current) desktopInputRef.current.value = "";
                if (mobileInputRef.current) mobileInputRef.current.value = "";
                fetchBanners();

            } catch (error) {
                console.error("Error uploading banners:", error);
                Swal.fire({
                    icon: "error",
                    title: "Upload Failed!",
                    text: "Something went wrong while uploading banners.",
                });
            }
        }
    };

    // Handle edit click
    const handleEdit = (item) => {
        setEditId(item._id);
        setIsDisabled(false);
        setDesktopBanner(null);
        setMobileBanner(null);
        setCurrentImages({
            desktopproductbanner: item.desktopproductbanner,
            mobileproductbanner: item.mobileproductbanner,
        });

        if (desktopInputRef.current) desktopInputRef.current.value = "";
        if (mobileInputRef.current) mobileInputRef.current.value = "";
    };

    // Handle delete banner
    const handleDelete = (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/${id}`);
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Banner has been deleted.',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    fetchBanners();
                } catch (error) {
                    console.error("Error deleting banner:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Failed!',
                        text: 'Something went wrong while deleting the banner.',
                    });
                }
            }
        });
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Product Banner</h3>
            <form onSubmit={handleSubmit}>
                <div className="rounded-3 shadow overflow-hidden">
                    <div
                        className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                    >
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" /> {editId ? "Edit Product Banner" : "Add Product Banner"}
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Banner (Desktop View- Horizotally Rectangle)</label>
                                <input
                                    type="file"
                                    name="desktopproductbanner"
                                    accept="image/*"
                                    className="mt-1 w-100 form-control border border-secondary"
                                    onChange={(e) => {
                                        setDesktopBanner(e.target.files[0]);
                                        setCurrentImages(prev => ({ ...prev, desktopproductbanner: "" })); // Clear old path
                                    }}
                                    ref={desktopInputRef}
                                    disabled={isDisabled}
                                />
                                {editId && currentImages.desktopproductbanner && (
                                    <div className="mt-1 text-secondary" style={{ fontSize: "12px", whiteSpace: "normal", wordBreak: "break-all" }}>
                                        {currentImages.desktopproductbanner}
                                    </div>
                                )}
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Banner (Mobile View)</label>

                                <input
                                    type="file"
                                    name="mobileproductbanner"
                                    accept="image/*"
                                    className="mt-1 w-100 form-control border border-secondary"
                                    onChange={(e) => {
                                        setMobileBanner(e.target.files[0]);
                                        setCurrentImages(prev => ({ ...prev, mobileproductbanner: "" })); // Clear old path
                                    }}
                                    ref={mobileInputRef}
                                    disabled={isDisabled}
                                />
                                {editId && currentImages.mobileproductbanner && (
                                    <div className="mt-1 text-secondary" style={{ fontSize: "12px", whiteSpace: "normal", wordBreak: "break-all" }}>
                                        {currentImages.mobileproductbanner}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <button
                                type="submit"
                                className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                            >
                                <span>{editId ? "Update" : "Submit"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="rounded-3 shadow overflow-hidden my-4">
                <div
                    className="p-3"
                    style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                >
                    <h6 className="fw-bold m-0 text-dark">
                        <FaDatabase className="me-2" />
                        Added Product Banner
                    </h6>
                </div>
                <div className="bg-white p-4 table-responsive">
                    {fetching ? (
                        <div className="text-center">
                            <div role="status">
                                <img src={require("../../assets/Images/loader.gif")} className="img-fluid" alt="" />
                            </div>
                        </div>
                    ) : (
                        <table className="table table-bordered border-secondary custom-table table-hover text-center">
                            <thead style={{ fontSize: "15px" }}>
                                <tr>
                                    <th className="text-white" style={{ background: "var(--red)" }}>
                                        Banner (Desktop View)
                                    </th>
                                    <th className="text-white" style={{ background: "var(--red)" }}>
                                        Banner (Mobile View)
                                    </th>
                                    <th className="text-white" style={{ background: "var(--red)" }}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="pera">
                                {tableData.length > 0 ? (
                                    tableData.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <img
                                                    src={item.desktopproductbanner}
                                                    alt="Desktop Banner"
                                                    style={{
                                                        height: "60px",
                                                        objectFit: "fill",
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <img
                                                    src={item.mobileproductbanner}
                                                    alt="Mobile Banner"
                                                    style={{
                                                        height: "60px",
                                                        objectFit: "fill",
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center">
                                                    <FaEdit
                                                        className="text-warning fs-5 me-0 me-md-2 mb-2 mb-md-0"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleEdit(item)}
                                                    />
                                                    <FaTrash
                                                        className="text-danger fs-5"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleDelete(item._id)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center text-muted">
                                            No Product Banner.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductBanner