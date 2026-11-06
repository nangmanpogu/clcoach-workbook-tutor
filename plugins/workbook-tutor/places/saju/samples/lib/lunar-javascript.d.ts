// lunar-javascript 는 타입 파일이 없다. 이 프로젝트가 쓰는 만큼만 적는다
declare module "lunar-javascript" {
  type EightChar = {
    setSect(sect: 1 | 2): void;
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
  };
  type SolarDay = {
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getLunar(): { getEightChar(): EightChar };
  };
  const lunar: {
    Solar: {
      fromYmdHms(
        y: number,
        m: number,
        d: number,
        h: number,
        mi: number,
        s: number,
      ): SolarDay;
    };
    Lunar: {
      fromYmd(y: number, m: number, d: number): { getSolar(): SolarDay };
    };
  };
  export default lunar;
}
