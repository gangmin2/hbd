// 케이크 SVG 안에 들어가는 촛불 하나.
// (x, y)는 촛불 밑동 위치, lit이 false가 되면 불꽃이 꺼지고 연기가 피어오른다.
const COLORS = ['#ff9eb5', '#9fd3ff', '#ffd66b', '#9ee6c9', '#c8b6ff']

function Candle({ x, y, lit, index = 0, scale = 1 }) {
  const color = COLORS[index % COLORS.length]
  const w = 30
  const h = 130

  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(-4)`}>
      {/* 몸통 */}
      <g filter="url(#rough)">
        <rect x={-w / 2} y={-h} width={w} height={h} rx="6" fill="#fff" stroke="#3a3330" strokeWidth="5" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M ${-w / 2 + 2} ${-h + 22 + i * 30} L ${w / 2 - 2} ${-h + 8 + i * 30}`}
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
          />
        ))}
        {/* 심지 */}
        <path d={`M 0 ${-h} q 4 -12 -1 -22`} stroke="#3a3330" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>

      {/* 불꽃 */}
      <g className={`flame ${lit ? '' : 'flame--out'}`} style={{ animationDelay: `${index * -0.23}s` }}>
        <ellipse cx="0" cy={-h - 52} rx="34" ry="44" fill="#ffd66b" opacity="0.28" />
        <path
          d={`M 0 ${-h - 102} C 26 ${-h - 62} 24 ${-h - 22} 0 ${-h - 20} C -24 ${-h - 22} -26 ${-h - 62} 0 ${-h - 102} Z`}
          fill="#ffb347"
          stroke="#3a3330"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d={`M 0 ${-h - 66} C 11 ${-h - 48} 10 ${-h - 30} 0 ${-h - 29} C -10 ${-h - 30} -11 ${-h - 48} 0 ${-h - 66} Z`}
          fill="#fff3b0"
        />
      </g>

      {/* 꺼진 뒤 연기 */}
      {!lit && (
        <path
          className="smoke"
          d={`M 0 ${-h - 22} c -14 -18 14 -30 0 -48 c -14 -18 14 -30 0 -48`}
          stroke="#8a817c"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </g>
  )
}

export default Candle
