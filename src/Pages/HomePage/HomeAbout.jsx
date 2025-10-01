import React, { useState, useEffect } from "react";
import { FaDatabase, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

function HomeAbout() {

    const [tableData, setTableData] = useState([]);
    const [images, setImages] = useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false); // submit loader
    const [fetching, setFetching] = useState(true); // data fetching loader

    const fetchData = () => {
        setFetching(true);
        axios
            .get("https://backendvimalagro.onrender.com/aboutus")
            .then((res) => {
                if (res.data && Array.isArray(res.data)) {
                    setTableData(res.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
            }).finally(() => {
                setFetching(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageChange = (e) => {
        setImages({
            ...images,
            [e.target.name]: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (tableData.length === 0) {
            if (!images.image1 || !images.image2 || !images.image3 || !images.image4) {
                Swal.fire({
                    icon: "warning",
                    title: "All Images Required!",
                    text: "Please upload all images before submitting.",
                });
                return;
            }
        }

        if (tableData.length >= 1 && !isEditing) {
            Swal.fire({
                icon: "warning",
                title: "Already Exists!",
                text: "Images already exist! Use Edit button to update.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("image1", images.image1);
        formData.append("image2", images.image2);
        formData.append("image3", images.image3);
        formData.append("image4", images.image4);

        try {
            Swal.fire({
                title: isEditing ? "Updating Images..." : "Uploading Images...",
                text: isEditing
                    ? "Please wait while we update your images."
                    : "Please wait while we upload your images.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            if (isEditing && editId) {
                await axios.put(
                    `https://backendvimalagro.onrender.com/aboutus/${editId}`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: "Images updated successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                setIsEditing(false);
                setEditId(null);
            } else {
                await axios.post("https://backendvimalagro.onrender.com/aboutus", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Images uploaded successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }

            fetchData();
            setImages({ image1: null, image2: null, image3: null, image4: null });
            e.target.reset();
        } catch (error) {
            console.error("Error adding/updating data:", error);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };

    const handleEdit = (item) => {
        setIsEditing(true);
        setEditId(item._id);
        setImages({
            image1: item.image1,
            image2: item.image2,
            image3: item.image3,
            image4: item.image4,
        });
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the About Us Images!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://backendvimalagro.onrender.com/aboutus/${id}`);
                    fetchData();
                    Swal.fire({
                        title: "Deleted!",
                        text: "About Us Images deleted successfully.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    console.error("Error deleting data:", error);
                    Swal.fire("Error", "Failed to delete About Us entry", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">About Us</h3>
            <form onSubmit={handleSubmit}>
                <div className="rounded-3 shadow overflow-hidden">
                    <div
                        className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                    >
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" />
                            {isEditing ? "Edit About Us Image" : "Add About Us Image"}
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Image 1 (360px × 449px(Vertically Rectangle))</label>
                                <input
                                    type="file"
                                    name="image1"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    disabled={!isEditing && tableData.length >= 1}
                                />
                                {typeof images.image1 === "string" && (
                                    <div className="mt-1 text-secondary"
                                        style={{
                                            fontSize: "12px",
                                            whiteSpace: "normal",
                                            wordBreak: "break-all",
                                        }}>{images.image1}</div>
                                )}
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Image 2 (360px × 450px (Vertically Rectangle))</label>
                                <input
                                    type="file"
                                    name="image2"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    disabled={!isEditing && tableData.length >= 1}
                                />
                                {typeof images.image2 === "string" && (
                                    <div className="mt-1 text-secondary"
                                        style={{
                                            fontSize: "12px",
                                            whiteSpace: "normal",
                                            wordBreak: "break-all",
                                        }}>{images.image2}</div>
                                )}
                            </div>
                        </div>
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Image 3 (360px × 503px (Vertically Rectangle))</label>
                                <input
                                    type="file"
                                    name="image3"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    disabled={!isEditing && tableData.length >= 1}
                                />
                                {typeof images.image3 === "string" && (
                                    <div className="mt-1 text-secondary"
                                        style={{
                                            fontSize: "12px",
                                            whiteSpace: "normal",
                                            wordBreak: "break-all",
                                        }}>{images.image3}</div>
                                )}
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Image 4 (800px × 800px(Square shape))</label>
                                <input
                                    type="file"
                                    name="image4"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    disabled={!isEditing && tableData.length >= 1}
                                />
                                {typeof images.image4 === "string" && (
                                    <div className="mt-1 text-secondary"
                                        style={{
                                            fontSize: "12px",
                                            whiteSpace: "normal",
                                            wordBreak: "break-all",
                                        }}>{images.image4}</div>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 text-center">
                            <button
                                type="submit"
                                className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span>
                                        <div className="spinner-border spinner-border-sm me-2"
                                            role="status"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    <span>{isEditing ? "Update" : "Submit"}</span>
                                )}
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
                        Added About Us Image
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
                                    <th className="text-white" style={{ background: "var(--red)" }}>Image 1</th>
                                    <th className="text-white" style={{ background: "var(--red)" }}>Image 2</th>
                                    <th className="text-white" style={{ background: "var(--red)" }}>Image 3</th>
                                    <th className="text-white" style={{ background: "var(--red)" }}>Image 4</th>
                                    <th className="text-white" style={{ background: "var(--red)" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody className="pera">
                                {tableData.length > 0 ? (
                                    tableData.map((item) => (
                                        <tr key={item._id}>
                                            <td><img src={item.image1} alt="aboutus" style={{ width: "60px", height: "60px", objectFit: "cover" }} /></td>
                                            <td><img src={item.image2} alt="aboutus" style={{ width: "60px", height: "60px", objectFit: "cover" }} /></td>
                                            <td><img src={item.image3} alt="aboutus" style={{ width: "60px", height: "60px", objectFit: "cover" }} /></td>
                                            <td><img src={item.image4} alt="aboutus" style={{ width: "60px", height: "60px", objectFit: "cover" }} /></td>
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
                                        <td colSpan="5" className="text-center text-muted">No About Us Images.</td>
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

export default HomeAbout