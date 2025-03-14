/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import {getPlayerName} from '@gamepark/its-a-wonderful-world/Options'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {ComboVictoryPoints, getComboValue, getScoringDetails} from '@gamepark/its-a-wonderful-world/Scoring'
import {Avatar, GamePoints, PlayerTimer, usePlayer} from '@gamepark/react-client'
import {SpeechBubbleDirection} from '@gamepark/react-client/dist/Avatar'
import {Picture} from '@gamepark/react-components'
import {HTMLAttributes, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {empireAvatar} from '../material/empires/EmpireCard'
import {empireBackground, gameOverDelay} from '../util/Styles'
import PlayerConstructions from './PlayerConstructions'
import PlayerResourceProduction from './PlayerResourceProduction'
import VictoryPointsMultiplier from './VictoryPointsMultiplier'

type Props = {
  player: Player | PlayerView
  small: boolean
  gameOver: boolean
} & HTMLAttributes<HTMLDivElement>

export default function PlayerPanel({player, small, gameOver, ...props}: Props) {
  const {t} = useTranslation()
  const playerInfo = usePlayer<EmpireName>(player.empire)
  const bestCombo = useMemo(() => !small && getBestVictoryPointsCombo(player), [player])
  return (
    <div css={style(player.empire)} {...props}>
      {playerInfo?.avatar ?
        <Avatar playerId={player.empire} css={avatarStyle} speechBubbleProps={{direction: SpeechBubbleDirection.BOTTOM_LEFT}}/> :
        <Picture alt={t('Player avatar')} src={empireAvatar[player.empire]} css={fallbackAvatarStyle}/>
      }
      <h3 css={titleStyle}>
        <span css={[nameStyle, player.eliminated && eliminatedStyle]}>{playerInfo?.name || getPlayerName(player.empire, t)}</span>
        {!gameOver && <PlayerTimer playerId={player.empire}/>}
        <GamePoints playerId={player.empire} suspense={gameOverDelay} css={css`flex-shrink: 0`}/>
      </h3>
      <PlayerResourceProduction player={player} small={small}/>
      {bestCombo && <VictoryPointsMultiplier combo={bestCombo} css={victoryPointsMultiplierStyle}/>}
      <PlayerConstructions player={player}/>
    </div>
  )
}

const style = (empire: EmpireName) => css`
  position: absolute;
  z-index: 1;
  background-image: url(${empireBackground[empire]});
  background-size: cover;
  background-position: center;
  border-radius: 5px;

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
  }
`

const avatarStyle = css`
  position: absolute;
  width: 5em;
  height: 5em;
  top: 0.75em;
  left: 1em;
`

const fallbackAvatarStyle = css`
  position: absolute;
  width: 5em;
  height: 5em;
  top: 0.75em;
  left: 1em;
  border: 0.1em solid white;
  border-radius: 100%; 
`

const titleStyle = css`
  color: #333333;
  position: absolute;
  top: 0.5em;
  left: 22%;
  right: 3%;
  margin: 0;
  font-size: 2.9em;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
`

const nameStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const eliminatedStyle = css`
  text-decoration: line-through;
`

const victoryPointsMultiplierStyle = css`
  position: absolute;
  top: 38%;
  left: 2%;
  height: 20%;
  & img {
    width: 2.4em;
    height: 2.4em;
  }
`

function getBestVictoryPointsCombo(player: Player | PlayerView): ComboVictoryPoints | undefined {
  const scoringDetails = getScoringDetails(player, true)
  let bestCombo: {combo: ComboVictoryPoints, score: number} | undefined = undefined
  for (const comboVictoryPoint of scoringDetails.comboVictoryPoints) {
    const score = getComboValue(comboVictoryPoint, scoringDetails.scoreMultipliers)
    if (!bestCombo || bestCombo.score < score) {
      bestCombo = {combo: comboVictoryPoint, score}
    }
  }
  return bestCombo?.combo
}
