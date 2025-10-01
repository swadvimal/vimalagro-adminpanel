import React, { useState, useEffect } from "react";
import { FaDatabase, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = "https://backendvimalagro.onrender.com/ourstory";

function Ourstory() {

    const [storypera, setstorypera] = useState("");
    const [tableData, setTableData] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [editId, setEditId] = useState(null);

    // ✅ Fetch Stories (GET)
    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        setFetching(true);
        try {
            const res = await axios.get(API_URL);
            const sorted = res.data.data.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            setTableData(sorted);
        } catch (error) {
            console.error("Error fetching stories:", error);
        } finally {
            setFetching(false);
        }
    };

    // ✅ Add or Update Story
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!storypera.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Please enter a story before submitting!",
            });
            return;
        }

        try {
            if (editId) {
                // 🔹 Update existing story
                await axios.put(`${API_URL}/${editId}`, { storypera });

                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: "Story has been updated successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                // 🔹 Create new story
                await axios.post(API_URL, { storypera });

                Swal.fire({
                    icon: "success",
                    title: "Uploaded!",
                    text: "Story has been added successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }

            setstorypera("");
            setEditId(null);
            fetchStories();
        } catch (error) {
            console.error("Error submitting story:", error);
            Swal.fire("Error", "Failed to save story", "error");
        }
    };

    // ✅ Edit Story
    const handleEdit = (item) => {
        setstorypera(item.storypera);
        setEditId(item._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ✅ Delete Story
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the story!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/${id}`);
                    fetchStories();

                    Swal.fire({
                        title: "Deleted!",
                        text: "Story has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    console.error("Error deleting story:", error);
                    Swal.fire("Error", "Failed to delete story", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">
                Our Story
            </h3>

            {/* Upload / Update Form */}
            <form onSubmit={handleSubmit}>
                <div className="rounded-3 shadow overflow-hidden">
                    <div
                        className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                    >
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" />
                            {editId ? "Edit Story" : "Add Our Story"}
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Our Story</label>
                            <input
                                type="text"
                                name="storypera"
                                value={storypera}
                                onChange={(e) => setstorypera(e.target.value)}
                                className="mt-1 w-100 form-control border border-secondary"
                                placeholder="Enter Story Here ..."
                            />
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

            {/* Table Section */}
            <div className="rounded-3 shadow overflow-hidden my-4">
                <div
                    className="p-3"
                    style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                >
                    <h6 className="fw-bold m-0 text-dark">
                        <FaDatabase className="me-2" />
                        Added Our Story
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
                                        Our Story
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
                                            <td>{item.storypera}</td>
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
                                        <td colSpan="2" className="text-center text-muted">
                                            No Our Story.
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

export default Ourstory;
