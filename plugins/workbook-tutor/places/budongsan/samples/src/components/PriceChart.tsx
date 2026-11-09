// 고른 면적의 최근 3개월 거래를 점과 선으로 그린다. 점은 거래 하나, 선은 날마다의 평균을 잇는다.
// 가장 최근 거래는 파란 점으로 강조한다
import { useState } from "react";
import { Platform, Text, View } from "react-native";
import Svg, {
  Circle,
  G,
  Line,
  Polyline,
  Text as SvgText,
} from "react-native-svg";
import type { Trade } from "../lib/trades";
import { color, tabular } from "../lib/theme";

const HEIGHT = 150;
const TOP = 14;
const BOTTOM = 40; // 아래 달 이름 자리
const LABEL_W = 40; // 오른쪽 눈금 글자 자리
const DAY = 24 * 60 * 60 * 1000;
// 웹의 SVG 글자는 기본이 바탕체라 앱 글꼴로 맞춘다
const FONT = Platform.OS === "web" ? "-apple-system, system-ui, sans-serif" : undefined;

const toTime = (d: string) => new Date(`${d}T00:00:00`).getTime();

export function recentTrades(trades: Trade[]): Trade[] {
  if (trades.length === 0) return [];
  const last = toTime(trades[0].date);
  return trades.filter((t) => toTime(t.date) >= last - 90 * DAY);
}

export function PriceChart({ trades }: { trades: Trade[] }) {
  const [width, setWidth] = useState(0);
  const recent = recentTrades(trades);

  return (
    <View
      style={{
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderRadius: 20,
        backgroundColor: color.fillSoft,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 12,
        }}
      >
        <Text
          style={{ fontSize: 15, fontWeight: "600", color: color.textStrong }}
        >
          최근 3개월
        </Text>
        <Text style={{ fontSize: 13, color: color.textHint, ...tabular }}>
          거래 {recent.length}건
        </Text>
      </View>
      <View
        style={{ height: HEIGHT }}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {width > 0 && recent.length > 0 ? (
          <Plot trades={recent} width={width} />
        ) : null}
      </View>
    </View>
  );
}

function Plot({ trades, width }: { trades: Trade[]; width: number }) {
  const plotW = width - LABEL_W;
  const plotBottom = HEIGHT - BOTTOM;

  // 가로: 첫 거래가 있는 달의 1일부터 마지막 거래가 있는 달의 끝까지
  const first = new Date(`${trades[trades.length - 1].date}T00:00:00`);
  const last = new Date(`${trades[0].date}T00:00:00`);
  const from = new Date(first.getFullYear(), first.getMonth(), 1).getTime();
  const to = new Date(last.getFullYear(), last.getMonth() + 1, 0).getTime();
  const x = (t: number) =>
    4 + ((t - from) / Math.max(to - from, DAY)) * (plotW - 8);

  // 세로: 억 단위로 반올림한 범위. 가운데 눈금이 정수가 되게 폭을 짝수로 맞춘다
  const prices = trades.map((t) => t.price / 10000);
  let lo = Math.floor(Math.min(...prices));
  let hi = Math.ceil(Math.max(...prices));
  if (hi - lo < 2) hi = lo + 2;
  if ((hi - lo) % 2 === 1) hi += 1;
  const y = (eok: number) =>
    TOP + ((hi - eok) / (hi - lo)) * (plotBottom - TOP);
  const ticks = [hi, (hi + lo) / 2, lo];

  // 날마다의 평균을 이은 선
  const byDay = new Map<string, number[]>();
  for (const t of trades)
    byDay.set(t.date, [...(byDay.get(t.date) ?? []), t.price / 10000]);
  const days = [...byDay.keys()].sort();
  const line = days
    .map((d) => {
      const ps = byDay.get(d) ?? [];
      const avg = ps.reduce((a, b) => a + b, 0) / ps.length;
      return `${x(toTime(d)).toFixed(1)},${y(avg).toFixed(1)}`;
    })
    .join(" ");

  // 달 이름은 그 달 1일 자리에
  const months: { label: string; at: number }[] = [];
  for (
    let d = new Date(from);
    d.getTime() <= to;
    d = new Date(d.getFullYear(), d.getMonth() + 1, 1)
  ) {
    months.push({ label: `${d.getMonth() + 1}월`, at: x(d.getTime()) });
  }

  const latest = trades[0];
  return (
    <Svg width={width} height={HEIGHT}>
      <G>
        {ticks.map((v) => (
          <Line
            key={v}
            x1={0}
            x2={plotW}
            y1={y(v)}
            y2={y(v)}
            stroke={color.line}
            strokeWidth={1}
          />
        ))}
      </G>
      {ticks.map((v) => (
        <SvgText
          key={`t${v}`}
          x={width}
          y={y(v) + 4}
          fontSize={11}
          fontFamily={FONT}
          fill={color.textHint}
          textAnchor="end"
        >
          {`${v}억`}
        </SvgText>
      ))}
      {months.map((m) => (
        <SvgText
          key={m.label}
          x={m.at}
          y={HEIGHT - 8}
          fontSize={11}
          fontFamily={FONT}
          fill={color.textHint}
        >
          {m.label}
        </SvgText>
      ))}
      {days.length > 1 ? (
        <Polyline
          points={line}
          fill="none"
          stroke={color.primary}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ) : null}
      {trades.slice(1).map((t, i) => (
        <Circle
          key={i}
          cx={x(toTime(t.date))}
          cy={y(t.price / 10000)}
          r={3.5}
          fill={color.white}
          stroke={color.primary}
          strokeWidth={2}
        />
      ))}
      <Circle
        cx={x(toTime(latest.date))}
        cy={y(latest.price / 10000)}
        r={10}
        fill={color.primary}
        fillOpacity={0.18}
      />
      <Circle
        cx={x(toTime(latest.date))}
        cy={y(latest.price / 10000)}
        r={5}
        fill={color.primary}
      />
    </Svg>
  );
}
