import React, {useState, useEffect} from 'react';
import { Redirect, Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import axios from 'axios';


const Requests = () => {
  const {authTokens} = useAuth();
  const [sentRequests, setSentRequests] = useState();
  const [stem, setStem] = useState("http://192.168.99.104:6200");

  const [depart, setDepart] = useState("stationary");
  const [params, setParams] = useState();

  const [receivedRequests, setReceivedRequests] = useState();


  const initializeSentRequests = async() => {

  const promise = axios.get("http://192.168.99.104:6200/api/requests/getbysender/"+authTokens[0]["usernameID"]);

    promise.then(async(res) => {
         console.log("running");
         setSentRequests(await workMyCollection(res["data"],1));
      });
  }
  function workMyCollection(arr, mode) {
    if(mode === 1) {
      return Promise.all(arr.map( async(item) => {
          return returnSentChoices(item["recipient"], item["description"], item["article"], item["id"]);
      }));
    }

    else if (mode === 2) {
      return Promise.all(arr.map(async(item) => {

          return returnReceivedChoices(item["sender"], item["description"], item["article"], item["id"]);
      }));
    }

  }

   const returnSentChoices = async(recipientID, parent, article, id) => {


     const promise =  axios.get(stem + "/api/users/fetchusername/"+recipientID);
     const titlePromise = axios.get(stem + "/api/articles/fetchtitle/"+ article);
     const authorPromise = axios.get(stem + "/api/articles/fetchauthor/"+ article);

     return Promise.all([promise, titlePromise, authorPromise]).then(async([p1, p2, p3]) => {
       console.log("p2 " + p2["data"]);
       const creatorPromise = axios.get(stem + "/api/users/fetchusername/"+ p3["data"])
       return creatorPromise.then((res) => {
         return(<div>
           <div className="card border-0">
             <div className="card-body">
               <div className = "row">
                 <h3 className="card-title" >Suggested <Link to={{
                        pathname: '/article',
                        state: { articleID: article }}}>{p2["data"]}</Link> by {res["data"]} to <Link to={{
                               pathname: '/user',
                               state: { userID: recipientID }}}>{p1["data"]}</Link> </h3>
                               <button className="btn btn-secondary ml-auto" onClick={()=> {
                                 axios.delete(stem + "/api/requests/get/"+id);
                                 initializeReceivedRequests();
                                 initializeSentRequests();
                               }}> delete </button>
               </div>
             </div>
             <div className="card-body">
               <p className="card-text"> Description: {parent}</p>
             </div>
           </div>
         </div>);
       });

     });

   }
   const returnReceivedChoices = async(senderID, parent, article, id) => {
     const promise =   axios.get(stem + "/api/users/fetchusername/"+senderID);
     const titlePromise = axios.get(stem + "/api/articles/fetchtitle/"+ article);
     const authorPromise = axios.get(stem + "/api/articles/fetchauthor/"+ article);
     return Promise.all([promise, titlePromise, authorPromise]).then(async([p1, p2, p3]) => {
       const creatorPromise = axios.get(stem + "/api/users/fetchusername/"+ p3["data"])
       return creatorPromise.then((res) => {
         return(<div>
           <div className="card border-0">
             <div className="card-body">
               <div className = "row">
                 <h3 className="card-title"> {p1["data"]} suggested <Link to={{
                        pathname: '/article',
                        state: { articleID: article }}}>{p2["data"]}</Link> by <Link to={{
                               pathname: '/user',
                               state: { userID: senderID }}}>{res["data"]}</Link> </h3>
                 <button className="btn btn-secondary ml-auto" onClick={()=> {
                   axios.delete(stem + "/api/requests/get/"+id);
                   initializeReceivedRequests();
                   initializeSentRequests();
                 }}> delete </button>
               </div>

             </div>
             <div className="card-body">
               <p className="card-text"> Description: {parent}</p>
             </div>
           </div>
         </div>);
       });

     });
   }
   const initializeReceivedRequests = async() => {
     const promise =  axios.get(stem + "/api/requests/getbyrecipient/"+authTokens[0]["usernameID"]);
     promise.then(async(res) => {
       setReceivedRequests(await workMyCollection(res["data"],2));
      });

   }



   useEffect(() => {
    initializeReceivedRequests();
    initializeSentRequests();
  }, []);

   if(depart !== "stationary") {
     if(depart === "send") {
       return(<Redirect to="/sendrequest" />);
     }
     if(depart === "refresh") {
       return(<Redirect to="/requests" />);
     }
   }




   return (
     <div>

     <h1>Requests</h1>
     <hr />
     <button className="btn btn-secondary" onClick={() => {setDepart("send")}}> Send a Request </button>
     <h2>My Requests </h2>
     <hr />
     {sentRequests}
     <h2> Sent to me </h2>
     <hr />
     {receivedRequests}
     </div>
   )

}

export default Requests;
