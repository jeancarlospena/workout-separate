import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { useEffect } from "react";
import { WorkoutContext } from "../context/WorkoutContext.jsx";

const Exercises = () => {
  const { API, backendUrl } = useContext(UserContext);
  const { deleteExercise, loadExercises, exerciseList, exerciseError } =
    useContext(WorkoutContext);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseDescription, setExerciseDescription] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Chest");
  const [exerciseCategory, setExerciseCategory] = useState("Strength");
  const [error, setError] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!exerciseName || !exerciseDescription || !muscleGroup) {
      setError("All fields are required");
    }
    const exerciseData = { exerciseName, exerciseDescription, muscleGroup };
    try {
      API.post(backendUrl + "/api/workout/exercises", exerciseData)
        .then((response) => {
          loadExercises();
          setExerciseDescription("");
          setExerciseName("");
        })
        .catch((error) => {});
    } catch (error) {
      setError("Unable to create exercise");
    }
  };

  return (
    <div className="exercises-dash">
      <form className="workout-form l-form" onSubmit={onSubmitHandler}>
        <h3 className="form-title">Add New Exercise</h3>
        <label className="form-label  top-label" htmlFor="name">
          Name:
        </label>
        <input
          id="name"
          className="form-input "
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          placeholder="Exercise Name"
          autoComplete="none"
        />
        <label className="form-label" htmlFor="muscle-group">
          Muscle Group:
        </label>
        <select
          name="muscle-group"
          className="form-input pointer"
          id="muscle-group"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
        >
          <option value="Chest">Chest</option>
          <option value="Back">Back</option>
          <option value="Shoulders">Shoulders</option>
          <option value="Shoulders">Arms</option>
          <option value="Legs">Legs</option>
          <option value="Core">Core</option>
          <option value="Cardio">Cardio</option>
        </select>
        <label className="form-label" htmlFor="category">
          Category:
        </label>
        <select
          className="form-input pointer"
          id="category"
          name="category"
          value={exerciseCategory}
          onChange={(e) => setExerciseCategory(e.target.value)}
        >
          <option value="Strength">Strength (Repetitions Based)</option>
          <option value="Endurance">Endurance (Time Based)</option>
        </select>
        <label className="form-label" htmlFor="description">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          className="form-input"
          value={exerciseDescription}
          onChange={(e) => setExerciseDescription(e.target.value)}
          placeholder="Exercise Description"
        ></textarea>
        {error && <p>{error}</p>}
        <button className="btn">Add Exercise</button>
      </form>
      <div className="workout-form r-form">
        <h3 className="form-title">All Exercises</h3>

        {exerciseList &&
          exerciseList.map((exercise, ind) => {
            return (
              <div className="exercise-view" key={ind}>
                <p>{exercise.name}</p>
                <div className="descriptive">
                  <p>
                    Muscle Group
                    <span className="exercise-data">
                      {exercise.muscle_groups}
                    </span>{" "}
                  </p>
                  <p>
                    Category
                    <span className="exercise-data">
                      {exercise.category}
                    </span>{" "}
                  </p>
                </div>
                <p>{exercise.description}</p>
                {!exercise.is_template && (
                  <span
                    onClick={(e) => deleteExercise(exercise.id)}
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

export default Exercises;
