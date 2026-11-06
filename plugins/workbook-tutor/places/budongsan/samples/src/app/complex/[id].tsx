// 단지 화면. 고른 면적의 최근 거래가를 맨 위에 크게, 그 아래 가격 흐름과 거래 내역을 둔다
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AreaSheet } from "@/components/AreaSheet";
import { ComplexArt } from "@/components/Building";
import { BackIcon, ChevronDownIcon, HeartIcon } from "@/components/Icons";
import { PriceChart } from "@/components/PriceChart";
import { useFavorites } from "@/lib/favorites";
import {
  formatArea,
  formatDate,
  formatHouseholds,
  formatPrice,
} from "@/lib/format";
import { color, isIOS, space, tabular } from "@/lib/theme";
import {
  areaOptions,
  defaultArea,
  findComplex,
  tradesIn,
} from "@/lib/trades";

export default function ComplexScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const complex = findComplex(String(id));
  const insets = useSafeAreaInsets();
  const favorites = useFavorites();
  const [area, setArea] = useState(() => (complex ? defaultArea(complex) : 0));
  const [sheet, setSheet] = useState(false);

  const back = () => (router.canGoBack() ? router.back() : router.replace("/"));

  if (!complex) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: space.side,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700", color: color.text }}>
          단지를 찾지 못했어요
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={back}
          style={{ height: 44, justifyContent: "center" }}
        >
          <Text style={{ fontSize: 15, color: color.primaryText }}>
            검색으로 돌아가기
          </Text>
        </Pressable>
      </View>
    );
  }

  const trades = tradesIn(complex, area);
  const latest = trades[0];
  const liked = favorites.has(complex.id);

  return (
    <View style={{ flex: 1, backgroundColor: color.white }}>
      <View
        style={{
          paddingTop: insets.top,
          height: insets.top + (isIOS ? 44 : 64),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로"
          onPress={back}
          style={{
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BackIcon color={color.text} android={!isIOS} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={liked ? "관심 단지에서 빼기" : "관심 단지에 넣기"}
          onPress={() => favorites.toggle(complex.id)}
          style={{
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HeartIcon
            size={isIOS ? 26 : 24}
            color={liked ? color.heart : color.textOff}
            filled={liked}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View
          style={{
            paddingTop: isIOS ? 12 : 8,
            paddingHorizontal: space.side,
            paddingBottom: 28,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              accessibilityRole="header"
              style={{
                fontSize: 22,
                lineHeight: 31,
                fontWeight: "700",
                color: color.text,
              }}
            >
              {complex.name}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`면적 고르기, 지금 전용 ${formatArea(area)}`}
              onPress={() => setSheet(true)}
              style={{
                height: 28,
                paddingLeft: 10,
                paddingRight: 8,
                borderRadius: 8,
                backgroundColor: color.fill,
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: color.textSub,
                }}
              >
                전용 {formatArea(area)}
              </Text>
              <ChevronDownIcon color={color.textMuted} />
            </Pressable>
          </View>
          <Text
            style={{
              marginTop: 2,
              fontSize: 14,
              lineHeight: 21,
              color: color.textHint,
            }}
          >
            {complex.gu} {complex.dong} · {formatHouseholds(complex.households)}
          </Text>

          <View
            style={{
              marginTop: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 22,
                  fontWeight: "500",
                  color: color.textMuted,
                }}
              >
                최근 거래
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 30,
                  lineHeight: 40,
                  fontWeight: "700",
                  color: color.text,
                  ...tabular,
                }}
              >
                {formatPrice(latest.price)}
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 15,
                  lineHeight: 22,
                  color: color.textSub,
                  ...tabular,
                }}
              >
                {formatDate(latest.date)} · {latest.floor}층
              </Text>
            </View>
            <View style={{ marginRight: -8 }}>
              <ComplexArt size={104} />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: space.side, paddingBottom: 28 }}>
          <PriceChart trades={trades} />
        </View>

        <View style={{ height: space.band, backgroundColor: color.fill }} />

        <View style={{ paddingTop: 28 }}>
          <Text
            accessibilityRole="header"
            style={{
              marginHorizontal: space.side,
              marginBottom: 8,
              fontSize: 20,
              lineHeight: 29,
              fontWeight: "700",
              color: color.text,
            }}
          >
            거래 내역
          </Text>
          {trades.map((t, i) => (
            <View
              key={`${t.date}-${t.floor}-${i}`}
              style={{
                height: 56,
                paddingHorizontal: space.side,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: color.textSub,
                  ...tabular,
                }}
              >
                {formatDate(t.date)}
              </Text>
              <Text
                style={{
                  width: 56,
                  fontSize: 15,
                  color: color.textHint,
                  ...tabular,
                }}
              >
                {t.floor}층
              </Text>
              <Text
                style={{
                  width: 140,
                  textAlign: "right",
                  fontSize: 17,
                  fontWeight: "600",
                  color: color.text,
                  ...tabular,
                }}
              >
                {formatPrice(t.price)}
              </Text>
            </View>
          ))}
          <Text
            style={{
              marginTop: 16,
              marginHorizontal: space.side,
              fontSize: 13,
              lineHeight: 19,
              color: color.textHint,
            }}
          >
            국토교통부 실거래가 자료
          </Text>
        </View>
      </ScrollView>

      <AreaSheet
        visible={sheet}
        options={areaOptions(complex)}
        selected={area}
        onSelect={(g) => {
          setArea(g);
          setSheet(false);
        }}
        onClose={() => setSheet(false)}
      />
    </View>
  );
}
