import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth } from "../context/auth";
import { Redirect } from "react-router-dom";


const SendRequest = (e) => {
  const [stem, setStem] = useState("http://192.168.99.104:6200");
  const {authTokens} = useAuth();
  const [recipient, setRecipient] = useState("notset");
  const [recipientID, setRecipientID] = useState();
  const [article, setArticle] = useState("notset");
  const [articleID, setArticleID] = useState((typeof e["history"]["location"]["state"] === 'undefined') ? "notset" : e["history"]["location"]["state"]["articleID"]);
  const [sender, setSender] = useState(authTokens[0]["usernameID"]);
  const [description, setDescription] = useState();
  const [userButtons, setUserButtons] = useState([]);
  const [articleButtons, setArticleButtons] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [authorButtons, setAuthorButtons] = useState([]);
  const [depart, setDepart] = useState("stationary");




  const initializeProps = async() => {
    if(articleID !== "notset") {
      axios.get(stem + "/api/articles/fetchtitle/" + articleID).then((data) => {
        setArticle(data["data"]);
      });


    }
  }

  const requestAndInitializeUsers = async(e) => {
    // fetches id and username
    var arr = [];

    axios.get(stem + "/api/users/getidsbyusernamestring/"+e).then((res) => {
    for(var i = 0; i < res["data"].length; i++) {
    try {throw i}
    catch (ii) {
      arr.push(
        <button type="button" id={i} className="btn btn-secondary list-group-item list-group-item-action" onClick={(e) => {
        setRecipient(res["data"][e.target.id]["username"]);
        setRecipientID(res["data"][e.target.id]["id"]);
      }}>{res["data"][i]["username"]} </button>
    );
  }

  }
  setUserButtons(arr);
  }

    )

  }



  const requestAndInitializeArticles = async(e) => {
    axios.get(stem + "/api/articles/getarraybytitle/"+e).then((res) => {
      workMyCollection(res["data"]).then((data) => {
        setArticleButtons(data);
        console.log("my data" + data);
      });
    }
     );


  }


  const asyncCall= async(e,f,g) => {
    const promise =   axios.get(stem + "/api/users/fetchusername/"+e);
    return promise.then((res) => {
      return(<button type="button" className="btn btn-secondary list-group-item list-group-item-action" onClick={(e) => {
      setArticle(f);
      setArticleID(g);
    }}>{f} by {res["data"]} </button>);
    });
  }

  function workMyCollection(arr) {
    return Promise.all(arr.map(function(item) {
        return asyncCall(item["author"], item["title"], item["id"]);
    }));
}








  const onSubmit = (e) => {
    e.preventDefault();
    const req = {
      "recipient" : recipientID,
      "sender" : sender,
      "description" : description,
      "article" : articleID
    }


    axios.post(stem + "/api/requests/add", req).then((res) => console.log(res));
    setDepart("requests");
  }


  const recipientSwitcher = () => {
    if(recipient !== "notset") {
      return (
        <div className="form-group">
          <label >Recipient</label>
          <button type="button" className="btn btn-secondary ml-2" >{recipient}</button>
        </div>
      );


    }
    else {
      return(
        <div>
        <div className="form-group">
          <label >Recipient</label>
          <input type="text"
          required
          className="form-control"
          onChange= {e => {
              requestAndInitializeUsers(e.target.value);
          }}
          />
        </div>
        {userButtons}
        </div>
      );

    }
  }

  const articleSwitcher = (e) => {
    if(article !== "notset") {


      return (
        <div className="form-group">
          <label >Article</label>
          <button type="button" className="btn btn-secondary ml-2" >{article}</button>
        </div>
      );



    }
    else {
      return(
        <div>
        <div className="form-group">
          <label >Article</label>
          <input type="text"
          required
          className="form-control"
          onChange= {e => {
             requestAndInitializeArticles(e.target.value);
          }}
          />
        </div>
        {articleButtons}
        </div>
      );

    }
  }

  useEffect(()=> {
    initializeProps();
  }, []);


  if(depart !== "stationary") {
    return(<Redirect to ="/requests" />);
  }

   return(
     <div>
     <h1>Send a Request</h1>
     <form onSubmit={onSubmit}>

     {recipientSwitcher()}

     {articleSwitcher()}
     <div className="form-group">
       <label >Description</label>
       <textarea className="form-control"
       required
       onChange = {e => {
         setDescription(e.target.value);
       }}
       rows="3"></textarea>
     </div>


     <button className="btn btn-secondary" type="submit"> Submit </button>
     </form>
     </div>
   );

}

export default SendRequest;
