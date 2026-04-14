import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../../pages/home/Home'
import Reports from '../../pages/reports/Reports'
import Recommendations from '../../pages/recommendations/Recommendations'
import About from '../../pages/about/About'
import NotFound from '../not-found/NotFound'

export default function Main() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
