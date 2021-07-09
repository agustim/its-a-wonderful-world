/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {HTMLAttributes, useState} from 'react'
import usePlayersStartingWithMe from '../usePlayersStartingWithMe'
import PlayerScore from './PlayerScore'

type Props = { game: GameView, animation: boolean } & HTMLAttributes<HTMLDivElement>

export default function ScorePanel({game, animation}: Props) {
  const players = usePlayersStartingWithMe(game)
  const [displayScore, setDisplayScore] = useState(true)
  return (
    <div css={scorePanelStyle}>
      {players.map((player, index) =>
        <PlayerScore key={player.empire} position={index} player={player} displayScore={displayScore} setDisplayScore={setDisplayScore} animation={animation}/>
      )}
    </div>
  )
}

const scorePanelStyle = css`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  top: 8.5%;
  right: 20.6%;
  min-width: 69%;
  height: 90%;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
`