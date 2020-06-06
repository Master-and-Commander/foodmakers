import React, {Component, useState, useEffect} from 'react';
import {useAuth} from '../context/auth';
import axios from 'axios';
import { Link, Redirect } from "react-router-dom";
import {useAsyncHook} from './useAsyncHook';

const Tag = (e) => {
  const [name, setName] = useState();
   
  const [description, setDescription] = useState();
  const [query, setQuery] = useState();
  const [result, finished] = useAsyncHook("http://192.168.99.104:6200/api/tags/get/" + ((typeof e["history"]["location"]["state"] === 'undefined') ? "erroneous" : e["history"]["location"]["state"]["tagID"]  )  );
  var origin = "0";
  if (typeof e["history"]["location"]["state"]=== 'undefined') {
    console.log("user did not come from another page");

  }
  else {
    origin = e["history"]["location"]["state"]["tagID"];
    console.log("something else");
    console.log("query would be http://localhost:5000/tags/get/" + origin);

  }

  React.useEffect(() => {
   //setQuery("http://192.168.99.104:6200/api/tags/get/" + e["history"]["location"]["state"]["tagID"]);
  }, []);

  const renderDetails = () => {
   return (
     <div>
      <h1> {result["data"].name} </h1>
      <hr />
      <p> {result["data"].description} </p>
     </div>

   );


  }

  return (
    <div>
     <h1>{origin}</h1>
     <div>
     {finished  === undefined ? (<span>{renderDetails()}</span>)
     : (<p>nothing here</p>)}
     </div>
    </div>
  )



  return (<h1> Hey hey </h1>)
}







export default  Tag;
