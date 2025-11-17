"use client"; // Add this directive for using state and event handlers

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface PaymentStatusProps {
  method: "meowth-wallet" | "cash";
  status: "Payment Waiting" | "Paid";
  walletBalance?: number;
}

export default function PaymentStatus({
  method,
  status,
  walletBalance,
}: PaymentStatusProps) {
  const [paymentMethod, setPaymentMethod] = useState(method);

  if (status === "Paid") {
    return (
      <Card className="h-full w-full rounded-2xl bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Payment
          </CardTitle>
          <Badge variant="secondary">Complete</Badge>
        </CardHeader>
        <CardContent className="py-10 text-center">
          <p className="text-lg">
            Your payment was{" "}
            <span className="font-bold text-yellow-500">successful</span>. Your
            food is on its way!
          </p>
          <div className="mt-4 text-5xl">😀</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full rounded-2xl bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Payment
        </CardTitle>
        <Badge
          variant="outline"
          className="border-yellow-300 bg-yellow-50 text-yellow-800"
        >
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) =>
            setPaymentMethod(value as "meowth-wallet" | "cash")
          }
        >
          {/* Meowth Wallet Option */}
          <div className="flex items-start space-x-3">
            <RadioGroupItem
              value="meowth-wallet"
              id="meowth-wallet"
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="meowth-wallet" className="text-lg font-semibold">
                Meowth Wallet
              </Label>
              {paymentMethod === "meowth-wallet" && (
                <div className="mt-2 space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Go cashless! Enjoy fast, secure, and easy payments with your
                    in-app wallet.
                  </p>
                  {walletBalance !== undefined && (
                    <div className="text-muted-foreground flex justify-between text-sm">
                      <span>Remaining</span>
                      <span>{walletBalance.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" className="w-full">
                      Top up 20.00
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Top up 100.00
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Top up 500.00
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Top up 1,000.00
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Pay by Cash Option */}
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="cash" id="cash" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="cash" className="text-lg font-semibold">
                Pay by Cash
              </Label>
              {paymentMethod === "cash" && (
                <div className="mt-2">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Pay your driver in cash when your food arrives. The driver
                    will confirm your payment in the app before handing over
                    your order.
                    <br />
                    <br />
                    Unpaid orders may get you banded from our application.
                  </p>
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
