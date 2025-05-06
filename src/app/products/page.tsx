import React from "react";
import ProductForm from "../components/ProductForm";

const page = () => {
  return (
    <div className="container mx-auto p-4">
      <h1>New Product</h1>
      <ProductForm />
    </div>
  );
};

export default page;
