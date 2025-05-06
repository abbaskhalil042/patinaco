import { NextResponse } from "next/server";
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
      name: title, // Change title to name to match schema
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


//*update product
export async function PUT(request: Request, { params }: any) {
  try {
    connectDB();
    const { id } = params;
    const body: ProductRequestBody = await request.json();
    const { title, description, price, image, category, properties } = body;
    const product = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        images: image,
        category,
        properties,
      },
      { new: true }
    );
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Product updated successfully", product },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

//*delete product
export async function DELETE(request: Request, { params }: any) {
  try {
    connectDB();
    const { id } = params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
