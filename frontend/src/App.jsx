import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Subscribe from './pages/Subscribe.jsx'
import Success from './pages/Success.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <BrowserRouter basename="/demo/reviewsai/frontend">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}