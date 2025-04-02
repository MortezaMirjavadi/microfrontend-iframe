import React from "react";

const Categories: React.FC = () => {
  const categories = [
    { id: "electronics", name: "Electronics" },
    { id: "clothing", name: "Clothing" },
    { id: "home", name: "Home & Garden" },
    { id: "sports", name: "Sports & Outdoors" },
  ];

  return (
    <div>
      <h2>Product Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <strong>{category.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
