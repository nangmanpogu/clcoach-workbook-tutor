// 관심 단지. 단지 화면에서 하트를 누른 단지가 모인다. 아직 저장하지 않아서 앱을 다시 열면 비어 있다
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { ComplexArt } from "@/components/Building";
import { ComplexRow } from "@/components/ComplexRow";
import { PageTitle } from "@/components/PageTitle";
import { useFavorites } from "@/lib/favorites";
import { formatArea, formatDate, formatPrice } from "@/lib/format";
import { color, space } from "@/lib/theme";
import { defaultArea, findComplex, tradesIn, type Complex } from "@/lib/trades";

export default function FavoritesScreen() {
  const { ids } = useFavorites();
  const items = ids.map(findComplex).filter((c): c is Complex => Boolean(c));

  return (
    <View style={{ flex: 1, backgroundColor: color.white }}>
      <PageTitle title="관심 단지" />
      {items.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingHorizontal: space.side,
            paddingBottom: 96,
          }}
        >
          <View style={{ marginBottom: 16 }}>
            <ComplexArt size={120} />
          </View>
          <Text
            style={{
              fontSize: 20,
              lineHeight: 29,
              fontWeight: "700",
              color: color.text,
            }}
          >
            아직 관심 단지가 없어요
          </Text>
          <Text
            style={{
              fontSize: 15,
              lineHeight: 23,
              color: color.textHint,
              textAlign: "center",
            }}
          >
            단지 화면에서 하트를 누르면 여기에 모여요
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.navigate("/")}
            style={({ pressed }) => ({
              marginTop: 24,
              height: 48,
              paddingHorizontal: 20,
              borderRadius: 14,
              backgroundColor: pressed ? "#1B64DA" : color.primary,
              justifyContent: "center",
            })}
          >
            <Text
              style={{ fontSize: 17, fontWeight: "600", color: color.white }}
            >
              단지 검색하기
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          renderItem={({ item }) => {
            const group = defaultArea(item);
            const last = tradesIn(item, group)[0];
            return (
              <ComplexRow
                id={item.id}
                name={item.name}
                sub={`${item.dong} · ${formatArea(group)}`}
                price={formatPrice(last.price)}
                meta={`${formatDate(last.date)} · ${last.floor}층`}
                from="favorites"
              />
            );
          }}
        />
      )}
    </View>
  );
}
