import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext.jsx";

export const WorkoutContext = createContext();

const WorkoutContextProvider = (props) => {
  const { API, backendUrl, authLoaded, user } = useContext(UserContext);
  const [allWorkouts, setAllWorkouts] = useState(null);
  const [workoutError, setWorkoutError] = useState(null);
  const [exerciseList, setExerciseList] = useState(null);
  const [exerciseError, setExerciseError] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState(null);
  const [workoutLogsError, setWorkoutLogsError] = useState(null);

  const loadLogs = async () => {
    console.log("from load logs /workout/log");

    try {
      API.get(backendUrl + "/api/workout/log")
        .then((response) => {
          console.log(response);
          setWorkoutLogs(response.data.workoutLogs);
        })
        .catch((error) => {
          console.log(error);
          setWorkoutLogsError("Unable to load workouts");
        });
    } catch (error) {
      console.log(error);
      setWorkoutLogsError("Unable to load workouts");
    }
  };

  const deleteLog = async (sessionId) => {
    try {
      API.delete(backendUrl + `/api/workout/log/${sessionId}`)
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
    console.log("from updateworkouts /api/workout");
    try {
      API.get(backendUrl + "/api/workout")
        .then((response) => {
          console.log(response);
          setAllWorkouts(response.data.workouts);
        })
        .catch((error) => {
          console.log(error);
          setWorkoutError("Unable to load workouts");
        });
    } catch (error) {
      console.log(error);
      setWorkoutError("Unable to load workouts");
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      API.delete(backendUrl + `/api/workout/${workoutId}`)
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
      API.get(backendUrl + "/api/workout/exercises")
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
      API.delete(backendUrl + `/api/workout/exercises/${exerciseId}`)
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
