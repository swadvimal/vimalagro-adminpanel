import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaDatabase, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import ExtraSubHeading from "./ExtraSubHeading";

const API_URL = "https://backendvimalagro.onrender.com/api/extrasubproducts";

function ExtraSubProduct() {

    const [subProducts, setSubProducts] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [products, setProducts] = useState([]);
    const [fetching, setFetching] = useState(true);

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        productId: "",
        subproductName: "",
        description: "",
        weight: "",
        subproductImg: null,
    });

    const [editingId, setEditingId] = useState(null);

    // validation
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // loader
    const [formSubmitting, setFormSubmitting] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await axios.get("https://backendvimalagro.onrender.com/api/products");
            setProducts(res.data);
        };
        fetchProducts();
    }, []);

    const fetchData = async () => {
        setFetching(true);
        try {
            const res = await axios.get(API_URL);
            setSubProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ validation
    const validate = () => {
        const err = {};
        if (!formData.productId) err.productId = "Product is required";
        if (!formData.subproductName.trim()) err.subproductName = "Subproduct Name is required";
        if (!formData.description.trim()) err.description = "Description is required";
        if (!formData.weight) err.weight = "Weight is required";
        if (!formData.subproductImg && !editingId) err.subproductImg = "Image is required";
        return err;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
            setImagePreview(URL.createObjectURL(files[0]));
            if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        } else {
            setFormData({ ...formData, [name]: value });
            if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        const err = validate();
        setErrors(err);

        if (Object.keys(err).length > 0) {
            const messages = Object.values(err).join('<br />');
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill all required fields before submitting.",
            });
            return;
        }

        setFormSubmitting(true);

        try {
            const fd = new FormData();
            fd.append("productId", formData.productId);

            const extras = [
                {
                    subproductName: formData.subproductName,
                    description: formData.description,
                    weight: formData.weight,
                },
            ];
            fd.append("extrasubproducts", JSON.stringify(extras));

            if (formData.subproductImg) {
                fd.append("subproductImg_0", formData.subproductImg);
            }

            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, fd);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Subproduct updated successfully',
                    timer: 2000,
                    showConfirmButton: false
                });
                setEditingId(null);
            } else {
                await axios.post(`${API_URL}/add`, fd);
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'Subproduct added successfully',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            setFormData({
                productId: "",
                subproductName: "",
                description: "",
                weight: "",
                subproductImg: null,
            });
            setImagePreview(null);
            setSubmitted(false);
            fetchData();

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Failed!',
                text: 'Failed to save subproduct',
                confirmButtonText: "OK"
            });
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/${id}`);
                    fetchData();
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'The extra subproduct has been deleted.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } catch (err) {
                    console.error(err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed!',
                        text: 'Failed to delete the extra subproduct.',
                        confirmButtonText: 'OK'
                    });
                }
            }
        });
    };

    const handleEdit = (extra) => {
        setEditingId(extra._id);
        const firstSub = extra.extrasubproducts?.[0] || {};
        setFormData({
            productId: extra.productId?._id || "",
            subproductName: firstSub.subproductName || "",
            description: firstSub.description || "",
            weight: firstSub.weight || "",
            subproductImg: null,
        });
        setImagePreview(firstSub.subproductImg || null);
        setErrors({});
        setSubmitted(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Extra SubProduct</h3>
            <ExtraSubHeading />
            <form onSubmit={handleSubmit} noValidate>
                <div className="rounded-3 shadow overflow-hidden">
                    <div className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" /> {editingId ? "Edit Extra SubProduct" : "Add Extra SubProduct"}
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Select Product</label>
                            <select name="productId" className="mt-1 w-100 form-control border border-secondary" value={formData.productId} onChange={handleChange}                                >
                                <option value="">Select Product</option>
                                {products.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.productName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Subproduct Name</label>
                                <input type="text" name="subproductName" placeholder="Enter SubProduct Name" value={formData.subproductName} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" />
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Weight</label>
                                <input type="text" name="weight" placeholder="Enter Weight" value={formData.weight} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" />
                            </div>
                        </div>
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Description</label>
                            <textarea name="description" placeholder="Enter Description" value={formData.description} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" />
                        </div>
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Subproduct Image</label>
                            <input type="file" ref={fileInputRef} name="subproductImg" className="mt-1 w-100 form-control border border-secondary" onChange={handleChange} />
                            {imagePreview && (
                                <img src={imagePreview} alt="preview" width={60} height={60} className="mt-2 object-fit-fill" />
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
                        Added Extra SubProduct
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
                                    <th className="text-white" style={{ width: "10px", background: "var(--red)" }}>Subproduct Image</th>
                                    <th className="text-white" style={{ width: "20px", background: "var(--red)" }}>Subproduct Name</th>
                                    <th className="text-white" style={{ width: "40px", background: "var(--red)" }}>Description</th>
                                    <th className="text-white" style={{ width: "10px", background: "var(--red)" }}>Weight</th>
                                    <th className="text-white" style={{ width: "20px", background: "var(--red)" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody className="pera">
                                {subProducts.map((extra) =>
                                    extra.extrasubproducts.map((sp, i) => (
                                        <tr key={i}>
                                            <td style={{ width: "10px" }}>{sp.subproductImg && <img src={sp.subproductImg} alt="" width="50" />}</td>
                                            <td style={{ width: "20px" }}>{sp.subproductName}</td>
                                            <td style={{ width: "40px" }}>{sp.description}</td>
                                            <td style={{ width: "10px" }}>{sp.weight}</td>
                                            <td style={{ width: "20px" }}>
                                                <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center">
                                                    <FaEdit className="text-warning fs-5 me-0 me-md-2 mb-2 mb-md-0" onClick={() => handleEdit(extra)} style={{ cursor: "pointer" }} />
                                                    <FaTrash className="text-danger fs-5" onClick={() => handleDelete(extra._id)} style={{ cursor: "pointer" }} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {subProducts.length === 0 || subProducts.every(extra => extra.extrasubproducts.length === 0) ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">No Extra SubProduct Data Found.</td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExtraSubProduct