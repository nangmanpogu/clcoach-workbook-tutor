// 탭 화면의 큰 제목
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color, isIOS, space } from "../lib/theme";

export function PageTitle({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + (isIOS ? 20 : 16),
        paddingHorizontal: space.side,
        paddingBottom: 16,
        gap: 16,
      }}
    >
      <Text
        accessibilityRole="header"
        style={{
          fontSize: 26,
          lineHeight: 35,
          fontWeight: "700",
          letterSpacing: -0.3,
          color: color.text,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}
