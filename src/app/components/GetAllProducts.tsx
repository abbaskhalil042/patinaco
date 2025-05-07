"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";

interface Product {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images?: string[];
  category?: {
    name: string;
    _id: string;
  };
  createdAt: string;
}

export default function GetAllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleImages = (productId: string) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Gallery</h1>
        <Link className="btn-primary" href={"/products/new"}>
          Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg"
          >
            {/* Main Product Card */}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                    {product.category && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                        {product.category.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/products/edit/${product._id}`}
                    className="btn-default flex items-center gap-1"
                  >
                    {/* Edit Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit
                  </Link>
                  <Link
                    href={`/products/delete/${product._id}`}
                    className="btn-red flex items-center gap-1"
                  >
                    {/* Delete Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
                  </Link>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {product.description || "No description available"}
              </p>

              <div className="mt-3">
                <div
                  className="relative h-48 w-full rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => toggleImages(product._id)}
                >
                  {(product.images?.[0] && (
                    <img
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                      src={product.images[0]}
                      alt={product.title}
                    />
                  )) || (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  {(product.images?.length ?? 0) > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                      +{(product.images?.length ?? 0) - 1} more
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Image Gallery */}
            {expandedProductId === product._id && product.images && product.images.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">All Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-md overflow-hidden border border-gray-200"
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
              Added: {new Date(product.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No products found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new product
          </p>
          <div className="mt-6">
            <Link href="/products/new" className="btn-primary">
              Add New Product
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
