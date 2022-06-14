/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, createContext, useReducer, useContext } from 'react';
import NavBar from './components/Navbar'
import "./App.css"
import { BrowserRouter,Route, Routes, useNavigate } from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import { reducer, initialState } from '../src/reducers/UserReducer'
import NewPassword from './components/screens/NewPassword'
import ChangeEmail from './components/screens/ChangeEmail'

import NewEmail from './components/screens/NewEmail'
import DeleteAccount from './components/screens/DeleteAccount'
import ChangeUsername from './components/screens/Change-username'
import ChangeName from './components/screens/Change-name'
import './App.css';
import ScrollToTop from './components/screens/ScrollToTop';
import SignIn from './components/screens/Signin';
import SignUp from './components/screens/Signup';

import ResetPassword from './components/screens/ResetPassword';
import { createBrowserHistory } from 'history';




export const UserContext = createContext()





const Routing = () => {
  const navigate = useNavigate()
  const history = createBrowserHistory()

  const { state, dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: "USER", payload: user })
      // navigate("/")
    } else {
      if (!history.location.pathname.startsWith('/reset'))
        navigate("/signin")
    }
  }, [])
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/createpost" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route exact path="/reset" element={<ResetPassword />} />
      <Route path="/reset/:token" element={<NewPassword />} />
      <Route exact path="/change-email" element={<ChangeEmail />} />
      <Route path="/changeEmail/:token" element={<NewEmail />} />
      <Route path="/delete-account" element={<DeleteAccount />} />
      <Route path="/change-username" element={<ChangeUsername />} />
      <Route path="/change-name" element={<ChangeName />} />
      
    </Routes>

  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (

    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <div>
          <BrowserRouter>
            <NavBar />
            <main>
              <Routing />
            </main>
            <ScrollToTop />
          </BrowserRouter>
        </div>
      </UserContext.Provider>
    </>

  );
}

export default App;
