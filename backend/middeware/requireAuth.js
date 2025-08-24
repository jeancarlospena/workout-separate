import jwt from 'jsonwebtoken'
import { sql } from "../config/db.js"


export const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt
  console.log('--------------------------------------')
  console.log(token)
  if (!token) {
    console.log('User not logged in')
    return res.status(401).json({ success: false, message: 'Need to login' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await sql`
      SELECT * FROM users WHERE id=${decoded.id}
      `
    if (!user[0]) {
      return res.status(401).json({ success: false, message: "No such user" })
    }
    delete user[0].password
    req.user = user[0]
    next()
  } catch (error) {
    console.log("Error requireAuth:", error)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    res.status(401).json({ success: false, message: "Internal server error" })
  }
}

