import GameView from '@gamepark/its-a-wonderful-world/GameView'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import Resource from '@gamepark/its-a-wonderful-world/material/Resource'
import {isCompleteConstruction} from '@gamepark/its-a-wonderful-world/moves/CompleteConstruction'
import MoveType from '@gamepark/its-a-wonderful-world/moves/MoveType'
import MoveView from '@gamepark/its-a-wonderful-world/moves/MoveView'
import {isPlaceResourceOnConstruction} from '@gamepark/its-a-wonderful-world/moves/PlaceResource'
import {Animations} from '@gamepark/react-client'
import AnimationContext from '@gamepark/react-client/dist/animations/AnimationContext'

export default class ItsAWonderfulAnimations extends Animations<GameView, MoveView, EmpireName> {
  override getPreDuration(move: MoveView, {action, state, playerId: currentPlayerId}: AnimationContext<GameView, MoveView, EmpireName>) {
    switch (move.type) {
      case MoveType.ChooseDevelopmentCard: {
        const displayedPlayer = state.displayedPlayer ?? currentPlayerId ?? state.players[0].empire
        return move.playerId === displayedPlayer ? 0.5 : 0
      }
      case MoveType.RevealChosenCards:
        return (1 + (currentPlayerId ? state.players.length - 2 : state.players.length - 1) * 0.7) * 2.5
      case MoveType.PassCards:
        return 3
      case MoveType.SlateForConstruction:
      case MoveType.Recycle:
      case MoveType.CompleteConstruction: {
        const displayedPlayer = state.displayedPlayer ?? currentPlayerId ?? state.players[0].empire
        return move.playerId === displayedPlayer ? 0.3 : 0
      }
      case MoveType.PlaceResource: {
        const displayedPlayer = state.displayedPlayer ?? currentPlayerId ?? state.players[0].empire
        if (move.playerId !== displayedPlayer) {
          return 0
        }
        if (move.playerId === currentPlayerId) {
          if (isPlaceResourceOnConstruction(move) || move.resource === Resource.Krystallium) {
            return 0
          }
        }
        return 0.2
      }
      case MoveType.ReceiveCharacter:
        if (action.consequences.some(isCompleteConstruction)) {
          const displayedPlayer = state.displayedPlayer ?? currentPlayerId ?? state.players[0].empire
          return move.playerId === displayedPlayer ? 0.5 : 0
        } else {
          return 1
        }
      default:
        return 0
    }
  }

  override getUndoPostDuration(move: MoveView): number {
    switch (move.type) {
      case MoveType.ChooseDevelopmentCard:
      case MoveType.SlateForConstruction:
        return 0.3
      default:
        return 0
    }
  }
}
