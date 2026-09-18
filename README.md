# 🎂 생일 축하 인터랙티브 웹사이트

질문 → 방 → 문 열기 → 케이크 촛불 끄기 → 폭죽과 축하 메시지로 이어지는 작은 웹 경험입니다.
React + Vite로 만든 정적 사이트이며 백엔드는 없습니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # dist/ 에 정적 파일 생성
npm run preview  # 빌드 결과 미리보기
```

## 자주 바꾸는 것

| 바꾸고 싶은 것 | 위치 |
| --- | --- |
| 질문, "아니오" 문구, 비밀의 방 문구, 축하 문구 | `src/config.js` |
| 촛불 개수, 한 번에 꺼지는 촛불 수 | `src/config.js` (`CANDLE_COUNT`, `CANDLES_PER_BLOW`) |
| 마이크 민감도 | `src/config.js` (`MIC_THRESHOLD`, 클수록 세게 불어야 함) |
| 케이크 그림 | `src/assets/cake.jpg` 교체 후 `src/components/Cake.jsx`의 `IMAGE`, `TOP_FACE` 좌표 수정 |
| 촛불 위치/크기 | `src/components/Cake.jsx` (`CANDLE_SPOTS`, `CANDLE_SCALE`) |
| 촛불 모양 | `src/components/Candle.jsx` |

## 생일 축하 노래

- `public/music/happy-birthday.mp3` 파일을 넣으면 그 파일을 반복 재생합니다.
- 파일이 없거나 재생에 실패하면 Web Audio로 만든 오르골 멜로디를 대신 재생합니다
  (Happy Birthday 멜로디는 퍼블릭 도메인입니다).
- 브라우저 자동재생 정책 때문에 문 손잡이를 클릭하는 순간 재생을 시작합니다.
  그래도 막히면 케이크 화면의 "🎵 노래 켜기" 버튼으로 재생할 수 있습니다.
- 저작권이 있는 음원을 넣을 때는 사용 권한을 확인하세요.

## 촛불 끄기

- **버튼**: "후~ 불어서 촛불 끄기" — 어떤 환경에서도 동작합니다.
- **마이크(선택)**: "🎤 마이크로 불기" → "마이크 켜기". 켜진 직후 0.6초 동안 주변 소음을 재서 기준을 잡고,
  기준보다 훨씬 큰 소리가 0.15초 이상 이어지면 "후~"로 인식합니다.
  권한이 거부되거나 지원되지 않아도 버튼으로 계속 진행할 수 있습니다.
- 마이크는 **HTTPS 또는 localhost**에서만 동작합니다. 휴대폰으로 테스트하려면 HTTPS로 배포하세요
  (예: Vercel, Netlify, GitHub Pages).

## 구조

```
src/
├── App.jsx                  화면 흐름 (question → secretRoom → doorOpening → birthdayScene → celebration)
├── config.js                문구·설정값
├── components/
│   ├── BirthdayQuestion.jsx 생일 질문
│   ├── SecretRoom.jsx       비밀의 방
│   ├── Door.jsx             문 + 손잡이 (CSS 3D 회전)
│   ├── BirthdayScene.jsx    케이크 화면, 촛불 상태 관리
│   ├── Cake.jsx             케이크 그림 + 촛불 배치
│   ├── Candle.jsx           촛불 SVG (불꽃/연기)
│   ├── CandleBlowControl.jsx 버튼·마이크 촛불 끄기 UI
│   ├── MusicControl.jsx     노래 켜기/끄기, 음소거
│   ├── Celebration.jsx      최종 축하 화면
│   ├── Confetti.jsx         폭죽 (canvas-confetti)
│   ├── Bunting.jsx, Doodles.jsx  손그림 장식
├── hooks/
│   ├── useBirthdaySong.js   음악 파일 재생 + 내장 멜로디 대체
│   └── useMicrophoneBlow.js 마이크 "후~" 감지
└── assets/cake.jpg          케이크 그림
```
