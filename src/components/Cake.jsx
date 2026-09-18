import cakeImage from '../assets/cake.jpg'
import Candle from './Candle.jsx'

// 케이크 그림(src/assets/cake.jpg, 1127x1364) 위에 촛불을 얹는다.
// 그림을 바꾸면 IMAGE 크기와 TOP_FACE 꼭짓점 좌표만 새 그림에 맞춰 수정하면 된다.
const IMAGE = { width: 1127, height: 1364 }

// 케이크 윗면의 네 꼭짓점 (이미지 픽셀 좌표)
const TOP_FACE = {
  back: [365, 22], // 맨 위
  right: [888, 218], // 오른쪽
  front: [698, 688], // 앞쪽 모서리
  left: [122, 440], // 왼쪽
}

// 윗면 안에서의 촛불 자리 (u: back→right 방향, v: back→left 방향, 0~1)
// 촛불이 9개 이하면 이 자리를 앞에서부터 쓰고, 더 많으면 gridSpots()로 고르게 깐다.
const CANDLE_SPOTS = [
  [0.5, 0.5],
  [0.2, 0.26],
  [0.8, 0.22],
  [0.24, 0.8],
  [0.82, 0.76],
  [0.5, 0.14],
  [0.14, 0.54],
  [0.52, 0.88],
  [0.88, 0.48],
]
const CANDLE_SCALE = 1.35 // 촛불 크기 (9개 이하일 때)

// 촛불이 많을 때: 윗면을 격자로 나눠 배치 (줄마다 살짝 엇갈리게)
function gridSpots(count) {
  const cols = Math.ceil(Math.sqrt(count))
  const rows = Math.ceil(count / cols)
  const spots = []
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols)
    const c = i % cols
    const shift = r % 2 ? 0.25 : -0.25 // 엇갈림
    const u = 0.1 + (0.8 * (c + 0.5 + shift)) / cols
    const v = 0.1 + (0.8 * (r + 0.5)) / rows
    spots.push([u, v])
  }
  return spots
}

function candleLayout(count) {
  if (count <= CANDLE_SPOTS.length) return { spots: CANDLE_SPOTS, scale: CANDLE_SCALE }
  // 많을수록 작게 (너무 작아지지는 않게)
  return { spots: gridSpots(count), scale: CANDLE_SCALE * Math.max(0.5, Math.sqrt(CANDLE_SPOTS.length / count)) }
}

// 윗면의 (u, v) → 이미지 좌표 (네 꼭짓점 사이 쌍선형 보간)
function facePoint(u, v) {
  const { back, right, front, left } = TOP_FACE
  const pick = (i) =>
    (1 - u) * (1 - v) * back[i] + u * (1 - v) * right[i] + u * v * front[i] + (1 - u) * v * left[i]
  return [pick(0), pick(1)]
}

// 뒤쪽 촛불의 불꽃이 잘리지 않도록 위쪽 여백을 둔다
const TOP_MARGIN = 220

function Cake({ litCandles }) {
  const { spots, scale } = candleLayout(litCandles.length)
  const candles = litCandles
    .map((lit, index) => {
      const [u, v] = spots[index]
      const [x, y] = facePoint(u, v)
      return { lit, index, x, y }
    })
    // 뒤쪽(y가 작은) 촛불부터 그려야 앞쪽 촛불이 위에 겹친다
    .sort((a, b) => a.y - b.y)

  const litCount = litCandles.filter(Boolean).length

  return (
    <svg
      className="cake"
      viewBox={`0 ${-TOP_MARGIN} ${IMAGE.width} ${IMAGE.height + TOP_MARGIN}`}
      role="img"
      aria-label={`곰돌이들이 들고 있는 케이크, 촛불 ${litCandles.length}개 중 ${litCount}개가 켜져 있음`}
    >
      <image href={cakeImage} x="0" y="0" width={IMAGE.width} height={IMAGE.height} />
      {candles.map((c) => (
        <Candle key={c.index} x={c.x} y={c.y} lit={c.lit} index={c.index} scale={scale} />
      ))}
    </svg>
  )
}

export default Cake
