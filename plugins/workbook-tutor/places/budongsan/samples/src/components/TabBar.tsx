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

type TabName = keyof typeof tabs;

// 탭 줄의 모양. 탭 화면은 TabBar 가, 단지 화면은 들어온 탭을 켜 둔 채로 직접 쓴다(시안)
export function TabRow({
  active,
  onPress,
}: {
  active: TabName;
  onPress: (name: TabName) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: isIOS ? color.white : color.fillSoft,
        borderTopWidth: isIOS ? 1 : 0,
        borderTopColor: color.lineSoft,
        paddingTop: isIOS ? 8 : 12,
        paddingBottom: isIOS
          ? Math.max(insets.bottom, 8)
          : insets.bottom + 16,
      }}
    >
      {(Object.keys(tabs) as TabName[]).map((name) => {
        const on = name === active;
        const tint = on ? color.text : isIOS ? color.textOff : color.textMuted;
        const icon =
          name === "favorites" ? (
            <HeartIcon size={isIOS ? 26 : 24} color={tint} filled={on} />
          ) : (
            <SearchIcon
              size={isIOS ? 26 : 24}
              color={tint}
              strokeWidth={on ? (isIOS ? 2.4 : 2.2) : 2}
            />
          );
        return (
          <Pressable
            key={name}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onPress(name)}
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
              {tabs[name].label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function TabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const current = state.routes[state.index];
  return (
    <TabRow
      active={(current?.name as TabName) ?? "index"}
      onPress={(name) => {
        const route = state.routes.find((r) => r.name === name);
        if (!route) return;
        const event = emitter.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });
        if (route.key !== current?.key && !event.defaultPrevented)
          navigateToTab(route.key);
      }}
    />
  );
}
