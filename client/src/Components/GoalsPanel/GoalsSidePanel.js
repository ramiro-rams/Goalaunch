import NewGoalForm from "./NewGoalForm"
import GoalsList from "./GoalsList"
import PanelSelectionButtons from "../PanelSelectionButtons"
export default function GoalsSidePanel({
  goalsArray,
  setGoalsArray,
  setGoalSelectedIndex,
  goalSelectedIndex,
  panelSelected,
  setPanelSelected,
  authenticated
}) {
  return (
    <div className="goalsSidePanel">
      <PanelSelectionButtons panelSelected={panelSelected} setPanelSelected={setPanelSelected} />
      <h1 className="goalsHeader">Your Goals</h1>
      <NewGoalForm goalsArray={goalsArray} setGoalsArray={setGoalsArray} authenticated={authenticated} />
      <GoalsList goalsArray={goalsArray}
        goalSelectedIndex={goalSelectedIndex}
        setGoalSelectedIndex={setGoalSelectedIndex}
      />
    </div>
  )
}
