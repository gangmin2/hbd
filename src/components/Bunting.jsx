// 화면 위쪽에 걸린 손그림 가랜드
const FLAG_COLORS = ['#ff9eb5', '#ffd66b', '#9ee6c9', '#9fd3ff', '#c8b6ff']
const FLAGS = 11

function Bunting() {
  const step = 1000 / FLAGS
  // 줄이 살짝 처지도록 포물선 위에 깃발을 배치
  const sag = (x) => 14 + 36 * (1 - ((x - 500) / 500) ** 2)

  return (
    <svg className="bunting" viewBox="0 0 1000 110" preserveAspectRatio="none" aria-hidden="true">
      <g filter="url(#rough)" stroke="#2b2622" strokeWidth="3" strokeLinejoin="round">
        <path d="M0 14 Q500 86 1000 14" fill="none" />
        {Array.from({ length: FLAGS }, (_, i) => {
          const x1 = i * step + 8
          const x2 = (i + 1) * step - 8
          const mid = (x1 + x2) / 2
          const y1 = sag(x1)
          const y2 = sag(x2)
          return (
            <path
              key={i}
              d={`M${x1} ${y1} L${x2} ${y2} L${mid} ${(y1 + y2) / 2 + 48} Z`}
              fill={FLAG_COLORS[i % FLAG_COLORS.length]}
            />
          )
        })}
      </g>
    </svg>
  )
}

export default Bunting
