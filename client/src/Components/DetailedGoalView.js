import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import Calendar from "react-calendar";
import GoalNotes from './GoalNotes';

export default function DetailedGoalView({goalsArray, goalIndex, setGoalsArray, setGoalSelectedIndex, authenticated}) {
  const title = goalsArray[goalIndex].goalName
    const [initialTitle, setInitialTitle] = useState(goalsArray[goalIndex].goalName)
    const [tabSelected, setTabSelected] = useState('Calendar'); //either 'Calendar' or 'Notes'
    const [value, setValue] = useState(new Date())
    const [editingTitle, setEditingTitle] = useState(false)
    const titleFormRef = useRef(null)
    let statusesArray = []
    statusesArray = goalsArray[goalIndex].dateAchievementStatuses
    useEffect(() => {
      const handleClickOutsideForm = async (event) => {
        if(titleFormRef.current && !titleFormRef.current.contains(event.target)){
          const form = document.getElementById('goalTitleForm')
          if(form){
            form.requestSubmit()
          }
        }
      }
      document.addEventListener('mousedown', handleClickOutsideForm)
      return() => {
        document.removeEventListener('mousedown', handleClickOutsideForm)
      }
    }, [])
    const dateIsInArray = (array, date) =>{
      let index = null
      const isInArray = array.some((obj, i) => {
        const dateInObj = new Date(obj.fullDate)
        if(dateInObj.getFullYear() === date.getFullYear() &&
           dateInObj.getMonth() === date.getMonth() &&
           dateInObj.getDate() === date.getDate()){
          index = i
          return true
        }
        else {
          return false
        }
      })
      return {status: isInArray, index: index}
    }
    const handleChange = async (value) => {
      var checked, crossed = false;
      const dateInArray = dateIsInArray(statusesArray, value)
      const newStatusesArray = [...statusesArray]
      if(dateInArray.status === true){
        const dateIndex = dateInArray.index
        if(newStatusesArray[dateIndex].status === 'checked'){
          newStatusesArray[dateIndex] = {...newStatusesArray[dateIndex], status: 'crossed'}
          crossed = true;
        }
        else{
          newStatusesArray.splice(dateIndex, 1)
        }
      }
      else{
        newStatusesArray.push({fullDate: value, status: 'checked'})
        checked = true;
      }
      setGoalsArray(prev=>{
        const newGoalsArr = [...prev]
        newGoalsArr[goalIndex].dateAchievementStatuses = newStatusesArray
        return newGoalsArr
      })
      if(authenticated){
        if(checked){
          try{
            await axios.post('/goals/checkDateStatus', {
              _id: goalsArray[goalIndex]._id,
              date: value
            }, {withCredentials: true})
          }catch(err){
          }
        }
        else if(crossed){
          try{
            await axios.post('/goals/crossDateStatus', 
              {
                _id: goalsArray[goalIndex]._id,
                date: value
              }, 
              {
                withCredentials: true
              })
          }catch{
          }
        }
        else {
          try{
            await axios.post('/goals/clearDateStatus', {
              _id: goalsArray[goalIndex]._id,
              date: value
            }, {withCredentials: true})
          }catch{
          }
        }
        
      }
      setValue(value)
    }
  
    const setTileContent = (statusesArray ,date, view) => {
      const checkmark = <img className='tileCompletionStatus' alt='' src="icons8-checkmark-48.png"></img>
      const cross = <img className='tileCompletionStatus' alt="" src="icons8-cross-48.png"></img>
      const dateInArray = dateIsInArray(statusesArray, date)
      if(dateInArray.status){
        if(view === 'month' && statusesArray[dateInArray.index].status === 'checked'){
          return checkmark
        }
        else if(view === 'month' && statusesArray[dateInArray.index].status === 'crossed'){
          return cross
        }
      }
      else{
        return null
      }
    }
  
    const handleTabChange = (tab) => {
      setTabSelected(tab);
    };
    
    const handleCloseView = () => {
      setGoalSelectedIndex(-1)
      const goalsPanel = document.querySelector('.goalsSidePanel');
      const pomodoroTimerPanel = document.querySelector('.pomodoroTimer')
      if(goalsPanel)
        goalsPanel.classList.remove('left');
      if(pomodoroTimerPanel)
        pomodoroTimerPanel.classList.remove('right')
    }

    const handleDelete = async () => {
      const confirmed = window.confirm('Are you sure you want to delete?')
      if(confirmed){
        handleCloseView()
        const newArray = goalsArray.filter((obj, i) => goalIndex !== i)
        setGoalsArray(newArray)
        try{
          await axios.post('/goals/deleteGoal', {
            _id: goalsArray[goalIndex]._id
          }, {withCredentials: true})
        }catch(err){
        }
      }
    }
    const renderComponent = () => {
      switch (tabSelected) {
        case 'Calendar':
          return <Calendar  
                    onChange={(value, event)=>{
                      handleChange(value)
                    }}
                    value={value}
                    minDetail='year'
                    tileContent={({date, view}) => setTileContent(statusesArray, date, view)}
                    showNeighboringMonth={false}
                  />;
        case 'Notes':
          return <GoalNotes goalsArray={goalsArray} setGoalsArray={setGoalsArray} goalIndex={goalIndex}/>
        default:
          return null;
      }
    };
    const handleTitleSubmit = async (e) => {
      e.preventDefault()
      setEditingTitle(false)
      if(initialTitle !== title && title){
        try{
          await axios.post('/goals/editGoal', {_id: goalsArray[goalIndex]._id, goalName: title}, {withCredentials: true})
        }catch(e){
        }
        setInitialTitle(title)
      }
      else{
        const newArray = [...goalsArray]
        newArray[goalIndex].goalName = initialTitle
        setGoalsArray(newArray)
      }
    }
    const handleTitleClick = () => {
      setEditingTitle(true)
    }

    const handleTitleChange = (e) => {
      const newArray = [...goalsArray]
      newArray[goalIndex].goalName = e.target.value
      setGoalsArray(newArray)
    }
  
    return (
      <div className='detailedGoalView'>
        <button onClick={handleCloseView} className='close-detailedView-button'>X</button>
        {editingTitle ? (
        <form id='goalTitleForm' ref={titleFormRef} onSubmit={(e) => {handleTitleSubmit(e)}}>
          <input autoFocus type='text' value={goalsArray[goalIndex].goalName} onChange={(e) => handleTitleChange(e)}/>
          <button type='button' onClick={handleDelete}><img className='delete-goal-img' src='trash-bin-trash-svgrepo-com.svg' alt=''/></button>
          <button type='submit'><img className='save-goal-img' src='check-circle-svgrepo-com.svg' alt=''/></button>
        </form>
        ) : (
          <button className='detailedGoalViewTitleButton' onClick={handleTitleClick}>{goalsArray[goalIndex].goalName}</button>
        )}
        <div className='tabsBarr'>
          <button onClick={() => handleTabChange('Calendar')}>Calendar</button>
          <button onClick={() => handleTabChange('Notes')}>Notes</button>
        </div>
        {renderComponent()}
      </div>
    );
}