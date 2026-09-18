// 생일 축하 노래 버튼
// - 재생 중: 음소거 버튼만 보인다
// - 재생 안 됨(자동재생 차단 등): "노래 켜기" 버튼이 보인다
function MusicControl({ song }) {
  if (!song.playing) {
    return (
      <div className="music">
        <button type="button" className="btn btn--small" onClick={song.play}>
          🎵 노래 켜기
        </button>
      </div>
    )
  }

  return (
    <div className="music">
      <button
        type="button"
        className="btn btn--small btn--icon"
        onClick={song.toggleMute}
        aria-pressed={song.muted}
        aria-label={song.muted ? '소리 켜기' : '음소거'}
      >
        {song.muted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}

export default MusicControl
