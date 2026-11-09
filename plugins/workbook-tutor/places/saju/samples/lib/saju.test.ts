// 여덟 글자 계산을 확인한다. 기대값은 lunar-javascript 의 결과를 옮겨 적은 것이 아니다.
// - 일주: 2000-01-01 이 무오일(戊午)이라는 기준에서 날 수를 세어 구했다(60일마다 같은 간지가 돌아온다)
// - 년주·월주: 입춘·입하 같은 절기 날짜와 「갑기년 병인월, 을경년 무인월」 규칙으로 구했다
// - 시주: 「을경일 병자시」 규칙으로 구했다(자시가 병자면 사시는 신사, 해시는 정해)
// - 음력: 2000년 설날은 양력 2000-02-05, 2020년 윤4월 1일은 양력 2020-05-23 이다(한국천문연구원 음양력 변환과 같다)
import { test } from "node:test";
import assert from "node:assert/strict";
import { calculate, BirthError, yearFlow } from "./saju.ts";

function gz(p: { stem: { hanja: string }; branch: { hanja: string } } | null) {
  return p ? p.stem.hanja + p.branch.hanja : null;
}

test("양력 1990-05-15 10:30 은 경오년 신사월 경진일 신사시다", () => {
  const s = calculate({
    calendar: "solar",
    year: 1990,
    month: 5,
    day: 15,
    time: { hour: 10, minute: 30 },
  });
  assert.deepEqual(
    [gz(s.year), gz(s.month), gz(s.day), gz(s.hour)],
    ["庚午", "辛巳", "庚辰", "辛巳"],
  );
  assert.deepEqual(s.elementCounts, { 목: 0, 화: 3, 토: 1, 금: 4, 수: 0 });
  assert.equal(s.ilju.name, "경진일주");
  assert.equal(s.ilju.animal, "하얀 용");
  assert.deepEqual(
    [s.hour!.stem.god, s.day.stem.god, s.month.stem.god, s.year.stem.god],
    ["겁재", "나", "겁재", "비견"],
  );
  assert.deepEqual(
    [
      s.hour!.branch.god,
      s.day.branch.god,
      s.month.branch.god,
      s.year.branch.god,
    ],
    ["편관", "편인", "편관", "정관"],
  );
});

test("시각을 모르면 시주 없이 여섯 글자다", () => {
  const s = calculate({
    calendar: "solar",
    year: 1990,
    month: 5,
    day: 15,
    time: null,
  });
  assert.equal(s.hour, null);
  assert.equal(s.total, 6);
  assert.deepEqual(
    [gz(s.year), gz(s.month), gz(s.day)],
    ["庚午", "辛巳", "庚辰"],
  );
});

test("음력 2000년 1월 1일은 양력 2000-02-05 계사일이다", () => {
  const s = calculate({
    calendar: "lunar",
    year: 2000,
    month: 1,
    day: 1,
    time: null,
  });
  assert.equal(s.solarDate, "2000-02-05");
  assert.equal(gz(s.day), "癸巳");
});

test("음력 윤달을 고르면 윤달 날짜로 바꾼다", () => {
  const s = calculate({
    calendar: "lunar",
    year: 2020,
    month: 4,
    day: 1,
    leapMonth: true,
    time: null,
  });
  assert.equal(s.solarDate, "2020-05-23");
});

test("시 경계는 30분 늦다. 23:20 은 해시, 23:40 은 다음 날 자시다", () => {
  const before = calculate({
    calendar: "solar",
    year: 1990,
    month: 5,
    day: 15,
    time: { hour: 23, minute: 20 },
  });
  assert.equal(gz(before.day), "庚辰");
  assert.equal(gz(before.hour), "丁亥");
  const after = calculate({
    calendar: "solar",
    year: 1990,
    month: 5,
    day: 15,
    time: { hour: 23, minute: 40 },
  });
  assert.equal(gz(after.day), "辛巳");
  assert.equal(gz(after.hour), "戊子");
  // 10:20 은 보정하면 09:50 이라 아직 사시다. 09:20 은 08:50 이라 진시다
  const early = calculate({
    calendar: "solar",
    year: 1990,
    month: 5,
    day: 15,
    time: { hour: 9, minute: 20 },
  });
  assert.equal(gz(early.hour), "庚辰");
});

test("달력에 없는 날짜는 오류다", () => {
  assert.throws(
    () =>
      calculate({
        calendar: "solar",
        year: 1990,
        month: 2,
        day: 30,
        time: null,
      }),
    BirthError,
  );
  assert.throws(
    () =>
      calculate({
        calendar: "lunar",
        year: 2021,
        month: 4,
        day: 1,
        leapMonth: true,
        time: null,
      }),
    BirthError,
  );
});

test("2026년은 병오년, 2027년은 정미년이다", () => {
  const dayStem = 6; // 경
  assert.equal(yearFlow(2026, dayStem).name, "병오년");
  assert.equal(yearFlow(2026, dayStem).god, "편관");
  assert.equal(yearFlow(2027, dayStem).name, "정미년");
  assert.equal(yearFlow(2027, dayStem).god, "정관");
});
