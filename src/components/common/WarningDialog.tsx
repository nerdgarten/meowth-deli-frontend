"use client";

import { createContext, useContext, useState } from "react";

interface WarningDialogContextProps {
  open: (s: string) => void;
  close: () => void;
}

const WarningDialogContext = createContext<
  WarningDialogContextProps | undefined
>(undefined);

export function WarningDialogProvider() {
  const [content, setContent] = useState<string>("");

  const open = (s: string) => {
    setContent(s);
  };
  const close = () => {
    setContent("");
  };
  return (
    <WarningDialogContext.Provider value={{ open, close }}>
      {content && (
        <div className="fixed inset-0 z-50 m-60 rounded-md bg-white/50 shadow-lg">
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 p-8">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              ✕
            </button>
            <h1 className="text-2xl font-bold">Warning Dialog</h1>
            <h2 className="text-center text-lg font-semibold">
              Delete is permanently, system can&apos;t recover deleted data.
            </h2>
          </div>
        </div>
      )}
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
