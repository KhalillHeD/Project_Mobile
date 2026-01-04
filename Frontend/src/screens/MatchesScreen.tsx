import React from "react";
import { useAppContext } from "../context/AppContext";
import JobseekerMatchesScreen from "./JobseekerMatchesScreen";
import RecruiterMatchesScreen from "./RecruiterMatchesScreen";

export default function MatchesScreen() {
  const { role } = useAppContext() as any;
  return role === "recruiter" ? <RecruiterMatchesScreen /> : <JobseekerMatchesScreen />;
}
