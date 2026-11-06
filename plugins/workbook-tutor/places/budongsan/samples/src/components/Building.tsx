import { useId } from "react";
import { SvgXml } from "react-native-svg";
import { complexXml, towerXml } from "./buildingXml";

// 그림 안의 색 번짐(gradient) 이름을 그림마다 다르게 붙인다. 같은 이름이 여러 그림에 있으면 웹에서 가려진 화면의
// 그림을 가리켜 색이 빠진다
function useUniqueXml(xml: string): string {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return xml
    .replace(/id="(g[lr])"/g, `id="$1${uid}"`)
    .replace(/url\(#(g[lr])\)/g, `url(#$1${uid})`);
}

// 단지 그림(건물 셋)
export function ComplexArt({ size }: { size: number }) {
  return <SvgXml xml={useUniqueXml(complexXml)} width={size} height={size} />;
}

// 목록 칸에 넣는 건물 하나
export function TowerArt({ size }: { size: number }) {
  return <SvgXml xml={useUniqueXml(towerXml)} width={size} height={size} />;
}
