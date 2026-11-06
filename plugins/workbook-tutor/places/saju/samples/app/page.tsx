"use client";

// 입력과 결과를 한 주소에서 보여 준다. 생년월일시는 주소(URL)에 싣지 않는다. 링크를 받은 사람에게 남의 생일이 보이면 안 된다
import { useState } from "react";
import BirthForm, { type FormValues } from "../components/BirthForm";
import Result from "../components/Result";
import { BirthError, calculate, type BirthInput, type Saju } from "../lib/saju";

export default function Home() {
  const [values, setValues] = useState<FormValues>({
    calendar: "solar",
    date: "",
    leap: false,
    time: "",
    unknownTime: false,
  });
  const [saju, setSaju] = useState<{ input: BirthInput; result: Saju } | null>(
    null,
  );

  function submit(input: BirthInput): string | null {
    try {
      setSaju({ input, result: calculate(input) });
      window.scrollTo(0, 0);
      return null;
    } catch (e) {
      if (e instanceof BirthError) return e.message;
      throw e;
    }
  }

  if (saju) {
    return (
      <Result
        input={saju.input}
        saju={saju.result}
        onBack={() => {
          setSaju(null);
          window.scrollTo(0, 0);
        }}
      />
    );
  }
  return <BirthForm values={values} onChange={setValues} onSubmit={submit} />;
}
