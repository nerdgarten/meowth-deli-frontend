import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderId: string;
      amount: number;
      paymentMethod: string;
    };
    const { orderId, amount, paymentMethod } = body;

    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Call the backend API
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/process-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({
          orderId,
          amount,
          paymentMethod,
        }),
      }
    );

    const data = (await backendResponse.json()) as {
      success: boolean;
      message?: string;
    };

    if (backendResponse.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { success: false, message: data.message ?? "Payment failed" },
        { status: backendResponse.status }
      );
    }
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
