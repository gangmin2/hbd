import { SECRET_ROOM } from '../config.js'
import Door from './Door.jsx'
import Doodles from './Doodles.jsx'

function SecretRoom({ opening, onOpen }) {
  return (
    <section className={`screen secret-room ${opening ? 'secret-room--opening' : ''}`}>
      <Doodles chalk />

      <header className="secret-room__text">
        <h1>{SECRET_ROOM.title}</h1>
        <p>{SECRET_ROOM.hint}</p>
      </header>

      <Door opening={opening} onOpen={onOpen} />

      {/* 문이 열리면 화면 전체로 번지는 빛 */}
      <div className="light-flood" aria-hidden="true" />
    </section>
  )
}

export default SecretRoom
