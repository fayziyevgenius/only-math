"use client";

type Props = {
  figure: any;
};

export default function QuestionFigure({ figure }: Props) {
  if (!figure) return null;

  if (figure.type === "triangle") {
    return (
      <div className="flex justify-center py-6 overflow-hidden">
        <svg
          viewBox="0 0 400 260"
          className="w-full max-w-[420px] h-auto"
        >
          {/* Triangle */}
          <polygon
            points="70,210 330,210 200,40"
            fill="none"
            stroke="white"
            strokeWidth="4"
          />

          {/* Height */}
          {figure.height && (
            <>
              <line
                x1="200"
                y1="40"
                x2="200"
                y2="210"
                stroke="#22c55e"
                strokeWidth="3"
                strokeDasharray="8 6"
              />

              <text
                x="210"
                y="135"
                fill="#22c55e"
                fontSize="18"
                fontWeight="bold"
              >
                {figure.labels?.height}
              </text>
            </>
          )}

          {/* Base */}
          {figure.base && (
            <text
              x="185"
              y="240"
              fill="white"
              fontSize="18"
              fontWeight="bold"
            >
              {figure.labels?.base}
            </text>
          )}

          {/* Angles */}
          {figure.angles && (
            <>
              <text
                x="82"
                y="195"
                fill="#60a5fa"
                fontSize="18"
                fontWeight="bold"
              >
                {figure.angles[0]}
              </text>

              <text
                x="290"
                y="195"
                fill="#60a5fa"
                fontSize="18"
                fontWeight="bold"
              >
                {figure.angles[1]}
              </text>

              <text
                x="195"
                y="70"
                fill="#22c55e"
                fontSize="20"
                fontWeight="bold"
              >
                {figure.angles[2]}
              </text>
            </>
          )}
        </svg>
      </div>
    );
  }

  if (figure.type === "rectangle") {
    return (
      <div className="flex justify-center py-6">
        <svg
          viewBox="0 0 400 240"
          className="w-full max-w-[420px] h-auto"
        >
          {/* Rectangle */}
          <rect
            x="80"
            y="50"
            width="240"
            height="120"
            fill="none"
            stroke="white"
            strokeWidth="4"
          />

          {/* Top label */}
          <text
            x="195"
            y="35"
            fill="#22c55e"
            fontSize="20"
            fontWeight="bold"
          >
            {figure.labels?.top}
          </text>

          {/* Right label */}
          <text
            x="335"
            y="115"
            fill="#22c55e"
            fontSize="20"
            fontWeight="bold"
          >
            {figure.labels?.right}
          </text>

          {/* Corner points */}
          <circle cx="80" cy="50" r="4" fill="white" />
          <circle cx="320" cy="50" r="4" fill="white" />
          <circle cx="320" cy="170" r="4" fill="white" />
          <circle cx="80" cy="170" r="4" fill="white" />

          <text x="65" y="45" fill="white" fontSize="18">
            A
          </text>

          <text x="325" y="45" fill="white" fontSize="18">
            B
          </text>

          <text x="325" y="195" fill="white" fontSize="18">
            C
          </text>

          <text x="60" y="195" fill="white" fontSize="18">
            D
          </text>
        </svg>
      </div>
    );
  }

  return null;
}