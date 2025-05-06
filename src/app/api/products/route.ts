import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "../../../../lib/db";
import { Product } from "../../../../models/product";
import { isAdminRequest } from "../auth/[...nextauth]/route";

interface Category {
  _id: string;
}

interface ProductRequestBody {
  title: string;
  description: string;
  price: number;
  image: string[] | string;
  category?: Category | string;
  properties?: Record<string, string>;
}

//*create post

export async function POST(request: Request) {
  try {
    connectDB();
    const body: ProductRequestBody = await request.json();
    const { title, description, price, image, category, properties } = body;

    const product = await Product.create({
      title, // Change title to name to match schema
      description,
      price,
      image, // Fixed variable name from image to images
      category,
      properties,
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

//*get all products
export async function GET(request: Request) {
  try {
    connectDB();
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
