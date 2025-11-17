"use client";

interface UserInfo {
  id?: number;
  email?: string;
  name?: string;
  role?: string;
}

import { TriangleAlert, X } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { boolean } from "zod";
interface WarningDialogContextProps {
  open: (userInfo: UserInfo, onConfirm?: () => void) => void;
  close: () => void;
}

const WarningDialogContext = createContext<WarningDialogContextProps>({
  open: (userInfo: UserInfo) => {},
  close: () => {},
});

export function WarningDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    role: "Customer",
    email: "",
    name: "",
    id: 0,
  });
  const [confirmCallback, setConfirmCallback] = useState<
    (() => void) | undefined
  >(undefined);
  const updateOpen = (info: UserInfo, onConfirm?: () => void) => {
    setOpen(true);
    setUserInfo(info);
    setConfirmCallback(() => onConfirm);
  };
  const updateClose = () => {
    setOpen(false);
    setConfirmCallback(undefined);
    setUserInfo({ role: "Customer", email: "", name: "", id: 0 });
  };
  const onConfirm = () => {
    if (confirmCallback) confirmCallback();
    updateClose();
  };
  return (
    <WarningDialogContext.Provider
      value={{ open: updateOpen, close: updateClose }}
    >
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-8 shadow-lg">
            <button
              onClick={updateClose}
              className="absolute top-3 right-3 rounded-full border-3 border-orange-300 stroke-orange-300 text-orange-300 hover:bg-orange-300/10 active:bg-orange-300/20"
            >
              <X size={20} className="stroke-3" />
            </button>
            <div className="flex w-full items-center rounded-2xl bg-red-100">
              <TriangleAlert size={30} className="m-4 stroke-red-900" />
              <h1 className="my-6 text-2xl font-bold text-red-900">WARNING</h1>
            </div>
            <div className="flex w-full flex-col gap-2">
              <h1 className="text-3xl font-semibold">
                Delete {userInfo.name ?? userInfo.email ?? "user"}{" "}
                {userInfo.role?.toLowerCase()} profile?
              </h1>
              <p className="text-app-tan font-light">
                This action will remove device tokens.
              </p>
              <p className="text-app-tan font-light">
                Transactions cannot be restored once confirmed.
              </p>
            </div>
            <div className="w-full rounded-2xl border border-red-200 bg-white/30 p-4 shadow-md">
              <div className="flex flex-col gap-2">
                <p className="text-app-tan text-sm font-medium">FOCUSED ROLE</p>
                <h1 className="text-2xl font-semibold capitalize">
                  {userInfo.role ?? "Customer"}
                </h1>
                <p className="text-app-tan pr-10 text-sm font-light">
                  Closed account including name and email, saved addresses, and
                  phone number for diners.
                </p>
                {userInfo.email && (
                  <div className="mt-2">
                    <p className="text-app-tan text-sm font-medium">
                      Acting on:{" "}
                      <span className="font-semibold text-gray-700">
                        {userInfo.name ?? userInfo.email}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">{userInfo.email}</p>
                    {userInfo.id && (
                      <p className="text-sm text-gray-500">ID: {userInfo.id}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full rounded-2xl border bg-white/30 p-4 shadow-md">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold">
                  Checklist before deletion
                </h1>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>
                    Make sure the customer has no pending orders or payments.
                  </li>
                  <li>Check if any wallet balance or discount is left.</li>
                  <li>Send a goodbye message to the customer automatically.</li>
                </ul>
              </div>
            </div>
            <div className="w-full rounded-2xl border border-orange-200 bg-orange-50/50 p-3">
              <p className="text-app-tan text-sm font-medium">ACTION SUMMARY</p>
              <p className="text-sm font-semibold text-gray-700">
                The account will be temporarily deleted.
              </p>
            </div>
            <div className="text-md flex w-full gap-4">
              <button
                onClick={updateClose}
                className="flex-1 rounded-full bg-sky-400 px-4 py-2 font-semibold text-white shadow-md hover:bg-sky-500 active:bg-sky-600"
              >
                Keep user active
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-full bg-red-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-red-700 active:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </WarningDialogContext.Provider>
  );
}

export function useWarningDialog() {
  const context = useContext(WarningDialogContext);
  if (!context) {
    throw new Error(
      "useWarningDialog must be used within a WarningDialogProvider"
    );
  }
  return context;
}
