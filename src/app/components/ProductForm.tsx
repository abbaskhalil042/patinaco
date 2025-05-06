"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ReactSortable } from "react-sortablejs";
import Spinner from "./Spinner";

export interface ProductFormProps {
  _id?: string;
  title?: string;
  description?: string;
  price?: number;
  images?: string[] | string; // Allow both string and string[] types
  category?: string;
  properties?: Record<string, string>;
}

type Property = {
  name: string;
  values: string[];
};

type Category = {
  _id: string;
  name: string;
  properties: Property[];
  parent?: {
    _id: string;
  };
};

interface CategoryResponse {
  _id: string;
  name: string;
  properties: Property[];
  parent?: {
    _id: string;
  };
}

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}: ProductFormProps) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState<
    Record<string, string>
  >(assignedProperties || {});
  const [price, setPrice] = useState(existingPrice || null);
  const [images, setImages] = useState<string[]>(
    Array.isArray(existingImages)
      ? existingImages
      : existingImages
      ? existingImages.split(",")
      : []
  );
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images: images.filter((img) => img.trim() !== ""),
      category,
      properties: productProperties,
    };
    if (_id) {
      await axios.put("/api/products/" + _id, { ...data });

      // console.log("Updated product:", response?.data);
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(ev: React.ChangeEvent<HTMLInputElement>) {
    const files = ev.target?.files;
    if (!files) return;
    if (files.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => [
        ...oldImages,
        ...(res.data.links || [res.data.url]),
      ]);
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images: string[]): void {
    setImages(images);
  }

  function setProductProp(propName: string, value: string) {
    setProductProperties((prev) => ({ ...prev, [propName]: value }));
  }
  const propertiesToFill: Property[] = [];

  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);

    if (catInfo) {
      // Add current category properties if they exist
      if (catInfo.properties && Array.isArray(catInfo.properties)) {
        propertiesToFill.push(...catInfo.properties);
      }

      // Check parent categories
      while (catInfo?.parent?._id) {
        const parentCat = categories.find(
          ({ _id }) => _id === catInfo?.parent?._id
        );
        if (parentCat) {
          // Add parent properties if they exist
          if (parentCat.properties && Array.isArray(parentCat.properties)) {
            propertiesToFill.push(...parentCat.properties);
          }
          catInfo = parentCat;
        } else {
          break;
        }
      }
    }
  }
  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        className="focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 rounded-md shadow-sm"
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select
        className="focus:ring-1 focus:ring-blue-900 border-blue-900 rounded-md shadow-sm"
        value={category}
        onChange={(ev) => setCategory(ev.target.value)}
      >
        <option value="">Uncategorized</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {propertiesToFill.map((p, i) => (
        <div key={i}>
          <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
          <div>
            <select
              value={productProperties[p.name]}
              onChange={(ev) => setProductProp(p.name, ev.target.value)}
            >
              {p.values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-1"
        >
          {images
            .filter((img) => img.trim() !== "")
            .map((link, i) => (
              <div
                key={i}
                className="h-24 bg-white p-1 shadow-sm rounded-sm border border-gray-200"
              >
                <img
                  src={link}
                  alt={`Uploaded ${i}`}
                  className="rounded-lg max-h-full object-contain"
                />
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}

        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add image</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>

      <label>Description</label>
      <textarea
        className="focus:ring-2 focus:ring-blue-900 border-blue-900 rounded-md shadow-sm"
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        className="focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 rounded-md shadow-sm"
        placeholder="price"
        value={price!}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
          setPrice(parseInt(ev.target.value) || 0)
        }
      />
      <button type="submit" className="btn-primary cursor-pointer">
        Save
      </button>
    </form>
  );
}
