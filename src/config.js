// 사이트에 쓰이는 문구와 설정값을 한 곳에 모아둔 파일입니다.
// 이름이나 문구를 바꾸고 싶으면 이 파일만 수정하면 됩니다.

// STEP 1. "예"를 누를 때마다 다음 질문으로 넘어갑니다.
// swap: true 인 질문에서는 예/아니오 버튼 위치가 몰래 바뀝니다.
export const QUESTIONS = [
  { text: '오늘 생일인가요?' },
  { text: '진짜 오늘 생일인가요?' },
  { text: '정말 정말 진짜루 생일 맞나요?', swap: true },
  { text: '확실해요?' },
  { text: '거짓말이면 큰일 나요. 증맬루 생일 맞아요?', swap: true },
  { text: '음... 한 번만 더 물어볼게요. 오늘 생일인가요?' },
]

// 모든 질문을 통과하면 잠깐 보여줄 문구
export const QUESTION_DONE_MESSAGE = '옹게옹게, 꺼몽꺼몽'

// "아니오"를 누르면 순서대로 보여줄 장난 문구
export const NO_MESSAGES = [
  '흠... 다시 생각해 보세요.',
  '생일인 것 같은데요?',
  '예를 눌러주세요. 😏',
  '아니오는 받지 않습니다~',
]

// 버튼 자리가 바뀐 질문에서 "아니오"를 눌렀을 때 보여줄 문구
export const SWAP_TRAP_MESSAGE = '방금 아니오 누르셨어요. 잘 보고 누르세요 😏'

// STEP 2. 비밀의 방
export const SECRET_ROOM = {
  title: '문을 열고 들어가보세요!',
  hint: '손잡이를 눌러보세요',
}

// STEP 3. 케이크와 촛불
// 촛불 개수. 9개 이하는 정해둔 자리에, 그보다 많으면 케이크 윗면에 고르게 깔립니다.
export const CANDLE_COUNT = 28
// "후~" 한 번에 꺼지는 촛불 개수 (최소~최대 사이에서 랜덤)
export const CANDLES_PER_BLOW = { min: 2, max: 5 }

// STEP 4. 생일 축하 노래
// public/music/happy-birthday.mp3 파일을 넣으면 그 파일을 재생합니다.
// 파일이 없거나 재생에 실패하면 내장 멜로디(오르골 소리)로 대신 재생합니다.
export const MUSIC_SRC = `${import.meta.env.BASE_URL}music/happy-birthday.mp3`

// STEP 5. 마이크 감지 민감도 (0~1, 값이 클수록 세게 불어야 함)
export const MIC_THRESHOLD = 0.002

// STEP 6. 최종 축하 화면
export const CELEBRATION = {
  title: '🎉 생일 축하포카푸 🎉',
  message: '오늘 대빵 즐거운 하루 보내시오!',
  sub: '무 헤 헤 헤',
}
