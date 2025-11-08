import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext.jsx'
import Feed from './pages/Feed.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
