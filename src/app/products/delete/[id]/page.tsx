"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/app/components/Layout";

interface ProductInfo {
  _id: string;
  title: string;
  // Add other product properties as needed
}

export default function DeleteProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const id = params.id;
  console.log("id", id);

  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No product ID provided");
      return;
    }
    // Validate the ID format if needed
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      setError("Invalid product ID format");
      return;
    }

    axios
      .get(`/api/products/${id}`)
      .then((response) => {
        if (!response.data) {
          setError("Product not found");
          return;
        }
        console.log("response", response.data);
        setProductInfo(response.data);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      });
  }, [id]);

  async function deleteProduct() {
    if (!id) {
      setError("No product ID available for deletion");
      return;
    }

    try {
      await axios.delete(`/api/products?id=${id}`);
      console.log("Product deleted successfully!");
      goBack();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
    }
  }

  function goBack() {
    router.push("/products");
  }

  if (error) {
    return (
      <>
        <h1>{id}</h1>
        <div className="text-center text-red-500">{error}</div>
        <div className="flex justify-center mt-4">
          <button className="btn-default cursor-pointer" onClick={goBack}>
            Back to Products
          </button>
        </div>
      </>
    );
  }

  if (!productInfo) {
    return (
      <>
        <div className="text-center">Loading product details...</div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-center">
        Do you really want to delete &nbsp;&quot;{productInfo.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center mt-4">
        <button onClick={deleteProduct} className="btn-red cursor-pointer">
          Yes
        </button>
        <button className="btn-default cursor-pointer" onClick={goBack}>
          NO
        </button>
      </div>
    </>
  );
}
