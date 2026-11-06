// 화면에 보이는 숫자·날짜 표기를 한곳에서 정한다

function withComma(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 만원 단위 가격을 「31억 3,000만원」 처럼 쓴다
export function formatPrice(manwon: number): string {
  const eok = Math.floor(manwon / 10000);
  const rest = manwon % 10000;
  if (eok === 0) return `${withComma(rest)}만원`;
  if (rest === 0) return `${eok}억`;
  return `${eok}억 ${withComma(rest)}만원`;
}

// 「2026-10-22」 를 「10월 22일」 로 쓴다
export function formatDate(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${m}월 ${d}일`;
}

export function formatHouseholds(n: number): string {
  return `${withComma(n)}세대`;
}

export function formatArea(group: number): string {
  return `${group}㎡`;
}
