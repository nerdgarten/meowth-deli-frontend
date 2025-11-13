"use client";
import { useContext, useState, createContext } from "react";

interface SettingFloatPanelContextType {
  showPanel: (panel: React.ReactNode) => void;
  hidePanel: () => void;
  setShowCloseButton: (show: boolean) => void;
}

const SettingFloatPanelContext = createContext<
  SettingFloatPanelContextType | undefined
>(undefined);

export function SettingFloatPanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [closeButton, setCloseButton] = useState<boolean>(false);
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const showPanel = (c: React.ReactNode) => setContent(c);
  const hidePanel = () => setContent(null);
  const setShowCloseButton = (show: boolean) => {
    setCloseButton(show);
    // This function can be expanded to control the visibility of the close button
  };

  return (
    <SettingFloatPanelContext.Provider
      value={{ showPanel, hidePanel, setShowCloseButton }}
    >
      {content && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative rounded-2xl bg-white p-6 shadow-lg">
            {closeButton && (
              <button
                onClick={hidePanel}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
            {content}
          </div>
        </div>
      )}
      {children}
    </SettingFloatPanelContext.Provider>
  );
}

export function useSettingFloatPanel() {
  const floatPanel = useContext(SettingFloatPanelContext);
  if (!floatPanel) {
    throw new Error("useFloatPanel must be used inside FloatPanelProvider");
  }
  return floatPanel;
}
