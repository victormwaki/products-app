// src/pages/SignIn.js
import React, { useState, useEffect } from 'react';
import './signin.css'; 

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [customerType, setCustomerType] = useState('');
    const [customerTypes, setCustomerTypes] = useState([]);
    const [error, setError] = useState('');

    // Fetch the customer types from the backend
    useEffect(() => {
        const fetchCustomerTypes = async () => {
            try {
                const response = await fetch('http://localhost:5555/customer_types');
                const data = await response.json();
                setCustomerTypes(data);
            } catch (err) {
                setError('Failed to load customer types.');
            }
        };

        fetchCustomerTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            username,
            email,
            password,
            customer_type: customerType,
        };

        try {
            const response = await fetch('http://localhost:5555/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Sign Up Successful!');
                // Redirect or clear form, based on your app's flow
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Error signing up. Please try again.');
        }
    };

    return (
        <div className="signin-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Customer Type</label>
                    <select
                        value={customerType}
                        onChange={(e) => setCustomerType(e.target.value)}
                        required
                    >
                        <option value="">Select Customer Type</option>
                        {customerTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Sign Up</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default SignUp;
