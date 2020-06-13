import React, { useState, useContext} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar.component";
import Home from "./components/home.component";
import Search from "./components/search.component";
import Main from "./components/main.component";
import About from "./components/about.component";
import CreateReview from "./components/addreview.component.js";
import CreateArticle from "./components/addarticle.component.js";
import Login from "./components/login.component.js";
import Article from "./components/article.component.js";
import EditProfile from "./components/editprofile.component.js";
import User from "./components/user.component.js";
import Tag from "./components/tag.component.js";
import Signup from "./components/signup.component.js";
import ViewReview from "./components/viewreview.component.js";
import SendRequest from "./components/sendrequest.component.js";
import Requests from "./components/requests.component.js";
import HomeController from "./controllers/HomeController.component.js";
import PrivateRoute from './PrivateRoute';

import { AuthContext } from "./context/auth";



const App = () => {
  const [authTokens, setAuthTokens] = useState(JSON.parse(localStorage.getItem("tokens")));

  const setTokens = async(data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
    console.log(authTokens);
  }
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens}}>
    <Router>
          <Navbar />
          <div className="container border-left-1 border-right-1">
          <Route path="/" exact component={Main} />
          <Route path="/search" component={Search} />
          <PrivateRoute path="/home" component={Home} />
          <Route path="/about" component={About} />
          <PrivateRoute path="/createreview" component={CreateReview} />
          <PrivateRoute path="/createarticle" component={CreateArticle} />
          <Route path="/login" component={Login} />
          <Route path="/article" component={Article} />
          <Route path="/user" component={User} />
          <Route path="/editprofile" component = {EditProfile} />
          <Route path="/tag" component = {Tag} />
          <Route path="/signup" component = {Signup} />
          <Route path="/viewreview" component = {ViewReview} />
          <PrivateRoute path='/test' component = {HomeController} />
          <PrivateRoute path="/sendrequest" component = {SendRequest} />
          <PrivateRoute path="/requests" component = {Requests} />
          </div>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
