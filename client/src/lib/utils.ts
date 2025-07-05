import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiUrl() {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:5000";
  }
  // Replace this with your Render backend URL once deployed
  return "https://shan-study-hub-backend.onrender.com";
}
