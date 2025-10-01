import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaDatabase } from "react-icons/fa";
import Swal from "sweetalert2";

function BlogForm() {

    const [blogs, setBlogs] = useState([]);
    const [editingBlogId, setEditingBlogId] = useState(null);
    const [fetching, setFetching] = useState(true);

    const blogImageRef = useRef();
    const blogBannerRef = useRef();
    const blogBannerMobileRef = useRef();
    const recipeImageRef = useRef();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        recipes: [],
    });

    const [files, setFiles] = useState({
        blogImage: null,
        blogBanner: null,
        blogBannerMobile: null,
        recipeImages: {},
    });

    // Recipe form state
    const [recipeForm, setRecipeForm] = useState({
        recipeName: "",
        serving: "",
        prep_time: "",
        cook_time: "",
        description: "",
        difficulty: "",
        ingredients: [""],
        cooking_instructions: [""],
    });
    const [recipeImage, setRecipeImage] = useState(null);
    const [editingRecipeIndex, setEditingRecipeIndex] = useState(null);

    // Validation
    const [errors, setErrors] = useState({});
    const [recipeErrors, setRecipeErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // Loading
    const [formSubmitting, setFormSubmitting] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setFetching(true);
        try {
            const res = await axios.get("https://backendvimalagro.onrender.com/api/blogs");
            setBlogs(res.data);
        } catch (err) {
            console.error("Error fetching blogs", err);
        } finally {
            setFetching(false);
        }
    };

    // ✅ Validation for Blog
    const validate = () => {
        const err = {};
        if (!form.title.trim()) err.title = "Title is required";
        if (!form.description.trim()) err.description = "Description is required";
        if (!form.category.trim()) err.category = "Category is required";
        if (!files.blogImage && !editingBlogId) err.blogImage = "Blog Image is required";
        if (!files.blogBanner && !editingBlogId) err.blogBanner = "Blog Banner is required";
        if (!files.blogBannerMobile && !editingBlogId) err.blogBannerMobile = "Blog Banner (mobile) is required";
        if (form.recipes.length === 0) err.recipes = "At least one recipe is required";
        return err;
    };

    // ✅ Validation for Recipe
    const validateRecipe = () => {
        const err = {};
        if (!recipeForm.recipeName.trim()) err.recipeName = "Recipe name is required";
        if (!recipeForm.description.trim()) err.description = "Description is required";
        if (!recipeForm.serving.trim()) err.serving = "serving is required";
        if (!recipeForm.prep_time.trim()) err.prep_time = "prep_time is required";
        if (!recipeForm.cook_time.trim()) err.cook_time = "cook_time is required";
        if (!recipeForm.ingredients.some((i) => i.trim() !== ""))
            err.ingredients = "At least one ingredient required";
        if (!recipeForm.cooking_instructions.some((i) => i.trim() !== ""))
            err.cooking_instructions = "At least one step required";
        if (!recipeImage && editingRecipeIndex === null)
            err.recipeImage = "Recipe image is required";
        return err;
    };

    // ✅ Handle Blog Field Change
    const handleChange = (e) => {
        const { name, value } = e.target;

        // special condition only for description
        if (name === "description") {
            const words = value.trim().split(/\s+/);
            if (words.length > 15) {
                return; // stop typing after 15 words
            }
        }

        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    // ✅ Handle Blog File Change
    const handleFile = (e, key) => {
        const file = e.target.files[0];
        setFiles((prev) => ({ ...prev, [key]: file }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
    };

    // ✅ Recipe form handlers
    const handleRecipeField = (field, value) => {
        setRecipeForm((prev) => ({ ...prev, [field]: value }));
        if (recipeErrors[field]) setRecipeErrors((prev) => ({ ...prev, [field]: null }));
    };

    const handleRecipeArray = (field, idx, value) => {
        const updated = [...recipeForm[field]];
        updated[idx] = value;
        setRecipeForm((prev) => ({ ...prev, [field]: updated }));
    };

    const addRecipeArrayItem = (field) => {
        // Check if any existing input is empty
        const hasEmpty = recipeForm[field].some((item) => item.trim() === "");
        if (hasEmpty) {
            Swal.fire({
                icon: "warning",
                title: "Step Required!",
                text: "Please complete the current step before adding a new one.",
            });
            return;
        }

        // If all filled, add a new empty field
        setRecipeForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeRecipeArrayItem = (field, idx) => {
        const updated = [...recipeForm[field]];
        updated.splice(idx, 1);
        setRecipeForm((prev) => ({ ...prev, [field]: updated }));
    };

    const saveRecipe = () => {
        // Validate main fields
        const err = validateRecipe();

        // Extra validation: check ingredients and instructions arrays
        const hasEmptyIngredient = recipeForm.ingredients.some((item) => item.trim() === "");
        const hasEmptyInstruction = recipeForm.cooking_instructions.some((item) => item.trim() === "");

        if (Object.keys(err).length > 0 || hasEmptyIngredient || hasEmptyInstruction) {
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill in all fields for the recipe before submitting.",
            });
            return; // Prevent submission
        }

        let updatedRecipes = [...form.recipes];
        const newRecipe = { ...recipeForm, image: recipeImage }; // 👈 image field add kari

        if (editingRecipeIndex !== null) {
            updatedRecipes[editingRecipeIndex] = newRecipe;
        } else {
            updatedRecipes.push(newRecipe);
        }

        setForm((prev) => ({ ...prev, recipes: updatedRecipes }));

        setFiles((prev) => ({
            ...prev,
            recipeImages: {
                ...prev.recipeImages,
                [editingRecipeIndex !== null
                    ? editingRecipeIndex
                    : updatedRecipes.length - 1]: recipeImage,
            },
        }));

        Swal.fire({
            title: editingRecipeIndex !== null ? "Updated!" : "Added!",
            text: editingRecipeIndex !== null
                ? "✅ Recipe Updated Successfully."
                : "✅ Recipe Added Successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
        });

        // Reset recipe form
        setRecipeForm({
            recipeName: "",
            serving: "",
            prep_time: "",
            cook_time: "",
            description: "",
            difficulty: "",
            ingredients: [""],
            cooking_instructions: [""],
        });
        setRecipeImage(null);
        setEditingRecipeIndex(null);
        setRecipeErrors({});

        if (recipeImageRef.current) recipeImageRef.current.value = "";
    };

    const editRecipe = (index) => {
        const recipe = form.recipes[index];
        setRecipeForm(recipe);

        // handle both new file object and URL from backend
        setRecipeImage(recipe.image || null);

        setEditingRecipeIndex(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const removeRecipe = (index) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This recipe will be deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                const updated = [...form.recipes];
                updated.splice(index, 1);
                setForm((prev) => ({ ...prev, recipes: updated }));

                const updatedImages = { ...files.recipeImages };
                delete updatedImages[index];
                setFiles((prev) => ({ ...prev, recipeImages: updatedImages }));

                Swal.fire({
                    title: "Deleted!",
                    text: "✅ Recipe has been deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        });
    };

    // ✅ Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        const err = validate();
        setErrors(err);

        if (Object.keys(err).length > 0) {
            // If there is any error, show the alert and block submission
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill in all required fields for the new blog and add at least one recipe before submitting."
            });
            return;
        }

        // If validation passes, submit the form
        setFormSubmitting(true);

        Swal.fire({
            title: editingBlogId ? "Updating Blog..." : "Uploading Blog...",
            text: editingBlogId
                ? "Please wait while we update your blog data."
                : "Please wait while we add your new blog data.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const data = new FormData();
            data.append("title", form.title);
            data.append("description", form.description);
            data.append("category", form.category);
            data.append("recipes", JSON.stringify(form.recipes));

            if (files.blogImage) data.append("blogImage", files.blogImage);
            if (files.blogBanner) data.append("blogBanner", files.blogBanner);
            if (files.blogBannerMobile) data.append("blogBannerMobile", files.blogBannerMobile);

            form.recipes.forEach((_, i) => {
                if (files.recipeImages[i]) {
                    data.append(`recipeImage_${i}`, files.recipeImages[i]);
                }
            });

            if (editingBlogId) {
                await axios.put(`https://backendvimalagro.onrender.com/api/blogs/${editingBlogId}`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                Swal.fire({
                    title: "Updated!",
                    text: "✅ Blog Updated Successfully.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await axios.post("https://backendvimalagro.onrender.com/api/blogs/add", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                Swal.fire({
                    title: "Added!",
                    text: "✅ Blog Added Successfully.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            setForm({ title: "", description: "", category: "", recipes: [], serving: '', prep_time: '', cook_time: '' });
            setFiles({ blogImage: null, blogBanner: null, blogBannerMobile: null, recipeImages: {} });

            if (blogImageRef.current) blogImageRef.current.value = "";
            if (blogBannerRef.current) blogBannerRef.current.value = "";
            if (blogBannerMobileRef.current) blogBannerMobileRef.current.value = "";
            if (recipeImageRef.current) recipeImageRef.current.value = "";

            setEditingBlogId(null);
            setErrors({});
            setSubmitted(false);
            fetchBlogs();

        } catch (err) {
            console.error(err);
            Swal.fire("❌ Failed to save blog", "", "error");
        } finally {
            setFormSubmitting(false);
        }
    };

    const editBlog = (b) => {
        setForm({
            title: b.title,
            description: b.description,
            category: b.category,
            recipes: b.recipes || [],
            blogImage: b.blogImage || null,
            blogBanner: b.blogBanner || null,
            blogBannerMobile: b.blogBannerMobile || null,
        });

        setFiles({
            blogImage: null,
            blogBanner: null,
            blogBannerMobile: null,
            recipeImages: {},
        });

        setEditingBlogId(b._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteBlog = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This blog will be deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://backendvimalagro.onrender.com/api/blogs/${id}`);
                    Swal.fire({
                        title: "Deleted!",
                        text: "✅ Blog has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    fetchBlogs();
                } catch (err) {
                    console.error(err);
                    Swal.fire("❌ Failed to delete blog", "", "error");
                }
            }
        });
    };

    return (
        <>
            <div className="container mt-3 mt-lg-0 mt-md-0">
                <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Blog</h3>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="rounded-3 shadow overflow-hidden">
                        <div className="p-3"
                            style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                            <h6 className="fw-bold m-0 text-dark">
                                <FaPlus className="me-2" />Add New Blog
                            </h6>
                        </div>
                        <div className="px-4 pb-4 pt-2 bg-white">
                            <div className="d-lg-flex d-md-flex gap-3">
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Tittle</label>
                                    <input type="text" placeholder="Enter Tittle" name="title" value={form.title} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" />
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Category</label>
                                    <input type="text" placeholder="Enter Category" name="category" value={form.category} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" />
                                </div>
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Blog Image</label>
                                <input type="file" ref={blogImageRef} className="mt-1 w-100 form-control border border-secondary" onChange={(e) => handleFile(e, "blogImage")} />
                                <div className="mt-2">
                                    {files.blogImage ? (
                                        <img src={URL.createObjectURL(files.blogImage)} alt="preview" width="80" />
                                    ) : editingBlogId && form.blogImage ? (
                                        <img src={form.blogImage} alt="preview" width="80" />
                                    ) : null}
                                </div>
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Description (Max 15 Words)</label>
                                <textarea name="description" placeholder="Enter Description" value={form.description} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" />
                            </div>
                            <div className="d-lg-flex d-md-flex gap-3">
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Blog Banner(horizontally Rectangle)</label>
                                    <input type="file" ref={blogBannerRef} className="mt-1 w-100 form-control border border-secondary" onChange={(e) => handleFile(e, "blogBanner")} />
                                    <div className="mt-2">
                                        {files.blogBanner ? (
                                            <img src={URL.createObjectURL(files.blogBanner)} alt="preview" width="80" />
                                        ) : editingBlogId && form.blogBanner ? (
                                            <img src={form.blogBanner} alt="preview" width="80" />
                                        ) : null}
                                    </div>
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Blog Banner(Vertically Rectangle)</label>
                                    <input type="file" ref={blogBannerMobileRef} className="mt-1 w-100 form-control border border-secondary" onChange={(e) => handleFile(e, "blogBannerMobile")} />
                                    <div className="mt-2">
                                        {files.blogBannerMobile ? (
                                            <img src={URL.createObjectURL(files.blogBannerMobile)} alt="preview" width="80" />
                                        ) : editingBlogId && form.blogBannerMobile ? (
                                            <img src={form.blogBannerMobile} alt="preview" width="80" />
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3 shadow overflow-hidden mt-4">
                        <div
                            className="p-3"
                            style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                        >
                            <h6 className="fw-bold m-0 text-dark">
                                <FaPlus className="me-2" />
                                {editingRecipeIndex !== null ? "Edit Recipe" : "Add New Recipe"}
                            </h6>
                        </div>
                        <div className="px-4 pb-4 pt-2 bg-white">
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Recipe Name</label>
                                <input type="text" placeholder="Recipe Name" value={recipeForm.recipeName} onChange={(e) => handleRecipeField("recipeName", e.target.value)} className="mt-1 w-100 form-control border border-secondary" />
                            </div>
                            <div className="d-lg-flex d-md-flex gap-3">
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Serving</label>
                                    <input type="text" placeholder="Serving" value={recipeForm.serving} onChange={(e) => handleRecipeField("serving", e.target.value)} className="mt-1 w-100 form-control border border-secondary" />
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Prep Time (min)</label>
                                    <input type="text" placeholder="prep_time" value={recipeForm.prep_time} onChange={(e) => handleRecipeField("prep_time", e.target.value)} className="mt-1 w-100 form-control border border-secondary" />
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Cook Time (min)</label>
                                    <input type="text" placeholder="cook_time" value={recipeForm.cook_time} onChange={(e) => handleRecipeField("cook_time", e.target.value)} className="mt-1 w-100 form-control border border-secondary" />
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Difficulty</label>
                                    <input type="text" placeholder="Enter Difficulty" value={recipeForm.difficulty} onChange={(e) => handleRecipeField("difficulty", e.target.value)} className="mt-1 w-100 form-control border border-secondary" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="d-block fw-bold">Description</label>
                                <textarea placeholder="Enter Description" value={recipeForm.description} onChange={(e) => handleRecipeField("description", e.target.value)} className="mt-1 w-100 form-control border border-secondary" />
                            </div>
                            <div className="d-lg-flex d-md-flex gap-3">
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Add Ingredients</label>
                                    {recipeForm.ingredients.map((ing, idx) => (
                                        <div key={idx} className="d-flex mb-2">
                                            <input type="text" placeholder="Enter Ingredients Step" value={ing} onChange={(e) => handleRecipeArray("ingredients", idx, e.target.value)} className="mt-1 w-100 form-control border border-secondary" />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="mt-1 px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn"
                                        onClick={() => addRecipeArrayItem("ingredients")}
                                    >
                                        <span>+ Add Ingredient</span>
                                    </button>
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Add Cooking Instructions</label>
                                    {recipeForm.cooking_instructions.map((step, idx) => (
                                        <div key={idx} className="d-flex mb-2">
                                            <input type="text" placeholder="Enter Cooking Instructions Step" value={step} onChange={(e) => handleRecipeArray("cooking_instructions", idx, e.target.value)} className="mt-1 w-100 form-control border border-secondary" />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="mt-1 px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn"
                                        onClick={() => addRecipeArrayItem("cooking_instructions")}
                                    >
                                        <span>+ Add Step</span>
                                    </button>
                                </div>
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Recipe Image (526px × 300px)</label>
                                <input
                                    type="file"
                                    ref={recipeImageRef}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    onChange={(e) => setRecipeImage(e.target.files[0])}
                                />
                                <div className="mt-2">
                                    {recipeImage ? (
                                        typeof recipeImage === "object" ? (
                                            <img src={URL.createObjectURL(recipeImage)} alt="recipe" width="80" />
                                        ) : (
                                            <img src={recipeImage} alt="recipe" width="80" />
                                        )
                                    ) : null}
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <button type="button" className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow" onClick={saveRecipe}>
                                    <span> {editingRecipeIndex !== null ? "Update Recipe" : " + Add Recipe"}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {form.recipes.length > 0 && (
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
                                                <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Image</th>
                                                <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Name</th>
                                                <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Serving</th>
                                                <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Prep</th>
                                                <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Cook</th>
                                                <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Difficulty</th>
                                                <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Add Cooking Instructions</th>
                                                <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="pera">
                                            {form.recipes.length > 0 ? (
                                                form.recipes.map((r, i) => (
                                                    <tr key={i}>
                                                        <td style={{ width: "10%" }}>
                                                            {r.image ? (
                                                                typeof r.image === "object" ? (
                                                                    <img src={URL.createObjectURL(r.image)} alt="recipe" width="50" />
                                                                ) : (
                                                                    <img src={r.image} alt="recipe" width="50" />
                                                                )
                                                            ) : (
                                                                <small>No Image.</small>
                                                            )}
                                                        </td>
                                                        <td style={{ width: "20%" }}>{r.recipeName}</td>
                                                        <td style={{ width: "10%" }}>{r.serving}</td>
                                                        <td style={{ width: "10%" }}>{r.prep_time}</td>
                                                        <td style={{ width: "10%" }}>{r.cook_time}</td>
                                                        <td style={{ width: "10%" }}>{r.difficulty}</td>
                                                        <td style={{ width: "20%" }}>
                                                            {r.cooking_instructions.map((step, idx) => (
                                                                <div key={idx}>{step}</div>
                                                            ))}
                                                        </td>
                                                        <td style={{ width: "10%" }}>
                                                            <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center">
                                                                <FaEdit className="text-warning fs-5 me-0 me-md-2 mb-2 mb-md-0"
                                                                    style={{ cursor: "pointer" }} onClick={() => editRecipe(i)} />
                                                                <FaTrash className="text-danger fs-5" style={{ cursor: "pointer" }} onClick={() => removeRecipe(i)} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center text-muted">No Recipe Data Found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <button type="submit" className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow" disabled={formSubmitting}>
                            <span>{editingBlogId ? "Update Blog" : "Save Blog"}</span>
                        </button>
                    </div>
                </form>

                <div className="rounded-3 shadow overflow-hidden my-4">
                    <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                        <h6 className="fw-bold m-0 text-dark">
                            <FaDatabase className="me-2" />
                            Added Blog Data
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
                                        <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Blog Image</th>
                                        <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Title</th>
                                        <th className="text-white" style={{ width: "30%", background: "var(--red)" }}>Category</th>
                                        <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Recipe</th>
                                        <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="pera">
                                    {blogs.length > 0 ? (
                                        blogs.map((b) => (
                                            <tr key={b._id}>
                                                <td style={{ width: "20%" }}>{b.blogImage && <img src={b.blogImage} alt="" width="50" />}</td>
                                                <td style={{ width: "20%" }}>{b.title}</td>
                                                <td style={{ width: "30%" }}>{b.category}</td>
                                                <td style={{ width: "10%" }}>{b.recipes.length}</td>
                                                <td style={{ width: "20%" }}>
                                                    <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center">
                                                        <FaEdit className="text-warning fs-5 me-0 me-md-2 mb-2 mb-md-0" onClick={() => editBlog(b)} />
                                                        <FaTrash
                                                            className="text-danger fs-5"
                                                            onClick={() => deleteBlog(b._id)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted">No Blog Found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BlogForm