import React, { useState, useRef, useEffect } from "react";
import { FaDatabase, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = "https://backendvimalagro.onrender.com/vimalabout";

function Vimalaboutus() {
    const [aboutImage, setAboutImage] = useState(null);
    const [oldPath, setOldPath] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [editingId, setEditingId] = useState(null); // 🔹 Track editing item
    const fileInputRef = useRef(null);

    // ✅ Fetch About Us Images (GET)
    useEffect(() => {
        fetchAboutImages();
    }, []);

    const fetchAboutImages = async () => {
        setFetching(true);
        try {
            const res = await axios.get(API_URL);
            const sorted = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setTableData(sorted);
        } catch (error) {
            console.error("Error fetching About Us images:", error);
        } finally {
            setFetching(false);
        }
    };

    // ✅ File change handler
    const handleFileChange = (e) => {
        setAboutImage(e.target.files[0]);
        setOldPath(null); // hide old path once new selected
    };
    // ✅ Add About Us Image (POST)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 👉 Prevent multiple images
        if (tableData.length >= 1) {
            Swal.fire({
                icon: "warning",
                title: "Already Exists!",
                text: "Image already exist! Use Edit button to update.",
            });
            return;
        }

        if (!aboutImage) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Please select an image before submitting!",
            });
            return;
        }

        const formData = new FormData();
        formData.append("vimalaboutimage", aboutImage);

        try {
            await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire({
                icon: "success",
                title: "Uploaded!",
                text: "About Us image has been added successfully.",
                timer: 2000,
                showConfirmButton: false,
            });

            setAboutImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            fetchAboutImages();
        } catch (error) {
            console.error("Error uploading About Us image:", error);
            Swal.fire("Error", "Failed to upload About Us image", "error");
        }
    };

    // ✅ Edit Image (Enable input)
    const handleEdit = (id) => {
        setEditingId(id);
        const oldImage = tableData.find((item) => item._id === id)?.vimalaboutimage;
        setOldPath(oldImage || null); // show old path
        setAboutImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ✅ Update About Us Image (PUT)
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!aboutImage) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Please select an image before updating!",
            });
            return;
        }

        const formData = new FormData();
        formData.append("vimalaboutimage", aboutImage);

        try {
            await axios.put(`${API_URL}/${editingId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "About Us image has been updated successfully.",
                timer: 2000,
                showConfirmButton: false,
            });

            setAboutImage(null);
            setEditingId(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            fetchAboutImages();
        } catch (error) {
            console.error("Error updating About Us image:", error);
            Swal.fire("Error", "Failed to update About Us image", "error");
        }
    };

    // ✅ Delete About Us Image (DELETE)
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the image!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/${id}`);
                    fetchAboutImages();

                    Swal.fire({
                        title: "Deleted!",
                        text: "About Us image has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    console.error("Error deleting image:", error);
                    Swal.fire("Error", "Failed to delete image", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Vimal About Us</h3>
            <form onSubmit={editingId ? handleUpdate : handleSubmit}>
                <div className="rounded-3 shadow overflow-hidden">
                    <div
                        className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                    >
                        <h6 className="fw-bold m-0 text-dark">
                            {editingId ? (
                                <>
                                    <FaPlus className="me-2" /> Edit About Us Image
                                </>
                            ) : (
                                <>
                                    <FaPlus className="me-2" /> Add About Us Image
                                </>
                            )}
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">About Us Image( 1500px × 1004px)</label>
                            <input
                                type="file"
                                name="vimalaboutimage"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="mt-1 w-100 form-control border border-secondary"
                                disabled={!editingId && tableData.length >= 1}
                            />
                            {editingId && oldPath && (
                                <div className="mt-2 text-secondary"
                                    style={{
                                        fontSize: "12px",
                                        whiteSpace: "normal",
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {oldPath}
                                </div>
                            )}
                        </div>
                        <div className="mt-3 text-center">
                            <button
                                type="submit"
                                className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                            >
                                <span>{editingId ? "Update" : "Submit"}</span>
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
                        Added About Us Images
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
                                        About Us Image
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
                                                    src={item.vimalaboutimage}
                                                    alt="About Us"
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        objectFit: "contain",
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center">
                                                    <FaEdit
                                                        className="text-warning fs-5 me-0 me-md-2 mb-2 mb-md-0"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleEdit(item._id)}
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
                                        <td colSpan="2" className="text-center text-muted">
                                            No About Us Images.
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

export default Vimalaboutus