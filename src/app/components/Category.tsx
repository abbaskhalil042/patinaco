"use client";
import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Layout from "../components/Layout";

interface Property {
  name: string;
  values: string; // comma-separated string in form state
}

interface Category {
  id: string;
  name: string;
  parent?: {
    id: string;
    name: string;
  };
  properties: { name: string; values: string[] }[];
}

interface CategoriesProps {
  swal: {
    fire: (options: any) => Promise<{ isConfirmed: boolean }>;
  };
}

function Category({ swal }: CategoriesProps) {
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }

  async function saveCategory(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data: any = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };

    if (editedCategory) {
      data.id = editedCategory.id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }

    // Reset form
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category: Category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?.id || "");
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategory(category: Category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete("/api/categories?id=" + category.id);
          fetchCategories();
        }
      });
  }

  function addProperty() {
    setProperties((prev) => [...prev, { name: "", values: "" }]);
  }

  function handlePropertyNameChange(index: number, newName: string) {
    setProperties((prev) => {
      const updated = [...prev];
      updated[index].name = newName;
      return updated;
    });
  }

  function handlePropertyValuesChange(index: number, newValues: string) {
    setProperties((prev) => {
      const updated = [...prev];
      updated[index].values = newValues;
      return updated;
    });
  }

  function removeProperty(indexToRemove: number) {
    setProperties((prev) => prev.filter((_, i) => i !== indexToRemove));
  }

  return (
    <>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
          >
            <option value="">No parent category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            onClick={addProperty}
            className="btn-default text-sm mb-2"
          >
            Add new property
          </button>

          {properties.map((prop, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                type="text"
                placeholder="property name (example: color)"
                value={prop.name}
                className="mb-0"
                onChange={(ev) =>
                  handlePropertyNameChange(index, ev.target.value)
                }
              />
              <input
                type="text"
                placeholder="values, comma separated"
                value={prop.values}
                className="mb-0"
                onChange={(ev) =>
                  handlePropertyValuesChange(index, ev.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeProperty(index)}
                className="btn-red"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>

      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.parent?.name || "—"}</td>
                <td>
                  <button
                    onClick={() => editCategory(cat)}
                    className="btn-default mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cat)}
                    className="btn-red"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default withSwal(({ swal }: any) => <Category swal={swal} />);
