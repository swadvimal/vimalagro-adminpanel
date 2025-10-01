import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaDatabase, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
const API_URL = "https://backendvimalagro.onrender.com/categories";
function OurCategory() {
    const [categoriesData, setCategoriesData] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [fetching, setFetching] = useState(true);

    const fileInputRef = useRef([]);

    const [formData, setFormData] = useState({
        productId: "",
        category: [
            {
                categoryName: "",
                productName: "",
                description: "",
                categoryBanner: null
            }
        ],
    });

    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);

    // Fetch products for select dropdown
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
            setCategoriesData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const validate = () => {
        const err = {};
        if (!formData.productId) err.productId = "Product is required";
        formData.category.forEach((cat, i) => {
            if (!cat.categoryName.trim()) err[`categoryName_${i}`] = "Category Name is required";
            if (!cat.productName.trim()) err[`productName_${i}`] = "Product Name is required";
            if (!cat.description.trim()) err[`description_${i}`] = "Description is required";
            if (!cat.categoryBanner && !editingId) err[`categoryBanner_${i}`] = "Banner is required";
        });
        return err;
    };

    const handleChange = (e, index) => {
        const { name, value, files } = e.target;
        const updatedCategory = [...formData.category];
        if (files) {
            updatedCategory[index][name] = files[0];
            const updatedPreviews = [...imagePreviews];
            updatedPreviews[index] = URL.createObjectURL(files[0]);
            setImagePreviews(updatedPreviews);
            if (errors[name]) setErrors((prev) => ({ ...prev, [`${name}_${index}`]: null }));
        } else {
            updatedCategory[index][name] = value;
            if (errors[name]) setErrors((prev) => ({ ...prev, [`${name}_${index}`]: null }));
        }
        setFormData({ ...formData, category: updatedCategory });
    };

    // const addCategoryField = () => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         category: [...prev.category, { categoryName: "", productName: "", description: "", categoryBanner: null }]
    //     }));
    //     setImagePreviews((prev) => [...prev, null]);
    // };

    const removeCategoryField = (index) => {
        const updatedCategory = [...formData.category];
        const updatedPreviews = [...imagePreviews];
        updatedCategory.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setFormData({ ...formData, category: updatedCategory });
        setImagePreviews(updatedPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        const err = validate();
        setErrors(err);
        if (Object.keys(err).length > 0) {
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

            formData.category.forEach((cat, i) => {
                const catData = {
                    categoryName: cat.categoryName,
                    productName: cat.productName,
                    description: cat.description
                };
                fd.append("category", JSON.stringify([catData])); // keep as array for backend
                if (cat.categoryBanner) fd.append(`categoryBanner_${i}`, cat.categoryBanner);
            });

            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, fd);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Category updated successfully',
                    timer: 2000,
                    showConfirmButton: false
                });
                setEditingId(null);
            } else {
                await axios.post(`${API_URL}/add`, fd);
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'Category added successfully',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            // Reset form
            setFormData({
                productId: "",
                category: [{ categoryName: "", productName: "", description: "", categoryBanner: null }],
            });
            setImagePreviews([]);
            setSubmitted(false);
            fetchData();
            fileInputRef.current = [];
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Failed!',
                text: 'Failed to save category',
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
                        text: 'Category deleted successfully.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } catch (err) {
                    console.error(err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed!',
                        text: 'Failed to delete category.',
                        confirmButtonText: 'OK'
                    });
                }
            }
        });
    };

    const handleEdit = (catDoc) => {
        setEditingId(catDoc._id);
        setFormData({
            productId: catDoc.productId?._id || "",
            category: catDoc.category.map(c => ({
                categoryName: c.categoryName || "",
                productName: c.productName || "",
                description: c.description || "",
                categoryBanner: null
            }))
        });
        setImagePreviews(catDoc.category.map(c => c.categoryBanner || null));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="container mt-3 mt-lg-0 mt-md-0">
            <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Our Categories</h3>

            <form onSubmit={handleSubmit} noValidate>
                <div className="rounded-3 shadow overflow-hidden">
                    <div className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" /> {editingId ? "Edit Categories" : "Add Categories"}
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Select Product</label>
                            <select name="productId" className="mt-1 w-100 form-control border border-secondary" value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: e.target.value })}>
                                <option value="">Select Product</option>
                                {products.map((p) => (
                                    <option key={p._id} value={p._id}>{p.productName}</option>
                                ))}
                            </select>
                        </div>

                        {formData.category.map((cat, index) => (
                            <div key={index} className="border p-3 my-2 rounded-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6>Category {index + 1}</h6>
                                    {formData.category.length > 1 && (
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeCategoryField(index)}>Remove</button>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <label className="d-block fw-bold">Category Name</label>
                                    <input type="text" name="categoryName" placeholder="Enter Category Name" value={cat.categoryName} onChange={(e) => handleChange(e, index)} className="mt-1 w-100 form-control border border-secondary" />
                                </div>
                                <div className="mt-2">
                                    <label className="d-block fw-bold">Product Name</label>
                                    <input type="text" name="productName" placeholder="Enter Product Name" value={cat.productName} onChange={(e) => handleChange(e, index)} className="mt-1 w-100 form-control border border-secondary" />
                                </div>
                                <div className="mt-2">
                                    <label className="d-block fw-bold">Description</label>
                                    <textarea name="description" placeholder="Enter Description" value={cat.description} onChange={(e) => handleChange(e, index)} className="mt-1 w-100 form-control border border-secondary" />
                                </div>
                                <div className="mt-2">
                                    <label className="d-block fw-bold">Category Banner (Rectangle Shape)</label>
                                    <input type="file" ref={(el) => fileInputRef.current[index] = el} name="categoryBanner" className="mt-1 w-100 form-control border border-secondary" onChange={(e) => handleChange(e, index)} />
                                    {imagePreviews[index] && <img src={imagePreviews[index]} alt="preview" width={60} height={60} className="mt-2 object-fit-fill" />}
                                </div>
                            </div>
                        ))}

                        {/* <button type="button" className="btn btn-secondary mt-2" onClick={addCategoryField}>Add Another Category</button> */}

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
                        Added Categories
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
                                    <th className="text-white" style={{ background: "var(--red)" }}>Category Banner</th>
                                    <th className="text-white" style={{ background: "var(--red)" }}>Category Name</th>
                                    <th className="text-white" style={{ background: "var(--red)" }}>Product Name</th>
                                    <th className="text-white" style={{ background: "var(--red)" }}>Description</th>
                                    <th className="text-white" style={{ background: "var(--red)" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody className="pera">
                                {categoriesData.map((catDoc) =>
                                    catDoc.category.map((cat, i) => (
                                        <tr key={i}>
                                            <td>{cat.categoryBanner && <img src={cat.categoryBanner} alt="" width="50" />}</td>
                                            <td>{cat.categoryName}</td>
                                            <td>{cat.productName}</td>
                                            <td>{cat.description}</td>
                                            <td>
                                                <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center">
                                                    <FaEdit className="text-warning fs-5 me-0 me-md-2 mb-2 mb-md-0" onClick={() => handleEdit(catDoc)} style={{ cursor: "pointer" }} />
                                                    <FaTrash className="text-danger fs-5" onClick={() => handleDelete(catDoc._id)} style={{ cursor: "pointer" }} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {categoriesData.length === 0 || categoriesData.every(doc => doc.category.length === 0) ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">No Category Data Found.</td>
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


export default OurCategory