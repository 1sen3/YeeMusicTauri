import { isTauri } from "@tauri-apps/api/core";
import { Effect } from "@tauri-apps/api/window";
import { createContext, useContext, useEffect, useState } from "react";

export type WindowMaterial = "Acrylic" | "Mica" | "None";

type MaterialProviderProps = {
  children: React.ReactNode;
  defaultMaterial?: WindowMaterial;
  storageKey?: string;
};

type MaterialProviderState = {
  material: WindowMaterial;
  setMaterial: (material: WindowMaterial) => void;
};

const initialState: MaterialProviderState = {
  material: "Mica",
  setMaterial: () => null,
};

const MaterialProviderContext =
  createContext<MaterialProviderState>(initialState);

export function MaterialProvider({
  children,
  defaultMaterial = "Mica",
  storageKey = "yee-music-material",
  ...props
}: MaterialProviderProps) {
  const [material, setMaterial] = useState<WindowMaterial>(
    () =>
      (localStorage.getItem(storageKey) as WindowMaterial) || defaultMaterial,
  );

  useEffect(() => {
    if (isTauri()) {
      import("@tauri-apps/api/window").then(async (module) => {
        const appWindow = module.getCurrentWindow();
        try {
          await appWindow.clearEffects();
          if (material === "Mica") {
            await appWindow.setEffects({ effects: [Effect.Mica] });
          } else if (material === "Acrylic") {
            await appWindow.setEffects({ effects: [Effect.Acrylic] });
          }
        } catch (error) {
          console.error("Failed to set window effects", error);
        }
      });
    }
  }, [material]);

  const value = {
    material,
    setMaterial: (newMaterial: WindowMaterial) => {
      localStorage.setItem(storageKey, newMaterial);
      setMaterial(newMaterial);
    },
  };

  return (
    <MaterialProviderContext.Provider {...props} value={value}>
      {children}
    </MaterialProviderContext.Provider>
  );
}

export const useMaterial = () => {
  const context = useContext(MaterialProviderContext);
  if (context === undefined)
    throw new Error("useMaterial mus be used within a MaterialProvider");
  return context;
};
