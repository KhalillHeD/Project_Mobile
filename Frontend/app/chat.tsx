import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatScreenUI from "../src/screens/ChatScreen";

export default function ChatRoute() {
  const router = useRouter();
  const { job } = useLocalSearchParams<{ job?: string }>();
  return <ChatScreenUI job={job} onBack={() => router.back()} />;
}
