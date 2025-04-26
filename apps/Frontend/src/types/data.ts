import { Rgb } from "./rgb";

export type Data = { action: "FILL"; r: number; g: number; b: number } | { action: "BRIGHTNESS"; value: number };
export type ActionType = "FILL" | "BRIGHTNESS";
export type ActionValue = Rgb | number;
