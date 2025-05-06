import ProductForm from "@/app/components/ProductForm";
import React from "react";


const page = () => {
  return (
    <div className="container mx-auto p-4">
      <h1>New Product</h1>
      <ProductForm/>
    </div>
  );
};

export default page;
