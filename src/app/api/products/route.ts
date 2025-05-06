import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "../../../../lib/db";
import { Product } from "../../../../models/product";
import { isAdminRequest } from "../auth/[...nextauth]/route";

interface Category {
  id: string;
}

interface ProductRequestBody {
  title: string;
  description: string;
  price: number;
  images: string[] | string;
  category?: Category | string;
  properties?: Record<string, string>;
}

//*create post

export async function POST(request: Request) {
  try {
    connectDB();
    const body: ProductRequestBody = await request.json();
    const { title, description, price, images, category, properties } = body;

    const product = await Product.create({
      title, // Change title to name to match schema
      description,
      price,
      images, // Fixed variable name from image to images
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
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    connectDB();
    // const { slug } = await params;
    // const id = slug as string;
    console.log("###########################################################", params);
    console.log("Request URL:", request.url);
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
