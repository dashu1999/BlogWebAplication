import React,{useState,useContext,} from 'react'
import {useNavigate} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
const Reset  = ()=>{
    const navigate = useNavigate()
    const {state,dispatch} = useContext(UserContext)
    const [email,setEmail] = useState("")
    const [name,setName] = useState("")
    const PostData = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid email",classes:"#c62828 red darken-3"})
            return
        }
        fetch('/change-name',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
               M.toast({html:data.message,classes:"#43a047 green darken-1"})
               localStorage.clear()
               dispatch({type:"CLEAR"})
               navigate('/signin')
               M.toast({html: "Sign in again to confirm it was you.",classes:"#43a047 green darken-1"})
           }
        }).catch(err=>{
            console.log(err)
        })
    }
   return (
      <div className="mycard">
          <div className="card auth-card input-field">
            <h2>DBlogger</h2>
            <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input
            type="text"
            placeholder="Enter your new name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
            <button className="btn #64b5f6 blue darken-1"
            onClick={()=>PostData()}
            >
               Change Name
            </button>
            
    
        </div>
      </div>
   )
}


export default Reset