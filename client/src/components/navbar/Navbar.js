import React, { useState } from 'react';
import './navbar.css';

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode', !darkMode);
    };

    return (
        <nav className="navbar">
        <div className="navbar-logo">
            <h1>Products App</h1>
        </div>
        <ul className="navbar-links">
            <li><a href="/">Home</a></li>
            <li><a href="/signin">SignUp</a></li>
            <li><a href="/login">LogIn</a></li>
            <li><a href="/createproducts">CreateProduct</a></li>
            <li><a href="/cart">🛒</a></li>

        </ul>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        </nav>
    );
};

export default Navbar;
