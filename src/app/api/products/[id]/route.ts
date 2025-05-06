import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import { Product } from "../../../../../models/product";
import mongoose from "mongoose";

interface ProductRequestBody {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  properties?: Record<string, any>;
}
//*get single product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params; // Get ID from route parameter

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Correct way to extract id from params (remove await)
    const { id } = params;

    console.log("ID from params:", id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Valid product ID is required" },
        { status: 400 }
      );
    }

    const body: ProductRequestBody = await request.json();
    const { title, description, price, images, category, properties } = body;

    // Validate required fields
    if (!title || !price) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        images,
        category,
        properties,
      },
      { new: true, runValidators: true } // Added runValidators
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product updated successfully", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Remove product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Valid product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully", deletedId: product._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
