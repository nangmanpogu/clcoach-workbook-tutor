// 색·여백·글자 크기. DESIGN.md 와 같은 값이다
import { Platform } from "react-native";

export const color = {
  text: "#191F28",
  textStrong: "#333D4B",
  textSub: "#4E5968",
  textMuted: "#6B7684",
  textHint: "#8B95A1",
  textOff: "#B0B8C1",
  line: "#E5E8EB",
  lineSoft: "#F2F4F6",
  fill: "#F2F4F6",
  fillSoft: "#F9FAFB",
  tile: "#F2F6FF",
  primary: "#3182F6",
  primarySoft: "#E8F3FF",
  primaryText: "#1B64DA",
  heart: "#F04452",
  white: "#FFFFFF",
  dim: "rgba(0,19,43,0.58)",
};

export const space = { side: 24, band: 16 };

export const isIOS = Platform.OS !== "android";

// 숫자를 같은 폭으로 그려 세로로 맞춘다
export const tabular = { fontVariant: ["tabular-nums" as const] };
