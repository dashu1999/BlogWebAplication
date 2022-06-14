/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line
import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App'
import { GrClose } from 'react-icons/gr';
import { CgProfile } from 'react-icons/cg';
import { HiChatAlt } from 'react-icons/hi';
import { FiCamera } from 'react-icons/fi';
import { BiHomeAlt } from 'react-icons/bi'

import styled from 'styled-components'

import ScrollToTop from './screens/ScrollToTop/index'
import '../App.css'
import GoToTop from './screens/ScrollToTop';
import M from 'materialize-css'



const StyledButton = styled.button`
    font-size: 1.7rem;
`
const StyledIcon = styled.div`
    font-size: 1.5rem;
    margin-left: -10px;
    margin-top: 2px;
    @media only screen and (max-width: 800px) {
       margin-left: -20px;
    }
`
const StyledIcon1 = styled.div`
    font-size: 1.5rem;
    margin-left: -40px;
    margin-top: -2px;
`

const NavBar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const navigate = useNavigate()
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        M.Modal.init(searchModal.current)
        let sidenav = document.querySelector('#nav-mobile');
        M.Sidenav.init(sidenav, {});
    }, [])

    const renderList = () => {
        if (state) {
            return [
                <li key="1"><StyledIcon1><i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i></StyledIcon1></li>,

                // <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i></li>,
                <li key="2"><Link style={{ color: "black" }} to={state ? "/" : "/signin"}><StyledIcon><BiHomeAlt /></StyledIcon></Link></li>,

                // <li key="0"><Link to="/chats"><StyledIcon><HiChatAlt /></StyledIcon></Link></li>,
                <li key="4"><Link style={{ color: "black" }} to="/profile"><StyledIcon><CgProfile /></StyledIcon></Link></li>,
                <li key="5"><Link style={{ color: "black" }} to="/createpost"><StyledIcon><FiCamera /></StyledIcon></Link></li>,
                // <li key="2">< Link to="/profile">Profile</Link></li>,
                // <li key="6"><Link to="/myfollowingpost">My Following Posts</Link></li>,
                // <li key="4"><Link to="/createpost">Create Post</Link></li>,
                <li key="7">
                    <button className="btn #c62828 red darken-3 ok"
                        
                        onClick={() => {
                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            navigate('/signin')
                            M.toast({ html: "Logged out successfully", classes: "#43a047 green darken-1" })
                        }}
                    >
                        Logout
                    </button>
                </li>
            ]
        } else {
            return [
                <li key="8"><Link className='signin' to="/signin">SignIn</Link></li>,
                <li key="9"><Link className='signup' to="/signup">SignUp</Link></li>,

            ]
        }
    }

    const fetchUsers = (query) => {
        setSearch(query)
        fetch('/search-users', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query
            })
        }).then(res => res.json())
            .then(results => {
                setUserDetails(results.user)
            })
    }
    return (


        <nav className="navbar">
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo left">DBlogger</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal style-width" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-footer">
                    <StyledButton className="modal-close waves-effect waves-white btn-flat right" onClick={() => setSearch('')}><GrClose /></StyledButton>
                </div>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="Search users"
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)}
                    />
                    {
                        userDetails && userDetails.length > 0
                            ?
                            <ul className="collection">
                                {userDetails.map(item => {
                                    return (
                                        <Link to={item._id !== state._id ? "/profile/" + item._id : '/profile'} onClick={() => {
                                            M.Modal.getInstance(searchModal.current).close()
                                            setSearch('')
                                        }}><li className="collection-item">
                                                <img className="search-image" src={item.pic} alt={item._id} />
                                                <span className="search-user">{item.username}</span>
                                                <span className="search-email">{item.email}</span>
                                            </li></Link>
                                    )
                                })}
                            </ul> : <ul>No result found</ul>
                    }
                </div>
            </div>
            <ScrollToTop />
            <GoToTop />
        </nav>



        // <nav>
        //     <div className="nav-wrapper white">
        //         <Link to={state ? "/" : "/signin"} className="brand-logo left">Blog</Link>
        //         <Link to="#" data-target="mobile-demo" className="sidenav-trigger right"><i className="material-icons right">menu</i></Link>
        //         <ul id="slide-out" className="right hide-on-med-and-down">
        //             {renderList()}
        //         </ul>
        //     </div>
        //     <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
        //         <div className="modal-content">
        //             <input
        //                 type="text"
        //                 placeholder="search users"
        //                 value={search}
        //                 onChange={(e) => fetchUsers(e.target.value)}
        //             />
        //             <ul className="collection">
        //                 {
        //                     userDetails.map(item => {
        //                         return <Link to={item._id !== state._id ? "/profile/" + item._id : "/profile"} onClick={() => {
        //                             M.Modal.getInstance(searchModal.current).close()
        //                             setSearch('')
        //                         }}><li className="collection-item">{item.name}</li></Link>
        //                     })
        //                 }
        //             </ul>

        //         </div>
        //         <div className="modal-footer">
        //             <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Close</button >
        //         </div>
        //     </div>
        //     <ul className="sidenav" id="mobile-demo">
        //         {renderList()}
        //     </ul>
        // </nav>
    )
}


export default NavBar