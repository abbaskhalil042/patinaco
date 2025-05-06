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

export default function DeleteProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id='+id).then(response => {
      setProductInfo(response.data);
    });
  }, [id]);

  function goBack() {
    router.push('/products');
  }

  async function deleteProduct() {
    await axios.delete('/api/products?id='+id);
    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">Do you really want to delete
        &nbsp;&quot;{productInfo?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          onClick={deleteProduct}
          className="btn-red"
        >
          Yes
        </button>
        <button
          className="btn-default"
          onClick={goBack}
        >
          NO
        </button>
      </div>
    </Layout>
  );
}