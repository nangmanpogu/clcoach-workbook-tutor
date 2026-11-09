// 미리 적어 둔 풀이 문장. 일간(나를 뜻하는 글자)마다 기본 문장을 두고, 오행이 많거나 없을 때 붙는 문장은 계산 결과로 채운다.
// 사람마다 다른 풀이는 나중에 AI 가 쓴다. 그때도 여덟 글자는 lib/saju.ts 가 계산한다.
import {
  ELEMENTS,
  relatedElements,
  type Element,
  type Saju,
  type TenGod,
} from "./saju";

export const ELEMENT_NAME: Record<Element, string> = {
  목: "나무",
  화: "불",
  토: "흙",
  금: "쇠",
  수: "물",
};
export const ELEMENT_HANJA: Record<Element, string> = {
  목: "木",
  화: "火",
  토: "土",
  금: "金",
  수: "水",
};
const COUNT_WORD = [
  "없음",
  "하나",
  "둘",
  "셋",
  "넷",
  "다섯",
  "여섯",
  "일곱",
  "여덟",
];

type Base = {
  title: string;
  keywords: string[];
  personality: string;
  work: string;
  people: string;
  // 표현하는 기운이 없을 때 「사람 관계」 둘째 문장. 없으면 people 을 쓴다
  peopleLack?: string;
};

// 일간 순서: 갑 을 병 정 무 기 경 신 임 계
const BASE: Base[] = [
  {
    title: "곧게 뻗는 큰 나무처럼\n먼저 길을 여는 사람",
    keywords: ["추진력", "자존심", "리더십", "정직"],
    personality:
      "갑목(甲木)은 하늘로 곧게 자라는 큰 나무예요. 남이 가지 않은 길을 먼저 걷는 걸 두려워하지 않고, 한번 정한 방향은 쉽게 꺾지 않아요.",
    work: "처음 판을 짜고 사람을 이끄는 자리에서 힘이 나요. 남이 정한 틀 안에서 같은 일을 되풀이하면 금방 지루해할 수 있어요.",
    people:
      "약한 사람을 그냥 지나치지 못해서 곁에 기대는 사람이 많아요. 다만 자존심을 건드리는 말에는 크게 서운해해요.",
  },
  {
    title: "바람에 휘어도 꺾이지 않는\n풀처럼 끈질긴 사람",
    keywords: ["유연함", "끈기", "눈치", "섬세함"],
    personality:
      "을목(乙木)은 풀과 덩굴이에요. 부딪히기보다 돌아가는 길을 찾고, 어떤 자리에 가도 금방 뿌리를 내려요.",
    work: "사람과 사람 사이를 잇고 분위기를 읽는 일에 강해요. 혼자 밀어붙이기보다 좋은 동료 곁에서 실력이 커져요.",
    people:
      "상대의 기분을 빨리 알아채서 편하다는 말을 자주 들어요. 대신 싫은 걸 싫다고 말하지 못해 속으로 쌓아 두기 쉬워요.",
  },
  {
    title: "한낮의 해처럼\n어디서나 눈에 띄는 사람",
    keywords: ["열정", "솔직함", "표현력", "낙천"],
    personality:
      "병화(丙火)는 하늘의 해예요. 밝고 숨김이 없어서 어디에 있어도 사람들의 눈길이 모여요. 기분이 얼굴에 그대로 드러나는 편이에요.",
    work: "앞에 나서서 알리고 설득하는 일에서 빛나요. 시작하는 힘이 큰 만큼, 마무리는 꼼꼼한 사람과 나누면 좋아요.",
    people:
      "처음 만난 사람에게도 먼저 말을 걸어 자리를 금방 풀어 줘요. 서운한 일도 오래 담아 두지 않아요.",
  },
  {
    title: "어둠 속 촛불처럼\n가까운 사람을 따뜻하게 비추는 사람",
    keywords: ["다정함", "집중력", "감수성", "배려"],
    personality:
      "정화(丁火)는 촛불과 등불이에요. 넓게 비추기보다 가까운 곳을 깊게 밝혀요. 겉은 조용해도 속에는 오래 타는 열정이 있어요.",
    work: "한 가지를 깊게 파고드는 일에 잘 맞아요. 가르치고 돌보는 일에서도 보람을 크게 느껴요.",
    people:
      "가까운 사람의 작은 변화도 놓치지 않아요. 마음을 준 사람에게는 끝까지 정성을 쏟아요.",
  },
  {
    title: "큰 산처럼\n흔들림 없이 버티는 사람",
    keywords: ["듬직함", "포용력", "신중함", "뚝심"],
    personality:
      "무토(戊土)는 큰 산과 넓은 땅이에요. 웬만한 일에는 흔들리지 않고, 결정은 느려도 한번 정하면 오래 지켜요.",
    work: "사람과 일을 품고 조율하는 자리에 잘 맞아요. 버티는 힘이 있어서 오래 걸리는 일에서 결과를 내요.",
    people:
      "말수는 적어도 곁에 있으면 든든하다는 소리를 들어요. 속마음을 잘 내보이지 않아 오해를 사기도 해요.",
  },
  {
    title: "기름진 밭처럼\n사람을 길러 내는 사람",
    keywords: ["살림꾼", "꼼꼼함", "실속", "배려"],
    personality:
      "기토(己土)는 씨앗을 키우는 밭이에요. 앞에 나서기보다 뒤에서 챙기고 가꾸는 데 마음을 써요. 현실 감각이 좋아 허황된 말에 잘 넘어가지 않아요.",
    work: "자료를 정리하고 살림을 꾸리는 일, 사람을 키우는 일에서 실력이 드러나요. 작은 것을 모아 크게 만드는 재주가 있어요.",
    people:
      "누구에게나 필요한 걸 먼저 챙겨 주는 사람이에요. 다만 남의 일을 떠안다가 내 몫을 놓치기 쉬워요.",
  },
  {
    title: "단단한 쇠처럼\n맺고 끊음이 분명한 사람",
    keywords: ["결단력", "책임감", "의리", "직설"],
    personality:
      "경금(庚金)은 다듬기 전의 큰 쇠예요. 옳다고 생각하면 돌아가지 않고, 한 번 맡은 일은 끝까지 책임져요.",
    work: "맡은 범위가 넓어질수록 오히려 힘이 나는 편이에요.",
    people:
      "속으로는 챙기는데 겉으로는 무뚝뚝해 보이기 쉬워요. 한번 내 사람이라고 정하면 끝까지 의리를 지켜요.",
    peopleLack: "속으로는 챙기는데 겉으로는 무뚝뚝해 보이는 거죠.",
  },
  {
    title: "잘 다듬은 보석처럼\n작은 것까지 빛나게 하는 사람",
    keywords: ["섬세함", "감각", "완벽주의", "깔끔함"],
    personality:
      "신금(辛金)은 다듬어진 보석과 칼이에요. 보는 눈이 날카로워서 남이 놓치는 흠도 금방 찾아요. 자기 기준에 못 미치면 쉽게 만족하지 않아요.",
    work: "품질을 따지고 마지막 손질을 하는 일에서 빛나요. 디자인, 편집, 검수처럼 감각이 필요한 일과 잘 맞아요.",
    people:
      "예의를 중요하게 여겨서 함부로 대하는 사람과는 금방 거리를 둬요. 칭찬 한마디에 크게 힘을 얻어요.",
  },
  {
    title: "넓은 바다처럼\n무엇이든 품고 흘러가는 사람",
    keywords: ["지혜", "포용", "자유", "호기심"],
    personality:
      "임수(壬水)는 큰 강과 바다예요. 생각이 넓고 빨라서, 한 자리에 오래 머물기보다 새로운 곳으로 흘러가고 싶어 해요.",
    work: "정보를 모으고 흐름을 읽는 일, 여러 곳을 오가는 일에 잘 맞아요. 판단을 맡겨 주는 자리에서 힘을 내요.",
    people:
      "누구와도 잘 어울리지만 깊은 속마음은 쉽게 꺼내지 않아요. 자유를 존중해 주는 사람에게 마음을 열어요.",
  },
  {
    title: "조용히 스미는 빗물처럼\n깊이 생각하는 사람",
    keywords: ["직관", "차분함", "공감", "상상력"],
    personality:
      "계수(癸水)는 비와 이슬이에요. 겉으로는 조용해도 속으로는 생각이 깊고, 남의 마음을 빨리 알아채요.",
    work: "기획하고 연구하는 일, 사람의 마음을 읽어야 하는 일에서 실력이 드러나요. 혼자 생각할 시간이 있어야 좋은 답을 내요.",
    people:
      "말없이 곁을 지켜 주는 사람이라 오래 사귈수록 진가가 드러나요. 걱정을 혼자 안고 가지 않는 연습이 필요해요.",
  },
];

// 없는 기운을 생활에서 채우는 법
export const FILL: Record<Element, string> = {
  목: "초록색 물건을 곁에 두고, 아침에 걷는 시간을 만들어 보세요. 새 일을 벌이는 힘이 붙어요.",
  화: "햇볕을 쬐며 몸을 움직이는 시간을 늘려 보세요. 붉은색 소품을 두면 사람 앞에 나서는 힘이 붙어요.",
  토: "먹고 자는 시간을 하루 일과로 정해 지켜 보세요. 노란색이나 흙색 물건을 가까이 두면 마음이 차분해져요.",
  금: "책상을 한 번 정리하고 미뤄 둔 일을 하나 끝내 보세요. 흰색 물건이 마음먹은 걸 밀고 가는 힘을 보태요.",
  수: "하루를 마치며 짧게 일기를 써 보세요. 속에 담아 둔 말을 꺼내는 연습이 돼요.",
};

// 그해의 십성에 따라 쓰는 한 해 풀이. 첫 문장(어떤 기운이 들어오는 해인지)은 yearText 가 붙인다
export const YEAR_TEXT: Record<TenGod, string> = {
  비견: "함께할 동료가 늘고 경쟁도 생겨요. 혼자 다 하려 하지 말고 손잡을 사람을 골라 보세요.",
  겁재: "내 몫을 나눠 갖자는 사람이 많아져요. 돈을 빌려주는 일은 한 번 더 따져 보세요. 대신 경쟁 덕분에 실력이 늘어요.",
  식신: "하고 싶은 일이 많아지고 손이 바빠져요. 배운 것을 결과물로 내놓기 좋아요.",
  상관: "말과 생각이 날카로워져요. 새로운 시도로 눈에 띄기 좋지만 윗사람과 부딪히기도 쉬워요. 하고 싶은 말은 글로 한 번 다듬어 보세요.",
  편재: "생각지 못한 기회가 오가요. 판이 커질수록 흐름도 빨라지니, 들어온 것을 지킬 계획부터 세워 두세요.",
  정재: "꾸준히 한 만큼 돌아와요. 들어오고 나가는 돈을 정리해 두면 연말에 남는 게 보여요.",
  편관: "맡는 일과 평가받을 자리가 늘어요. 들어오는 일을 다 받기보다 꼭 할 일만 골라 끝까지 해내 보세요.",
  정관: "자리와 이름이 따라와요. 약속과 규칙을 지킨 만큼 믿음이 쌓여요. 미뤄 둔 자격이나 승진에 도전하기 좋아요.",
  편인: "혼자 깊이 파고드는 시간이 늘어요. 남다른 공부나 취미가 길이 되기도 해요.",
  정인: "배우고 자격을 갖추는 일에 힘이 실려요. 미뤄 둔 공부를 시작하기 좋아요.",
};

// 「나무를 다듬는 자리」처럼, 나를 다듬는 기운이 하는 일
const POWER_VERB: Record<Element, string> = {
  목: "나무를 다듬는",
  화: "불길을 다스리는",
  토: "흙을 일구는",
  금: "쇠를 달구는",
  수: "물길을 잡는",
};

// 한 해 풀이. 천간과 지지가 같은 기운이면 「겹친 해」, 지지가 나를 돕는 기운이면 지지를 따라 「받쳐 주는 해」로 쓴다
export function yearText(
  me: Element,
  y: {
    stem: { element: Element };
    branch: { element: Element };
    god: TenGod;
    branchGod: TenGod;
  },
) {
  const name = (e: Element) => ELEMENT_NAME[e];
  const obj = (w: string) => w + (hasBatchim(w) ? "을" : "를");
  if (y.stem.element === y.branch.element)
    return `${name(y.stem.element)} 기운이 겹친 해예요. ${YEAR_TEXT[y.god]}`;
  if (y.branch.element === relatedElements(me).support)
    return `${name(y.branch.element)} 기운이 들어와 ${obj(name(me))} 받쳐 주는 해예요. ${YEAR_TEXT[y.branchGod]}`;
  return `${name(y.stem.element)} 기운이 들어오는 해예요. ${YEAR_TEXT[y.god]}`;
}

export const GOD_GROUPS = [
  { name: "비견 · 겁재", text: "나와 같은 기운이에요. 형제, 친구, 경쟁자" },
  { name: "식신 · 상관", text: "내가 만들어 내는 것이에요. 말, 재능, 표현" },
  { name: "편재 · 정재", text: "내가 다루는 것이에요. 돈, 결과, 살림" },
  { name: "편관 · 정관", text: "나를 다듬는 것이에요. 직장, 규칙, 책임" },
  { name: "편인 · 정인", text: "나를 돕는 것이에요. 배움, 어른, 자격" },
];

function count(n: number) {
  return COUNT_WORD[n] ?? String(n);
}

// 오행 개수로 붙는 문장. 결과 화면의 「쇠 기운이 넷이라」 같은 말은 여기서 나온다
export function reading(s: Saju) {
  const base = BASE[s.dayMaster.index];
  const rel = relatedElements(s.dayMaster.element);
  const c = s.elementCounts;
  const name = (e: Element) => ELEMENT_NAME[e];
  const whole = s.total === 8 ? "여덟 글자" : "여섯 글자";

  let personality = base.personality;
  const self = c[rel.self];
  if (self >= 4) {
    personality += ` ${whole} 가운데 ${name(rel.self)} 기운이 ${count(self)}이라, 주변에서 고집이 세다는 말을 들을 수 있어요. 말을 꺼내기 전에 한 번 더 들어 주는 습관이 사람을 곁에 오래 머물게 해요.`;
  } else if (self === 3) {
    personality += ` ${name(rel.self)} 기운이 셋이라 자기 생각이 뚜렷해요. 다른 의견을 한 번 더 들어 보면 판단이 더 단단해져요.`;
  } else if (self === 1) {
    personality += ` ${name(rel.self)} 기운이 나 하나뿐이라, 혼자 버티기보다 믿을 만한 사람과 짐을 나누면 훨씬 수월해요.`;
  }

  let work = "";
  const power = c[rel.power];
  if (power >= 3) {
    work += `${name(rel.power)} 기운이 ${count(power)}이라 ${POWER_VERB[rel.self]} 자리, 곧 규칙과 책임이 분명한 조직에서 실력이 드러나요. `;
  }
  work += base.work;
  const wealth = c[rel.wealth];
  if (wealth === 0) {
    work += ` 다만 ${name(rel.wealth)} 기운이 없어 돈이 들어오는 길이 한 갈래로 좁기 쉬워요. 본업 말고 작은 수입원을 하나 더 만들어 두면 마음이 한결 편해요.`;
  } else if (wealth >= 3) {
    work += ` ${name(rel.wealth)} 기운이 ${count(wealth)}이라 돈이 들어오는 길이 여러 갈래예요. 들어오는 만큼 새는 곳도 많으니 쓰는 곳을 정해 두면 좋아요.`;
  }

  let people = base.people;
  const output = c[rel.output];
  if (output === 0) {
    people = `${name(rel.output)} 기운이 없어 마음을 말로 풀어내는 데 서툴 수 있어요. ${base.peopleLack ?? base.people} 고마운 일은 그날 바로 말로 전해 보세요. 짧은 한마디가 오래 쌓인 오해를 풀어 줘요.`;
  } else if (output >= 3) {
    people += ` ${name(rel.output)} 기운이 ${count(output)}이라 말과 표현이 풍부해요. 다만 생각보다 말이 먼저 나갈 때가 있으니, 중요한 이야기는 한 번 쉬고 꺼내 보세요.`;
  }

  return {
    title: base.title,
    keywords: base.keywords,
    personality,
    work,
    people,
  };
}

// 오행 칸의 제목. 많은 기운과 없는 기운을 한 문장으로 말한다
export function elementTitle(s: Saju) {
  // 많은 기운은 많은 것부터 말한다(쇠 넷, 불 셋이면 「쇠와 불이」)
  const strong = ELEMENTS.filter(
    (e) => s.elementCounts[e] / s.total >= 0.3,
  ).sort((a, b) => s.elementCounts[b] - s.elementCounts[a]);
  const missing = ELEMENTS.filter((e) => s.elementCounts[e] === 0);
  const join = (list: Element[]) =>
    list
      .map((e, i) =>
        i < list.length - 1
          ? ELEMENT_NAME[e] + (hasBatchim(ELEMENT_NAME[e]) ? "과" : "와")
          : ELEMENT_NAME[e],
      )
      .join(" ");
  const subject = (list: Element[]) =>
    join(list) +
    (hasBatchim(ELEMENT_NAME[list[list.length - 1]]) ? "이" : "가");
  if (strong.length && missing.length)
    return `${subject(strong)} 강하고\n${subject(missing)} 없어요`;
  if (strong.length)
    return `${subject(strong)} 강하고\n다섯 기운이 모두 있어요`;
  if (missing.length)
    return `기운이 고르게 퍼져 있고\n${subject(missing)} 없어요`;
  return "다섯 기운이\n고르게 퍼져 있어요";
}

export function elementState(n: number, total: number) {
  if (n === 0) return "없음";
  return n / total >= 0.3 ? "많음" : "알맞음";
}

function hasBatchim(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code % 28 !== 0;
}

export { count as countWord };
