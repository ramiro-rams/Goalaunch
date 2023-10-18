import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export default function GoalNotes({goalsArray, setGoalsArray, goalIndex, authenticated}){
    let value = ""
    if(goalsArray){
        value = goalsArray[goalIndex].notes
    }
    const handleInputChange = (event) => {
        const newGoalsArray = [...goalsArray]
        newGoalsArray[goalIndex].notes = event.target.value
        setGoalsArray(newGoalsArray)
    };
    const handleSubmit = async () => {
        if(authenticated){
            try{
                await axios.post('/goals/setNotes', {_id: goalsArray[goalIndex]._id, notes: value}, {withCredentials: true})
            }
            catch(err){
            }
        }
    }
    return (
        <div className='goalNotes'>
            <h2>Text Editor</h2>
            <textarea
                value={value}
                onChange={handleInputChange}
                rows="8"
                cols="50"
                placeholder="Type your notes here..."
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}