import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { useEffect } from "react";
import { WorkoutContext } from "../context/WorkoutContext.jsx";

const Workout = () => {
  const { API } = useContext(UserContext);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");

  // const [exerciseList, setExericiseList] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercisesHtml, setExercisesHtml] = useState([]);
  const [exerciseCount, setExerciseCount] = useState(1);
  const [defaultExercise, setDefaultExercise] = useState({});
  const [error, setError] = useState("");
  // const [allWorkouts, setAllWorkouts] = useState([]);
  const {
    updateWorkouts,
    allWorkouts,
    workoutError,
    deleteWorkout,
    exerciseList,
  } = useContext(WorkoutContext);
  // const [workoutError, setWorkoutError] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (selectedExercises.length === 0) {
      setError("Plase add exercises");
      return;
    }
    if (!workoutName || !workoutDescription) {
      setError("All fields are required");
      return;
    }
    const workoutData = { workoutName, selectedExercises, workoutDescription };
    // return;
    try {
      API.post("/workout", workoutData)
        .then((response) => {
          setSelectedExercises([defaultExercise]);
          updateWorkouts();
          setWorkoutName("");
          setWorkoutDescription("");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      setError("Unable to create workout");
    }
  };

  const updateExercises = (updating, itemInd, value) => {
    switch (updating) {
      case "sets":
      case "reps":
        setSelectedExercises((prev) => {
          return prev.map((item, i) =>
            i === itemInd ? { ...item, [updating]: parseInt(value) } : item
          );
        });
        break;
      case "exercise":
        const exerciseData = exerciseList.find(
          (exercise) => exercise.id == value
        );

        setSelectedExercises((prev) => {
          return prev.map((item, i) =>
            i == itemInd ? { ...item, ...exerciseData } : item
          );
        });
        break;
      case "remove":
        setSelectedExercises((prev) => {
          return prev.filter((_, ind) => {
            return ind !== Number(itemInd);
          });
        });
        break;
    }
  };

  useEffect(() => {
    if (selectedExercises) {
      const arr = selectedExercises.map((exercise, ind) => {
        return (
          <div className="exercises-container" key={ind}>
            <p className="exercise-indicator">
              Exercise <span className="exercise-counter">{ind + 1}</span>
              <span
                onClick={(e) => updateExercises("remove", ind, "")}
                className="exercise-indicator remove-spacer highlight-text"
              >
                Remove
              </span>
            </p>

            <label className="form-label " htmlFor="muscle-group">
              Select Exercise:
            </label>
            <select
              className="form-input pointer"
              id="muscle-group"
              value={exercise.id}
              onChange={(e) => updateExercises("exercise", ind, e.target.value)}
            >
              {exerciseList.map((exercise, ind) => {
                return (
                  <option key={`exercise${ind}`} value={exercise.id}>
                    {exercise.name}
                  </option>
                );
              })}
            </select>
            <div className="split-section">
              <div className="input-label-combo">
                <label className="form-label" htmlFor="sets">
                  Sets:
                </label>

                <input
                  onKeyDown={(e) => {
                    if (e.key === "." || e.key === "," || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  min={1}
                  step={1}
                  className="form-input"
                  id="sets"
                  type="number"
                  value={exercise.sets}
                  onChange={(e) => updateExercises("sets", ind, e.target.value)}
                  placeholder="Enter Sets"
                  autoComplete="none"
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div className="input-label-combo">
                <label className="form-label" htmlFor="reps">
                  Reps:
                </label>
                <input
                  onKeyDown={(e) => {
                    if (e.key === "." || e.key === "," || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  min={1}
                  step={1}
                  className="form-input"
                  id="reps"
                  type="number"
                  value={exercise.reps}
                  onChange={(e) => updateExercises("reps", ind, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  autoComplete="none"
                  placeholder="Enter Reps"
                />
              </div>

              {/* {console.log("hit")}
                {console.log(selectedExercises[key])} */}
            </div>
          </div>
        );
      });
      setExercisesHtml(arr);
    }
  }, [selectedExercises, exerciseList]);

  useEffect(() => {
    defaultExerciseSetter();
  }, [exerciseList]);

  const defaultExerciseSetter = () => {
    if (exerciseList) {
      const defaultExerciseInitialize = {
        ...exerciseList[0],
        sets: 5,
        reps: 5,
        weight: 100,
      };
      setDefaultExercise(defaultExerciseInitialize);
      setSelectedExercises([defaultExerciseInitialize]);
    }
  };

  // useEffect(() => {
  //   console.log(selectedExercises);
  // }, []);

  return (
    <div className="exercises-dash">
      <form className="workout-form l-form" onSubmit={onSubmitHandler}>
        <h3 className="form-title">Create New Workout</h3>
        <label className="form-label top-label" htmlFor="category">
          Workout Name:
        </label>
        <input
          className="form-input"
          id="name"
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="Type Name"
          autoComplete="none"
        />
        <p className="p-title">Workout Exercises:</p>
        <div>{exercisesHtml}</div>

        <img
          onClick={() =>
            setSelectedExercises((prev) => [...prev, defaultExercise])
          }
          src="plus-icon.jpg"
          className="add-exercise-button"
        ></img>

        <label className="form-label" htmlFor="category">
          Workout Description:
        </label>
        <textarea
          id="category"
          className="form-input"
          value={workoutDescription}
          onChange={(e) => setWorkoutDescription(e.target.value)}
          placeholder="Type Description"
        ></textarea>
        {error && <p className="error">{error}</p>}
        <button className="btn">Add Workout</button>
      </form>
      <div className="workout-form r-form">
        <h3 className="form-title">Workout Templates</h3>
        {workoutError && <p className="error">{workoutError}</p>}
        {allWorkouts &&
          allWorkouts.map((workout, ind) => {
            return (
              <div className="exercise-view" key={"workout_" + ind}>
                <p>{workout.name}</p>
                <p>Exercises:</p>
                {workout.exercises.map((exercise, exerciseInd) => {
                  return (
                    <p
                      key={"exercise_" + exerciseInd}
                      className="exercise-data-container"
                    >
                      {exercise.name}
                      <span className="exercise-data">
                        Sets
                        {" " + exercise.sets}
                      </span>
                      <span className="exercise-data">
                        Reps{" " + exercise.reps}{" "}
                      </span>
                    </p>
                  );
                })}
                <p>{workout.description}</p>
                {!workout.is_template && (
                  <span
                    onClick={(e) => deleteWorkout(workout.id)}
                    className=" highlight-text"
                  >
                    Delete
                  </span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Workout;
