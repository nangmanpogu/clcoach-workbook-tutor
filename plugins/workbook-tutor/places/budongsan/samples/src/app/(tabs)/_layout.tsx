import { Tabs } from "expo-router/js-tabs";
import { TabBar } from "@/components/TabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "검색" }} />
      <Tabs.Screen name="favorites" options={{ title: "관심 단지" }} />
    </Tabs>
  );
}
