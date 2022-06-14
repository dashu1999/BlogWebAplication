import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css'
import { UserContext } from '../../App'

const SignIn = () => {
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")


    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate('/signin')
        }
    }, []);


    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invaild email", classes: "rounded #c62828 red darken-3" })
            return
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                email,
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "Login Susscessfull", classes: "#388e3c green darken-2" })
                    navigate('/')
                }
            }).catch(err => {
                console.log(err)
            })
    }
    const submitHandler = (e) => {
        e.preventDefault();
        PostData();
    };
    return (

        <div>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h4 className='center titlee'>Sign In</h4>
                </div>
                <div>
                    <label htmlFor='email'>Email Address <span className='req'>*</span></label>
                    <input
                        id='email'
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}>
                    </input>
                </div>
                <div>
                    <label htmlFor='password'>Password <span className='req'>*</span></label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}>
                    </input>
                </div>
                <div>
                    <label />
                    <button className='btn waves-effect waves-light #c2185b pink darken-2' type='submit'>
                        Sign In
                    </button>
                </div>
                <div>

                    <div className='center'>
                        <br />
                        <div className='spp'>
                            <button className='btn #c2185b blue darken-2' type='button' style={{ borderRadius: "30px" }}>
                                <Link to="/signup">Don't have an Account. ?</Link>
                            </button>
                        </div>
                        <hr/>
                        <div className='sp'>
                            <Link to="/reset">Forgot Password </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>


        // <div className="mycard">
        //     <div className="card auth-card input-field">
        //         <h2>DBlogger</h2>
        //         <div>
        //             <label htmlFor='email' className='form2'>Email Address</label>
        //             <input                        
        //                 id='email'
        //                 type="text"
        //                 placeholder="Email"
        //                 value={email}
        //                 onChange={(e) => setEmail(e.target.value)}
        //             />
        //         </div>
        //         <div>
        //             <label htmlFor='password'>Password</label>
        //             <input
        //                 type="password"
        //                 placeholder="Password"
        //                 value={password}
        //                 onChange={(e) => setPassword(e.target.value)}
        //             />
        //         </div>
        //         <button className="btn waves-effect waves-light #c2185b pink darken-2"
        //             onClick={() => PostData()}
        //         >
        //             Sign In
        //         </button>
        //         <br />
        //         <h5>
        //             <Link to="/signup">Don't have an Account. ?</Link>
        //         </h5>

        //         <h6>
        //             <Link to="/reset">Forgot Password </Link>
        //         </h6>
        //     </div>
        // </div>
    )
}


export default SignIn
