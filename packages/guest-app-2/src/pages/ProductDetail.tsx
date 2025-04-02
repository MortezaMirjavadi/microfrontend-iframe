import React from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h2>Product Details</h2>
      <p>Viewing product with ID: {id}</p>

      <div>
        <h3>Product {id}</h3>
        <p>Price: $99.99</p>
        <p>Description: This is an example product description.</p>
      </div>

      <Link to="/products">Back to Products</Link>
    </div>
  );
};

export default ProductDetail;
