import { sql } from "../config/db.js"


export const createExercise = async (req, res) => {
  const { exerciseName, exerciseDescription, muscleGroup } = req.body
  try {
    const newExercise = await sql`
      INSERT INTO exercises (name, description, muscle_groups)
      VALUES (${exerciseName}, ${exerciseDescription}, ${muscleGroup})
      RETURNING *
    `
    // res.status(200).json({ success: true, newExerciseCategory: newExerciseCategory[0] })
    res.json({ success: true, newExercise: newExercise[0] })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}


export const getExercises = async (req, res) => {
  try {

    const exercises = await sql`
    SELECT * FROM exercises 
    WHERE deleted = FALSE
    ORDER BY name
    `
    res.status(200).json({ success: true, exercises })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export const deleteExercise = async (req, res) => {
  const { exerciseid } = req.params
  try {


    await sql`UPDATE exercises
    SET deleted = TRUE, deleted_at = NOW()
    WHERE id = ${exerciseid} AND is_template = FALSE;`

    res.status(200).json({ success: true, message: 'Deleted exercise' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete' })
  }
}

export const createWorkout = async (req, res) => {
  const { selectedExercises, workoutName, workoutDescription } = req.body
  const userId = req.user.id
  const addedExercises = []
  try {
    const [newWorkout] = await sql`
      INSERT INTO workouts (user_id, name, description)
      VALUES (${userId}, ${workoutName}, ${workoutDescription})
      RETURNING *
    `
    let position = 1
    for (const exercise of selectedExercises) {

      const addedExercise = await sql`
      INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, position)
      VALUES (${newWorkout.id}, ${exercise.id}, ${exercise.sets}, ${exercise.reps}, ${position})
      RETURNING *
    `
      addedExercises.push(addedExercise)
      position += 1
    }
    res.status(200).json({
      message: "Workout created successfully",
      workout: newWorkout,
      exercises: addedExercises,
    });
  } catch (error) {
    console.error("Error creating workout:", error);
    res.status(500).json({ success: false, message: "Failed to create workout" });
  }

}

export const getWorkouts = async (req, res) => {
  const userId = req.user.id
  // const workouts = await sql`
  //   SELECT * FROM workouts WHERE user_id=${userId}
  //   `
  const result = await sql`
  SELECT u.id as user_id, u.first_name,
         w.id as workout_id, w.is_template, w.name as workout_name, w.description,
         e.id as exercise_id, e.name as exercise_name,
         we.sets, we.reps, we.position
  FROM users u
  LEFT JOIN workouts w ON w.user_id = u.id
  LEFT JOIN workout_exercises we ON we.workout_id = w.id
  LEFT JOIN exercises e ON e.id = we.exercise_id
  WHERE u.id = ${userId} OR w.is_template = TRUE ;
`
  const workoutMap = {}


  result.forEach(row => {
    if (!row.workout_id) return // user might have no workouts yet

    if (!workoutMap[row.workout_id]) {
      workoutMap[row.workout_id] = {
        id: row.workout_id,
        name: row.workout_name,
        description: row.description,
        is_template: row.is_template,
        exercises: []
      }
      // user.workouts.push(workoutMap[row.workout_id])
    }

    if (row.exercise_id) {
      workoutMap[row.workout_id].exercises.push({
        id: row.exercise_id,
        name: row.exercise_name,
        sets: row.sets,
        reps: row.reps,
        position: row.position
      })
    }
  })
  const workouts = Object.values(workoutMap);
  res.status(200).json({
    success: true,
    workouts: workouts,

  });
}

export const deleteWorkout = async (req, res) => {
  const { workoutid } = req.params
  try {
    await sql`
      DELETE FROM workouts
      WHERE id = ${workoutid} AND user_id = ${req.user.id} AND is_template = FALSE
      
    `
    res.status(200).json({ success: true, message: "Workout deleted" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Failed to delete workout' })
  }
}

export const createWorkoutLog = async (req, res) => {
  const { workoutTracker, workoutId } = req.body
  const userId = req.user.id
  try {
    const session = await sql`
        INSERT INTO workout_sessions (user_id, workout_id)
        VALUES (${userId}, ${workoutId})
        RETURNING *
      `
    console.log('session id: =============')
    console.log(session[0].id)
    for (const exercise of Object.values(workoutTracker)) {

      await sql`
        INSERT INTO workout_logs (user_id, session_id, exercise_id, sets_completed, reps_per_set, weight_per_set)
        VALUES (${userId}, ${session[0].id}, ${exercise.exerciseId}, ${exercise.reps.length}, ${exercise.reps}, ${exercise.weight})
        RETURNING *
      `
    }
    res.status(200).json({ success: true, message: 'Successfully logged workout' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Failed to log workout' })
  }
}


export const getSessions = async (req, res) => {
  const userId = req.user.id

  try {

    const result = await sql`
      SELECT 
        ws.id AS session_id,
        ws.completed_at,
        ws.workout_id,
        w.name AS workout_name,
        json_agg(
          json_build_object(
            'exercise_id', wl.exercise_id,
            'exercise_name', e.name,
            'reps_per_set', wl.reps_per_set,
            'weight_per_set', wl.weight_per_set
          ) ORDER BY wl.exercise_id
        ) AS exercises
      FROM workout_sessions ws
      LEFT JOIN workouts w ON w.id = ws.workout_id
      LEFT JOIN workout_logs wl ON wl.session_id = ws.id
      LEFT JOIN exercises e ON e.id = wl.exercise_id
      WHERE ws.user_id = ${userId}
      GROUP BY ws.id, ws.completed_at, ws.workout_id, w.name
      ORDER BY ws.completed_at DESC
    `;
    res.status(200).json({ success: true, workoutLogs: result })
  } catch (error) {
    console.log(error)
    res.json()
  }
}

export const deleteSession = async (req, res) => {
  const { sessionId } = req.params
  try {
    const response = await sql`
    DELETE FROM workout_sessions 
    WHERE id = ${sessionId} AND user_id = ${req.user.id} 
    `
    console.log(response)
    res.status(200).json({ success: true, message: 'we are deleteing' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Failed to delete' })
  }
}

// getSessions()

// const result = await sql`
//   SELECT u.id as user_id, u.first_name,
//          w.id as workout_id, w.name as workout_name, w.description,
//          e.id as exercise_id, e.name as exercise_name,
//          we.sets, we.reps, we.position
//   FROM users u
//   LEFT JOIN workouts w ON w.user_id = u.id
//   LEFT JOIN workout_exercises we ON we.workout_id = w.id
//   LEFT JOIN exercises e ON e.id = we.exercise_id
//   WHERE u.id = ${userId};
// `