import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {useAuth} from '../context/auth';

const Navbar = () => {
    const { setAuthTokens, authTokens } = useAuth();
    const [depart, setDepart] = useState("stationary");
    /*
    if(depart !== "stationary"){
      if(depart === "login") {
        return <Redirect to='/login' />;
      }
    }
    */

    const toggleLogin = () => {
      if(localStorage.getItem("tokens")=== null) {
        // user not logged in
        return(<button className="nav-item btn btn-secondary ml-auto" onClick={() => {
          setDepart("login");
        }}>Log in/ Sign up</button>)
      }
      else {
        return (<button className="nav-item btn btn-secondary  ml-auto" onClick={() => {
          localStorage.removeItem("tokens")
          setAuthTokens(null);
          setDepart("login");
        } }>Log out</button>)
      }
    }



    return (
      <div>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">FoodMakers</Link>
        <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto row navbar-collapse collapse">
          <li className="navbar-item">
          <Link to="/home" className = "nav-link">Home</Link>
          </li>
          <li className="navbar-item">
          <Link to="/search" className="nav-link">Recipes</Link>
          </li>
          <li className="navbar-item">
          <Link to="/requests" className="nav-link">Requests</Link>
          </li>
          <li className="navbar-item">
          <Link to="/" className="nav-link">Main</Link>
          </li>
          <li className="navbar-item">
          <Link to="/about" className="nav-link">About</Link>
          </li>

          {toggleLogin()}
          </ul>
          </div>
          </nav>
          {
            depart === "login" ? (<Redirect to='/login' />)
            : (<span>  </span>)
          }
          </div>
    );

}
export default Navbar;
