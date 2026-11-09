// 면적 고르기 바텀시트. 바깥을 누르거나 X 를 누르면 닫힌다
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckIcon, CloseIcon } from "./Icons";
import type { AreaOption } from "../lib/trades";
import { formatArea } from "../lib/format";
import { color, space, tabular } from "../lib/theme";

type Props = {
  visible: boolean;
  options: AreaOption[];
  selected: number;
  onSelect: (group: number) => void;
  onClose: () => void;
};

export function AreaSheet({
  visible,
  options,
  selected,
  onSelect,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel="닫기"
        onPress={onClose}
        style={{ flex: 1, backgroundColor: color.dim }}
      />
      <View
        accessibilityRole="none"
        style={{
          backgroundColor: color.white,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 24),
        }}
      >
        <View
          style={{
            alignSelf: "center",
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: "#D1D6DB",
            marginBottom: 16,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: space.side,
            paddingRight: 14,
            paddingBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              lineHeight: 29,
              fontWeight: "700",
              color: color.text,
            }}
          >
            면적 고르기
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="닫기"
            onPress={onClose}
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloseIcon color={color.textSub} />
          </Pressable>
        </View>
        {options.map((o) => {
          const on = o.group === selected;
          return (
            <Pressable
              key={o.group}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => onSelect(o.group)}
              style={({ pressed }) => ({
                height: 56,
                paddingHorizontal: space.side,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: pressed ? color.fillSoft : color.white,
              })}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: on ? "700" : "400",
                  color: on ? color.primaryText : color.textStrong,
                }}
              >
                전용 {formatArea(o.group)}
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <Text
                  style={{ fontSize: 15, color: color.textHint, ...tabular }}
                >
                  거래 {o.count}건
                </Text>
                {on ? <CheckIcon color={color.primary} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}
