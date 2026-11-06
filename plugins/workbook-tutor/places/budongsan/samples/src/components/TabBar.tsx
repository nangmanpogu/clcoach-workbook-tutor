// 아래 탭. 아이폰은 흰 바탕에 위 선, 안드로이드는 고른 탭 아이콘 뒤에 알약 표시를 둔다
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeartIcon, SearchIcon } from "./Icons";
import { color, isIOS } from "../lib/theme";

const tabs: Record<string, { label: string }> = {
  index: { label: "검색" },
  favorites: { label: "관심 단지" },
};

export function TabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: isIOS ? color.white : color.fillSoft,
        borderTopWidth: isIOS ? 1 : 0,
        borderTopColor: color.lineSoft,
        paddingTop: isIOS ? 8 : 12,
        paddingBottom: Math.max(insets.bottom, isIOS ? 8 : 16),
      }}
    >
      {state.routes.map((route, i) => {
        const on = state.index === i;
        const tint = on ? color.text : isIOS ? color.textOff : color.textMuted;
        const label = tabs[route.name]?.label ?? route.name;
        const icon =
          route.name === "favorites" ? (
            <HeartIcon size={isIOS ? 26 : 24} color={tint} filled={on} />
          ) : (
            <SearchIcon
              size={isIOS ? 26 : 24}
              color={tint}
              strokeWidth={on ? 2.4 : 2}
            />
          );
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => {
              const event = emitter.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!on && !event.defaultPrevented)
                navigateToTab(route.key);
            }}
            style={{ flex: 1, alignItems: "center", gap: isIOS ? 2 : 4 }}
          >
            {isIOS ? (
              icon
            ) : (
              <View
                style={{
                  width: 64,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: on ? color.line : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </View>
            )}
            <Text
              style={{
                fontSize: isIOS ? 11 : 12,
                fontWeight: on ? (isIOS ? "600" : "700") : "500",
                color: tint,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
