import React, { useEffect, useState } from 'react'
import { FaDatabase, FaEdit, FaPlus } from 'react-icons/fa'
import Swal from 'sweetalert2';

function Counter() {

    const [counters, setCounters] = useState({
        customers: "",
        products: "",
        countries: "",
    });

    const [tableData, setTableData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        setFetching(true);
        fetch("https://backendvimalagro.onrender.com/counter")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const allValues = data.flatMap(item =>
                        item.value.map(v => ({ ...v, parentId: item._id }))
                    );
                    setTableData(allValues);
                }
            })
            .catch((err) => console.error("Fetch error:", err))
            .finally(() => {
                setFetching(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCounters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!counters.customers || !counters.products || !counters.countries) {
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill all fields before submitting.",
            });
            return;
        }

        const data = { value: [counters] };

        try {
            const res = await fetch("https://backendvimalagro.onrender.com/counter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const newData = await res.json();
                if (newData?.counter?.value?.length > 0) {
                    const added = newData.counter.value[0];
                    setTableData(prev => [...prev, { ...added, parentId: newData.counter._id }]);
                }

                setCounters({ customers: "", products: "", countries: "" });

                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Counter details added successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleEdit = (row) => {
        setCounters({
            customers: row.customers,
            products: row.products,
            countries: row.countries,
        });
        setEditId(row.parentId);
        setIsEditMode(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editId) return;

        if (!counters.customers || !counters.products || !counters.countries) {
            Swal.fire({
                icon: "warning",
                title: "All Fields Required!",
                text: "Please fill all fields before updating.",
            });
            return;
        }

        try {
            const res = await fetch(`https://backendvimalagro.onrender.com/counter/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: [counters] }),
            });

            if (res.ok) {
                const updatedData = await res.json();

                if (updatedData?.counter?.value?.length > 0) {
                    const updated = updatedData.counter.value[0];
                    setTableData(prev =>
                        prev.map(row =>
                            row.parentId === editId ? { ...updated, parentId: editId } : row
                        )
                    );
                }

                setCounters({ customers: "", products: "", countries: "" });
                setIsEditMode(false);
                setEditId(null);

                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: "Counter details updated successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const isDisabled = !isEditMode && tableData.length > 0;

    return (
        <div className='container mt-3 mt-lg-0 mt-md-0'>
            <h3 className='fw-bold text-center mb-3 mb-md-4 main-tittle'>Counter</h3>
            <form onSubmit={isEditMode ? handleUpdate : handleSubmit}>
                <div className="rounded-3 shadow overflow-hidden">
                    <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className='me-2' />{isEditMode ? "Update Counter Details" : "Add Counter Details"}
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className='d-lg-flex d-md-flex gap-3'>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label className='d-block fw-bold'>Happy Customers</label>
                                <input
                                    type="number"
                                    name="customers"
                                    className='mt-1 w-100 form-control border border-secondary'
                                    placeholder="Enter Customer Count"
                                    value={counters.customers}
                                    onChange={handleChange}
                                    disabled={isDisabled}
                                />
                            </div>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label className='d-block fw-bold'>Popular Products</label>
                                <input
                                    type="number"
                                    name="products"
                                    className='mt-1 w-100 form-control border border-secondary'
                                    placeholder="Enter Product Count"
                                    value={counters.products}
                                    onChange={handleChange}
                                    disabled={isDisabled}
                                />
                            </div>
                            <div className='w-100 w-lg-50 w-md-50 mt-2'>
                                <label className='d-block fw-bold'>More Countries</label>
                                <input
                                    type="number"
                                    name="countries"
                                    className='mt-1 w-100 form-control border border-secondary'
                                    placeholder="Enter Countries Count"
                                    value={counters.countries}
                                    onChange={handleChange}
                                    disabled={isDisabled}
                                />
                            </div>
                        </div>
                        <div className='mt-3 text-center'>
                            <button
                                type='submit'
                                className='px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow'
                                onClick={(e) => {
                                    if (isDisabled) {
                                        e.preventDefault();
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Already Exists!',
                                            text: 'Data already exists! Use Edit button to update.',
                                        });
                                    }
                                }}
                            >
                                <span>{isEditMode ? "Update" : "Submit"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className='rounded-3 shadow overflow-hidden my-4'>
                <div className="p-3" style={{ background: "white", borderBottom: "2px solid lightgrey" }}>
                    <h6 className="fw-bold m-0 text-dark">
                        <FaDatabase className='me-2' />Counter Data
                    </h6>
                </div>
                <div className='bg-white p-4 table-responsive'>
                    {fetching ? (
                        <div className="text-center">
                            <div role="status">
                                <img src={require("../../assets/Images/loader.gif")} className="img-fluid" alt="" />
                            </div>
                        </div>
                    ) : (
                        <table className='table table-bordered border-secondary custom-table table-hover text-center'>
                            <thead style={{ fontSize: "15px" }}>
                                <tr>
                                    <th className='text-white' style={{ background: "var(--red)" }}>Happy Customers</th>
                                    <th className='text-white' style={{ background: "var(--red)" }}>Popular Products</th>
                                    <th className='text-white' style={{ background: "var(--red)" }}>More Countries</th>
                                    <th className='text-white' style={{ background: "var(--red)" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody className='pera'>
                                {tableData.length > 0 ? (
                                    tableData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row.customers}</td>
                                            <td>{row.products}</td>
                                            <td>{row.countries}</td>
                                            <td>
                                                <FaEdit onClick={() => handleEdit(row)} className='text-danger fs-5' />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">
                                            No Counter Data Found.
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

export default Counter