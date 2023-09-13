import axios from 'axios'
import { useNavigate } from 'react-router-dom';
export default function ProgressBar ({barData, setGoalsArray}) {
  const navigate = useNavigate()
    const handleIncrement = async () =>{
      if(barData.progressPoints < barData.progressPointsCap){
        setGoalsArray(prev => {
          const newArray = [...prev]
          newArray[barData.goalIndex] = {
            ...newArray[barData.goalIndex],
            progressPoints: newArray[barData.goalIndex].progressPoints + 1
          }
          return newArray
        })
        try{
          await axios.post('/incrementProgress', {_id: barData.goalId}, {withCredentials: true})
        } catch{
          navigate('/login')
        }
      }
    }
    const handleDecrement = async () => {
      if(barData.progressPoints > 0){
        setGoalsArray(prev => {
          const newArray = [...prev]
          newArray[barData.goalIndex] = {
            ...newArray[barData.goalIndex],
            progressPoints: newArray[barData.goalIndex].progressPoints - 1
          }
          return newArray
        })
        try{
          await axios.post('/decrementProgress', {_id: barData.goalId}, {withCredentials: true})
        } catch{
          navigate('/login')
        }
      }
    }
    return (
      <div className='progressBar'>  
          <p>{barData.progressPoints}/{barData.progressPointsCap}</p>
          <progress value={barData.progressPoints} max={barData.progressPointsCap}>Testing</progress>
          <button onClick={handleDecrement}>-</button>
          <button onClick={handleIncrement}>+</button>
      </div>
    );
  };