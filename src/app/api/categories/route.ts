import { NextResponse } from "next/server";
import { Category } from "../../../../models/category";

type ParentCategory = {
  _id: string;
};

type Body = {
  name: string;
  parent?: ParentCategory; // Optional if parent is not always provided
};
export  async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const { name, parent } = body

    const category = await Category.create({
      name,
      parent,
    });

    return NextResponse.json(
      { message: "Category created successfully", category },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

//*get all categories
export async function GET(request: Request) {
  try {
    const categories = await Category.find().populate("parent");
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

//*update category
export async function PUT(request: Request) {
  try {
    const body: Body = await request.json();
    const { name, parent } = body;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, parent },
      { new: true }
    );

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category updated successfully", category },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

//*delete category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
