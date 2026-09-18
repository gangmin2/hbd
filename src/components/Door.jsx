import { useState } from 'react'

// 비밀의 방 문. 손잡이(button)를 누르면 onOpen이 호출되고,
// opening이 true가 되면 문이 CSS 3D 회전으로 열린다.
function Door({ opening, onOpen }) {
  const [nudge, setNudge] = useState(0)

  // 문판을 눌렀을 때는 살짝 흔들어서 손잡이를 누르라고 알려준다
  const handlePanelClick = (e) => {
    if (opening || e.target.closest('.door__knob')) return
    setNudge((n) => n + 1)
  }

  return (
    <div className={`door ${opening ? 'door--open' : ''}`}>
      <div className="door__light" aria-hidden="true" />

      <div key={nudge} className={`door__panel ${nudge ? 'wiggle' : ''}`} onClick={handlePanelClick}>
        {/* 대충 그린 문: 색칠이 선 밖으로 삐져나가고, 선은 모서리에서 삐죽 넘어간다 */}
        <svg viewBox="0 0 200 320" className="door__art" aria-hidden="true">
          <g filter="url(#rough)" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="#2b2622">
            {/* 크레파스로 대충 칠한 면 */}
            <path d="M14 16 L186 8 L194 300 L18 314 Z" fill="#c98a5a" stroke="none" />
            <path d="M150 200 l30 -24 M140 236 l44 -36 M146 262 l40 -32 M160 286 l28 -22" stroke="#a86a3e" strokeWidth="5" />

            {/* 테두리 (한 획씩 따로, 모서리에서 삐져나감) */}
            <path d="M2 12 Q70 2 198 6" strokeWidth="4.5" />
            <path d="M192 0 Q198 140 190 318" strokeWidth="4.5" />
            <path d="M198 308 Q90 318 0 314" strokeWidth="4.5" />
            <path d="M8 2 Q0 150 10 320" strokeWidth="4.5" />

            {/* 삐뚤한 판자 두 칸 (끝이 안 맞음) */}
            <path d="M44 46 L158 38 L164 140 L40 150 L42 52" strokeWidth="3.5" />
            <path d="M40 184 L154 178 L160 282 L46 290 L38 190" strokeWidth="3.5" />

            {/* 낙서 같은 나뭇결 */}
            <path d="M60 80 q16 -10 34 0 t30 -4" strokeWidth="2.5" opacity="0.55" />
            <path d="M70 116 q20 8 40 -2" strokeWidth="2.5" opacity="0.55" />
            <path d="M62 226 q18 -8 36 2 t32 -2" strokeWidth="2.5" opacity="0.55" />
          </g>
        </svg>

        <button
          type="button"
          className="door__knob"
          onClick={onOpen}
          disabled={opening}
          aria-label="문 손잡이를 돌려서 문 열기"
        >
          <span className="door__knob-ring" aria-hidden="true" />
        </button>

        {!opening && (
          <span className="door__knob-hint" aria-hidden="true">
            여기 →
          </span>
        )}
      </div>
    </div>
  )
}

export default Door
