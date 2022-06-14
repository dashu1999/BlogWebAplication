import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState(undefined)
  useEffect(() => {
    if (url) {
      postsdetails()
    }
  }, [url])



  const postPic = () => {
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

  const postsdetails = () => {
      fetch("/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title,
          body,
          pic: url
        })
      }).then(res => res.json())
        .then(data => {

          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" })
          }
          else {
            M.toast({ html: "Created post Successfully", classes: "#43a047 green darken-1" })
            navigate('/')
          }
        }).catch(err => {
          console.log(err)
        })
    
  }

  const PostData = () => {
    if (image) {
      postPic()
    } else {
      postsdetails()
    }

  }

  return (

    <div className="card okk input-field">
      <div className="card input-filed"
        style={{
          margin: "30px auto",
          maxWidth: "500px",
          padding: "20px",
          textAlign: "center",
        }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

      </div>
      <textarea className="textarea card"
        cols="30" rows="5"
        type="text"
        placeholder="Write a Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => {
            var file = e.target.files[0];
            var t = file.type.split('/').pop().toLowerCase();
            if (t != "jpeg" && t != "jpg" && t != "png") {
              M.toast({ html: "Image Format is invalid", classes: "#c62828 red darken-3" })
              return;
            }
            setImage(e.target.files[0])
          }} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" placeholder="jpg/jpeg/png" />
        </div>
      </div>
      <button className="btn #64b5f6 blue darken-1"
        onClick={() => PostData()}
      >
        Submit Post
      </button>

    </div>
    // <div
    //   className="card input-filed"
    //   style={{
    //     margin: "30px auto",
    //     maxWidth: "500px",
    //     padding: "20px",
    //     textAlign: "center",
    //   }}
    // >
    //   <input
    //     type="text"
    //     placeholder="Title"
    //     value={title}
    //     onChange={(e) => setTitle(e.target.value)}
    //   />
    //   <input
    //     type="text"
    //     placeholder="Body"
    //     value={body}
    //     onChange={(e) => setBody(e.target.value)}
    //   />
    //   <div className="file-field input-field">
    //     <div
    //       className="btn #c2185b blue darken-2"
    //       style={{ borderRadius: "30px" }}
    //     >
    //       <span>Upload Image</span>
    //       <input type="file" onChange={(e) => setImage(e.target.files[0])} />
    //     </div>
    //     <div className="file-path-wrapper">
    //       <input className="file-path validate" type="text" />
    //     </div>
    //   </div>
    //   <button
    //     className="btn waves-effect waves-light #c2185b pink darken-2"
    //     onClick={() => postDetails()}
    //   >
    //     Submit Post
    //   </button>
    // </div>
  );
};

export default CreatePost
