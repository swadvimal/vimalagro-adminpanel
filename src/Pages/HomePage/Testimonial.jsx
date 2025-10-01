import React, { useState, useEffect, useRef } from "react";
import { FaDatabase, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

function Testimonial() {

  const [formData, setFormData] = useState({
    testimonialname: "",
    testimonialpera: "",
    testimonialimage: null,
  });
  const [tableData, setTableData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef(null);

  const API_URL = "https://backendvimalagro.onrender.com/testimonial";

  // Fetch testimonials from API
  const fetchTestimonials = async () => {
    setFetching(true);
    try {
      const response = await axios.get(API_URL);
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "testimonialimage") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "testimonialpera") {
      const words = value.trim().split(/\s+/);
      if (words.length <= 25) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.testimonialname || !formData.testimonialpera || (!formData.testimonialimage && !isEditing)) {
      Swal.fire({
        icon: "warning",
        title: "All Fields Required!",
        text: "Please fill all fields before submitting.",
      });
      return;
    }

    const form = new FormData();
    form.append("testimonialname", formData.testimonialname);
    form.append("testimonialpera", formData.testimonialpera);
    if (formData.testimonialimage) {
      form.append("testimonialimage", formData.testimonialimage);
    }

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${editId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({ icon: "success", title: "Updated!", text: "Testimonial updated successfully.", timer: 2000, showConfirmButton: false });
      } else {
        await axios.post(API_URL, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({ icon: "success", title: "Added!", text: "Testimonial added successfully.", timer: 2000, showConfirmButton: false });
      }

      setFormData({ testimonialname: "", testimonialpera: "", testimonialimage: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsEditing(false);
      setEditId(null);
      fetchTestimonials();
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error!", text: "Something went wrong." });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          Swal.fire({ icon: "success", title: "Deleted!", text: "Testimonial has been deleted.", timer: 2000, showConfirmButton: false });
          fetchTestimonials();
        } catch (error) {
          console.error(error);
          Swal.fire({ icon: "error", title: "Error!", text: "Could not delete testimonial." });
        }
      }
    });
  };

  const handleEdit = (item) => {
    setFormData({
      testimonialname: item.testimonialname,
      testimonialpera: item.testimonialpera,
      testimonialimage: null,
    });
    setIsEditing(true);
    setEditId(item._id);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="container mt-3 mt-lg-0 mt-md-0">
      <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">Testimonial</h3>
      <form onSubmit={handleSubmit}>
        <div className="rounded-3 shadow overflow-hidden">
          <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
            <h6 className="fw-bold m-0 text-dark">
              <FaPlus className="me-2" />
              {isEditing ? "Edit Testimonial" : "Add Testimonial Details"}
            </h6>
          </div>
          <div className="px-4 pb-4 pt-2 bg-white">
            <div className="d-lg-flex d-md-flex gap-3">
              <div className="w-100 w-lg-50 w-md-50 mt-2">
                <label className="d-block fw-bold">Name</label>
                <input type="text" name="testimonialname" value={formData.testimonialname} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" placeholder="Enter Name" />
              </div>
              <div className="w-100 w-lg-50 w-md-50 mt-2">
                <label className="d-block fw-bold">Image (Square shape)</label>
                <input type="file" name="testimonialimage" ref={fileInputRef} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" />
              </div>
            </div>
            <div className="w-100 w-lg-50 w-md-50 mt-2">
              <label className="d-block fw-bold">Review (Max 25 Words)</label>
              <textarea name="testimonialpera" value={formData.testimonialpera} onChange={handleChange} className="mt-1 w-100 form-control border border-secondary" placeholder="Enter Review"></textarea>
            </div>
            <div className="mt-3 text-center">
              <button type="submit" className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow">
                <span>{isEditing ? "Update" : "Submit"}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="rounded-3 shadow overflow-hidden my-4">
        <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
          <h6 className="fw-bold m-0 text-dark">
            <FaDatabase className="me-2" />
            Testimonial Data
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
                  <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Sr. No.</th>
                  <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Image</th>
                  <th className="text-white" style={{ width: "20%", background: "var(--red)" }}>Name</th>
                  <th className="text-white" style={{ width: "50%", background: "var(--red)" }}>Description</th>
                  <th className="text-white" style={{ width: "10%", background: "var(--red)" }}>Action</th>
                </tr>
              </thead>
              <tbody className="pera">
                {tableData.length > 0 ? (
                  tableData.map((item, index) => (
                    <tr key={item._id}>
                      <td style={{ width: "10%" }}>{index + 1}</td>
                      <td style={{ width: "10%" }}>
                        <img src={item.testimonialimage} alt={item.testimonialname} style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                      </td>
                      <td style={{ width: "20%" }}>{item.testimonialname}</td>
                      <td style={{ width: "50%" }}>{item.testimonialpera}</td>
                      <td style={{ width: "10%" }}>
                        <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center">
                          <FaEdit onClick={() => handleEdit(item)} className="text-warning fs-5 me-0 me-md-2 mb-2 mb-md-0" style={{ cursor: "pointer" }} />
                          <FaTrash onClick={() => handleDelete(item._id)} className="text-danger fs-5" style={{ cursor: "pointer" }} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No Testimonial Data Found.</td>
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

export default Testimonial