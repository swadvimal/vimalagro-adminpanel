import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaDatabase, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [editingProductId, setEditingProductId] = useState(null);
    const [expandedProductId, setExpandedProductId] = useState(null);

    const productBannerRef = useRef(null);
    const productBannerMobileRef = useRef(null);   // ✅ new
    const productImagesRef = useRef(null);
    const banner2Ref = useRef(null);
    const banner2MobileRef = useRef(null);         // ✅ new
    const howToMakeBannerRef = useRef(null);
    const howToMakeBannerMobileRef = useRef(null); // ✅ new

    const subproductImgRef = useRef(null);

    const recipeMainImgRef = useRef(null);
    const recipeSubImgRef = useRef(null);

    const [product, setProduct] = useState({
        productBanner: "",
        productBannerMobile: "",  // ✅ new
        productName: "",
        productImages: [],
        productSizes: [],
        subproducts: [],
        banner2: "",
        banner2Mobile: "",        // ✅ new
        howToMakeBanner: "",
        howToMakeBannerMobile: "",// ✅ new
        recipes: [],
    });

    const [files, setFiles] = useState({
        productBanner: null,
        productBannerMobile: null,   // ✅ new
        banner2: null,
        banner2Mobile: null,         // ✅ new
        howToMakeBanner: null,
        howToMakeBannerMobile: null, // ✅ new
        productImages: [],
    });

    const [sub, setSub] = useState({
        subproductName: "",
        subproductImg: "",
        description: "",
        weight: "",
    });
    const [editingSubIndex, setEditingSubIndex] = useState(null);

    const [recipe, setRecipe] = useState({
        recipeName: "",
        steps: [""],
        recipeMainImg: "",
        recipeSubImg: "",
    });
    const [editingRecipeIndex, setEditingRecipeIndex] = useState(null);

    // Validation error states
    const [productErrors, setProductErrors] = useState({});
    const [subErrors, setSubErrors] = useState({});
    const [recipeErrors, setRecipeErrors] = useState({});

    // Submitted flags
    const [productSubmitted, setProductSubmitted] = useState(false);
    const [subSubmitted, setSubSubmitted] = useState(false);
    const [recipeSubmitted, setRecipeSubmitted] = useState(false);

    // Loading states
    const [loadingImages, setLoadingImages] = useState({
        productBanner: false,
        productBannerMobile: false, // ✅ new
        banner2: false,
        banner2Mobile: false,       // ✅ new
        howToMakeBanner: false,
        howToMakeBannerMobile: false,// ✅ new
        productImages: false,
        subproductImg: false,
        recipeMainImg: false,
        recipeSubImg: false,
    });
    const [formSubmitting, setFormSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setFetching(true);
        try {
            const res = await axios.get(
                "https://backendvimalagro.onrender.com/api/products"
            );
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products", err);
        } finally {
            setFetching(false);
        }
    };

    // Helper: validate product fields
    // const validateProduct = () => {
    //     // If ANY of the 6 fields are missing, return an error flag
    //     if (
    //         !product.productName.trim() ||
    //         !product.productSizes.length ||
    //         product.productSizes.every((s) => !s.trim()) ||
    //         (!product.productBanner && !files.productBanner) ||
    //         (!product.productImages.length && !files.productImages.length) ||
    //         (!product.banner2 && !files.banner2) ||
    //         (!product.howToMakeBanner && !files.howToMakeBanner)
    //     ) {
    //         return { allRequired: true };
    //     }
    //     return {};
    // };

    const validateProduct = () => {
        if (
            !product.productName.trim() ||
            !product.productSizes.length ||
            product.productSizes.every((s) => !s.trim()) ||
            (!product.productBanner && !files.productBanner) ||
            (!product.productBannerMobile && !files.productBannerMobile) || // ✅ new
            (!product.productImages.length && !files.productImages.length) ||
            (!product.banner2 && !files.banner2) ||
            (!product.banner2Mobile && !files.banner2Mobile) ||             // ✅ new
            (!product.howToMakeBanner && !files.howToMakeBanner) ||
            (!product.howToMakeBannerMobile && !files.howToMakeBannerMobile) // ✅ new
        ) {
            return { allRequired: true };
        }
        return {};
    };

    // Helper: validate subproduct only if any field filled
    const validateSub = () => {
        if (
            !sub.subproductName.trim() ||
            !sub.subproductImg ||
            !sub.description.trim() ||
            !sub.weight
        ) {
            return { allRequired: true };
        }
        return {};
    };

    // Helper: validate recipe only if any field filled
    const validateRecipe = () => {
        const errors = {};

        if (!recipe.recipeName.trim())
            errors.recipeName = "Recipe Name is required";
        if (!recipe.recipeMainImg)
            errors.recipeMainImg = "Main Recipe Image is required";
        if (!recipe.recipeSubImg)
            errors.recipeSubImg = "Sub Recipe Image is required";
        if (
            recipe.steps.length === 0 ||
            recipe.steps.some((step) => !step.trim())
        )
            errors.steps = "All steps must be filled";
        return errors;
    };

    // Clear product error on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: name === "productSizes" ? value.split(",") : value,
        }));
        if (productErrors[name]) {
            setProductErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Clear subproduct error on input change
    const handleSubChange = (e) => {
        const { name, value } = e.target;
        setSub((prev) => ({ ...prev, [name]: value }));
        if (subErrors[name]) {
            setSubErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Clear recipe error on input change
    const handleRecipeChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({ ...prev, [name]: value }));
        if (recipeErrors[name]) {
            setRecipeErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Handle steps change with error clearing
    const handleStepChange = (index, value) => {
        // split words (ignore multiple spaces)
        const words = value.trim().split(/\s+/).filter(Boolean);

        if (words.length > 15) {
            return; // stop typing after 15 words
        }

        const newSteps = [...recipe.steps];
        newSteps[index] = value;
        setRecipe({ ...recipe, steps: newSteps });
    };

    // Handle file select with loader for product images
    const handleFileSelect = (e, key, multiple = false) => {
        if (multiple) {
            setFiles((prev) => ({ ...prev, [key]: [...prev[key], ...e.target.files] }));
        } else {
            setFiles((prev) => ({ ...prev, [key]: e.target.files[0] }));
        }
        // Clear error for that field
        if (productErrors[key]) {
            setProductErrors((prev) => ({ ...prev, [key]: null }));
        }
    };

    // Subproduct image upload with loader and error clearing
    const handleSubFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSub((prev) => ({ ...prev, subproductImg: file }));
        }
    };

    // Recipe image upload with loader and error clearing
    const handleRecipeFileUpload = (e, key) => {
        const files = e.target.files;
        if (!files) return;

        if (key === "recipeSubImg") {
            setRecipe((prev) => ({
                ...prev,
                recipeSubImg: Array.from(files), // always array
            }));
        } else {
            setRecipe((prev) => ({
                ...prev,
                [key]: files[0],
            }));
        }
    };

    // Add or update subproduct with validation
    const addOrUpdateSubproduct = () => {
        setSubSubmitted(true);
        const errors = validateSub();

        if (errors.allRequired) {
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill in all fields for the subproduct before submitting.",
            });
            return;
        }

        setProduct((prev) => {
            const updatedSubs = [...prev.subproducts];
            if (editingSubIndex !== null) {
                updatedSubs[editingSubIndex] = { ...sub };
                Swal.fire({
                    title: "Updated!",
                    text: "✅ SubProduct Updated Successfully.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                updatedSubs.push({ ...sub });
                Swal.fire({
                    title: "Added!",
                    text: "✅ SubProduct Added Successfully.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
            return { ...prev, subproducts: updatedSubs };
        });

        // reset form after success
        setSub({
            subproductName: "",
            subproductImg: "",
            description: "",
            weight: "",
        });
        setEditingSubIndex(null);
        setSubErrors({});
        setSubSubmitted(false);

        if (subproductImgRef.current) {
            subproductImgRef.current.value = "";
        }
    };

    // Add or update recipe with validation
    const addOrUpdateRecipe = () => {
        setRecipeSubmitted(true);
        const errors = validateRecipe();
        setRecipeErrors(errors);

        if (Object.keys(errors).length > 0) {
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill in all fields for the recipe before submitting.",
            });
            return;
        }

        setProduct((prev) => {
            const updatedRecipes = [...prev.recipes];
            if (editingRecipeIndex !== null) {
                updatedRecipes[editingRecipeIndex] = { ...recipe };
                Swal.fire({
                    title: "Updated!",
                    text: "✅ Recipe Updated Successfully.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                updatedRecipes.push({ ...recipe });
                Swal.fire({
                    title: "Added!",
                    text: "✅ Recipe Added Successfully.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
            return { ...prev, recipes: updatedRecipes };
        });

        // reset form
        setRecipe({
            recipeName: "",
            steps: [""],
            recipeMainImg: "",
            recipeSubImg: "",
        });
        setEditingRecipeIndex(null);
        setRecipeErrors({});
        setRecipeSubmitted(false);

        if (recipeMainImgRef.current) recipeMainImgRef.current.value = "";
        if (recipeSubImgRef.current) recipeSubImgRef.current.value = "";
    };

    // Edit subproduct
    const editSubproduct = (index) => {
        setSub(product.subproducts[index]);
        setEditingSubIndex(index);
        setSubErrors({});
        setSubSubmitted(false);
        window.scrollTo({ top: 300, behavior: "smooth" });
    };

    // Remove subproduct
    const removeSubproduct = (index) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This subproduct will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                const updated = [...product.subproducts];
                updated.splice(index, 1);
                setProduct({ ...product, subproducts: updated });

                if (editingSubIndex === index) {
                    setSub({
                        subproductName: "",
                        subproductImg: "",
                        description: "",
                        weight: "",
                    });
                    setEditingSubIndex(null);
                    setSubErrors({});
                    setSubSubmitted(false);
                }

                Swal.fire({
                    title: "Deleted!",
                    text: "✅ SubProduct has been Deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
    };

    const addStep = () => {
        if (recipe.steps.length >= 10) return;

        const lastStep = recipe.steps[recipe.steps.length - 1];

        if (!lastStep || !lastStep.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Step Required!",
                text: "Please complete the current step before adding a new one.",
            });
            return;
        }

        setRecipe((prev) => ({
            ...prev,
            steps: [...prev.steps, ""],
        }));
    };

    // Edit recipe
    const editRecipe = (index) => {
        const r = product.recipes[index];

        setRecipe({
            recipeName: r.recipeName || "",
            steps: r.steps && r.steps.length > 0 ? r.steps : [""],
            recipeMainImg: r.recipeMainImg || "",
            recipeSubImg: Array.isArray(r.recipeSubImg)
                ? r.recipeSubImg
                : r.recipeSubImg
                    ? [r.recipeSubImg]   // wrap string into array
                    : [],                // default empty
        });

        setEditingRecipeIndex(index);
        setRecipeErrors({});
        setRecipeSubmitted(false);
        window.scrollTo({ top: 500, behavior: "smooth" });
    };

    // Remove recipe
    const removeRecipe = (index) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This recipe will be Deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                const updated = [...product.recipes];
                updated.splice(index, 1);
                setProduct({ ...product, recipes: updated });

                if (editingRecipeIndex === index) {
                    setRecipe({
                        recipeName: "",
                        steps: [""],
                        recipeMainImg: "",
                        recipeSubImg: [],
                    });
                    setEditingRecipeIndex(null);
                    setRecipeErrors({});
                    setRecipeSubmitted(false);
                }

                Swal.fire({
                    title: "Deleted!",
                    text: "✅ Recipe has been Deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setProductSubmitted(true);

        const errors = validateProduct();
        if (errors.allRequired) {
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill in all fields for the new product before submitting.",
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        Swal.fire({
            title: editingProductId ? "Updating Product..." : "Uploaded Product...",
            text: editingProductId
                ? "Please wait while we update your product data."
                : "Please wait while we add your new product data.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        setFormSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("productName", product.productName);
            formData.append("productSizes", JSON.stringify(product.productSizes));
            formData.append("subproducts", JSON.stringify(product.subproducts));
            formData.append("recipes", JSON.stringify(product.recipes));

            if (files.productBanner) formData.append("productBanner", files.productBanner);
            if (files.productBannerMobile) formData.append("productBannerMobile", files.productBannerMobile); // ✅
            if (files.banner2) formData.append("banner2", files.banner2);
            if (files.banner2Mobile) formData.append("banner2Mobile", files.banner2Mobile); // ✅
            if (files.howToMakeBanner) formData.append("howToMakeBanner", files.howToMakeBanner);
            if (files.howToMakeBannerMobile) formData.append("howToMakeBannerMobile", files.howToMakeBannerMobile); // ✅

            if (files.productImages.length > 0) {
                files.productImages.forEach((file) => {
                    formData.append("productImages", file);
                });
            }

            product.subproducts.forEach((sub, index) => {
                if (sub.subproductImg instanceof File) {
                    formData.append(`subproductImg_${index}`, sub.subproductImg);
                }
            });
            product.recipes.forEach((rec, index) => {
                if (rec.recipeMainImg instanceof File) {
                    formData.append(`recipeMainImg_${index}`, rec.recipeMainImg);
                }
                if (Array.isArray(rec.recipeSubImg)) {
                    rec.recipeSubImg.forEach(file => {
                        if (file instanceof File) {
                            formData.append(`recipeSubImg_${index}`, file)
                        }
                    });
                }
            });


            if (editingProductId) {
                await axios.put(
                    `https://backendvimalagro.onrender.com/api/products/${editingProductId}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                // 🔹 Fetch updated list so edit form shows new image without refresh
                await fetchProducts();

                Swal.fire({
                    title: "Updated!",
                    text: "✅ Product Updated Successfully.",
                    icon: "success",
                });
            } else {
                await axios.post(
                    "https://backendvimalagro.onrender.com/api/products/add",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                // 🔹 Fetch updated list after add
                await fetchProducts();

                Swal.fire({
                    title: "Added!",
                    text: "✅ Product Added Successfully.",
                    icon: "success",
                });
            }

            // reset with new fields
            setProduct({
                productBanner: "",
                productBannerMobile: "", // ✅
                productName: "",
                productImages: [],
                productSizes: [],
                subproducts: [],
                banner2: "",
                banner2Mobile: "",       // ✅
                howToMakeBanner: "",
                howToMakeBannerMobile: "",// ✅
                recipes: [],
            });
            setFiles({
                productBanner: null,
                productBannerMobile: null, // ✅
                banner2: null,
                banner2Mobile: null,       // ✅
                howToMakeBanner: null,
                howToMakeBannerMobile: null,// ✅
                productImages: [],
            });

            if (productBannerRef.current) productBannerRef.current.value = "";
            if (productBannerMobileRef.current) productBannerMobileRef.current.value = ""; // ✅
            if (productImagesRef.current) productImagesRef.current.value = "";
            if (banner2Ref.current) banner2Ref.current.value = "";
            if (banner2MobileRef.current) banner2MobileRef.current.value = "";             // ✅
            if (howToMakeBannerRef.current) howToMakeBannerRef.current.value = "";
            if (howToMakeBannerMobileRef.current) howToMakeBannerMobileRef.current.value = ""; // ✅

        } catch (err) {
            console.error(err);
            Swal.fire("❌ Failed to save product", "", "error");
        } finally {
            setFormSubmitting(false);
        }
    };

    // Edit product
    const editProduct = (p) => {
        setProduct(p);
        setEditingProductId(p._id);
        setExpandedProductId(p._id);
        setEditingSubIndex(null);
        setEditingRecipeIndex(null);
        setProductErrors({});
        setProductSubmitted(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Delete product
    const deleteProduct = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this product?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`https://backendvimalagro.onrender.com/api/products/${id}`);
                fetchProducts();
                Swal.fire({
                    title: "Deleted!",
                    text: "The product has been deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (err) {
                console.error("Delete failed", err);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete the product.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        }
    };

    return (
        <div className="container mt-3">
            <form onSubmit={handleSubmit} noValidate>
                <div className="rounded-3 shadow overflow-hidden">
                    <div
                        className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                    >
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" />
                            {editingProductId ? "Edit New Product" : "Add New Product"}
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Product Name</label>
                                <input
                                    type="text"
                                    name="productName"
                                    placeholder="Enter Product Name"
                                    value={product.productName}
                                    onChange={handleChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    disabled={formSubmitting}
                                />
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Product Size (Comma Separated)</label>
                                <input
                                    type="text"
                                    name="productSizes"
                                    placeholder="Enter Product Size"
                                    value={product.productSizes.join(",")}
                                    onChange={handleChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    disabled={formSubmitting}
                                />
                            </div>
                        </div>
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Product Images</label>
                            <input
                                type="file"
                                className="mt-1 w-100 form-control border border-secondary"
                                multiple
                                ref={productImagesRef}
                                onChange={(e) => handleFileSelect(e, "productImages", true)}
                                disabled={formSubmitting || loadingImages.productImages}
                            />
                            {loadingImages.productImages && <div>Loading images...</div>}
                            <div className="mt-2">
                                {/* {[...product.productImages, ...files.productImages].map((img, i) => {
                                    const src = typeof img === "string" ? img : URL.createObjectURL(img);
                                    return (
                                        <img
                                            key={i}
                                            src={src}
                                            alt={`Product Img ${i + 1}`}
                                            width={60}
                                            height={60}
                                            className="me-2 object-fit-fill"
                                        />
                                    );
                                })} */}
                                <div className="image-preview">
                                    {files.productImages && files.productImages.length > 0 ? (
                                        // Show only newly selected images
                                        files.productImages.map((file, idx) => (
                                            <img
                                                key={idx}
                                                src={URL.createObjectURL(file)}
                                                alt="New Preview"
                                                style={{ width: "100px", margin: "5px" }}
                                            />
                                        ))
                                    ) : (
                                        // Show DB images only if no new ones selected
                                        product.productImages &&
                                        product.productImages.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt="Old Preview"
                                                style={{ width: "100px", margin: "5px" }}
                                            />
                                        ))
                                    )}
                                </div>

                            </div>
                        </div>
                        <div className="d-lg-flex d-md-flex gap-3">

                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Product Banner(horizontally Rectangle)</label>
                                <input
                                    type="file"
                                    className="mt-1 w-100 form-control border border-secondary"
                                    onChange={(e) => handleFileSelect(e, "productBanner")}
                                    ref={productBannerRef}
                                    disabled={formSubmitting || loadingImages.productBanner}
                                />
                                {loadingImages.productBanner && <div>Loading image...</div>}
                                {(files.productBanner || product.productBanner) && !loadingImages.productBanner && (
                                    <div className="mt-2">
                                        <img
                                            src={
                                                files.productBanner
                                                    ? URL.createObjectURL(files.productBanner)
                                                    : product.productBanner
                                            }
                                            alt="Product Banner"
                                            className="object-fit-fill"
                                            height={60}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Product Banner-Mobile (Vertically Rectangle)</label>
                                <input
                                    type="file"
                                    className="mt-1 w-100 form-control border border-secondary"
                                    onChange={(e) => handleFileSelect(e, "productBannerMobile")}
                                    ref={productBannerMobileRef}
                                    disabled={formSubmitting || loadingImages.productBannerMobile}
                                />
                                {loadingImages.productBannerMobile && <div>Loading image...</div>}
                                {(files.productBannerMobile || product.productBannerMobile) && !loadingImages.productBannerMobile && (
                                    <div className="mt-2">
                                        <img
                                            src={
                                                files.productBannerMobile
                                                    ? URL.createObjectURL(files.productBannerMobile)
                                                    : product.productBannerMobile
                                            }
                                            alt="Product Banner"
                                            className="object-fit-fill"
                                            height={60}
                                        />
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Banner 2(horizontally Rectangle)</label>
                                <input
                                    type="file"
                                    className="mt-1 w-100 form-control border border-secondary"
                                    onChange={(e) => handleFileSelect(e, "banner2")}
                                    ref={banner2Ref}
                                    disabled={formSubmitting || loadingImages.banner2}
                                />
                                {loadingImages.banner2 && <div>Loading image...</div>}
                                {(files.banner2 || product.banner2) && !loadingImages.banner2 && (
                                    <div className="mt-2">
                                        <img
                                            src={
                                                files.banner2 ? URL.createObjectURL(files.banner2) : product.banner2
                                            }
                                            alt="Banner 2"
                                            className="object-fit-fill"
                                            height={60}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Banner2-Mobile (Vertically Rectangle)</label>
                                <input
                                    type="file"
                                    className="mt-1 w-100 form-control border border-secondary"
                                    onChange={(e) => handleFileSelect(e, "banner2Mobile")}
                                    ref={banner2MobileRef}
                                    disabled={formSubmitting || loadingImages.banner2Mobile}
                                />
                                {(files.banner2Mobile || product.banner2Mobile) && !loadingImages.banner2Mobile && (
                                    <div className="mt-2">
                                        <img
                                            src={
                                                files.banner2Mobile ? URL.createObjectURL(files.banner2Mobile) : product.banner2Mobile
                                            }
                                            alt="Banner 2 Mobile"
                                            className="object-fit-fill"
                                            height={60}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">How To Make Banner(horizontally Rectangle)</label>
                                <input
                                    type="file"
                                    className="mt-1 w-100 form-control border border-secondary"
                                    onChange={(e) => handleFileSelect(e, "howToMakeBanner")}
                                    ref={howToMakeBannerRef}
                                    disabled={formSubmitting || loadingImages.howToMakeBanner}
                                />
                                {loadingImages.howToMakeBanner && <div>Loading image...</div>}
                                {(files.howToMakeBanner || product.howToMakeBanner) && !loadingImages.howToMakeBanner && (
                                    <div className="mt-2">
                                        <img
                                            src={
                                                files.howToMakeBanner
                                                    ? URL.createObjectURL(files.howToMakeBanner)
                                                    : product.howToMakeBanner
                                            }
                                            alt="How To Make Banner"
                                            className="object-fit-fill"
                                            height={60}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">How To Make Banner-Mobile (Vertically Rectangle)</label>
                                <input
                                    type="file"
                                    className="mt-1 w-100 form-control border border-secondary"
                                    onChange={(e) => handleFileSelect(e, "howToMakeBannerMobile")}
                                    ref={howToMakeBannerMobileRef}
                                    disabled={formSubmitting || loadingImages.howToMakeBannerMobile}
                                />
                                {(files.howToMakeBannerMobile || product.howToMakeBannerMobile) && !loadingImages.howToMakeBannerMobile && (
                                    <div className="mt-2">
                                        <img
                                            src={
                                                files.howToMakeBannerMobile ? URL.createObjectURL(files.howToMakeBannerMobile) : product.howToMakeBannerMobile
                                            }
                                            alt="howToMake Banner Mobile"
                                            className="object-fit-fill"
                                            height={60}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subproduct Section */}
                <div className="rounded-3 shadow overflow-hidden mt-4">
                    <div
                        className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                    >
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" /> Add SubProduct
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">SubProduct Name</label>
                                <input
                                    type="text"
                                    name="subproductName"
                                    placeholder="Enter SubProduct Name"
                                    value={sub.subproductName}
                                    onChange={handleSubChange}
                                    className={`mt-1 w-100 form-control border ${subSubmitted && subErrors.subproductName ? "border-danger" : "border-secondary"
                                        }`}
                                    disabled={formSubmitting}
                                />
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Weight</label>
                                <input
                                    type="text"
                                    name="weight"
                                    placeholder="Enter Weight"
                                    value={sub.weight}
                                    onChange={handleSubChange}
                                    className={`text-uppercase mt-1 w-100 form-control border ${subSubmitted && subErrors.weight ? "border-danger" : "border-secondary"
                                        }`}
                                    disabled={formSubmitting}
                                />
                            </div>
                        </div>
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Description</label>
                            <textarea name="description"
                                placeholder="Enter Description" value={sub.description}
                                onChange={handleSubChange}
                                className={`mt-1 w-100 form-control border ${subSubmitted && subErrors.description ? "border-danger" : "border-secondary"
                                    }`}
                                disabled={formSubmitting}></textarea>
                        </div>
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">SubProduct Image</label>
                            <input
                                type="file"
                                ref={subproductImgRef}
                                className="mt-1 w-100 form-control border border-secondary"
                                onChange={handleSubFileUpload}
                                disabled={formSubmitting || loadingImages.subproductImg}
                            />
                            {loadingImages.subproductImg && <div>Loading image...</div>}
                            {sub.subproductImg && !loadingImages.subproductImg && (
                                <div className="mt-2">
                                    <img src={sub.subproductImg instanceof File ? URL.createObjectURL(sub.subproductImg) : sub.subproductImg} alt="Subproduct" className="object-fit-fill"
                                        width={60}
                                        height={60}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mt-3 text-center col-12">
                            <button
                                type="button"
                                className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                                onClick={addOrUpdateSubproduct}
                                disabled={formSubmitting}
                            >
                                <span>{editingSubIndex !== null ? "Update Subproduct" : "+ Add Subproduct"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {product.subproducts.length > 0 && (
                    <div className="rounded-3 shadow overflow-hidden my-4">
                        <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                            <h6 className="fw-bold m-0 text-dark">
                                <FaDatabase className="me-2" />
                                SubProduct Data
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
                                            <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>SubProduct Image</th>
                                            <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>SubProduct Name</th>
                                            <th className="text-white" style={{ width: "40%", background: "var(--red)" }}>Description</th>
                                            <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Weight</th>
                                            <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="pera">
                                        {product.subproducts.length > 0 ? (
                                            product.subproducts.map((s, i) => (
                                                <tr key={i}>
                                                    <td style={{ width: "20%" }}>
                                                        {s.subproductImg &&
                                                            (s.subproductImg instanceof File ? (
                                                                <img
                                                                    src={URL.createObjectURL(s.subproductImg)}
                                                                    alt="Subproduct"
                                                                    width="50"
                                                                />
                                                            ) : (
                                                                <img src={s.subproductImg} alt="Subproduct" width="50" />
                                                            ))
                                                        }
                                                    </td>
                                                    <td style={{ width: "20%" }}>{s.subproductName}</td>
                                                    <td style={{ width: "40%" }}>{s.description}</td>
                                                    <td style={{ width: "10%" }}>{s.weight}</td>
                                                    <td style={{ width: "10%" }}>
                                                        <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center">
                                                            <FaEdit
                                                                className="text-warning fs-5 me-0 me-md-2 mb-2 mb-md-0"
                                                                onClick={() => editSubproduct(i)}
                                                                disabled={formSubmitting}
                                                            />
                                                            <FaTrash
                                                                className="text-danger fs-5"
                                                                onClick={() => removeSubproduct(i)}
                                                                disabled={formSubmitting}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted">No SubProduct Data Found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* Recipe Section */}
                <div className="rounded-3 shadow overflow-hidden mt-4">
                    <div
                        className="p-3"
                        style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                    >
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" />
                            Add Recipe(Minimum 2 Recepie Required)
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Recipe Name</label>
                            <input
                                type="text"
                                name="recipeName"
                                placeholder="Enter Recipe Name"
                                value={recipe.recipeName}
                                onChange={handleRecipeChange}
                                className="mt-1 w-100 form-control border border-secondary"
                                disabled={formSubmitting}
                            />
                        </div>
                        <div className="w-100 w-lg-50 w-md-50 mt-2">
                            <label className="d-block fw-bold">Recipe Step (Max 10 Steps)</label>
                            {recipe.steps.map((step, index) => (
                                <div key={index} className="d-flex align-items-center mb-2">
                                    <input
                                        type="text"
                                        value={step}
                                        onChange={(e) => handleStepChange(index, e.target.value)}
                                        className="mt-1 w-100 form-control border border-secondary"
                                        placeholder={`Step ${index + 1} (Max 15 Words)`}
                                        disabled={formSubmitting}
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                className="mt-1 px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn"
                                onClick={addStep}
                                disabled={formSubmitting || recipe.steps.length >= 10}
                            >
                                <span>+ Add Step</span>
                            </button>
                        </div>
                        <div className="d-lg-flex d-md-flex gap-3">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Main Recipe Image(Square Shape Required)</label>
                                <input
                                    type="file"
                                    ref={recipeMainImgRef}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    onChange={(e) => handleRecipeFileUpload(e, "recipeMainImg")}
                                    disabled={formSubmitting || loadingImages.recipeMainImg}
                                />
                                {loadingImages.recipeMainImg && <div>Loading image...</div>}
                                {/* {recipe.recipeMainImg && !loadingImages.recipeMainImg && (
                                        <img src={recipe.recipeMainImg} alt="" width="80" height={100} />
                                    )} */}

                                {recipe.recipeMainImg && !loadingImages.recipeMainImg && (
                                    <img
                                        src={
                                            recipe.recipeMainImg instanceof File
                                                ? URL.createObjectURL(recipe.recipeMainImg)
                                                : recipe.recipeMainImg
                                        }
                                        alt="Main Recipe"
                                        width={60}
                                        height={60}
                                        className="object-fit-fill mt-2"
                                    />
                                )}
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Sub Recipe Image(Square Shape Required)</label>
                                <input
                                    type="file"
                                    ref={recipeSubImgRef}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    onChange={(e) => handleRecipeFileUpload(e, "recipeSubImg")}
                                    disabled={formSubmitting || loadingImages.recipeSubImg}
                                />
                                {loadingImages.recipeSubImg && <div>Loading image...</div>}
                                {Array.isArray(recipe.recipeSubImg) && recipe.recipeSubImg.length > 0 && !loadingImages.recipeSubImg && (
                                    <div className="d-flex gap-2 flex-wrap mt-2">
                                        {recipe.recipeSubImg.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img instanceof File ? URL.createObjectURL(img) : img}
                                                alt={`Recipe Sub ${i + 1}`}
                                                height={60}
                                                className="object-fit-fill mt-2"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <button
                                type="button"
                                className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                                onClick={addOrUpdateRecipe}
                                disabled={formSubmitting}
                            >
                                <span>{editingRecipeIndex !== null ? "Update Recipe" : "+ Add Recipe"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {product.recipes.length > 0 && (
                    <div className="rounded-3 shadow overflow-hidden my-4">
                        <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                            <h6 className="fw-bold m-0 text-dark">
                                <FaDatabase className="me-2" />
                                Recipe Data
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
                                            <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Main Recipe Image</th>
                                            <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Sub Recipe Image</th>
                                            <th className="text-white" style={{ width: "40%", background: "var(--red)" }}>Recipe Name</th>
                                            <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="pera">
                                        {product.recipes.length > 0 ? (
                                            product.recipes.map((r, i) => (
                                                <tr key={i}>
                                                    <td style={{ width: "20%" }}>
                                                        {r.recipeMainImg &&
                                                            (r.recipeMainImg instanceof File ? (
                                                                <img src={URL.createObjectURL(r.recipeMainImg)} alt="Main Img" width="50" />
                                                            ) : (
                                                                <img src={r.recipeMainImg} alt="Main Img" width="50" />
                                                            ))}
                                                    </td>
                                                    <td style={{ width: "20%" }}>
                                                        {Array.isArray(r.recipeSubImg) ? (
                                                            r.recipeSubImg.map((img, j) => (
                                                                <img
                                                                    key={j}
                                                                    src={img instanceof File ? URL.createObjectURL(img) : img}
                                                                    alt={`Sub Img ${j + 1}`}
                                                                    width="50"
                                                                    className="me-1"
                                                                />
                                                            ))
                                                        ) : (
                                                            r.recipeSubImg && (
                                                                <img
                                                                    src={r.recipeSubImg instanceof File ? URL.createObjectURL(r.recipeSubImg) : r.recipeSubImg}
                                                                    alt="Sub Img"
                                                                    width="50"
                                                                />
                                                            )
                                                        )}
                                                    </td>
                                                    <td style={{ width: "40%" }}>{r.recipeName}</td>
                                                    <td style={{ width: "20%" }}>
                                                        <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center">
                                                            <FaEdit
                                                                className="text-warning fs-5 me-0 me-md-2 mb-2 mb-md-0"
                                                                onClick={() => editRecipe(i)}
                                                                disabled={formSubmitting}
                                                            />
                                                            <FaTrash
                                                                className="text-danger fs-5"
                                                                onClick={() => removeRecipe(i)}
                                                                disabled={formSubmitting}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted">No Recipe Data Found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-4 text-center">
                    <button
                        type="submit"
                        className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                        disabled={formSubmitting}
                    >
                        <span>
                            {editingProductId ? "Update Product" : "Submit Product"}
                        </span>
                    </button>
                </div>
            </form>

            <div className="rounded-3 shadow overflow-hidden my-4">
                <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                    <h6 className="fw-bold m-0 text-dark">
                        <FaDatabase className="me-2" />
                        Product Data
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
                                    <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Product Banner</th>
                                    <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Product Name</th>
                                    <th className="text-white" style={{ width: "50%", background: "var(--red)" }}>Product Size</th>
                                    <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody className="pera">
                                {products.length > 0 ? (
                                    products.map((p) => (
                                        <tr key={p._id}>
                                            <td style={{ width: "20%" }}>{p.productBanner && <img src={p.productBanner} alt="" width="60" />}</td>
                                            <td style={{ width: "20%" }}>{p.productName}</td>
                                            <td style={{ width: "50%" }}>{p.productSizes?.join(", ")}</td>
                                            <td style={{ width: "10%" }}>
                                                <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center">
                                                    <FaEdit
                                                        className="text-warning fs-5 me-0 me-md-2 mb-2 mb-md-0"
                                                        onClick={() => editProduct(p)}
                                                        disabled={formSubmitting}
                                                    />
                                                    <FaTrash
                                                        className="text-danger fs-5"
                                                        onClick={() => deleteProduct(p._id)}
                                                        disabled={formSubmitting}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">No Product Data Found.</td>
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

export default ProductPage