import React from 'react';
import './singin.css';

const SignIn = () => {
    return (

        <div className='singin-container'>
            <h2>Sign In</h2>
            <form>
                <input type='email' placeholder='Email'/>
                <input type="password" placeholder="Password" />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default SignIn;