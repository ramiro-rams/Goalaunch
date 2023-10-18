import './Styles/App.css'
import './Styles/SidePanel.css'
import './Styles/DetailedGoalView.css'
import './Styles/PomodoroTimer.css'
import './Styles/CalendarCustom.css'
// import 'react-calendar/dist/Calendar.css' //calendar original styling
import './Styles/PanelSelectionButtons.css'
import './Styles/LoginPage.css'
import './Styles/RegisterPage.css'
import './Styles/GoalNotes.css'
import './Styles/IntroductionPage.css'
import './Styles/TopNavBar.css'
import UserGoalsPage from './Components/UserGoalsPage'
import RegisterPage from './Components/RegisterPage'
import LoginPage from './Components/LoginPage'
import IntroductionPage from './Components/IntroductionPage'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<IntroductionPage/>}/>
      <Route path="/goals" element={<UserGoalsPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
    </Routes>
  );
}

export default App;
