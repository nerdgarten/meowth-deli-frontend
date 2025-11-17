"use client";
import { createContext, useContext, useState } from "react";
import { boolean } from "zod";
import { X, TriangleAlert } from "lucide-react";
interface ResolveReportContextProps {
  open: () => void;
  close: () => void;
}
const ResolveReportContext = createContext<ResolveReportContextProps | null>(
  null
);

export function ResolveReport({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  const updateOpen = () => {
    setOpen(true);
  };
  const updateClose = () => {
    setOpen(false);
  };
  return (
    <ResolveReportContext.Provider
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

            <div className="flex w-full flex-col gap-2">
              <h1 className="text-3xl font-semibold">Resolve this report?</h1>
              <p className="text-app-tan font-light">
                Confirm before archiving the report from your pending queue.
              </p>
            </div>

            <div className="text-md flex w-full gap-4">
              <button
                onClick={updateClose}
                className="flex-1 rounded-full bg-sky-400 px-4 py-2 font-semibold text-white shadow-md hover:bg-sky-500 active:bg-sky-600"
              >
                Keep pending
              </button>
              <button
                onClick={updateClose}
                className="flex-1 rounded-full bg-red-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-red-700 active:bg-red-800"
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </ResolveReportContext.Provider>
  );
}

export function useResolveReport() {
  const context = useContext(ResolveReportContext);
  if (!context) {
    throw new Error(
      "useWarningDialog must be used within a WarningDialogProvider"
    );
  }
  return context;
}
