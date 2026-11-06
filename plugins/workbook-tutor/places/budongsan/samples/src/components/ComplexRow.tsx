// 검색 결과와 관심 단지 목록의 한 줄. 왼쪽은 단지, 오른쪽은 최근 거래가다
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { TowerArt } from "./Building";
import { color, space, tabular } from "../lib/theme";

type Props = {
  id: string;
  name: string;
  sub: string;
  price: string;
  meta: string;
};

export function ComplexRow({ id, name, sub, price, meta }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: "/complex/[id]", params: { id } })}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingVertical: 12,
        paddingHorizontal: space.side,
        backgroundColor: pressed ? color.fillSoft : color.white,
      })}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          backgroundColor: color.tile,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TowerArt size={40} />
      </View>
      <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
        <Text
          style={{
            fontSize: 17,
            lineHeight: 25,
            fontWeight: "600",
            color: color.text,
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{ fontSize: 14, lineHeight: 21, color: color.textHint }}
          numberOfLines={1}
        >
          {sub}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 2 }}>
        <Text
          style={{
            fontSize: 17,
            lineHeight: 25,
            fontWeight: "600",
            color: color.text,
            ...tabular,
          }}
        >
          {price}
        </Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 21,
            color: color.textHint,
            ...tabular,
          }}
        >
          {meta}
        </Text>
      </View>
    </Pressable>
  );
}
