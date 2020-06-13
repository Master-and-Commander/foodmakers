import React, {Component, useState, useEffect} from 'react';
import {useAuth} from '../context/auth';
import axios from 'axios';
import { Link, Redirect } from "react-router-dom";
import Test from "./components/test.component";

const HomeController = () => {

    const {setAuthTokens, authTokens } = useAuth();
    const [userDetails, setUserDetails] = useState();

    // Not sure if these should be needed
    const [exit, setExit] = useState("false");
    const [extra, setExtra] = useState("notset");

    
    const generateData = async(props) => {
        response = ""
        switch(props) {
            case("title"):
             response = "This is a title";
            break;
            case("section"):
              response = "section";
            break;
        }
        return response;

    }

    const testing1 = Test(generateData("title"));
    const testing2 = Test(generateData("section"));

    // this manages the state for home

    return ( 
        <div>
          {{testing1}}
          {{testing2}}
        </div>
    );
}
    export default HomeController;