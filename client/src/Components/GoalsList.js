import { useState} from "react"
export default function GoalsList({goalsArray, goalSelectedIndex, setGoalSelectedIndex}){
  const [mouseOverTitleIndex, setMouseOverTitleIndex] = useState(-1)
  const handleTitleClick = (index) => {
    setGoalSelectedIndex(index)
  }
  const handleMouseOver = (index) =>{
    setMouseOverTitleIndex(index)
  }
  const handleMouseLeave = () => {
    setMouseOverTitleIndex(-1)
  }
  return(
    goalsArray.map((obj, index) =>
      {
        return(
          <div className="goalTitleContainer" key={`goal${index}`}>
            <button className={`goalTitle ${goalSelectedIndex === index || mouseOverTitleIndex === index ? 'goalSelected' : ''}`} onMouseOver={() => handleMouseOver(index)} onMouseLeave={handleMouseLeave} onClick={()=>{handleTitleClick(index)}}>{obj.goalName}</button>
          </div>
        )
      }
    )
  )
} 