import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Home, Heart, User } from "lucide-react-native";
import { AppProvider, useAppContext } from "../src/context/AppContext";
import LoadingScreen from "../src/components/LoadingScreen";

function RootTabs() {
  const { isReady } = useAppContext();
  const [startupDone, setStartupDone] = useState(false);

  useEffect(() => {
    if (isReady) setStartupDone(true);
  }, [isReady]);

  if (!startupDone) {
    return <LoadingScreen />;
  }

  return (
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

      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="signup" options={{ href: null }} />
      <Tabs.Screen name="chat" options={{ href: null }} />
      <Tabs.Screen name="my-jobs" options={{ href: null }} />
      <Tabs.Screen name="add-job" options={{ href: null }} />
      <Tabs.Screen name="recruiter-jobs" options={{ href: null }} />
      <Tabs.Screen name="+not-found" options={{ href: null }} />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootTabs />
    </AppProvider>
  );
}
