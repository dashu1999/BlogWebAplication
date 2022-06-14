import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import styled from "styled-components";


const SignUp = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState(undefined)
  useEffect(() => {
    if (url) {
      uploadFields()
    }
  }, [url])

  const uploadPic = () => {
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "dashugram")
    data.append("cloud_name", "dashuthummar")
    fetch("https://api.cloudinary.com/v1_1/dashuthummar/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({
        html: "Invaild email",
        classes: "rounded #c62828 red darken-3",
      })
      return
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        name,
        password,
        email,
        pic: url
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({
            html: data.error,
            classes: "rounded #c62828 red darken-3",
          });
        } else {


          M.toast({
            html: data.message,
            classes: "rounded #388e3c green darken-2",
          });
          navigate("/signin")
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const PostData = () => {
    if (image) {
      uploadPic()
    } else {
      uploadFields()
    }

  }

  const submitHandler = (e) => {
    e.preventDefault();
    PostData();
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <strong><h4 className="center titlee">Sign Up</h4></strong>
        </div>
        <div>
          <label htmlFor='username'>Username <span className='req'>*</span></label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}>
          </input>
        </div>

        <div>
          <label htmlFor='name'>Name <span className='req'>*</span></label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}>
          </input>
        </div>
        <div>
          <label htmlFor='email'>Email Address <span className='req'>*</span></label>
          <input
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}>
          </input>
        </div>
        <div>
          <label htmlFor='password'>Password <span className='req'>*</span></label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}>
          </input>
        </div>

        <div className="file-field input-field in">
          <div
            className="btn #c2185b blue darken-2 bf"
            style={{ borderRadius: "30px" }}
          >
            <span>Upload Profile Pic</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <div>
          <button
            className="btn #c2185b pink darken-2" style={{ borderRadius: "30px" }}
            type="submit"
          >
            Sign Up
          </button>
        </div>             
        <div className='sp center'>
          <h6>
            <Link to="/signin">Already have an Account ?</Link>
          </h6>          
        </div>
      </form>
    </div>


    /* <div className="mycard"> 
    <div className="card auth-card input-field">
      <h2>DBlogger</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="file-field input-field">
        <div
          className="btn #c2185b blue darken-2"
          style={{ borderRadius: "30px" }}
        >
          <span>Upload Profile Pic</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #c2185b pink darken-2"
        onClick={() => PostData()}
      >
        Sign Up
      </button>
      <br />
      <h6>
        <Link to="/signin">Already have an Account ?</Link>
      </h6>
    </div>
    </div>
        */
  );


};

export default SignUp
