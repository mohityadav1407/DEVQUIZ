const register = async (req, res) => {
  res.status(201).json({ message: 'Register route working ✅' })
}

const login = async (req, res) => {
  res.status(200).json({ message: 'Login route working ✅' })
}

const getMe = async (req, res) => {
  res.status(200).json({ message: 'GetMe route working ✅', user: req.user })
}

module.exports = { register, login, getMe }