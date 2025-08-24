import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import workoutRoutes from './routes/workoutRoutes.js'
import { aj } from './lib/arcjet.js'
// import { sql } from './config/db.js'
import initDB from './models/models.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;
const originUrl = process.env.ORIGIN_URL || "http://localhost:5173"
// const originUrl = "http://localhost:5173"



// MIDDLEWARES
app.use(express.json())
// app.use(cors({
//   origin: originUrl, // or your frontend URL
//   credentials: true// allow cookies to be sent
// }));
app.use(cookieParser())
app.use(cors())
app.use(helmet())
app.use(morgan('dev')) // log the requests

// apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1 // specifies that each request consumes 1 token
    })
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({
          error: 'Too many requests'
        })
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" })
      } else {
        res.status(403).json({ error: 'Forbidden' })
      }
      return
    }

    // check for spoofed bots
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: 'Spoofed bot detected' })
      return
    }

    next()
  } catch (error) {
    console.log('Arject error', error)
    next(error)
  }
})


app.get('/', (req, res) => {
  res.status(200).json({ message: 'ok you are here', theurl: originUrl })
})
// routes
app.use('/api/products', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/workout', workoutRoutes)



// server running
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is runnning on localhost:${PORT}`)
  })
})
