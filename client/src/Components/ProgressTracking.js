import ProgressBar from "./ProgressBar";
import TimeBar from "./TimeBar";
export default function ProgressTracking({goalsArray, setGoalsArray, goalIndex}){

    return(
        <div className="progressTracking">
            <ProgressBar barData={{progressPoints: goalsArray[goalIndex].progressPoints, 
                                progressPointsCap: goalsArray[goalIndex].progressPointsCap,
                                goalIndex: goalIndex,
                                goalId: goalsArray[goalIndex]._id}}
                        setGoalsArray={setGoalsArray}/>
            <TimeBar barData={{startTime: goalsArray[goalIndex].startTime,
                                endTime: goalsArray[goalIndex].endTime,
                                goalIndex: goalIndex,
                                goalId: goalsArray[goalIndex]._id}}
                    setGoalsArray={setGoalsArray}/>
        </div>
    )
}