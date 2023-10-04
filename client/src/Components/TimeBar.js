import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TimeBar = ({barData, setGoalsArray}) => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate()
  const handleStartTimeChange = async (e) => {
    const startTime = new Date(e.target.value);
    setGoalsArray(prev=>{
      const newGoalsArray = [...prev]
      newGoalsArray[barData.goalIndex].startTime = startTime
      return newGoalsArray
    })
    try{
      await axios.post('/goals/insertStartTime', {
        _id: barData.goalId,
        startTime: startTime
      }, {withCredentials: true});
    }catch(err){
      navigate('/login')
    }
  };

  const handleEndTimeChange = async (e) => {
    const endTime = new Date(e.target.value);
    setGoalsArray(prev=>{
      const newGoalsArray = [...prev]
      newGoalsArray[barData.goalIndex].endTime = endTime
      return newGoalsArray
    })
    try{
      await axios.post('/goals/insertEndTime', {
        _id: barData.goalId,
        endTime: endTime
      }, {withCredentials: true});
    }catch(err){
      navigate('/login')
    }
    
  };

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const startDate = new Date(barData.startTime);
      const endDate = new Date(barData.endTime);
      const totalDuration = endDate.getTime() - startDate.getTime();
      const elapsedDuration = now.getTime() - startDate.getTime();
      const calculatedProgress = (elapsedDuration / totalDuration) * 100;
      setProgress(calculatedProgress);
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 1000); // Update progress every second
    return () => clearInterval(interval);
  }, [barData.startTime, barData.endTime]);

  function convertToLocaleString(date) {
    const timezoneOffset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);
    return adjustedDate.toISOString().slice(0, -8);
  }

  return (
    <div className='timeBar'>
      <label>
        Start Time:
        <input
          type="datetime-local"
          value={convertToLocaleString(new Date(barData.startTime))}
          onChange={(e) => handleStartTimeChange(e)}
        />
      </label>
      <br />
      <label>
        Deadline:
        <input
          type="datetime-local"
          value={convertToLocaleString(new Date(barData.endTime))}
          onChange={(e) => handleEndTimeChange(e)}
        />
      </label>
      <p>{progress === Infinity ? '' : `${progress.toFixed(2)} %`}</p>
      <progress value={progress} max={100}></progress>
    </div>
  );
};

export default TimeBar;