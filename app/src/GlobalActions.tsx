/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {getLegalMoves} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import Character from '@gamepark/its-a-wonderful-world/material/Character'
import Move from '@gamepark/its-a-wonderful-world/moves/Move'
import {isReceiveCharacter, receiveCharacterMove} from '@gamepark/its-a-wonderful-world/moves/ReceiveCharacter'
import {isTellYouAreReady} from '@gamepark/its-a-wonderful-world/moves/TellYouAreReady'
import Player from '@gamepark/its-a-wonderful-world/Player'
import {usePlay} from '@gamepark/react-client'
import {useTranslation} from 'react-i18next'
import CharacterToken from './material/characters/CharacterToken'
import Button from './util/Button'
import {glow, screenRatio} from './util/Styles'

type Props = {
  game: GameView
  player: Player
  validate: () => void
}

export default function GlobalActions({game, player, validate}: Props) {
  const {t} = useTranslation()
  const play = usePlay<Move>()
  const legalMoves = getLegalMoves(player, game.phase)
  const canValidate = legalMoves.some(isTellYouAreReady)
  const chooseCharacter = legalMoves.some(isReceiveCharacter)
  return (<>
    {canValidate && <Button onClick={validate} css={validateButtonStyle}>{t('Validate')}</Button>}
    {chooseCharacter && <>
      <CharacterToken character={Character.Financier} onClick={() => play(receiveCharacterMove(player.empire, Character.Financier))}
                      css={[characterTokenStyle, financierTokenPosition]}/>
      <CharacterToken character={Character.General} onClick={() => play(receiveCharacterMove(player.empire, Character.General))}
                      css={[characterTokenStyle, generalTokenPosition]}/>
    </>}
  </>)
}

const validateButtonStyle = css`
  position: absolute;
  font-size: 5em;
  top: 10%;
  left: 50%;
`

const characterTokenStyle = css`
  position: absolute;
  top: 9%;
  width: ${10 / screenRatio}%;
  height: 10%;
  cursor: pointer;
  animation: ${glow('cyan', '0', '1em')} 1s ease-in-out infinite alternate;

  &:hover, &:active {
    transform: scale(1.1);
  }
`

const financierTokenPosition = css`
  left: 43%;
`

const generalTokenPosition = css`
  left: 51%;
`