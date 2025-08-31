import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { WorkoutContext } from "../context/WorkoutContext.jsx";
import { Link } from "react-router-dom";

const UserHome = () => {
  const { allWorkouts, workoutError, workoutLogs, deleteLog } =
    useContext(WorkoutContext);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutLogsHtml, setWorkoutLogsHtml] = useState(null);

  const workoutLogsHtmlGenerator = () => {
    if (workoutLogs) {
      const arr = workoutLogs.map((workout, ind) => {
        return (
          <div className="exercise-view" key={"workout_" + ind}>
            <div className="log-section">
              <p>{workout.workout_name}</p>
              <p>{formatDate(workout.completed_at)}</p>
            </div>
            {workout.exercises.map((exercise, ind) => {
              return (
                <div className="exercise-section" key={"exercise_" + ind}>
                  <p>{exercise.exercise_name} </p>
                  <div className="weight-reps">
                    {exercise.reps_per_set.map((reps, index) => {
                      return (
                        <p key={"reps_" + index}>
                          {exercise.weight_per_set[index]} x {reps}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <span
              onClick={(e) => deleteLog(workout.session_id)}
              className=" highlight-text"
            >
              Delete
            </span>
          </div>
        );
      });
      setWorkoutLogsHtml(arr);
    }
  };

  useEffect(() => {
    if (allWorkouts && allWorkouts.length) {
      setSelectedWorkout(allWorkouts[0].id);
    }
  }, [allWorkouts]);

  useEffect(() => {
    workoutLogsHtmlGenerator();
  }, [workoutLogs]);

  const formatDate = (date) => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  return (
    <div className="exercises-dash">
      <div className="workout-form l-form">
        {" "}
        <h3 className="form-title">Start A Workout</h3>
        {selectedWorkout && (
          <>
            <label className="form-label top-label" htmlFor="category">
              Select Workout:
            </label>
            <select
              className="form-input pointer"
              id="category"
              name="category"
              value={selectedWorkout}
              onChange={(e) => setSelectedWorkout(e.target.value)}
            >
              {/* <option value="Back">Strength (Repetitions Based)</option>
              <option value="Endurance">Endurance (Time Based)</option> */}
              {allWorkouts &&
                allWorkouts.map((workout, ind) => {
                  return (
                    <option key={"workout_option_" + ind} value={workout.id}>
                      {workout.name}
                    </option>
                  );
                })}
            </select>
          </>
        )}
        <Link className="btn" to={`/workout/${selectedWorkout}`}>
          {/* <button className="btn">Start Workout</button> */}
          Start Session
        </Link>
      </div>
      <div className="workout-form r-form">
        <h3 className="form-title">Workout Logs</h3>
        {workoutLogs && workoutLogsHtml}
      </div>
    </div>
  );
};

export default UserHome;
