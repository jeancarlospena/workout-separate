
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sql } from "../config/db.js"
import { createToken } from '../util/createToken.js'


export const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" })
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email' })
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
  }

  try {
    const exists = await sql`
    SELECT email FROM users WHERE email=${email}
    `
    if (exists[0]) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' })
    }
    const salt = await bcrypt.genSalt(11)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await sql`
      INSERT INTO users (first_name, last_name, email, password)
      VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword})
      RETURNING *
    `
    createToken(res, newUser[0].id)
    delete newUser[0].password
    res.status(201).json({ success: true, user: newUser[0] })

  } catch (error) {
    console.log("Error createUser:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  console.log(req.body)
  try {
    const user = await sql`
    SELECT * FROM users WHERE email=${email}
    `
    if (user.length === 0) {
      return res.status(401).json({ success: false, message: "Wrong username or password" })
    }
    const mathchingPassword = await bcrypt.compare(password, user[0]['password'])
    if (!mathchingPassword) {
      return res.status(401).json({ success: false, message: "Invalid password" })
    }
    delete user[0].password
    createToken(res, user[0].id)

    res.status(200).json({ success: true, user: user[0], message: "Logged in successfully" })
  } catch (error) {
    console.log("Error loginUser:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export const logoutUser = async (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'strict' })
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}

export const authCheck = async (req, res) => {
  res.status(200).json({ success: true, user: req.user })
}