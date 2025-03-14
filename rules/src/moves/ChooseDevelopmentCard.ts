import GameState from '../GameState'
import GameView from '../GameView'
import EmpireName from '../material/EmpireName'
import {isPlayerView} from '../typeguards'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

export default interface ChooseDevelopmentCard {
  type: typeof MoveType.ChooseDevelopmentCard
  playerId: EmpireName
  card: number
}

export type ChooseDevelopmentCardView = Omit<ChooseDevelopmentCard, 'card'>

export const chooseDevelopmentCardMove = (playerId: EmpireName, card: number): ChooseDevelopmentCard => ({
  type: MoveType.ChooseDevelopmentCard, playerId, card
})

export function chooseDevelopmentCard(state: GameState | GameView, move: ChooseDevelopmentCard) {
  const player = state.players.find(player => player.empire === move.playerId)
  if (!player) return console.error('Cannot apply', move, 'on', state, ': player id is missing')
  if (isPlayerView(player)) return console.error('Cannot apply', move, 'on', state, ': chosen card should be hidden to the other players')
  player.chosenCard = move.card
}

export function chooseDevelopmentCardInView(state: GameView, move: ChooseDevelopmentCard | ChooseDevelopmentCardView) {
  if (isChosenDevelopmentCardVisible(move)) {
    chooseDevelopmentCard(state, move)
  } else {
    chooseSecretDevelopmentCard(state, move)
  }
}

export function chooseSecretDevelopmentCard(state: GameView, move: ChooseDevelopmentCardView) {
  const player = state.players.find(player => player.empire === move.playerId)
  if (!player) return console.error('Cannot apply', move, 'on', state, ': player id is missing')
  if (!isPlayerView(player)) return console.error('Cannot apply', move, 'on', state, ': chosen card should not be hidden to the player choosing it')
  player.ready = true
}

export function isChooseDevelopmentCard(move: Move | MoveView): move is (ChooseDevelopmentCard | ChooseDevelopmentCardView) {
  return move.type === MoveType.ChooseDevelopmentCard
}

export function isChosenDevelopmentCardVisible(move: ChooseDevelopmentCard | ChooseDevelopmentCardView): move is ChooseDevelopmentCard {
  return (move as ChooseDevelopmentCard).card !== undefined
}