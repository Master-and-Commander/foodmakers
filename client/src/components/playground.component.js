import React, {Component, useState, useEffect} from 'react';
import {useAuth} from '../context/auth';
import axios from 'axios';
import { Link, Redirect } from "react-router-dom";
// https://camjackson.net/post/9-things-every-reactjs-beginner-should-know
// try to implement stateless functionality
const Playground = props => {
    const profileDescription = renderProfileDescription(props.id);
    const
}

export default Playground;
