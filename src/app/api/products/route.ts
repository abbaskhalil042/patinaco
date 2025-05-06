import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { Product } from "../../../../models/product";

interface ProductRequestBody {
  name: string;
  description: string;
  price: number;
  image: string[];
}

//*create post
export default async function POST(request: Request) {
  try {
    connectDB();
    const body: ProductRequestBody = await request.json();
    const { name, description, price, image } = body;
    const product = await Product.create({
      name,
      description,
      price,
      images: image,
    });
    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
