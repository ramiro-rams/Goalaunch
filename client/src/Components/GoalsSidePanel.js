import NewGoalForm from "./NewGoalForm"
import GoalsList from "./GoalsList"
import PanelSelectionButtons from "./PanelSelectionButtons"
import { useState, useEffect } from "react"
export default function GoalsSidePanel({goalsArray,
                                        setGoalsArray,
                                        setGoalSelectedIndex,
                                        goalSelectedIndex,
                                        panelSelected,
                                        setPanelSelected,
                                        windowWidth}){
  const [editMode, setEditMode] = useState(false)

  useEffect(()=>{
    if(goalsArray.length === 0){
      setEditMode(false)
    }
  }, [goalsArray])
  return(
    <div className="goalsSidePanel">
      <PanelSelectionButtons panelSelected={panelSelected} setPanelSelected={setPanelSelected}/>
      <h1 className="goalsHeader">Your Goals</h1>
      {editMode ?(
        <>
          <button className="leftArrowButton" onClick={() => setEditMode(false)}><img src="arrow-left-svgrepo-com.svg" alt="blue left arrow" title="back"/></button>
          <NewGoalForm goalsArray={goalsArray} setGoalsArray={setGoalsArray}/>
        </>
        ) : (
        <>
          {goalsArray.length === 0 && <NewGoalForm goalsArray={goalsArray} setGoalsArray={setGoalsArray}/>}
          {goalsArray.length !== 0 && <button className="editButton" onClick={()=>setEditMode(true)}><img src="pen-new-square-svgrepo-com.svg" alt="edit icon" title="edit"/></button>}
        </>
        )}
      <GoalsList goalsArray={goalsArray} 
                 setGoalsArray={setGoalsArray}
                 goalSelectedIndex={goalSelectedIndex} 
                 setGoalSelectedIndex={setGoalSelectedIndex}
                 windowWidth={windowWidth}
                 editMode={editMode}/>
    </div>
  )
}
