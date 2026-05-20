import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Subscribe from './pages/Subscribe.jsx'
import Success from './pages/Success.jsx'

export default function App() {
  return (
    <BrowserRouter basename="/demo/reviewsai/frontend">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  )
}