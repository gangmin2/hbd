// 화면 가장자리에 흩어진 손그림 장식 (별, 하트, 뱅글뱅글, 반짝이)
const SHAPES = {
  star: 'M20 3 L25 15 L38 16 L28 25 L31 38 L20 31 L9 38 L12 25 L2 16 L15 15 Z',
  heart: 'M20 36 C 4 24 2 12 11 8 C 16 6 19 9 20 13 C 21 9 24 6 29 8 C 38 12 36 24 20 36 Z',
  swirl: 'M20 20 m -2 0 a 2 2 0 1 1 4 0 a 5 5 0 1 1 -10 0 a 8 8 0 1 1 16 0 a 11 11 0 1 1 -22 0',
  sparkle: 'M20 2 Q 22 18 38 20 Q 22 22 20 38 Q 18 22 2 20 Q 18 18 20 2 Z',
}

// [모양, left%, top%, 크기(px), 회전, 색]
const ITEMS = [
  ['star', 6, 8, 34, -12, 'var(--yellow)'],
  ['heart', 88, 10, 30, 14, 'var(--pink)'],
  ['swirl', 12, 78, 34, 0, 'none'],
  ['sparkle', 84, 72, 30, 8, 'var(--sky)'],
  ['sparkle', 50, 4, 22, 0, 'var(--mint)'],
  ['heart', 4, 45, 22, -18, 'var(--lavender)'],
  ['star', 92, 44, 24, 20, 'var(--mint)'],
  ['swirl', 72, 90, 26, 0, 'none'],
  ['star', 30, 92, 20, 10, 'var(--pink)'],
]

function Doodles({ chalk = false }) {
  return (
    <div className={`doodles ${chalk ? 'doodles--chalk' : ''}`} aria-hidden="true">
      {ITEMS.map(([shape, left, top, size, rotate, fill], i) => (
        <svg
          key={i}
          className="doodle"
          viewBox="0 0 40 40"
          width={size}
          height={size}
          style={{ left: `${left}%`, top: `${top}%`, '--r': `${rotate}deg`, animationDelay: `${i * -0.7}s` }}
        >
          <path
            d={SHAPES[shape]}
            fill={chalk ? 'none' : fill}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#rough)"
          />
        </svg>
      ))}
    </div>
  )
}

export default Doodles
