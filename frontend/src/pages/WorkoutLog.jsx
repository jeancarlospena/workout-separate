import { useContext, useRef, useEffect, useState } from "react";
import { WorkoutContext } from "../context/WorkoutContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";

const WorkoutLog = () => {
  const { API } = useContext(UserContext);
  const navigate = useNavigate();
  const { allWorkouts, loadLogs } = useContext(WorkoutContext);
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [exerciseHtml, setExerciseHtml] = useState([]);
  const [selectedEx, setSelectedEx] = useState(1);
  const [selectedRep, setSelectedRep] = useState(1);
  const repsRef = useRef(0);
  const weightRef = useRef(0);
  const [workoutTracker, setWorkoutTracker] = useState({});

  const completedWorkout = () => {
    //  `CREATE TABLE IF NOT EXISTS workout_logs(
    // id SERIAL PRIMARY KEY,
    // user_id INT REFERENCES users(id) ON DELETE CASCADE,
    // workout_id INT REFERENCES workouts(id) ON DELETE SET NULL,
    // exercise_id INT REFERENCES exercises(id) ON DELETE SET NULL,
    // performed_at TIMESTAMP DEFAULT NOW(),
    // sets_completed INT,
    // reps_per_set INT[],
    // weight_per_set NUMERIC(5, 2)[],
    // )`
    const trackerData = { workoutTracker, workoutId: workout.id };
    API.post("/workout/log", trackerData)
      .then((response) => {
        loadLogs();
        navigate("/");
      })
      .catch((error) => {
        // console.log(error);
      });
    // console.log("completed workout");
    // console.log(workoutTracker);
    // console.log(workout.id);
  };

  useEffect(() => {
    if (allWorkouts) {
      for (const workout of allWorkouts) {
        if (workout.id === Number(id)) {
          workout.exercises.sort((a, b) => a.position - b.position);
          setWorkout(workout);
          const tempTracker = {};
          for (const [index, exercise] of workout.exercises.entries()) {
            tempTracker[index + 1] = {};
            tempTracker[index + 1].reps = [];
            tempTracker[index + 1].weight = [];
            tempTracker[index + 1].exerciseId = exercise.id;
          }
          setWorkoutTracker(tempTracker);
          break;
        }
      }
    }
  }, [allWorkouts]);

  useEffect(() => {
    if (workout) {
      exerciseHtmlGenerator(workout);
    }
  }, [selectedEx, selectedRep, workout]);

  const exerciseHtmlGenerator = (workout) => {
    const htmlArr = workout.exercises.map((exercise, ind) => {
      const buttonsHtml = [];
      for (let i = 1; i <= exercise.sets; i++) {
        const selected = ind + 1 === selectedEx && i === selectedRep;
        const completed =
          ind + 1 < selectedEx || (i < selectedRep && ind + 1 === selectedEx);
        buttonsHtml.push(
          <p
            key={`selected_rep_${ind}_${i}`}
            className={
              selected ? "selected-set" : completed ? "completed-set" : ""
            }
          >
            Set {i}
          </p>
        );
        // console.log(e);
      }

      return (
        <div key={"exercise_" + ind} className="ex-section">
          <p>
            {exercise.name}: {exercise.sets} sets of {exercise.reps}
          </p>
          <div className="ex-sets">{buttonsHtml}</div>
          {ind + 1 === selectedEx && (
            <div className="set-controls">
              <div className="sets-input-section">
                <div>
                  <div className="flex-display">
                    <label className="form-label " htmlFor="muscle-group">
                      Weight:
                    </label>
                    <input
                      defaultValue={0}
                      ref={weightRef}
                      // value={repsVal}
                      type="number"
                      // step={1}
                      // min={1}
                      // name=""
                      // id="1"
                    />
                  </div>
                  <img
                    onClick={() => changeWeightVal(5)}
                    className="chevron-btn"
                    src="../chevron.svg"
                    alt=""
                  />
                  <img
                    onClick={() => changeWeightVal(-5)}
                    className="chevron-btn down-chev"
                    src="../chevron.svg"
                    alt=""
                  />
                </div>
                <div>
                  <div className="flex-display">
                    <label className="form-label " htmlFor="muscle-group">
                      Reps:
                    </label>
                    <input
                      defaultValue={exercise.reps}
                      ref={repsRef}
                      // value={repsVal}
                      type="number"
                      // step={1}
                      // min={1}
                      // name=""
                      // id="1"
                    />
                  </div>
                  <img
                    onClick={() => changeRepsVal(1)}
                    className="chevron-btn"
                    src="../chevron.svg"
                    alt=""
                  />
                  <img
                    onClick={() => changeRepsVal(-1)}
                    className="chevron-btn down-chev"
                    src="../chevron.svg"
                    alt=""
                  />
                </div>
              </div>

              <button onClick={() => completeSet(exercise.sets, ind + 1)}>
                Complete Set
              </button>
              <button onClick={() => skipSet(exercise.sets)}>Skip Set</button>
            </div>
          )}
        </div>
      );
    });
    setExerciseHtml(htmlArr);
  };

  const changeRepsVal = (add) => {
    repsRef.current.value = Number(repsRef.current.value) + add;
  };

  const changeWeightVal = (add) => {
    weightRef.current.value = Number(weightRef.current.value) + add;
  };

  const completeSet = (maxSets, exercise) => {
    if (selectedRep >= 1) {
      const trackerCopy = { ...workoutTracker };
      trackerCopy[exercise]["reps"].push(Number(repsRef.current.value));
      trackerCopy[exercise]["weight"].push(Number(weightRef.current.value));
      setWorkoutTracker(trackerCopy);
      // console.log(workoutTracker[exercise]);
      // console.log(exercise);
    }
    if (maxSets === selectedRep) {
      if (workout.exercises.length === selectedEx) {
        completedWorkout();
      }
      setSelectedEx((prev) => (prev += 1));
      setSelectedRep(1);
    } else {
      setSelectedRep((prev) => prev + 1);
      exerciseHtmlGenerator(workout);
    }
  };

  const skipSet = (maxSets) => {
    if (maxSets === selectedRep) {
      if (workout.exercises.length === selectedEx) {
        completedWorkout();
      }
      setSelectedEx((prev) => (prev += 1));
      setSelectedRep(1);
    } else {
      setSelectedRep((prev) => prev + 1);
      exerciseHtmlGenerator(workout);
    }
  };

  return (
    <>
      {workout && (
        <div className="workout-log-wrapper">
          <h3 className="form-title">Workout Session - {workout.name}</h3>
          <p></p>
          {exerciseHtml}
          {/* {workout.exercises.map((exercise, ind) => {
            return (
              <>
                <p>{exercise.name}</p>
                <p>{exercise.reps}</p>
                <p>{exercise.sets}</p>
              </>
            );
          })} */}
          {/* {workout && <>{workout.name}</>} */}
        </div>
      )}
    </>
  );
};

export default WorkoutLog;
