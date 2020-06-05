import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../context/auth";
import Crypto from "crypto-js";

function Login(props) {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens, authTokens } = useAuth();
  const [stem, setStem] = useState("http://192.168.99.104:6200");
  ///const referer = props.location.state.referer || '/home';
  /// https://stackoverflow.com/questions/47164330/axios-api-calls-in-heroku/47165888

  const postLogin = async(e) => {
    e.preventDefault();
    const check = Crypto.SHA256(password).toString();
    axios.get(stem+"/api/tags/").then((result) => {
      console.log("Result " + result);
    });
    axios.post(stem + '/api/login/validatelogin/', {userName, check})
    .then(result => {
      if (result.status === 200) {
        console.log("data");
        console.log(result.data);
        setAuthTokens(result.data);

        setLoggedIn(true);

      }
    }).catch(e => {
      console.log("Error at PostLogin: " + e);
    });
  }
  if (isLoggedIn) {
    return <Redirect to="/home" />;
  }



  return (
     <div>
      <form onSubmit={postLogin}>
        <input
          type="username"
          value={userName}
          onChange={e => {
            setUserName(e.target.value);
          }}
          placeholder="email"
        />
        <input
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
          }}
          placeholder="password"
        />
        <button>Sign In</button>
      </form>
      <p> Don't have an account?<Link to="/signup"> Sign up </Link> </p>
      </div>
  );

}

export default Login;
