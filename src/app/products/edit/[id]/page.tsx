"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm, { ProductFormProps } from "@/app/components/ProductForm";
import Layout from "@/app/components/Layout";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState<ProductFormProps>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Edit product</h1>
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}
