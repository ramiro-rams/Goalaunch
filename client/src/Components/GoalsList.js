import { useState} from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
export default function GoalsList({goalsArray, setGoalsArray, goalSelectedIndex, setGoalSelectedIndex, windowWidth, editMode}){
  const [mouseOverTitleIndex, setMouseOverTitleIndex] = useState(-1)
  const [editingIndex, setEditingIndex] = useState(-1)
  const [initialTitle, setInitialTitle] = useState('') //the initial title of goal title being edited
  const navigate = useNavigate()
  const handleTitleClick = (index) => {
    setGoalSelectedIndex(index)
  }
  const handleMouseOver = (index) =>{
    setMouseOverTitleIndex(index)
  }
  const handleMouseLeave = () => {
    setMouseOverTitleIndex(-1)
  }
  const handleSubmit = async (e, index) => {
    e.preventDefault()
    if(goalsArray[index].goalName !== initialTitle && goalsArray[index].goalName){
      try{
        await axios.post('/editGoal', {_id: goalsArray[index]._id, goalName: goalsArray[index].goalName}, {withCredentials: true})
      }catch(e){
        navigate('/login')
      }
    }
    else{
      const newArray = [...goalsArray]
      newArray[index].goalName = initialTitle
      setGoalsArray(newArray)
    }
    setInitialTitle('')
    setEditingIndex(-1)
  }
  const handleChange = (e, index) => {
    const newArray = [...goalsArray]
    newArray[index].goalName = e.target.value
    setGoalsArray(newArray)
  }
  const handleDelete = async (index) => {
    const confirmed = window.confirm("Are you sure you want to delete?")
    if(confirmed){
      try{
        await axios.post('deleteGoal', {
          _id: goalsArray[index]._id
        }, {withCredentials: true})
      }catch(err){
        navigate('/login')
      }
      const newArray = goalsArray.filter((obj, i) => index !== i)
      setGoalsArray(newArray)
    }
    setInitialTitle('')
    setEditingIndex(-1)
    if(goalSelectedIndex === index){
      const goalsPanel = document.querySelector('.goalsSidePanel');
      const pomodoroTimerPanel = document.querySelector('.pomodoroTimer')
      setGoalSelectedIndex(-1)
      if(goalsPanel)
        goalsPanel.classList.remove('left');
      if(pomodoroTimerPanel)
        pomodoroTimerPanel.classList.remove('right')
    }
    else if(goalSelectedIndex > index){
      setGoalSelectedIndex(prev => prev - 1)
    }
  }
  const handleEditTitleClick = (index, goalName) => {
    setInitialTitle(goalName)
    setEditingIndex(index)
  }
  return(
    goalsArray.map((obj, index) =>
      {
        return(
          <div className="goalTitleContainer" key={`goal${index}`}>
            {editingIndex === index ? 
              (
                <form className="sidePanelTitleEditForm" onSubmit={(e)=>handleSubmit(e, index)}>
                  <input className="titleEditTextInput"autoFocus type="text" value={obj.goalName} onChange={(e)=>handleChange(e, index)}></input>
                  <button className="sidePanelDeleteButton" type="button" onClick={()=>handleDelete(index)}><img src="trash-bin-trash-svgrepo-com.svg" title="Delete" alt=""/></button>
                  {obj.goalName.length !== 0 && <button className="sidePanelEditDoneButton" type="submit"><img src="check-circle-svgrepo-com.svg" alt=""/></button>}
                </form>
              ) : (
              <>
                <button className={`goalTitle ${goalSelectedIndex === index || mouseOverTitleIndex === index ? 'goalSelected' : ''}`} onMouseOver={() => handleMouseOver(index)} onMouseLeave={handleMouseLeave} onClick={()=>{handleTitleClick(index)}}>{obj.goalName}</button>
                {editMode && <button className="editTitleButton"onClick={()=>handleEditTitleClick(index, obj.goalName)}><img src="pen-new-square-svgrepo-com.svg" alt=""/></button>}
              </>)
            }
          </div>
        )
      }
    )
  )
} 