import React, {Component, useState} from 'react';
import windowSize from 'react-window-size';
import {useAsyncHook} from './useAsyncHook';
import { Link, Redirect } from "react-router-dom";
import {useAsyncHookforList} from './useAsyncHookforList';
import {useAuth} from '../context/auth';
import axios from 'axios';

const Article = (e) => {
  const {authTokens} = useAuth();
   
  const [result, finished] = useAsyncHook("http://192.168.99.104:6200/api/articles/get/" + ((typeof e["history"]["location"]["state"] === 'undefined') ? "erroneous" : e["history"]["location"]["state"]["articleID"]  )  );
  const [username, userNameRetrieved] = useAsyncHook("http://192.168.99.104:6200/api/users/get/" + ((typeof finished === 'undefined') ? result["data"].author : "erroneous"));
  const [tags, finTags] = useAsyncHookforList("http://192.168.99.104:6200/api/articles/get/" + ((typeof e["history"]["location"]["state"] === 'undefined') ? "erroneous" : e["history"]["location"]["state"]["articleID"] ), "http://192.168.99.104:6200/api/tags/get/", "tags");
  const [extra, setExtra] = useState();
  const [depart, setDepart] = useState("stationary");
  const [buttons, setButtons] = useState([]);


  React.useEffect(() => {
    if(finTags === "Success") {
      var initialization = [];
      console.log("length of list " + tags.length);
      for(var i = 0;i < tags.length;i++) {
        try{throw i}
        catch(ii) {
        initialization.push({
          "name" : tags[i]["data"]["name"],
          "id" : tags[i]["data"]["_id"]
        });
        }
      }
    setButtons(initialization);

    }

  }, [finTags]);

  const renderButtons = () => {
    var toret = [];
    console.log("Buttons array " + buttons);
    for(var i = 0;i < buttons.length;i++) {
      try{throw i}
      catch(ii) {

        toret.push(
          <div className="btn-group" role="group">
          <button type="button" id={i} className="btn btn-secondary mr-2" onClick={(e) => {
            setExtra(buttons[e.target.id]["id"]);
            setDepart("tag");
          }} >{buttons[i]["name"]}</button>
          </div>
        );


      }
    }

    return toret;

  }



  if(depart !== "stationary") {
    if(depart === "author") {
      console.log("departing" + extra);
      return <Redirect to={{
             pathname: '/user',
             state: { userID: extra }}} />;
    }
    else if(depart === "tag") {
      console.log("departing" + extra);
      return <Redirect to={{
             pathname: '/tag',
             state: { tagID: extra }}} />;
    }
    else if(depart === "review") {
      console.log("departing" + extra);
      return <Redirect to={{
             pathname: '/createreview',
             state: { articleID: extra }}} />;
    }

  }

  const addToEatList = (articleID) => {
    axios.post("http://192.168.99.104:6200/api/users/updateeatlist/"+authTokens[0].usernameID +"/"+ articleID).then((res) => console.log(res));

  }


  const returnSpecificContent = () => {
     return (
       <div>
       <div className="card border-0">
        <div className="row no-gutters">
          <div className="col-md-4">
              <img src="/RedCrown/IMAGE-RedCrown.jpg" className="card-img rounded-0" alt="..." />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h1 className="card-title rightalign">{result["data"].title}</h1>
              <div className="text-right">
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Options
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <button className="dropdown-item" onClick={(e) => {
                    setExtra(result["data"]["_id"]);
                    setDepart("review");
                  }} >Review</button>
                  <button className="dropdown-item" onClick={(e) => {
                    addToEatList(result["data"]["_id"]);
                  }} >Add to Eat list</button>
                  <button className="dropdown-item" onClick={() => {setDepart("editprofile")}} >Edit</button>
                </div>
              </div>
              </div>

               <p className="card-text">
               <div>
               {result["data"].description}
               </div>
               <div>
               <span>by {userNameRetrieved  === undefined ? (<span><a onClick={(e) => {
                 setExtra(result["data"].author);
                 setDepart("author"); }}>{username["data"].username}</a></span>) : (<span> chef </span>)}</span>
               </div>
               </p>
              </div>
            </div>
          </div>
          <div className="card-body">
          {renderButtons()}
            <h5><small>tags</small></h5>
          </div>
          </div>
          <div>
          <h2>Ingredients</h2>
            <hr />
            <p className="linebreaks">{result["data"].ingredients}</p>
            <br />
          </div>
          <div>
          <h2>Steps</h2>
            <hr />
            <p className="linebreaks">{result["data"].steps}</p>
            <br />
          </div>
          <div>
           <h2> Related </h2>
           <hr />
          </div>

          </div>
     );
  }



  return (
    <div>
     <div>{finished  === undefined ? (<span>{returnSpecificContent()}</span>)
     : (<p>nothing here</p>)}
     </div>
    </div>
  )

}

export default Article;
