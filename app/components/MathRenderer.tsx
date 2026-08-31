"use client";

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

type Props = {
  text: string;
};

export default function MathRenderer({ text }: Props) {
  const parts = text.split(/(\\\(.+?\\\)|\\\[.+?\\\])/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("\\(") && part.endsWith("\\)")) {
          return (
            <InlineMath
              key={index}
              math={part.slice(2, -2)}
            />
          );
        }

        if (part.startsWith("\\[") && part.endsWith("\\]")) {
          return (
            <BlockMath
              key={index}
              math={part.slice(2, -2)}
            />
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
}