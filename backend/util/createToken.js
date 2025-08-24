import jwt from 'jsonwebtoken'


export const createToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' })

  res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 60 * 1000 })
  return token
}
