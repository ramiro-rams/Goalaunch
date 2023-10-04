import NewGoalForm from "./NewGoalForm"
import GoalsList from "./GoalsList"
import PanelSelectionButtons from "./PanelSelectionButtons"
export default function GoalsSidePanel({goalsArray,
                                        setGoalsArray,
                                        setGoalSelectedIndex,
                                        goalSelectedIndex,
                                        panelSelected,
                                        setPanelSelected,
                                      }){
  return(
    <div className="goalsSidePanel">
      <PanelSelectionButtons panelSelected={panelSelected} setPanelSelected={setPanelSelected}/>
      <h1 className="goalsHeader">Your Goals</h1>
      <NewGoalForm goalsArray={goalsArray} setGoalsArray={setGoalsArray}/>
      <GoalsList goalsArray={goalsArray} 
                 goalSelectedIndex={goalSelectedIndex} 
                 setGoalSelectedIndex={setGoalSelectedIndex}
      />
    </div>
  )
}
