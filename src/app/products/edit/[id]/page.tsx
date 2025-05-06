"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm, { ProductFormProps } from "@/app/components/ProductForm";
import Spinner from "@/app/components/Spinner";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [productInfo, setProductInfo] = useState<ProductFormProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError("");

    axios
      .get(`/api/products/${id}`)
      .then((response) => {
        setProductInfo(response.data);
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Failed to fetch product");
        console.error("Error fetching product:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading)
    return (
      <div className=" flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!productInfo) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit product</h1>
      <ProductForm {...productInfo} />
    </div>
  );
}
