import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginimg from '../assets/code.png'
import '../css/login.css'
import { AppContext } from '../App'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
import { url } from '../baseurl'
import { getAuth, signInWithPopup } from "firebase/auth";
import { provider } from "../firebase";
import googlelogo from '../assets/google.png'

export const Login = () => {
    const context = useContext(AppContext)
    const authgoogle = getAuth();
    const navigate = useNavigate()
    const [email, setemail] = useState('')
    const [password, setPassword] = useState('')
    async function login() {
        if (!email) {
            toast.error("Email required", {
                style: {
                    fontSize: '12px'
                }
            })
            return;
        }
        if (!password) {
            toast.error("Password required", {
                style: {
                    fontSize: '12px'
                }
            })
            return;
        }
        try {
            const resp = await axios.post(`${url}/auth/login`, { email, password })
            localStorage.setItem('auth', JSON.stringify(resp.data))
            navigate('/')
            context.setAuth(resp.data)
        }
        catch (err) {
            toast.error(err.response.data.message, {
                style: {
                    fontSize: '12px'
                }
            })
        }
    }
    function handleGoogleAuth() {
        signInWithPopup(authgoogle, provider).then((result) => {
            const user = result.user;
            return axios.post(`${url}/auth/googleauth`, { email: user.email, img: user.photoURL, username: user.displayName, uid: user.uid })
        }).then((res) => {
            console.log(res);
            localStorage.setItem('auth', JSON.stringify(res.data))
            navigate('/')
            context.setAuth(res.data)
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
        <div className="containerlogin">
            <Toaster />
            <div className="leftlogin">
                <img style={{ marginTop: '-15px', minWidth: '400px', width: '75%', marginBottom: '0px' }} src={loginimg} alt="" />
            </div>
            <div className="rightlogin">
                <div className="headerlogin">
                    <h1>
                        Sign in to CatchBlog
                    </h1>
                    <p style={{ marginTop: '-10px', marginBottom: '5px', fontSize: '14px', marginLeft: '5px', minWidth: '320px' }}>Don't have an account <Link to="/register" style={{ color: 'rgb(109 109 109)', textDecoration: 'none', marginBottom: '-2.5px', marginLeft: '3px' }}> Register here</Link></p>
                </div>
                <input type="email" placeholder='Enter email' style={{ background: context.dark ? 'rgb(66 66 66)' : 'white', height: '47px', outline: 'none', border: 'none', borderRadius: '5px', color: 'inherit', width: '325px', marginTop: '20px', paddingLeft: '14px' }} value={email} onChange={(e) => setemail(e.target.value)} />
                <input type="password" placeholder='Enter password' style={{ background: context.dark ? 'rgb(66 66 66)' : 'white', height: '47px', outline: 'none', border: 'none', borderRadius: '5px', color: 'inherit', width: '325px', marginTop: '20px', paddingLeft: '14px' }} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={login} style={{ fontFamily: 'Poppins', width: '320px', color: context.dark ? 'black' : 'white', border: 'none', outline: 'none', background: context.dark ? 'white' : 'rgb(66 66 66)', height: '44px', borderRadius: '5px', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold' }} variant="outlined">Login</button>
                <Link style={{ textDecoration: 'none', color: 'inherit', fontSize: '12.75px', marginTop: '12px', marginBottom: '5px' }} to="/reset"><p>Forgot Password ?</p></Link>
                <button onClick={() => handleGoogleAuth()} style={{ fontFamily: 'Poppins', width: '320px', border: 'none', outline: 'none', backgroundColor: context.dark ? '#2D3748' : 'rgb(233 233 233)', color: context.dark ? 'white' : 'black', height: '46px', borderRadius: '5px', cursor: 'pointer', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} variant="outlined"><img style={{ width: '20px', marginRight: '9px', fontWeight: 'bold' }} src={googlelogo} alt=""></img> Continue With Google</button>
            </div>
        </div>
    )
}
