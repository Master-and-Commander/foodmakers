import React, {Component, useState, useEffect} from 'react';
import {useAuth} from '../context/auth';
import axios from 'axios';
import { Link, Redirect } from "react-router-dom";


// str to replace : http://192.168.99.104:6200
const Home = () => {
  /*
   Home shows the user's profile description and created articles
  */
  const { setAuthTokens, authTokens } = useAuth();
  const [userDetails, setUserDetails] = useState();
  const [depart, setDepart] = useState("false");
  const [extra, setExtra] = useState("notset");
  const [buttons, setButtons] = useState([]);
  const [eatList, setEatlist] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [userArticles, setUserArticles] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [description, setDescription] = useState("");
  
  const initializeUserProfile = () => {
    // pull user basics from auth tokens username ID
    const profilePromise = axios.get("http://192.168.99.104:6200/api/users/get/" + authTokens[0].usernameID);
    return profilePromise.then(async(data) => {
      setUserDetails(data["data"]);
      setDescription(<span>
      {data["data"]["description"]}
      </span>);
      presentUserEatList(data["data"]["toEat"]);
      presentUserReviews(data["data"]["reviews"]);
      presentUserArticles(data["data"]["articles"]);
      presentUserTags(data["data"]["tags"], data["data"] );


    });
  }

  const presentUserEatList = async(e) => {
    // these are 'starred' articles that the user wants to see for further consideration
    var arr = [];
    Promise.all(e.map(async(item)=> {
      var author = await axios.get("http://192.168.99.104:6200/api/articles/fetchauthor/" + item);
      var title = await axios.get("http://192.168.99.104:6200/api/articles/fetchtitle/" + item);
      var articleInfo = await axios.get("http://192.168.99.104:6200/api/articles/get/" + item);
      var name = await axios.get("http://192.168.99.104:6200/api/users/fetchusername/" + author["data"]);
      var path = "/"+name["data"]+"/"+item;
      console.log("path " + path);

      arr.push(
      <div>
        <div className="card border-0">
          <div className="card-body">
            <div className="row no-gutters">
              <div className="col-md-1">
                <img src={"/"+name["data"]+"/"+item+".PNG"} className="card-img rounded-0" alt="..." />
              </div>
            <div className="col-md-8">
              <div className = "row">
                <h3 className="card-title" >
                  <Link to={{pathname: '/article', state: { articleID: item }}}>{title["data"]}</Link> by 
                  <Link to={{pathname: '/user', state: { userID: author["data"] }}}>{name["data"]}</Link> 
                </h3>
                  <div className="dropdown ml-auto">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Options
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <button className="dropdown-item" onClick={() => {setDepart("reviewArticle"); setExtra(item);}}>
                        Review
                      </button>
                      <button className="dropdown-item" onClick={() => {setDepart("request"); setExtra(item)}}>
                        Request
                      </button>
                      <button className="dropdown-item" onClick={() => {
                        console.log("removing http://localhost:5000/users/removeitemfromeatlist/"+authTokens[0].usernameID+"/"+item);
                        axios.post("http://192.168.99.104:6200/api/users/removeitemfromeatlist/"+authTokens[0].usernameID+"/"+item);
                        initializeUserProfile();
                      }} >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                <p className="card-text"> Description: {articleInfo["data"]["description"]} </p>
              </div>
            </div>
          </div>
        </div>
      </div>);
    })).then(() => {
      setEatlist(arr);
    });
  }

  const presentUserReviews = (e) => {
    // need the article name
    // need the author of the article name
    // need the author name
    // the array to return
    var arr = [];
    Promise.all(e.map(async(item)=> {
      // Reviews to fetch
      var review = await axios.get("http://192.168.99.104:6200/api/reviews/get/"+item);
      var author = await axios.get("http://192.168.99.104:6200/api/articles/fetchauthor/" + review["data"]["articleId"]);
      var title = await axios.get("http://192.168.99.104:6200/api/articles/fetchtitle/" + review["data"]["articleId"]);
      var name = await axios.get("http://192.168.99.104:6200/api/users/fetchusername/" + author["data"]);
      arr.push(
        <div>
          <div className="card border-0">
            <div className="card-body">
              <div className="row no-gutters">
                <div className="col-md-1">
                  <img src={"/"+name["data"]+"/"+review["data"]["articleId"]+".PNG"} className="card-img rounded-0" alt="..." />
                </div>
                <div className="col-md-8">
                  <div className = "row">
                    <h3 className="card-title" >
                      <Link to={{pathname: '/article',state: { articleID: review["data"]["articleId"] }}}>
                        {title["data"]}
                      </Link> by 
                      <Link to={{pathname: '/user', state: { userID: author["data"] }}}>
                        {name["data"]}
                      </Link> 
                      {review["data"]["rating"]}/5  {review["data"]["approved"]}
                    </h3>
                    <div className="dropdown ml-auto">
                      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Options
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <button className="dropdown-item" onClick={() => {
                          setDepart("viewreview");
                          setExtra(item);
                        }} >
                          View
                        </button>
                        <button className="dropdown-item" onClick={() => {setDepart("reviewArticle"); setExtra(review["data"]["articleId"])}} >
                          edit
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="card-text"> 
                    Description: {review["data"]["description"]} 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>);
      })).then(() => {
      setUserReviews(arr);
    });
  }

  const presentUserArticles = async(e) => {
     var arr = [];
     Promise.all(e.map(async(item)=> {
      var author = await axios.get("http://192.168.99.104:6200/api/articles/fetchauthor/" + item);
      var title = await axios.get("http://192.168.99.104:6200/api/articles/fetchtitle/" + item);
      var articleInfo = await axios.get("http://192.168.99.104:6200/api/articles/get/" + item);
      var name = await axios.get("http://192.168.99.104:6200/api/users/fetchusername/" + author["data"]);
      var path = "/"+name["data"]+"/"+item;

    arr.push(<div>
         <div className="card border-0">
           <div className="card-body">
           <div className="row no-gutters">
             <div className="col-md-1">
             <img src={"/"+name["data"]+"/"+item+".PNG"} className="card-img rounded-0" alt="..." />
             </div>

           <div className="col-md-8">
             <div className = "row">
               <h3 className="card-title" ><Link to={{
                      pathname: '/article',
                      state: { articleID: item }}}>{title["data"]}</Link> by <Link to={{
                             pathname: '/user',
                             state: { userID: author["data"] }}}>{name["data"]}</Link> </h3>

                <div className="dropdown ml-auto">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Options
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <button className="dropdown-item" onClick={() => {setDepart("reviewArticle"); setExtra(item)}} >Review</button>
                    <button className="dropdown-item" onClick={() => {setDepart("editarticle"); setExtra(item)}} >Edit</button>
                    <button className="dropdown-item" onClick={() => {setDepart("request"); setExtra(item)}}> Request </button>
                  </div>
                </div>

             </div>
              <p className="card-text"> Description: {articleInfo["data"]["description"]} </p>

           </div>

           </div>
           </div>
         </div>
       </div>);
     })).then(() => {
        setUserArticles(arr);
     });

   }

  const presentUserTags = (e, details) => {
    var arr = [];
    Promise.all(e.map(async(item) => {
      var tag = await axios.get("http://192.168.99.104:6200/api/tags/get/" + item);
      // show different color for what the user is an 'expert' in
      if(details["specialties"].includes(item))
        arr.push(
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-primary mr-2" onClick={(e)=>{setDepart("tag");setExtra(item);}} >
              {tag["data"]["name"]}
            </button>
          </div>
        );
      else {
        arr.push(
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-secondary mr-2" onClick={(e)=>{setDepart("tag"); setExtra(item);}}>
              {tag["data"]["name"]}
            </button>
          </div>
        );
      }
     })).then(() => {
       setUserTags(arr);
     });
   }
   // initialize profile only once
  React.useEffect(() => { initializeUserProfile() }, []);
  if(depart !== "false") {
    if (depart === "viewreview") {
      return <Redirect to= {{pathname: '/viewreview', state: { reviewID: extra }}} />;
    }

    else if (depart === "reviewArticle") {
      if(extra !== "notset")
        return <Redirect to={{pathname: '/createreview', state: { articleID: extra }}} />;
      else {
        return  <Redirect to='/createreview' />;
      }
    }
    
    else if (depart === "editprofile") {
      return <Redirect to='/editprofile' />;
    }

    else if (depart === "create") {
      return <Redirect to='/createarticle' />;
    }

    else if (depart === "tag") {
      console.log("departing" + extra);
      return <Redirect to={{pathname: '/tag',state: { tagID: extra }}} />;
    }

    else if (depart === "editarticle") {
      return <Redirect to={{pathname: '/createarticle', state: { articleID: extra }}}/>
    }

    else if (depart === "view") {
      console.log("departing" + extra);
      return <Redirect to={{pathname: '/article',state: { articleID: extra }}}/>
    }
    else if (depart === "request") {
      return(<Redirect to={{pathname: '/sendrequest',state: { articleID: extra }}} />)
    }
  }

  const renderButtons = () => {
    var toret = [];
    for(var i = 0;i < buttons.length;i++) {
      try{throw i}
      catch(ii) {
        toret.push(
          <div className="btn-group" role="group">
            <button type="button" id={i} className="btn btn-secondary mr-2" onClick=
            {(e) => {setExtra(buttons[e.target.id]["id"]);setDepart("tag");}}>
              {buttons[i]["name"]}
            </button>
          </div>
        );
      }
    }
    return toret;
  }



  return (
    <div className="card border-0">
      <div className="row no-gutters">
        <div className="col-md-4">
          <img src="/RedCrown/IMAGE-RedCrown.jpg" className="card-img rounded-0" alt="..." />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h1 className="card-title rightalign">{authTokens[0].username}</h1>
            <div className="text-right">
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Options
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <button className="dropdown-item" onClick={() => {setDepart("reviewArticle")}}>
                    Review
                  </button>
                  <button className="dropdown-item" onClick={() => {setDepart("editprofile")}}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
            <p className="card-text">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="card-body">
        {userTags}
        <h5>
          <small>interests</small>
        </h5>
      </div>
      <div>
        <h2>Recipes to try</h2>
        <hr className="style1" />
          {eatList}
      </div>
      <div>
        <h2>My Reviews</h2>
        <hr className="style1" />
        {userReviews}
        <h2>My Articles</h2>
        <hr className="style1" />
        {userArticles}
     </div>
    </div>
  )
}


export default Home;
