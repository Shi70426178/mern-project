import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState(''); // in this line we have [name , setName] name is used as textfield of the form that we enter and setName is use to update the name that is entered  we use useState for creating this , and useState is use here to manage the textfields for example we have name and useState helps to set the name 
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // This is used to navigate to another page like dashboard

    const handleSubmit = async (e) => {  // this function is used to submit the form and we give e as an arguiment that is used in next line that is 
        e.preventDefault(); // e.preventDefault() that means submit the form without any reloads it prevents page reload at the time of submission
        if (!name || !email || !username || !password) { // this line means if any of the field is missing then it will not run
            alert('All fields are required');
            return;
        }
        try {
            const res = await axios.post('https://mern-project-5-xoai.onrender.com/api/auth/signup', {
                name,
                email,
                username,
                password
            });  // these will work as sending all the data to server 
            localStorage.setItem('token', res.data.token); // this works as storing the passwords ids in local storage
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="form">
            <h3 className='header' id='he1'>Welcome To Website</h3>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // this line work as handling values in console e is event target is used to target what we typed and value is for example here is name  
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Signup</button>
            </form>
            <p>
                Already have an account? <Link to="/">Login here</Link>
            </p>
        </div>
    );
};

export default Signup;
