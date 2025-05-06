"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/app/components/Spinner";

interface ProductInfo {
  _id: string;
  title: string;
}

export default function DeleteProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id; // Remove the optional chaining (?.)

  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No product ID provided");
      setIsLoading(false);
      router.push("/products");
      return;
    }

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        
        if (!response.data) {
          setError("Product not found");
          return;
        }
        
        setProductInfo(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  async function deleteProduct() {
    try {
      setIsLoading(true);
      await axios.delete(`/api/products/${id}`);
      router.push("/products");
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <h1 className="text-red-500">{error}</h1>
        <button 
          className="btn-default mt-4"
          onClick={() => router.push("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!productInfo) {
    return <div className="text-center p-4">Loading product details...</div>;
  }

  return (
    <div className="text-center p-4">
      <h1 className="text-xl mb-4">
        Do you really want to delete &quot;{productInfo.title}&quot;?
      </h1>
      <div className="flex gap-4 justify-center">
        <button 
          onClick={deleteProduct} 
          className="btn-red"
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Yes, Delete"}
        </button>
        <button 
          className="btn-default" 
          onClick={() => router.push("/products")}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}