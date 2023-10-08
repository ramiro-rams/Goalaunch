import axios from 'axios'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewGoalForm({goalsArray, setGoalsArray, authenticated}){
    const [newGoal, setNewGoal] = useState('')
    async function handleSubmit(event){
      event.preventDefault()
      if(newGoal.length > 0){
        var userId
        if(authenticated){
          try{
            let res = await axios.post('/goals/insertGoal', {newGoal: newGoal}, {withCredentials: true})
            userId = res.data.insertedId
          }catch{
          }
        }
        else{
          userId = null
        }
        const newArray = [...goalsArray, {_id: userId, goalName: newGoal, dateAchievementStatuses: [], notes: ''}]
        console.log(userId)
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