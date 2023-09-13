export default function PanelSelectionButtons({panelSelected, setPanelSelected}){

  return(
    <div className="panelSelectionButtons">
      <button className={panelSelected === 'goals' ? 'tabSelected' : 'tabNotSelected'}onClick={()=>setPanelSelected('goals')}>Goals</button>
      <button className={panelSelected === 'timer' ? 'tabSelected' : 'tabNotSelected'}onClick={()=>setPanelSelected('timer')}>Timer</button>
    </div>
  )
}