import React from 'react';
import './home.css';
import Products from '../deserts/Deserts';

const Home = () => {
    return (
        <>
        <div className="home-container">
            <div className="welcome-overlay">
                <h1>Welcome to Your Favorite Desert Site!</h1>
                <p>Your ultimate destination for exploring the beautiful deserts around the world.</p>
            </div>
        </div>
        <Products/>
        </>
    );
};

export default Home;
