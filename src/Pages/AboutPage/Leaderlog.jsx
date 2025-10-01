import React, { useState, useRef, useEffect } from "react";
import { FaDatabase, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = "https://backendvimalagro.onrender.com/leaderlogo";

function Leaderlog() {

  const [leaderLogoImage, setLeaderLogoImage] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [fetching, setFetching] = useState(true);
  const fileInputRef = useRef(null);

  // ✅ Fetch Leader Logos (GET)
  useEffect(() => {
    fetchLeaderLogos();
  }, []);

  const fetchLeaderLogos = async () => {
    setFetching(true);
    try {
      const res = await axios.get(API_URL);
      const sorted = res.data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setTableData(sorted);
    } catch (error) {
      console.error("Error fetching leader logos:", error);
    } finally {
      setFetching(false);
    }
  };

  // ✅ File change handler
  const handleFileChange = (e) => {
    setLeaderLogoImage(e.target.files[0]);
  };

  // ✅ Add Leader Logo (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leaderLogoImage) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please select a leader logo image before submitting!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("Leaderlogoimage", leaderLogoImage); // backend expects this key

    try {
      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: "Leader logo has been added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      setLeaderLogoImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      fetchLeaderLogos(); // refresh list
    } catch (error) {
      console.error("Error uploading leader logo:", error);
      Swal.fire("Error", "Failed to upload leader logo", "error");
    }
  };

  // ✅ Delete Leader Logo (DELETE)
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the leader logo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          fetchLeaderLogos(); // refresh list

          Swal.fire({
            title: "Deleted!",
            text: "Leader logo has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting leader logo:", error);
          Swal.fire("Error", "Failed to delete leader logo", "error");
        }
      }
    });
  };

  return (
    <div className="container mt-3 mt-lg-0 mt-md-0">
      <h3 className="fw-bold text-center mb-3 mb-md-4 main-tittle">
        Leader Logo
      </h3>

      {/* Upload Form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-3 shadow overflow-hidden">
          <div
            className="p-3"
            style={{ background: "white", borderBottom: "2px solid lightgrey" }}
          >
            <h6 className="fw-bold m-0 text-dark">
              <FaPlus className="me-2" />
              Add Leader Logo
            </h6>
          </div>
          <div className="px-4 pb-4 pt-2 bg-white">
            <div className="w-100 w-lg-50 w-md-50 mt-2">
              <label className="d-block fw-bold">Leader Logo Image (size not required like... square or rectangle)</label>
              <input
                type="file"
                name="Leaderlogoimage"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="mt-1 w-100 form-control border border-secondary"
              />
            </div>
            <div className="mt-3 text-center">
              <button
                type="submit"
                className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
              >
                <span>Submit</span>
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
            Added Leader Logos
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
                    Leader Logo Image
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
                      <td>
                        <img
                          src={item.Leaderlogoimage}
                          alt="Leader Logo"
                          style={{
                            width: "100px",
                            height: "30px",
                            objectFit: "contain",
                          }}
                        />
                      </td>
                      <td>
                        <FaTrash
                          className="text-danger fs-5"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(item._id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center text-muted">
                      No Leader Logos.
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

export default Leaderlog