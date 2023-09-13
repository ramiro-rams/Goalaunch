import PanelSelectionButtons from "./PanelSelectionButtons"
import {useState, useEffect} from 'react'
import sound from '../bell-ring.mp3'
export default function PomodoroTimer({panelSelected, setPanelSelected}){
const [longBreakInterval, setLongBreakInterval] = useState(5);
const [intervalCount, setIntervalCount] = useState(1);
const [timeIsPaused, setTimeIsPaused] = useState(true)
const [workTime, setWorkTime] = useState(25)           //
const [breakTime, setBreakTime] = useState(5)          // time is in minutes
const [longBreakTime, setLongBreakTime] = useState(15) //
const [timeRemaining, setTimeRemaining] = useState(workTime * 60) //timeRemaining is in seconds
const [timeIsAtStart, setTimeIsAtStart] = useState(true)
const [timeState, setTimeState] = useState('work') //either 'work', 'break' or 'longBreak'
const [hoveringInput, setHoveringInput] = useState(null) //either null, 'work', 'break', 'long break', or 'interval

useEffect(()=>{
    const workTime = localStorage.getItem('workTime')
    const breakTime = localStorage.getItem('breakTime')
    const longBreakTime = localStorage.getItem('longBreakTime')
    const longBreakInterval = localStorage.getItem('longBreakInterval')
    if(workTime === null)
        localStorage.setItem('workTime', 25)
    else{
        setWorkTime(workTime)
        setTimeRemaining(Math.round(workTime * 60))
    }
    if(breakTime === null)
        localStorage.setItem('breakTime', 5)
    else
        setBreakTime(breakTime)
    if(longBreakTime === null)
        localStorage.setItem('longBreakTime', 15)
    else
        setLongBreakTime(longBreakTime)
    if(longBreakInterval === null)
        localStorage.setItem('longBreakInterval', 5)
    else
        setLongBreakInterval(longBreakInterval)
},[])


let initialTime = 0; // in seconds
switch(timeState){
    case 'work':
        initialTime = Math.round(workTime * 60)
        break
    case 'break':
        initialTime = Math.round(breakTime * 60)
        break
    case 'longBreak':
        initialTime = Math.round(longBreakTime * 60)
        break
    default:
        initialTime = 0
        break
}
let indicatorIndicationStyle = {
    strokeDashoffset: -502.65 * (timeRemaining / initialTime)
}

if(initialTime === 0){
    indicatorIndicationStyle.strokeDashoffset = -502.65
}

useEffect(() => {
    if(timeRemaining === 0 && !timeIsPaused){
        playSound()
    }
    const interval = setInterval(() => {
        switch (timeState) {
            case 'work':
                if(timeRemaining > 0){
                    if(!timeIsPaused){
                        if(timeRemaining < 1)
                            setTimeRemaining(0)
                        else
                            setTimeRemaining(timeRemaining - 1)
                    }
                }
                else{
                    if(!timeIsPaused){
                        setTimeRemaining(Math.round(breakTime * 60))
                        setTimeState('break')
                        setTimeIsPaused('true')
                        setTimeIsAtStart(true)
                    }
                }
                break
            case 'break':
                if(timeRemaining > 0){
                    if(!timeIsPaused){
                        if(timeRemaining < 1)
                            setTimeRemaining(0)
                        else
                            setTimeRemaining(timeRemaining - 1)
                    }
                }
                else{
                    if(intervalCount >= longBreakInterval){
                        if(!timeIsPaused){
                            setTimeState('longBreak')
                            setTimeIsPaused('true')
                            setTimeRemaining(Math.round(longBreakTime * 60))
                            setTimeIsAtStart(true)
                        }
                    }
                    else{
                        if(!timeIsPaused){
                            setTimeState('work')
                            setTimeIsPaused('true')
                            setTimeRemaining(Math.round(workTime * 60))
                            setIntervalCount(intervalCount + 1)
                        }
                    }
                }
                break
            case 'longBreak':
                if(timeRemaining > 0){
                    if(!timeIsPaused){
                        if(timeRemaining < 1)
                            setTimeRemaining(0)
                        else
                            setTimeRemaining(timeRemaining - 1)
                    }
                }
                else{
                    setTimeState('work')
                    setTimeIsPaused('true')
                    setTimeRemaining(Math.round(workTime * 60))
                    setTimeIsAtStart(true)
                    setIntervalCount(1)
                }
                break
            default:
                break
        }
    }, 1000)

    return () => clearInterval(interval)
}, [timeRemaining, timeIsPaused])

const playSound = () => {
    new Audio(sound).play()
}

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
const handleTimeReset = () => {
    setTimeRemaining(initialTime)
    setTimeIsPaused(true)
    setTimeIsAtStart(true)
}

const handleTimeStart = () => {
    setTimeIsPaused(false)
    setTimeIsAtStart(false)
}

const handleTimePause = () => {
    setTimeIsPaused(true)
}

const handleTimeSkip = () => {
    setTimeIsAtStart(true)
    setTimeIsPaused(true)
    switch(timeState){
        case 'work':
            setTimeRemaining(Math.round(breakTime * 60))
            setTimeState('break')
            break
        case 'break':
            if(intervalCount >= longBreakInterval){
                setTimeRemaining(Math.round(longBreakTime * 60))
                setTimeState('longBreak')
            }
            else{
                setTimeRemaining(Math.round(workTime * 60))
                setTimeState('work')
                setIntervalCount(intervalCount + 1)
            }
            break
        case 'longBreak':
            setTimeRemaining(Math.round(workTime * 60))
            setTimeState('work')
            setIntervalCount(1)
            break
        default:
            break
    }
}

const handleWorkTimeChange = (e) => {
    if(e.target.value >= 0){
        const time = e.target.value
        if(time === '')
            setWorkTime(0)
        setWorkTime(time)
        localStorage.setItem('workTime', time)
        if(timeState === 'work')
            setTimeRemaining(Math.round(time * 60))
    }
}

const handleBreakTimeChange = (e) => {
    const time = e.target.value
    if(time === '')
        setBreakTime(0)
    setBreakTime(time)
    localStorage.setItem('breakTime', time)
    if(timeState === 'break')
        setTimeRemaining(Math.round(time * 60))
}
const handleLongBreakTimeChange = (e) => {
    const time = e.target.value
    if(time === '')
        setLongBreakTime(0)
    setLongBreakTime(time)
    localStorage.setItem('longBreakTime', time)
    if(timeState === 'longBreak')
        setTimeRemaining(Math.round(time * 60))
}

const handleLongBreakIntervalChange = (e) => {
    const value = e.target.value
    if(intervalCount > value)
        setIntervalCount(1)
    if(value % 1 === 0 && value >= 0){
        const interval = e.target.value
        if(interval === null){
            setLongBreakInterval(1)
        }
        else
            setLongBreakInterval(interval)
        localStorage.setItem('longBreakInterval', interval)
    }
}

const handleLongBreakIntervalBlur = () => {
    if(longBreakInterval === 0)
        setLongBreakInterval(1)
}
  return (
    <div className="pomodoroTimer">
        <PanelSelectionButtons panelSelected={panelSelected} setPanelSelected={setPanelSelected}/>
        <div className='timeIndicatorContainer'>
            <span className='timeText'>{formatTime(timeRemaining)}</span>
            <svg className='timeIndicator'>
                <circle className='indicatorTrack'/>
                <circle className='indicatorIndication' style={indicatorIndicationStyle}/>
            </svg>
        </div>
        <div className='timerControlIconsContainer'>
            <button onClick={handleTimeReset} className='timerControlIconButton'>
                <img className='timerControlIcon' src='restart-svgrepo-com.svg' alt=""/>
            </button>
            {timeIsPaused ? (<button onClick={handleTimeStart} className="timerControlIconButton">
                <img className="timerControlIcon" src='play-svgrepo-com.svg' alt=""/>
            </button>): (<button onClick={handleTimePause} className="timerControlIconButton">
                <img className="timerControlIcon" src='pause-svgrepo-com.svg' alt=""/>
            </button>)}
            
            <button onClick={handleTimeSkip} className='timerControlIconButton'>
                <img className="timerControlIcon" src='skip-next-svgrepo-com.svg' alt=""/>
            </button>
        </div>
        <span className='sessionsIndicator'> {intervalCount} of {longBreakInterval} sessions</span>
       
        <div className='timeSettingsContainer'>
            <div className='timerInputContainer workDurationInputContainer'>
            {hoveringInput === 'work' && !timeIsAtStart ? <span className='resetTimerMessage'>Reset timer</span> : <span>Work Duration</span>}
                <div className='numberInputContainer'>
                    <input className='numberInput' type='number' min="0" step="1" value={workTime} onChange={(e)=>handleWorkTimeChange(e)} onMouseOver={() => {setHoveringInput('work')}} onMouseLeave={()=>{setHoveringInput(null)}} disabled={!timeIsAtStart}></input>
                </div>
            </div>
            <div className='timerInputContainer breakDurationInputContainer'>
            {hoveringInput === 'break' && !timeIsAtStart ? <span className='resetTimerMessage'>Reset timer</span> : <span>Break Duration</span>}
                <div className='numberInputContainer '>
                    <input  className='numberInput' type='number' min="0" step="1" value={breakTime ? breakTime : ''} onChange={(e)=>handleBreakTimeChange(e)} onMouseOver={() => {setHoveringInput('break')}} onMouseLeave={()=>{setHoveringInput(null)}} disabled={!timeIsAtStart}></input>
                </div>
            </div>
            <div className='timerInputContainer longBreakDurationInputContainer'>
            {hoveringInput === 'long break' && !timeIsAtStart ? <span className='resetTimerMessage'>Reset timer</span> : <span>Long Break Duration</span>}
                <div className='numberInputContainer'>
                    <input className='numberInput' type='number' min="0" step="1" value={longBreakTime ? longBreakTime : ''} onChange={(e)=>handleLongBreakTimeChange(e)} onMouseOver={() => {setHoveringInput('long break')}} onMouseLeave={()=>{setHoveringInput(null)}} disabled={!timeIsAtStart}></input>
                </div>
            </div>
            <div className='timerInputContainer longBreakIntervalInputContainer'>
            {hoveringInput === 'interval' && !timeIsAtStart ? <span className='resetTimerMessage'>Reset timer</span> : <span>Long Break Interval</span>}
                <div className='numberInputContainer'>
                    <input className='numberInput' type='number' min="1" step="1" value={longBreakInterval ? longBreakInterval : ''} onChange={(e)=>handleLongBreakIntervalChange(e)} onMouseOver={() => {setHoveringInput('interval')}} onMouseLeave={()=>{setHoveringInput(null)}} disabled={!timeIsAtStart} onBlur={handleLongBreakIntervalBlur}></input>
                </div>
            </div>
        </div>
    </div>
  );
};