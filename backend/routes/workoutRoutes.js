import express from 'express'
import { createExercise, createWorkout, createWorkoutLog, deleteExercise, deleteSession, deleteWorkout, getExercises, getSessions, getWorkouts } from '../controller/workoutController.js'
import { requireAuth } from '../middeware/requireAuth.js'

const router = express.Router()



router.post('/exercises', createExercise)
router.get('/exercises', getExercises)
router.delete('/exercises/:exerciseid', deleteExercise)
router.post('/', requireAuth, createWorkout)
router.get('/', requireAuth, getWorkouts)
router.delete('/:workoutid', requireAuth, deleteWorkout)
router.post('/log', requireAuth, createWorkoutLog)
router.get('/log', requireAuth, getSessions)
router.delete('/log/:sessionId', requireAuth, deleteSession)

export default router;