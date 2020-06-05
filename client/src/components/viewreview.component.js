import React, {Component, useState, useEffect} from 'react';
import {useAuth} from '../context/auth';
import axios from 'axios';
import { Link, Redirect } from "react-router-dom";


const ViewReview = (e) => {
   const [reviewID, setReviewID] = useState((typeof e["history"]["location"]["state"] === 'undefined') ? "notset" : e["history"]["location"]["state"]["reviewID"]);
   const [reviewInfo, setReviewInfo] = useState([]);
   const [related, setRelated] = useState([]);
   const [stem, setStem] = useState("http://192.168.99.104:6200");


   const showReview = async() => {
     if(reviewID !== "notset") {
       console.log(stem + "/api/reviews/get/"+ reviewID);
       var review = await axios.get(stem + "/api/reviews/get/"+ reviewID);
       var author = await axios.get(stem + "/api/articles/fetchauthor/" + review["data"]["articleId"]);
       var title = await axios.get(stem + "/api/articles/fetchtitle/" + review["data"]["articleId"]);;
       var name = await axios.get(stem + "/api/users/fetchusername/" + author["data"]);
       var reviewer = await axios.get(stem + "/api/users/fetchusername/" + review["data"]["reviewer"]);
       setReviewInfo(
         <div>
         <h1>{review["data"]["title"]}</h1>
         <hr className="style1" />
        <p className="text-muted"><Link to={{
               pathname: '/article',
               state: { articleID: review["data"]["articleId"] }}}>{title["data"]}</Link> by {name["data"]} </p>
         <hr className="style1" />
         <p className="lead">{review["data"]["description"]}</p>
         <hr />
         <p className="text-muted"> {review["data"]["rating"]}  </p>
         <p  className="text-muted"> -<Link to={{pathname: '/user', state: {userID: review["data"]["reviewer"]}}}>{reviewer["data"]}</Link> </p>

         </div>);
     }
     else {
       console.log("You have gotten here the wrong way");
       return(<p> you are guilty of high treason </p>);
     }

   }

   const showRelated = () => {
     if(reviewID !== "notset") {
       setRelated(<p> hey hey </p>);
     }
     else {

     }
   }

   React.useEffect(() => {
     showReview();
     showRelated();
   }, []);




   return(
   <div>
   {reviewInfo}
   <h2> Related </h2>
   <hr />
   {related}

   </div>
 );


}

export default ViewReview;
