import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../context/auth";
import Crypto from "crypto-js";



const Signup = () => {
   
  const [username, setUsername] = useState("");
  const [usernamePass, setUsernamePass] = useState(false);

  const [email, setEmail] = useState("");
  const [emailPass, setEmailPass] = useState(false);

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordPass, setPasswordPass] = useState(false);

  const [passwordHash, setPasswordHash] = useState();
  const [error, setError] = useState(false);
  const [depart, setDepart] = useState("stationary");

  const [usernameMessage, setUsernameMessage] = useState("Username must be unique and greater than 2 letters");



  const [emailMessage, setEmailMessage] = useState("Please enter an email. It will not be used against you!");
  const [password1Message, setPassword1Message] = useState("Password must be greater than 6 characters");
  const [password2Message, setPassword2Message] = useState("For best results, write password somewhere else and copy and paste here");
  const { setAuthTokens, authTokens } = useAuth();

  if(depart !== "stationary") {
    return <Redirect to="/home" />;
  }

  const verifyPassword = (e) => {
    // Password may not contain spaces or the following characters "/, \,"
    if (password1 !== e) {
      setPassword2Message("not matching");
      setPasswordPass(false);
    }
    else {
      setPassword2Message("Matching! You are good to go!")
      setPasswordPass(true);
    }
  }

  const verifyUsername = (e) => {
    // username must be greater than 2 letters
    if(e.length < 3) {
      setUsernameMessage("Keep goin'");
    }
    // username must be unique
    else {
      axios.get("http://192.168.99.104:6200/api/users/confirmifusernameexists/" + e).then(
        res =>  {
          if(res["data"]=== "empty") {
            setUsernameMessage("This username is free to take!");
            setUsername(e);
            setUsernamePass(true);
          }
          else {
            setUsernameMessage("Alas, this username is already taken.");
            setUsernamePass(false);

          }
        });
    }


  }



  const verifyEmail = (e) => {
    // username should  have an '@' and a ".com"
    // username special characters are limited to "." and no spaces
    var pat = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    var check = e.search(pat);
    if (check !== -1) {
      axios.get("http://192.168.99.104:6200/api/login/findbyemail/"+e).then((res) => {
        if(res["data"] !== "empty") {
          setEmailMessage("You already seem to have an account here");
          setEmailPass(false);

        }
        else {
          setEmailMessage("Looking good!");
          setEmail(e);
          setEmailPass(true);
        }
      });
    }

  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (emailPass && usernamePass && emailPass && passwordPass) {
        console.log("user can be added");
        //submit, set localhost, redirect
        const newUser = {
          "username" : username,
          "description": "To edit description, edit profile",
          "toEat": [],
          "specialties" : [],
          "tags" : [],
          "articles": [],
          "reviews" : [],
          "requests" : [],
          "picture" : ""
        };

        console.log("User " + newUser);

        axios.post("http://192.168.99.104:6200/api/users/add", newUser).then(() => {
          // retrieve id of record you just added
          axios.get("http://192.168.99.104:6200/api/users/getidbyusername/"+username).then((res) => {
            if(res["data"] === "empty") {
              console.log("Something went wrong");
            }

            else {
              const newLoginData = {
                "username" : username,
                "email" : email,
                "passwordHash" : Crypto.SHA256(password2).toString(),
                "usernameID" : res["data"]
              }

              console.log(newLoginData);
              console.log("data: " + res["data"]);
              console.log("password: " + Crypto.SHA256(password2).toString() );

              axios.post("http://192.168.99.104:6200/api/login/add", newLoginData).then(() => {
                const check = Crypto.SHA256(password2).toString();
                var userName = username;
                axios.post('http://192.168.99.104:6200/api/login/validatelogin/', {userName, check})
                .then(result => {
                  if (result.status === 200) {

                    setAuthTokens(result.data);
                    setDepart("/home");

                  }
                }).catch(e => {
                  console.log("Error at PostLogin: " + e);
                });
              });
            }
          })
        });
    }
    else {
      console.log("You did something wrong");
    }
  }

  return (
    <div>
    <form onSubmit={onSubmit}>
    <div className="form-group fieldwidth">
      <label >Username</label>
      <input type="text"
      required

      className="form-control"
      maxlength="16"
      onChange= {e => {
        verifyUsername(e.target.value);
      }}
      />
    </div>
    <div className="help-block">{usernameMessage}</div>
    <div className="form-group fieldwidth">
      <label >Email</label>
      <input type="text"
      required
      className="form-control"
      maxlength="32"
      onChange= {e => {
        verifyEmail(e.target.value);
      }}
      />
    </div>
    <div className="help-block">{emailMessage}</div>
    <div className="form-group fieldwidth">
      <label >Password</label>
      <input type="password"
      required
      className="form-control"
      maxlength="16"
      onChange= {e => {
        setPassword1(e.target.value);
      }}
      />
    </div>
    <div className="help-block">{password1Message}</div>
    <div className="form-group fieldwidth">
      <label >Confirm Password</label>
      <input type="password"
      required
      className="form-control"
      maxlength="16"
      onChange= {e => {
        setPassword2(e.target.value);
        verifyPassword(e.target.value);
      }}
      />
    </div>
    <div className="help-block">{password2Message}</div>
    <button type="submit" className="btn btn-primary">Submit</button>
    </form>

    </div>
  )

}

export default Signup;
