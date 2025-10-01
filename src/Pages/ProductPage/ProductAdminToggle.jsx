import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../assets/Css/Product.css";
import ProductPage from "./ProductPage";

function ProductAdminToggle() {

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        axios
            .get("https://backendvimalagro.onrender.com/view/btn")
            .then((res) => {
                setIsVisible(res.data.isVisible);
            })
            .catch((err) => console.error("Error fetching:", err));
    }, []);

    const handleChange = async () => {
        const newState = !isVisible;
        setIsVisible(newState);

        try {
            await axios.post("https://backendvimalagro.onrender.com/view/btn", {
                isVisible: newState,
            });
            console.log("Updated ✅", newState);
        } catch (err) {
            console.error("Error updating:", err);
        }
    };

    return (
        <>
            <div className="container mt-3 mt-lg-0 mt-md-0">
                <h3 className="fw-bold text-center mb-3 mb-md-2 main-tittle">
                    Product
                </h3>
                <div className="d-md-flex text-center justify-content-center align-items-center">
                    <h5 className="fw-bold m-0 text-dark me-2 mb-1 mb-md-0">
                        Show SubProduct's Detail :-
                    </h5>
                    <label className="switch">
                        <input type="checkbox" checked={isVisible} onChange={handleChange} />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="pera text-center mt-2 mt-md-1">
                    Note :- The toggle switch turns red to Enable and grey to Disable the
                    "View More" button for product details.
                </div>
            </div>

            <ProductPage />
        </>
    );
}

export default ProductAdminToggle