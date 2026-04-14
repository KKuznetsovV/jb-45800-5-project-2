import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
    return (
        <div className='Header'>
            <div className='Header__logo'>CryptoPulse AI</div>
            <nav className='Header__nav'>
                <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
                <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>Reports</NavLink>
                <NavLink to="/recommendations" className={({ isActive }) => isActive ? 'active' : ''}>Recommendations</NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
            </nav>
            <div className='Header__search'>
                <input type="text" placeholder="Search" />
            </div>
        </div>
    )
}
