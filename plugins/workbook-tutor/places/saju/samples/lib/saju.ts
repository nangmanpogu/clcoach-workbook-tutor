// 사주 여덟 글자를 계산한다. 같은 생년월일시면 누가 몇 번 계산해도 같은 글자가 나와야 해서, AI 가 아니라 이 코드가 계산한다.
// 절기와 음력은 lunar-javascript(MIT)가 맡는다. 이 파일은 한국식 시각 보정과 오행·십성 같은 풀이 재료를 더한다.
import lunar from "lunar-javascript";

const { Solar, Lunar } = lunar;

export type Element = "목" | "화" | "토" | "금" | "수";

export const STEMS = "甲乙丙丁戊己庚辛壬癸";
export const BRANCHES = "子丑寅卯辰巳午未申酉戌亥";
const STEM_KO = "갑을병정무기경신임계";
const BRANCH_KO = "자축인묘진사오미신유술해";
const STEM_ELEMENT: Element[] = [
  "목",
  "목",
  "화",
  "화",
  "토",
  "토",
  "금",
  "금",
  "수",
  "수",
];
const BRANCH_ELEMENT: Element[] = [
  "수",
  "토",
  "목",
  "목",
  "토",
  "화",
  "화",
  "토",
  "금",
  "금",
  "토",
  "수",
];
// 지지의 십성은 지지 속 가장 큰 기운(본기)의 천간으로 본다
const BRANCH_MAIN_STEM = "癸己甲乙戊丙丁己庚辛戊壬";
const ANIMALS = [
  "쥐",
  "소",
  "호랑이",
  "토끼",
  "용",
  "뱀",
  "말",
  "양",
  "원숭이",
  "닭",
  "개",
  "돼지",
];
const STEM_COLORS = [
  "푸른",
  "푸른",
  "붉은",
  "붉은",
  "노란",
  "노란",
  "하얀",
  "하얀",
  "검은",
  "검은",
];

export const ELEMENTS: Element[] = ["목", "화", "토", "금", "수"];
// 오행이 서로 낳는 차례. 목은 화를, 화는 토를 낳는다
const GENERATES: Record<Element, Element> = {
  목: "화",
  화: "토",
  토: "금",
  금: "수",
  수: "목",
};
// 오행이 서로 누르는 차례. 목은 토를, 토는 수를 누른다
const CONTROLS: Record<Element, Element> = {
  목: "토",
  토: "수",
  수: "화",
  화: "금",
  금: "목",
};

export type TenGod =
  | "비견"
  | "겁재"
  | "식신"
  | "상관"
  | "편재"
  | "정재"
  | "편관"
  | "정관"
  | "편인"
  | "정인";

export type Char = {
  hanja: string;
  ko: string;
  element: Element;
  god: TenGod | "나";
};

export type Pillar = { stem: Char; branch: Char };

export type BirthInput = {
  calendar: "solar" | "lunar";
  year: number;
  month: number;
  day: number;
  leapMonth?: boolean;
  // 태어난 시각을 모르면 null. 그러면 시주 없이 여섯 글자로 푼다
  time: { hour: number; minute: number } | null;
};

export type Saju = {
  solarDate: string;
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
  dayMaster: { hanja: string; ko: string; element: Element; index: number };
  elementCounts: Record<Element, number>;
  total: number;
  ilju: { name: string; hanja: string; animal: string };
};

export class BirthError extends Error {}

function yinYang(stemIndex: number) {
  return stemIndex % 2; // 0 이 양, 1 이 음
}

// 나(일간)와 다른 천간의 사이를 십성 이름으로 부른다
export function tenGod(dayStem: number, otherStem: number): TenGod {
  const me = STEM_ELEMENT[dayStem];
  const other = STEM_ELEMENT[otherStem];
  const same = yinYang(dayStem) === yinYang(otherStem);
  if (other === me) return same ? "비견" : "겁재";
  if (other === GENERATES[me]) return same ? "식신" : "상관";
  if (other === CONTROLS[me]) return same ? "편재" : "정재";
  if (CONTROLS[other] === me) return same ? "편관" : "정관";
  return same ? "편인" : "정인";
}

function pillarOf(ganzhi: string, dayStem: number, isDay = false): Pillar {
  const s = STEMS.indexOf(ganzhi[0]);
  const b = BRANCHES.indexOf(ganzhi[1]);
  return {
    stem: {
      hanja: ganzhi[0],
      ko: STEM_KO[s],
      element: STEM_ELEMENT[s],
      god: isDay ? "나" : tenGod(dayStem, s),
    },
    branch: {
      hanja: ganzhi[1],
      ko: BRANCH_KO[b],
      element: BRANCH_ELEMENT[b],
      god: tenGod(dayStem, STEMS.indexOf(BRANCH_MAIN_STEM[b])),
    },
  };
}

function validSolar(y: number, m: number, d: number) {
  const t = new Date(Date.UTC(y, m - 1, d));
  return (
    t.getUTCFullYear() === y &&
    t.getUTCMonth() === m - 1 &&
    t.getUTCDate() === d
  );
}

// 한국 표준시는 동경 135도 기준인데 서울은 약 127도라, 해의 움직임으로 보면 30분쯤 늦다. 국내 만세력 대부분이
// 이 차이를 빼고 시주를 정한다(자시가 23:30~01:30). 그래서 시각을 30분 당긴 뒤 계산한다.
// 날이 바뀌는 때는 자시가 시작하는 때(보정 뒤 23:00, 시계로 23:30)로 본다.
const KOREA_OFFSET_MINUTES = 30;

export function calculate(input: BirthInput): Saju {
  let y = input.year;
  let m = input.month;
  let d = input.day;
  if (input.calendar === "lunar") {
    try {
      const s = Lunar.fromYmd(y, input.leapMonth ? -m : m, d).getSolar();
      y = s.getYear();
      m = s.getMonth();
      d = s.getDay();
    } catch {
      throw new BirthError(
        input.leapMonth
          ? "그해 음력에는 그 윤달이 없어요"
          : "음력에 없는 날짜예요",
      );
    }
  } else if (!validSolar(y, m, d)) {
    throw new BirthError("달력에 없는 날짜예요");
  }
  if (y < 1900 || y > 2100)
    throw new BirthError("1900년부터 2100년 사이로 넣어 주세요");

  const solarDate = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  // 시각을 모르면 낮 12시로 년·월·일주만 구한다. 절기가 바뀌는 날에는 월주가 시각에 따라 갈릴 수 있다
  const at = input.time
    ? new Date(
        Date.UTC(
          y,
          m - 1,
          d,
          input.time.hour,
          input.time.minute - KOREA_OFFSET_MINUTES,
        ),
      )
    : new Date(Date.UTC(y, m - 1, d, 12, 0));
  const solar = Solar.fromYmdHms(
    at.getUTCFullYear(),
    at.getUTCMonth() + 1,
    at.getUTCDate(),
    at.getUTCHours(),
    at.getUTCMinutes(),
    0,
  );
  const ec = solar.getLunar().getEightChar();
  ec.setSect(1);

  const dayGz: string = ec.getDay();
  const dayStem = STEMS.indexOf(dayGz[0]);
  const year = pillarOf(ec.getYear(), dayStem);
  const month = pillarOf(ec.getMonth(), dayStem);
  const day = pillarOf(dayGz, dayStem, true);
  const hour = input.time ? pillarOf(ec.getTime(), dayStem) : null;

  const elementCounts: Record<Element, number> = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
  };
  for (const p of [year, month, day, hour]) {
    if (!p) continue;
    elementCounts[p.stem.element] += 1;
    elementCounts[p.branch.element] += 1;
  }
  const dayBranch = BRANCHES.indexOf(dayGz[1]);
  return {
    solarDate,
    year,
    month,
    day,
    hour,
    dayMaster: {
      hanja: dayGz[0],
      ko: STEM_KO[dayStem],
      element: STEM_ELEMENT[dayStem],
      index: dayStem,
    },
    elementCounts,
    total: hour ? 8 : 6,
    ilju: {
      name: `${STEM_KO[dayStem]}${BRANCH_KO[dayBranch]}일주`,
      hanja: dayGz,
      animal: `${STEM_COLORS[dayStem]} ${ANIMALS[dayBranch]}`,
    },
  };
}

// 그해의 간지와, 그해 천간이 나에게 어떤 사이(십성)인지. 1984년이 갑자년이다
export function yearFlow(year: number, dayStem: number) {
  const i = (((year - 1984) % 60) + 60) % 60;
  const s = i % 10;
  const b = i % 12;
  return {
    year,
    name: `${STEM_KO[s]}${BRANCH_KO[b]}년`,
    stem: { hanja: STEMS[s], element: STEM_ELEMENT[s] },
    branch: { hanja: BRANCHES[b], element: BRANCH_ELEMENT[b] },
    god: tenGod(dayStem, s),
    branchGod: tenGod(dayStem, STEMS.indexOf(BRANCH_MAIN_STEM[b])),
  };
}

// 나와 사이가 정해진 오행. 풀이 문장이 「돈이 되는 기운」 처럼 부를 때 쓴다
export function relatedElements(me: Element) {
  const controlsMe = ELEMENTS.find((e) => CONTROLS[e] === me)!;
  const feedsMe = ELEMENTS.find((e) => GENERATES[e] === me)!;
  return {
    self: me,
    output: GENERATES[me],
    wealth: CONTROLS[me],
    power: controlsMe,
    support: feedsMe,
  };
}
