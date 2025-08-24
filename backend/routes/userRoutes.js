import express from 'express'
import { createUser, loginUser, authCheck, logoutUser } from '../controller/userController.js'
import { requireAuth } from '../middeware/requireAuth.js'



const router = express.Router()

router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/auth', requireAuth, authCheck)

export default router