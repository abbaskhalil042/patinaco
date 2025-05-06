"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm, { ProductFormProps } from "@/app/components/ProductForm";
import Spinner from "@/app/components/Spinner";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState<ProductFormProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

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
        setProductInfo(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Error fetching product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!productInfo) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit product</h1>
      <ProductForm {...productInfo} />
    </div>
  );
}
