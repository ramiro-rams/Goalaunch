import axios from 'axios'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewGoalForm({goalsArray, setGoalsArray}){
    const [newGoal, setNewGoal] = useState('')
    const navigate = useNavigate()
    async function handleSubmit(event){
      event.preventDefault()
      if(newGoal.length > 0){
        var res 
        try{
          res = await axios.post('/insertGoal', {newGoal: newGoal}, {withCredentials: true})
        }catch{
          navigate('/login')
        }
        const startTime = new Date().toISOString()
        const endTime = new Date().toISOString()
        const newArray = [...goalsArray, {_id: res.data.insertedId, goalName: newGoal, progressPoints: 0, progressPointsCap: 100, dateAchievementStatuses: [], startTime: startTime, endTime: endTime}]
        setGoalsArray(newArray);
        setNewGoal('')
      }
    }
    return(
      <form className='sidePanelNewGoalForm' onSubmit={handleSubmit}>
        <input type='text' placeholder='Type New Goal' value={newGoal} onChange={(event)=>{setNewGoal(event.target.value)}}/>
        {newGoal.length > 0 && <button type='submit'><img src='check-circle-svgrepo-com.svg'/></button>}
      </form>
    )
  }