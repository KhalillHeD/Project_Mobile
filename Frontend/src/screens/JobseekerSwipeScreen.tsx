import React from "react";
import { useAppContext } from "../context/AppContext";

import RealJobseekerSwipeScreen from "./RealJobseekerSwipeScreen";
import RrecruiterJobScreen from "./RrecruiterJobScreen";

export default function JobseekerSwipeScreen() {
  const { role } = useAppContext() as any;
  return role === "recruiter" ? <RrecruiterJobScreen /> : <RealJobseekerSwipeScreen />;
}
