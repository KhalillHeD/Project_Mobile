import React from "react";
import { Tabs } from "expo-router";
import { Home, Heart, User } from "lucide-react-native";
import { AppProvider } from "../src/context/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#0F1220",
            borderTopColor: "rgba(255,255,255,0.12)",
          },
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "rgba(255,255,255,0.55)",
        }}
      >
        {/* ✅ MAIN TABS */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="matches"
          options={{
            title: "Matches",
            tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />

        {/* ❌ HIDE ROUTES FROM TAB BAR */}
        <Tabs.Screen
          name="index"
          options={{ href: null, tabBarStyle: { display: "none" } }}
        />
        <Tabs.Screen
          name="login"
          options={{ href: null, tabBarStyle: { display: "none" } }}
        />
        <Tabs.Screen
          name="signup"
          options={{ href: null, tabBarStyle: { display: "none" } }}
        />
        <Tabs.Screen name="chat" options={{ href: null }} />
        <Tabs.Screen name="my-jobs" options={{ href: null }} />
        <Tabs.Screen name="+not-found" options={{ href: null }} />
      </Tabs>
    </AppProvider>
  );
}
