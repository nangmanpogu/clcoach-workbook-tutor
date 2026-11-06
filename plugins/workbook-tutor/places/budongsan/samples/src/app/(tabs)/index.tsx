// 단지 검색. 검색어가 없으면 자료에 있는 단지를 모두 보여 준다
import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { ComplexRow } from "@/components/ComplexRow";
import { ClearIcon, CloseIcon, SearchIcon } from "@/components/Icons";
import { PageTitle } from "@/components/PageTitle";
import {
  formatArea,
  formatDate,
  formatHouseholds,
  formatPrice,
} from "@/lib/format";
import { color, isIOS, space } from "@/lib/theme";
import { defaultArea, searchComplexes, tradesIn } from "@/lib/trades";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const results = searchComplexes(query);

  return (
    <View style={{ flex: 1, backgroundColor: color.white }}>
      <PageTitle title="단지 검색">
        <View
          style={{
            height: isIOS ? 48 : 52,
            borderRadius: isIOS ? 12 : 26,
            backgroundColor: color.fill,
            flexDirection: "row",
            alignItems: "center",
            gap: isIOS ? 8 : 12,
            paddingLeft: isIOS ? 14 : 16,
            paddingRight: isIOS ? 12 : 4,
          }}
        >
          <SearchIcon
            size={isIOS ? 20 : 22}
            color={isIOS ? color.textHint : color.textMuted}
            strokeWidth={isIOS ? 2.4 : 2}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="단지나 동 이름"
            placeholderTextColor={color.textHint}
            returnKeyType="search"
            accessibilityLabel="단지 검색"
            style={{
              flex: 1,
              fontSize: 17,
              color: color.text,
              paddingVertical: 0,
            }}
          />
          {query ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="지우기"
              onPress={() => setQuery("")}
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isIOS ? (
                <ClearIcon />
              ) : (
                <CloseIcon size={22} color={color.textMuted} />
              )}
            </Pressable>
          ) : null}
        </View>
      </PageTitle>

      <FlatList
        data={results}
        keyExtractor={(c) => c.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        renderItem={({ item }) => {
          const group = defaultArea(item);
          const last = tradesIn(item, group)[0];
          return (
            <ComplexRow
              id={item.id}
              name={item.name}
              sub={`${item.dong} · ${formatHouseholds(item.households)}`}
              price={formatPrice(last.price)}
              meta={`${formatArea(group)} · ${formatDate(last.date)}`}
            />
          );
        }}
        ListEmptyComponent={
          <View
            style={{
              paddingTop: 64,
              paddingHorizontal: space.side,
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                lineHeight: 29,
                fontWeight: "700",
                color: color.text,
                textAlign: "center",
              }}
            >
              「{query.trim()}」 단지를 찾지 못했어요
            </Text>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 23,
                color: color.textHint,
                textAlign: "center",
              }}
            >
              단지 이름이나 동 이름으로 찾아보세요
            </Text>
          </View>
        }
      />
    </View>
  );
}
