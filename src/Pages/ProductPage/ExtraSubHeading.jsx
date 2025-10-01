import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const API_URL = "https://backendvimalagro.onrender.com/api/heading";

function ExtraSubHeading() {

    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        productId: "",
        subproductTitle: "",
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);

    // 🔹 Fetch product list for dropdown
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(
                    "https://backendvimalagro.onrender.com/api/products"
                );
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products", err);
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        if (!formData.productId || !formData.subproductTitle.trim()) {
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill all required fields before submitting.",
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setFormSubmitting(true);
        try {
            await axios.post(API_URL, formData);
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "SubProduct Heading saved successfully.",
                timer: 2000,
                showConfirmButton: false
            });
            setFormData({ productId: "", subproductTitle: "" });
        } catch (err) {
            console.error("Error saving subproduct heading", err);

            if (err.response && err.response.status === 400) {
                if (
                    err.response.data.error?.includes("already exists") ||
                    err.response.data.error?.includes("duplicate key")
                ) {
                    Swal.fire({
                        icon: "error",
                        title: "Duplicate Entry",
                        text: "This subproduct title already exists for the selected product.",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: err.response.data.error,
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to save subproduct heading.",
                });
            }
        } finally {
            setFormSubmitting(false);
        }
    };

    return (
        <div className="mt-3 mt-lg-0 mt-md-0 mb-4">
            <form onSubmit={handleSubmit} noValidate>
                <div className="rounded-3 shadow overflow-hidden">
                    <div className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" /> SubProduct Details
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Select Product</label>
                                <select
                                    name="productId"
                                    className="mt-1 w-100 form-control border border-secondary"
                                    value={formData.productId}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Product</option>
                                    {products.map((p) => (
                                        <option key={p._id} value={p._id}>
                                            {p.productName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">SubProduct Tittle</label>
                                <input
                                    type="text"
                                    name="subproductTitle"
                                    placeholder="Enter SubProduct Tittle"
                                    value={formData.subproductTitle}
                                    onChange={handleChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <button
                                type="submit"
                                className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                                disabled={formSubmitting}
                            >
                                <span>{formSubmitting ? "Update" : "Submit"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ExtraSubHeading