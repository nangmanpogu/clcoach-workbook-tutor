// 거래 자료(data/trades.json)를 읽어 화면이 쓰는 꼴로 바꾼다. 숫자는 자료 그대로 쓴다
import data from "../../data/trades.json";

export type Trade = {
  date: string;
  area: number;
  floor: number;
  price: number;
};
export type Complex = {
  id: string;
  name: string;
  gu: string;
  dong: string;
  households: number;
  trades: Trade[];
};

export const source: string = data.source;

// 최근 거래가 먼저 오게 둔다
export const complexes: Complex[] = data.complexes.map((c) => ({
  ...c,
  trades: [...c.trades].sort((a, b) => b.date.localeCompare(a.date)),
}));

export function findComplex(id: string): Complex | undefined {
  return complexes.find((c) => c.id === id);
}

// 면적은 전용면적의 정수부로 묶는다(84.8㎡ 와 84.88㎡ 는 같은 84㎡)
export function areaGroup(area: number): number {
  return Math.floor(area);
}

export type AreaOption = { group: number; count: number };

// 그 단지의 면적 묶음. 좁은 면적부터
export function areaOptions(c: Complex): AreaOption[] {
  const counts = new Map<number, number>();
  for (const t of c.trades) {
    const g = areaGroup(t.area);
    counts.set(g, (counts.get(g) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([group, count]) => ({ group, count }))
    .sort((a, b) => a.group - b.group);
}

// 처음 보여 줄 면적. 거래가 가장 많은 면적이고, 같으면 넓은 면적이다
export function defaultArea(c: Complex): number {
  const options = areaOptions(c);
  let best = options[0];
  for (const o of options) {
    if (
      o.count > best.count ||
      (o.count === best.count && o.group > best.group)
    )
      best = o;
  }
  return best.group;
}

export function tradesIn(c: Complex, group: number): Trade[] {
  return c.trades.filter((t) => areaGroup(t.area) === group);
}

// 이름이나 동 이름에 검색어가 들어간 단지. 띄어쓰기는 무시한다
export function searchComplexes(query: string): Complex[] {
  const q = query.replace(/\s/g, "");
  if (!q) return complexes;
  return complexes.filter((c) =>
    (c.name + c.dong + c.gu).replace(/\s/g, "").includes(q),
  );
}
