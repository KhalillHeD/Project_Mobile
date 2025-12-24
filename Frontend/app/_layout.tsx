import React from "react";
import { Slot } from "expo-router";
import { AppProvider } from "../src/context/AppContext"; // adjust path

export default function RootLayout() {
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  );
}
