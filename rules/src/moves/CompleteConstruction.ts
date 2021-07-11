import GameState from '../GameState'
import GameView from '../GameView'
import {isConstructionBonus} from '../material/DevelopmentDetails'
import {getCardDetails} from '../material/Developments'
import EmpireName from '../material/EmpireName'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

export default interface CompleteConstruction {
  type: typeof MoveType.CompleteConstruction
  playerId: EmpireName
  card: number
}

export const completeConstructionMove = (playerId: EmpireName, card: number): CompleteConstruction => ({
  type: MoveType.CompleteConstruction, playerId, card
})

export function completeConstruction(state: GameState | GameView, move: CompleteConstruction) {
  const player = state.players.find(player => player.empire === move.playerId)
  if (!player) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  player.constructionArea = player.constructionArea.filter(construction => construction.card !== move.card)
  player.constructedDevelopments.push(move.card)
  const bonus = getCardDetails(move.card).constructionBonus
  if (bonus) {
    if (isConstructionBonus(bonus)) {
      player.bonuses.push(bonus)
    } else {
      Object.keys(bonus).filter(isConstructionBonus).forEach(bonusType => player.bonuses.push(...new Array(bonus[bonusType]).fill(bonusType)))
    }
  }
}

export function isCompleteConstruction(move: Move | MoveView): move is CompleteConstruction {
  return move.type === MoveType.CompleteConstruction
}