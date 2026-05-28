import { type DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
  type: "light",
  bg: "#ffffff",
  text: "#050510",
  textSecondary: "#555555",
  surface: "#ffffff",
  inputBg: "#f7f7f8",
  divider: "#cacacd",
  primary: "#6534ff",
  accent: "#6534ff",
  overlay: "rgba(0, 0, 0, 0.4)",
  textMuted: "#97979b",
  textPlaceholder: "#c3c3c6",
  border: "#cacacd",
  skeleton: "#ededed",
};

export const darkTheme: DefaultTheme = {
  type: "dark",
  bg: "#121214",
  text: "#f1f1f3",
  textSecondary: "#b3b3b3",
  surface: "#1a1a1e",
  inputBg: "#242428",
  divider: "#2c2c30",
  primary: "#8257ff",
  accent: "#8257ff",
  overlay: "rgba(0, 0, 0, 0.6)",
  textMuted: "#8e8e93",
  textPlaceholder: "#6e6e73",
  border: "#2c2c30",
  skeleton: "#242428",
};
