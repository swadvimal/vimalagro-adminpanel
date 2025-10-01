import React, { useState } from 'react'
import { FaMailBulk } from 'react-icons/fa'
import { RiLockPasswordFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom';
import ButtonCom from '../ButtonCom';

function Login(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    let lognavigate = useNavigate();

    const LocalEmail = 'admin@gmail.com';
    const LocalPassword = "admin123";

    const logedin = () => {
        if (email == LocalEmail && password == LocalPassword) {
            localStorage.setItem("login", true);
            props.setlogin(true);
            lognavigate("/");
        }
        else {
            setErrorMessage('Invalid E-mail Or Password.');
        }
    }

    return (
        <>
            <div className="login_bg d-flex align-items-center justify-content-center">
                <div className='login_form shadow p-4 w-100 mx-3 mx-md-0' style={{ maxWidth: "400px" }}>
                    <h2 className='text-dark fw-bold text-center text-uppercase mb-4'>Login</h2>
                    <div>
                        <label className='fw-bold'><FaMailBulk className='fs-5' /> E-mail</label>
                        <input
                            type="email"
                            name="email"
                            placeholder='Enter E-mail'
                            onChange={(e) => setEmail(e.target.value)}
                            className='form-control border-secondary mt-2'
                        />
                    </div>
                    <div className='my-3'>
                        <label className='fw-bold'><RiLockPasswordFill className='fs-5' /> Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder='Enter Password'
                            onChange={(e) => setPassword(e.target.value)}
                            className='form-control border-secondary mt-2'
                        />
                    </div>
                    {errorMessage && (
                        <div className="text-danger text-center mb-3 fw-bold">
                            {errorMessage}
                        </div>
                    )}
                    <div className='text-center'>
                        <ButtonCom btn="Submit" onClick={logedin} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login