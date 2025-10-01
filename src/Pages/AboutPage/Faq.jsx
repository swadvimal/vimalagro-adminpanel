import React, { useEffect, useState } from "react";
import { FaDatabase, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

function Faq() {

    const [tableData, setTableData] = useState([]);
    const [que, setQue] = useState("");
    const [ans, setAns] = useState("");
    const [fetching, setFetching] = useState(true);
    const [editId, setEditId] = useState(null);

    const fetchFaqs = () => {
        setFetching(true);
        fetch("https://backendvimalagro.onrender.com/faq")
            .then((res) => res.json())
            .then((data) => {
                if (data && Array.isArray(data.data)) {
                    setTableData(data.data);
                } else {
                    setTableData([]);
                }
            })
            .catch((err) => console.error("Error fetching FAQ:", err))
            .finally(() => {
                setFetching(false);
            });
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!que.trim() || !ans.trim()) {
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill all fields before submitting.",
            });
            return;
        }

        try {
            let url = "https://backendvimalagro.onrender.com/faq";
            let method = "POST";

            if (editId) {
                url = `https://backendvimalagro.onrender.com/faq/${editId}`;
                method = "PUT";
            }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ que, ans }),
            });

            const data = await res.json();
            console.log("Response:", data);

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: editId ? "Updated!" : "Added!",
                    text: editId
                        ? "FAQ updated successfully."
                        : "FAQ added successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                setQue("");
                setAns("");
                setEditId(null);

                fetchFaqs();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: data.message || "Something went wrong!",
                });
            }
        } catch (err) {
            console.error("Error saving FAQ:", err);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to save FAQ",
            });
        }
    };

    const handleEdit = (item) => {
        setQue(item.que);
        setAns(item.ans);
        setEditId(item._id);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(
                        `https://backendvimalagro.onrender.com/faq/${id}`,
                        { method: "DELETE" }
                    );
                    const data = await res.json();

                    if (res.ok) {
                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: "FAQ deleted successfully.",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        fetchFaqs();
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error!",
                            text: data.message || "Failed to delete FAQ",
                        });
                    }
                } catch (err) {
                    console.error("Error deleting FAQ:", err);
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: "Something went wrong while deleting",
                    });
                }
            }
        });
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Faq</h3>

            <form onSubmit={handleSubmit}>
                <div className="rounded-3 shadow overflow-hidden">
                    <div
                        className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                    >
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" />
                            {editId ? "Edit Faq" : "Add Faq"}
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Question (Max 10 Words)</label>
                                <input
                                    type="text"
                                    name="que"
                                    value={que}
                                    onChange={(e) => {
                                        const words = e.target.value.trim().split(/\s+/);
                                        if (words.length <= 10) {
                                            setQue(e.target.value);
                                        }
                                    }}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    placeholder="Enter Question"
                                />
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Answer (Max 45 Words)</label>
                                <input
                                    type="text"
                                    name="ans"
                                    value={ans}
                                    onChange={(e) => {
                                        const words = e.target.value.trim().split(/\s+/);
                                        if (words.length <= 45) {
                                            setAns(e.target.value);
                                        }
                                    }}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    placeholder="Enter Answer"
                                />
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
                        Faq Data
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
                                    <th
                                        className="text-white"
                                        style={{ width: "10%", background: "var(--red)" }}
                                    >
                                        Sr. No.
                                    </th>
                                    <th
                                        className="text-white"
                                        style={{ width: "30%", background: "var(--red)" }}
                                    >
                                        Question
                                    </th>
                                    <th
                                        className="text-white"
                                        style={{ width: "45%", background: "var(--red)" }}
                                    >
                                        Answer
                                    </th>
                                    <th
                                        className="text-white"
                                        style={{ width: "15%", background: "var(--red)" }}
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="pera">
                                {tableData.length > 0 ? (
                                    tableData.map((item, index) => (
                                        <tr key={item._id}>
                                            <td style={{ width: "10%" }}>{index + 1}</td>
                                            <td style={{ width: "30%" }}>{item.que}</td>
                                            <td style={{ width: "45%" }}>{item.ans}</td>
                                            <td style={{ width: "15%" }}>
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
                                        <td colSpan="4" className="text-center text-muted">
                                            No Faq Data Found.
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

export default Faq