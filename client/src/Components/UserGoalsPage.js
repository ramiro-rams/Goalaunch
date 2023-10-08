import GoalsSidePanel from "./GoalsSidePanel"
import DetailedGoalView from "./DetailedGoalView"
import PomodoroTimer from "./PomodoroTimer"
import TopNavBar from "./TopNavBar/TopNavBar"
import { useEffect, useState } from "react"
import axios from 'axios'

export default function UserGoalsPage(){
  const [goalsArray, setGoalsArray] = useState([])
  const [goalSelectedIndex, setGoalSelectedIndex] = useState(-1)
  const [panelSelected, setPanelSelected] = useState('goals') // either 'goals', 'timer' or null
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [authenticated, setAuthenticated] = useState(false)
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
    const storedGoals = JSON.parse(localStorage.getItem('goals'));
    if(storedGoals){
      setGoalsArray(storedGoals)
    }
    const fetch = async()=>{
      try{
        const response = await axios.get('/goals/goalData', {withCredentials:true})
        setGoalsArray(response.data)
        setAuthenticated(true)
      }catch(err){
        setAuthenticated(false)
      }
    }
    fetch()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(()=>{
    if(goalsArray.length > 0){
      localStorage.setItem('goals', JSON.stringify(goalsArray))
    }
  },[goalsArray])

  return(
    <div>
      <TopNavBar authenticated={authenticated} setAuthenticated={setAuthenticated}/>
      <div className="userGoalsPage">
        {(windowWidth > 1150 || goalSelectedIndex === -1) && (windowWidth > 620 || panelSelected === 'goals')  && <GoalsSidePanel
                        goalsArray={goalsArray}
                        setGoalsArray={setGoalsArray}
                        setGoalSelectedIndex={setGoalSelectedIndex}
                        goalSelectedIndex={goalSelectedIndex}
                        panelSelected={panelSelected}
                        setPanelSelected={setPanelSelected}
                        windowWidth={windowWidth}
                        authenticated={authenticated}
        />}
        {goalSelectedIndex > -1 && goalsArray.length > 0 ? (
          <DetailedGoalView 
                            goalsArray={goalsArray}
                            goalIndex={goalSelectedIndex}
                            setGoalsArray={setGoalsArray}
                            setGoalSelectedIndex={setGoalSelectedIndex}
                            authenticated={authenticated}
          />
        ):<></>}
        {(windowWidth > 620 || panelSelected === 'timer') && <PomodoroTimer panelSelected={panelSelected} setPanelSelected={setPanelSelected}/>
        }
      </div>
    </div>
  )
}

