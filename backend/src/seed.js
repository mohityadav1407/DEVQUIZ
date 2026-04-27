const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const Quiz = require('./models/Quiz')

const questions = [
  { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Logic', 'Home Tool Markup Language'], answer: 'Hyper Text Markup Language', category: 'Frontend' },
  { question: 'Which CSS property makes a flex container?', options: ['display: flex', 'position: flex', 'layout: flex', 'align: flex'], answer: 'display: flex', category: 'Frontend' },
  { question: 'Which hook handles side effects in React?', options: ['useState', 'useEffect', 'useContext', 'useRef'], answer: 'useEffect', category: 'React' },
  { question: 'What does REST stand for?', options: ['Representational State Transfer', 'Remote Execution State Transfer', 'Request State Technology', 'Rapid Exchange Standard'], answer: 'Representational State Transfer', category: 'Backend' },
  { question: 'Which HTTP method updates data?', options: ['GET', 'POST', 'PUT', 'DELETE'], answer: 'PUT', category: 'Backend' },
  { question: 'What is MongoDB?', options: ['Relational database', 'NoSQL document database', 'Frontend framework', 'CSS library'], answer: 'NoSQL document database', category: 'Database' },
  { question: 'What does JWT stand for?', options: ['Java Web Token', 'JSON Web Token', 'JavaScript Web Transfer', 'JSON Widget Tool'], answer: 'JSON Web Token', category: 'Backend' },
  { question: 'Which command initializes a Node.js project?', options: ['node init', 'npm start', 'npm init -y', 'node create'], answer: 'npm init -y', category: 'Backend' },
  { question: 'What is useContext used for?', options: ['Fetch data from APIs', 'Share state globally', 'Handle side effects', 'Manage local state'], answer: 'Share state globally', category: 'React' },
  { question: 'Which method declares a variable in modern JS?', options: ['var x = 5', 'let x = 5', 'int x = 5', 'declare x = 5'], answer: 'let x = 5', category: 'JavaScript' },
]

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected!')

    await Quiz.deleteMany()
    console.log('🗑️ Old questions deleted!')

    await Quiz.insertMany(questions)
    console.log('✅ Questions seeded successfully!')

    process.exit()
  } catch (err) {
    console.error('❌ Seeding failed:', err.message)
    process.exit(1)
  }
}

seedDB()