"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { queryCustomerProfile } from "@/queries/profile";
import type { ICustomerProfile } from "@/types/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditProfileFormSchema,
  updateCustomerProfileMutation,
} from "@/queries/profile";
import { id } from "zod/v4/locales";

export function CustomerOrderPage() {
  return (
    <main className="bg-app-background flex h-full flex-col items-center pt-8">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8">
        <CustomerOrderList />
      </div>
    </main>
  );
}
const order = [
  {
    id: "ORD123456",
    restaurant: "Pizza Palace",
    status: "Delivered",
    price: 24.99,
  },
  {
    id: "ORD789012",
    restaurant: "Sushi World",
    status: "In Transit",
    price: 29.99,
  },
  {
    id: "ORD345678",
    restaurant: "Burger Barn",
    status: "Preparing",
    price: 15.99,
  },
];

export function CustomerOrderList() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white shadow-[0_15px_40px_rgba(64,56,49,0.08)]">
      <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-start gap-4">
          <span className="text-app-dark-brown flex size-12 items-center justify-center rounded-full">
            <ShoppingBag className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-app-dark-brown text-xl font-semibold">
              Order History
            </h2>
            <p className="text-app-brown/80 mt-1 text-sm">
              View your recent orders and their status.
            </p>
          </div>
        </div>
        {order.map((item, index) => (
          <div
            key={index}
            className="m-2 flex items-center justify-between rounded-lg border-gray-200 p-8 shadow-sm"
          >
            <div className="mx-4 flex h-full flex-col justify-between gap-2 rounded-lg">
              <div className="flex gap-2">
                <h3 className="text-app-dark-brown text-lg font-medium">
                  {item.id}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    item.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : item.status === "In Transit"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <h3 className="text-app-dark-brown text-lg font-medium">
                {item.restaurant}
              </h3>
              <p className="text-app-brown text-sm font-medium">
                Total Price: ${item.price.toFixed(2)}
              </p>
            </div>

            <button className="border-app-brown hover:bg-app-brown active:bg-app-dark-brown m-2 rounded-lg border-2 p-2 font-medium text-black transition-transform hover:text-white active:scale-95">
              View Detailed
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
