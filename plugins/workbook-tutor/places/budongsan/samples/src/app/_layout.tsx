import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FavoritesProvider } from "@/lib/favorites";
import { color } from "@/lib/theme";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.white },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="complex/[id]" />
      </Stack>
    </FavoritesProvider>
  );
}
