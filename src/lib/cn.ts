import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Joins conditional class names, with later Tailwind utilities overriding conflicting earlier ones. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
