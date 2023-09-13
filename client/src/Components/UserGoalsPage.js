import GoalsSidePanel from "./GoalsSidePanel"
import DetailedGoalView from "./DetailedGoalView"
import PomodoroTimer from "./PomodoroTimer"
import LogoutButton from "./LogoutButton"
import { useEffect, useState } from "react"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

export default function UserGoalsPage(){
  const [goalsArray, setGoalsArray] = useState([])
  const [goalSelectedIndex, setGoalSelectedIndex] = useState(-1)
  const [panelSelected, setPanelSelected] = useState('goals') // either 'goals', 'timer' or null
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const navigate = useNavigate()
  const initialDate = new Date()
  const deadLine = new Date()
  initialDate.setDate(1)
  deadLine.setDate(22)

  useEffect(()=>{
    let goalsPanel = document.querySelector('.goalsSidePanel')
    let pomodoroTimer = document.querySelector('.pomodoroTimer')
    if(goalsPanel && pomodoroTimer){
      if(windowWidth > 620 && goalSelectedIndex > -1){
        goalsPanel.classList.add('left')
        pomodoroTimer.classList.add('right')
      }
      else if(windowWidth <= 620){
        goalsPanel.classList.remove('left')
        pomodoroTimer.classList.remove('right')
      }
    }
    
  },[windowWidth, goalSelectedIndex])
  function handleResize(){
    setWindowWidth(window.innerWidth)
    const detailedGoalView = document.querySelector('.detailedGoalView')
    const goalsSidePanel = document.querySelector('.goalsSidePanel')
    if(detailedGoalView && goalsSidePanel){
      detailedGoalView.style.transition = 'none'
      goalsSidePanel.style.transition = 'none'
      setTimeout(()=>{
        detailedGoalView.style.transition = ''
        goalsSidePanel.style.transition = ''
      }, 0)
    }
  }

  useEffect(()=>{
    window.addEventListener('resize', handleResize)
    const fetch = async()=>{
      try{
        const response = await axios.get('/goalData', {withCredentials:true})
        setGoalsArray(response.data)
      }catch(err){
        navigate('/login')
      }
    }
    fetch()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return(
    <div>
      {!(windowWidth <= 620 && goalSelectedIndex > -1) && <LogoutButton/>}
      {(windowWidth > 1150 || goalSelectedIndex === -1) && (windowWidth > 620 || panelSelected === 'goals')  && <GoalsSidePanel
                      goalsArray={goalsArray}
                      setGoalsArray={setGoalsArray}
                      setGoalSelectedIndex={setGoalSelectedIndex}
                      goalSelectedIndex={goalSelectedIndex}
                      panelSelected={panelSelected}
                      setPanelSelected={setPanelSelected}
                      windowWidth={windowWidth}
      />}
      {goalSelectedIndex > -1 && goalsArray.length > 0 ? (
        <DetailedGoalView 
                          goalsArray={goalsArray}
                          goalIndex={goalSelectedIndex}
                          setGoalsArray={setGoalsArray}
                          setGoalSelectedIndex={setGoalSelectedIndex}
        />
      ):<></>}
      {(windowWidth > 620 || panelSelected === 'timer') && <PomodoroTimer panelSelected={panelSelected} setPanelSelected={setPanelSelected}/>
      }
    </div>
  )
}

