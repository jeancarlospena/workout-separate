import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext.jsx";
import React from "react";

export const WorkoutContext = createContext();

const WorkoutContextProvider = (props) => {
  const { API, authLoaded, user } = useContext(UserContext);
  const [allWorkouts, setAllWorkouts] = useState(null);
  const [workoutError, setWorkoutError] = useState(null);
  const [exerciseList, setExerciseList] = useState(null);
  const [exerciseError, setExerciseError] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState(null);
  const [workoutLogsError, setWorkoutLogsError] = useState(null);

  const loadLogs = async () => {
    try {
      API.get("/workout/log")
        .then((response) => {
          setWorkoutLogs(response.data.workoutLogs);
        })
        .catch((error) => {
          setWorkoutLogsError("Unable to load workouts");
        });
    } catch (error) {
      setWorkoutLogsError("Unable to load workouts");
    }
  };

  const deleteLog = async (sessionId) => {
    try {
      API.delete(`/workout/log/${sessionId}`)
        .then((response) => {
          loadLogs();
        })
        .catch((error) => {
          setWorkoutLogsError("Unable to delete workout");
        });
    } catch (error) {
      setWorkoutLogsError("Unable to delete workout");
    }
  };

  const updateWorkouts = async () => {
    try {
      API.get("/workout")
        .then((response) => {
          setAllWorkouts(response.data.workouts);
        })
        .catch((error) => {
          setWorkoutError("Unable to load workouts");
        });
    } catch (error) {
      setWorkoutError("Unable to load workouts");
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      API.delete(`/workout/${workoutId}`)
        .then((response) => {
          updateWorkouts();
        })
        .catch((error) => {
          setWorkoutError("Unable to delete workout");
        });
    } catch (error) {
      setWorkoutError("Unable to delete workout");
    }
  };

  const loadExercises = async () => {
    try {
      API.get("/workout/exercises")
        .then((response) => {
          setExerciseList(response.data.exercises);
        })
        .catch((error) => {
          setError("Unable to load exercises");
        });
    } catch (error) {
      setError("Unable to load exercises");
    }
  };

  const deleteExercise = async (exerciseId) => {
    try {
      API.delete(`/api/workout/exercises/${exerciseId}`)
        .then((response) => {
          loadExercises();
        })
        .catch((error) => {
          setExerciseError("Unable to delete workout");
        });
    } catch (error) {
      setExerciseError("Unable to delete workout");
    }
  };

  useEffect(() => {
    if (authLoaded && user) {
      loadLogs();
      loadExercises();
      updateWorkouts();
    }
  }, [user]);

  const value = {
    allWorkouts,
    updateWorkouts,
    deleteWorkout,
    workoutError,
    exerciseList,
    loadExercises,
    deleteExercise,
    exerciseError,
    loadLogs,
    workoutLogs,
    deleteLog,
  };
  return (
    <WorkoutContext.Provider value={value}>
      {props.children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContextProvider;
