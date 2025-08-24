import { sql } from '../config/db.js'

export default async function initDB() {
  try {


    // -- USERS
    await sql`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW())`

    // -- EXERCISE CATEGORIES (optional grouping)
    // await sql`
    // CREATE TABLE IF NOT EXISTS exercise_categories(
    // id SERIAL PRIMARY KEY,
    // name VARCHAR(50) UNIQUE NOT NULL, --e.g., "Strength", "Cardio", "Flexibility"
    // description TEXT)`

    // -- EXERCISES
    await sql`
    CREATE TABLE IF NOT EXISTS exercises(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Strength',
    muscle_groups TEXT, --e.g., '{Chest,Triceps,Shoulders}'
    is_template BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
    )`

    // -- WORKOUTS
    await sql`
    CREATE TABLE IF NOT EXISTS workouts(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_template BOOLEAN DEFAULT FALSE, -- for pre - made programs
    created_at TIMESTAMP DEFAULT NOW())`

    // -- WORKOUT_EXERCISES (junction table)
    await sql`
    CREATE TABLE IF NOT EXISTS workout_exercises(
    id SERIAL PRIMARY KEY,
    workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercises(id) ON DELETE CASCADE,
    sets INT NOT NULL,
    reps INT, --optional if it's time-based
    duration_seconds INT, -- for timed exercises like planks
    weight NUMERIC(5, 2), --optional for strength training
    position INT, --order in workout
    notes TEXT)`

    await sql`
    CREATE TABLE IF NOT EXISTS workout_sessions(id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    workout_id INT REFERENCES workouts(id) ON DELETE SET NULL,
    completed_at TIMESTAMP DEFAULT NOW())`

    // -- WORKOUT LOGS (tracking user progress)
    await sql`
    CREATE TABLE IF NOT EXISTS workout_logs(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    session_id INT REFERENCES workout_sessions(id) ON DELETE SET NULL,
    exercise_id INT REFERENCES exercises(id) ON DELETE SET NULL,
    sets_completed INT,
    reps_per_set INT[],
    weight_per_set INT[],
    duration_seconds INT,
    notes TEXT
    )`


    console.log('Database initialized successfully')
  } catch (error) {
    console.log('Error initDB', error)
  }
}



