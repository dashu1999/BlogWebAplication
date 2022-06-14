import React,{useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import M from 'materialize-css'


const NewPassword = () => {
    const navigate = useNavigate()
    const [password,setPassword] = useState("")
    const { token } = useParams()    
    console.log(token)
    const PostData= ()=>{
    
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error, classes: "rounded #c62828 red darken-3"})
            }
            else{
                M.toast({html: data.message, classes: "rounded #388e3c green darken-2"})
                navigate('/signin')
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
                type="password"
                placeholder="Enter a new Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #c2185b pink darken-2"
                onClick={()=>PostData()}
                >
                    Update passowrd
                </button>
            </div>
        </div>
    )
}


export default NewPassword
