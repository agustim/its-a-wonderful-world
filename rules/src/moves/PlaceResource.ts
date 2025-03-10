import GameState from '../GameState'
import GameView from '../GameView'
import EmpireName from '../material/EmpireName'
import Resource from '../material/Resource'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type PlaceResource = PlaceResourceOnEmpire | PlaceResourceOnConstruction

export default PlaceResource

export const placeResourceOnEmpireMove = (playerId: EmpireName, resource: Resource): PlaceResourceOnEmpire => ({
  type: MoveType.PlaceResource, playerId, resource
})

export const placeResourceOnConstructionMove = (playerId: EmpireName, resource: Resource, card: number, space: number): PlaceResourceOnConstruction => ({
  type: MoveType.PlaceResource, playerId, resource, card, space
})

export function isPlaceResource(move: Move | MoveView): move is PlaceResource {
  return move.type === MoveType.PlaceResource
}

export function placeResource(state: GameState | GameView, move: PlaceResource) {
  const player = state.players.find(player => player.empire === move.playerId)
  if (!player) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  const bonusIndex = player.bonuses.findIndex(bonus => bonus === move.resource)
  if (bonusIndex !== -1) {
    player.bonuses.splice(bonusIndex, 1)
  } else if (move.resource !== Resource.Krystallium) {
    player.availableResources.splice(player.availableResources.indexOf(move.resource), 1)
  } else {
    player.empireCardResources.splice(player.empireCardResources.indexOf(move.resource), 1)
  }
  if (isPlaceResourceOnConstruction(move)) {
    const construction = player.constructionArea.find(construction => construction.card === move.card)
    if (construction) {
      construction.costSpaces[move.space] = move.resource
    } else {
      console.error(`Expected ${move.card} to be in construction, but player is in unexpected state: ${JSON.stringify(player)}`)
    }
  } else {
    player.empireCardResources.push(move.resource)
  }
}

export interface PlaceResourceOnEmpire {
  type: typeof MoveType.PlaceResource
  playerId: EmpireName
  resource: Resource
}

export interface PlaceResourceOnConstruction {
  type: typeof MoveType.PlaceResource
  playerId: EmpireName
  resource: Resource
  card: number
  space: number
}

export function isPlaceResourceOnConstruction(move: Move | MoveView): move is PlaceResourceOnConstruction {
  if (!isPlaceResource(move)) {
    return false
  }
  return (move as PlaceResourceOnConstruction).card !== undefined && (move as PlaceResourceOnConstruction).space !== undefined
}