import React, { useEffect, useRef, useState } from "react";
import { FaDatabase, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

function Principles() {

    const [fetching, setFetching] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        principlenumber: "",
        principletitle: "",
        principledescription: "",
        principleimage: null,
        smallpngimage: null
    });

    const [preview, setPreview] = useState({
        principleimage: null,
        smallpngimage: null
    });

    const principleImageRef = useRef(null);
    const subImageRef = useRef(null);

    const fetchPrinciples = async () => {
        try {
            setFetching(true);
            const res = await fetch("https://backendvimalagro.onrender.com/principle");
            const data = await res.json();
            setTableData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchPrinciples();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });

            const fileURL = URL.createObjectURL(files[0]);
            setPreview({ ...preview, [name]: fileURL });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.principlenumber.trim() ||
            !formData.principletitle.trim() ||
            !formData.principledescription.trim() ||
            (!formData.principleimage && !editingId) ||
            (!formData.smallpngimage && !editingId)
        ) {
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill all fields before submitting.",
            });
            return;
        }

        try {

            Swal.fire({
                title: editingId ? "Updating Principle..." : "Uploading Principle...",
                text: editingId
                    ? "Please wait while we update your principle data."
                    : "Please wait while we add your new principle data.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const formDataObj = new FormData();
            formDataObj.append("principlenumber", formData.principlenumber);
            formDataObj.append("principletitle", formData.principletitle);
            formDataObj.append("principledescription", formData.principledescription);
            if (formData.principleimage) formDataObj.append("principleimage", formData.principleimage);
            if (formData.smallpngimage) formDataObj.append("smallpngimage", formData.smallpngimage);

            let url = "https://backendvimalagro.onrender.com/principle";
            let method = "POST";

            if (editingId) {
                url = `https://backendvimalagro.onrender.com/principle/${editingId}`;
                method = "PUT";
            }

            const res = await fetch(url, { method, body: formDataObj });

            Swal.close();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: editingId ? "Updated!" : "Added!",
                    text: editingId ? "Principle updated successfully." : "Principle added successfully.",
                    showConfirmButton: false,
                    timer: 2000,
                });

                setFormData({
                    principlenumber: "",
                    principletitle: "",
                    principledescription: "",
                    principleimage: null,
                    smallpngimage: null
                });
                setPreview({ principleimage: null, smallpngimage: null });

                if (principleImageRef.current) principleImageRef.current.value = "";
                if (subImageRef.current) subImageRef.current.value = "";

                setEditingId(null);
                fetchPrinciples();
            } else {
                Swal.fire({ icon: "error", title: "Failed to save principle!", showConfirmButton: true });
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error!", text: "Something went wrong.", showConfirmButton: true });
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setFormData({
            principlenumber: item.principlenumber,
            principletitle: item.principletitle,
            principledescription: item.principledescription,
            principleimage: null,
            smallpngimage: null
        });

        setPreview({
            principleimage: item.principleimage || null,
            smallpngimage: item.smallpngimage || null
        });

        if (principleImageRef.current) principleImageRef.current.value = "";
        if (subImageRef.current) subImageRef.current.value = "";
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this principle?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`https://backendvimalagro.onrender.com/principle/${id}`, { method: "DELETE" });
            if (res.ok) {
                Swal.fire({ icon: 'success', title: "Deleted!", text: "Principle deleted successfully.", showConfirmButton: false, timer: 2000 });
                fetchPrinciples();
            } else {
                Swal.fire({ icon: 'error', title: 'Failed to delete principle!', showConfirmButton: false, timer: 2000 });
            }
        } catch (error) {
            console.error("Error deleting principle:", error);
            Swal.fire({ icon: 'error', title: 'Something went wrong!', text: error.message, showConfirmButton: true });
        }
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Our Principles</h3>

            <form onSubmit={handleSubmit}>
                <div className="rounded-3 shadow overflow-hidden">
                    <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" />
                            {editingId ? "Edit Principle Details" : "Add Principles Details"}
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Principles No.</label>
                                <input type="text" name="principlenumber" value={formData.principlenumber} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" placeholder="Enter Principles No." />
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Principles Title</label>
                                <input type="text" name="principletitle" value={formData.principletitle} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" placeholder="Enter Principles Title" />
                            </div>
                        </div>
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Description</label>
                            <textarea name="principledescription" value={formData.principledescription} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" placeholder="Enter Description"></textarea>
                        </div>
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Principles Image (794px × 528px)</label>
                                <input type="file" name="principleimage" ref={principleImageRef} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" />
                                {preview.principleimage && <img src={preview.principleimage} alt="Preview" className="mt-2" style={{ height: "60px", objectFit: "contain" }} />}
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Principles SubImage (100px × 100px)</label>
                                <input type="file" name="smallpngimage" ref={subImageRef} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" />
                                {preview.smallpngimage && <img src={preview.smallpngimage} alt="Preview" className="mt-2" style={{ height: "60px", objectFit: "contain" }} />}
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <button type="submit" className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow">
                                <span>{editingId ? "Update" : "Submit"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="rounded-3 shadow overflow-hidden my-4">
                <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                    <h6 className="fw-bold m-0 text-dark">
                        <FaDatabase className="me-2" />
                        Added Our Principles
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
                                    <th className="text-white" style={{ width: "15%", background: "var(--red)" }}>Principles Image</th>
                                    <th className="text-white" style={{ width: "15%", background: "var(--red)" }}>Principles SubImage</th>
                                    <th className="text-white" style={{ width: "15%", background: "var(--red)" }}>Principles No.</th>
                                    <th className="text-white" style={{ width: "15%", background: "var(--red)" }}>Principles Title</th>
                                    <th className="text-white" style={{ width: "30%", background: "var(--red)" }}>Description</th>
                                    <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody className="pera">
                                {tableData.length > 0 ? (
                                    tableData.map((item) => (
                                        <tr key={item._id}>
                                            <td style={{ width: "15%" }}><img src={item.principleimage} alt={item.principletitle} style={{ height: "40px", objectFit: "contain" }} /></td>
                                            <td style={{ width: "15%" }}><img src={item.smallpngimage} style={{ height: "40px", objectFit: "contain" }} /></td>
                                            <td style={{ width: "15%" }}>{item.principlenumber}</td>
                                            <td style={{ width: "15%" }}>{item.principletitle}</td>
                                            <td style={{ width: "30%" }}>{item.principledescription}</td>
                                            <td style={{ width: "10%" }}>
                                                <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center">
                                                    <FaEdit className="text-warning fs-5 me-0 me-md-2 mb-2 mb-md-0" style={{ cursor: "pointer" }} onClick={() => handleEdit(item)} />
                                                    <FaTrash className="text-danger fs-5" style={{ cursor: "pointer" }} onClick={() => handleDelete(item._id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted">No Our Principles.</td>
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

export default Principles