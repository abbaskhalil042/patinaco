import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import { Product } from "../../../../../models/product";

//*get single product
export async function GET(request: Request, { params }: any) {
  try {
    connectDB();
    // const { searchParams } = new URL(request.url);
    // const id = searchParams.get("id");
    const { id } = params;
    console.log("id", id);
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
