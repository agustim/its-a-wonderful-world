import {ComboVictoryPoints} from '../Scoring'
import EmpireSide from './EmpireSide'
import Resource from './Resource'

type Empire = {
  [key in EmpireSide]: {
    victoryPoints?: ComboVictoryPoints
    production: { [key in Resource]?: number }
    krystallium?: number
  }
}

export default Empire