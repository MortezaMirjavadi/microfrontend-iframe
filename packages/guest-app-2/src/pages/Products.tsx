import React from "react";
import { Link } from "react-router-dom";

const Products: React.FC = () => {
  const products = [
    { id: 1, name: "Product 1", category: "Electronics" },
    { id: 2, name: "Product 2", category: "Clothing" },
    { id: 3, name: "Product 3", category: "Home" },
    { id: 4, name: "Product 4", category: "Electronics" },
    { id: 5, name: "Product 5", category: "Clothing" },
  ];

  return (
    <div>
      <h2>All Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/product/${product.id}`}>
              {product.name} - {product.category}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
