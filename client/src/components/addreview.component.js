import React, {Component, useEffect, useState} from 'react';
import {useAsyncHook} from './useAsyncHook';
import axios from 'axios';
import {useAuth} from '../context/auth';
import {Redirect} from "react-router-dom";

const CreateReview = (e) => {
  // check if review is existing
  // have a reference to what is being reviewed
  const { setAuthTokens, authTokens } = useAuth();
   const [stem, setStem] = useState("http://192.168.99.104:6200");
  const [depart, setDepart] = useState("stationary");
  const [fetchedReview, finishedFetchingReview] = useAsyncHook("http://192.168.99.104:6200/api/reviews/findbyarticleid/" + ((typeof e["history"]["location"]["state"] === 'undefined') ? "erroneous" : e["history"]["location"]["state"]["articleID"]  )  );
  const [articleID, setArticleID] = useState(((typeof e["history"]["location"]["state"] === 'undefined') ? "notset" : e["history"]["location"]["state"]["articleID"]  ));
  const [author, setAuthor] = useState();
  const [authorID, setAuthorID] = useState("notset");
  const [articleName, setArticleName] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [rating, setRating] = useState(1);
  const [approved, setApproved] = useState(false);
  const [reviewerExpertise, setReviewerExpertise] = useState();
  const [articleAreas, setArticleAreas] = useState();
  const [search, setSearch] = useState();
  const [authorQuery, setAuthorQuery] = useState();
  const [articleQuery, setArticleQuery] = useState();
  const [fetchedAuthors, finishedFetchingAuthors] = useAsyncHook(authorQuery);
  const [fetchedArticles, finishedFetchingArticles] = useAsyncHook(articleQuery);
  const [authorChoices, setAuthorChoices] = useState([]);
  const [articleChoices, setArticleChoices] = useState([]);
  const [existing, setExisting] = useState(false);
  const [reviewId, setReviewId] = useState();
  const [oldRating, setOldRating] = useState();
  const [oldApproved, setOldApproved] = useState();
  const [extraOptions, setExtraOptions] = useState(false);


  React.useEffect(() => {
    if(finishedFetchingAuthors !== "false" && finishedFetchingAuthors !== "error") {
      var initialization = [];
      for(var i = 0;i < fetchedAuthors["data"].length;i++) {
        try{throw i}
        catch(ii) {
        initialization.push({
          "username" : fetchedAuthors["data"][i]["username"],
          "id" : fetchedAuthors["data"][i]["id"]
        });
        }
      }
    setAuthorChoices(initialization);

    }

  }, [author]);


  const initizializeExisting = async() => {
    if(articleID !== "notset") {
      var fetchedArticle = await axios.get(stem + "/api/articles/get/"+articleID);
      var newAuthorName = await axios.get(stem + "/api/users/fetchusername/"+ fetchedArticle["data"]["author"]);
      setAuthorID(fetchedArticle["data"]["author"]);
      setArticleName(fetchedArticle["data"]["title"]);
      setAuthor(newAuthorName["data"]);
      setExtraOptions(checkForSpecialties(articleID));
      /// must set author id
      /// must set articleName
      /// must set username
    }
  }

  React.useEffect(() => { initizializeExisting() }, []);

  React.useEffect(() => {
    if(finishedFetchingArticles !== "false" && finishedFetchingArticles !== "error") {
      var initialization = [];
      for(var i = 0;i < fetchedArticles["data"].length;i++) {
        try{throw i}
        catch(ii) {
        initialization.push({
          "title" : fetchedArticles["data"][i]["title"],
          "id" : fetchedArticles["data"][i]["id"]
        });
        }
      }

    setArticleChoices(initialization);

    }

  }, [articleName]);


  if (depart !== "stationary") {
    return(<Redirect to="/home" />);
  }

  const returnAuthorResults = (e) => {
    setAuthorQuery(stem + "/api/users/getidsbyusernamestring/"+e);

  }



  const displayAuthorChoices = () => {
    var tempArr = [];

    for(var i = 0;i < authorChoices.length;i++) {
      try{throw i}
      catch(ii) {
        tempArr.push( <button type="button" id={i} className="btn btn-secondary list-group-item list-group-item-action" onClick={(e) => {
          setAuthor(authorChoices[e.target.id]["username"]);
          setAuthorID(authorChoices[e.target.id]["id"]);
          setArticleQuery(stem + "/api/articles/gettitlebyauthor/"+ authorChoices[e.target.id]["id"]);
        }}>{authorChoices[i]["username"]}</button>);
      }
    }
    return(tempArr);
  }

  const checkForSpecialties = async(article) => {
    const userSpecialties = axios.get(stem + stem + "/api/users/fetchspecialties/" + authTokens[0].usernameID); // recieves the specialites of the user
    console.log(stem + "/api/users/fetchspecialties/" + authTokens[0].usernameID);
    const articleTags = axios.get(stem + "/api/articles/gettags/"+ article);
    console.log(stem + "/api/articles/gettags/"+ article);
     // receives the tags on the article
    return Promise.all([userSpecialties, articleTags]).then(async([e, f]) => {
      for (var elem in f["data"]) {
        if(e["data"].includes(f["data"][elem])) {
          console.log("there is overlap with " + f["data"][elem]);
          return(true);
        }
        console.log("No overlap");
        return false;
      }

    });
  }

  const displayArticleChoices = () => {
    var tempArr = [];
    var decider = "";
    var decider2 = "";
    var counter = 0;
    var counterMax = 3;
    for(var i = 0;i < articleChoices.length;i++) {

      try{throw i}
      catch(ii) {
        decider = articleChoices[i]["title"].toUpperCase();
        decider2 = articleName.toUpperCase();
        if (decider.indexOf(decider2) !== -1 && counter < counterMax) {
          tempArr.push( <button type="button" id={i} className="btn btn-secondary list-group-item list-group-item-action" onClick={(e) => {
            setArticleName(articleChoices[e.target.id]["title"]);
            setArticleID(articleChoices[e.target.id]["id"]);
            searchForExisting(articleChoices[e.target.id]["id"]);
            setExtraOptions(checkForSpecialties(articleChoices[e.target.id]["id"]))
          }}>{articleChoices[i]["title"]}</button>);

          counter++;
        }


      }
    }
    return(tempArr);

  }
  const usernameSwitcher = () => {
    if(authorID === "notset") {

      return(
        <div>
        <div className="form-group">
          <label >Author's username</label>
        <input type="text"
      required
      className="form-control"
      onChange= {e => {
        returnAuthorResults(e.target.value);
        setAuthor(e.target.value);
      }}  />
      </div>
      <ul class="list-group">
      {displayAuthorChoices()}
      </ul>
    </div>);
    }
    else {
      return(
        <div>
        <div className="form-group">
          <label >Author's username</label>
          <button type="button" className="btn btn-secondary ml-2" >{author}</button>

        </div>
        </div>);


    }
  }
  const articleSwitcher = () => {
    if(articleID === "notset") {
      return(
        <div>

        <div className="form-group">
          <label >Article name</label>
          <input type="text"
          required
          className="form-control"
          onChange= {e => {
            setArticleName(e.target.value);
          }}
          />
        </div>
        <ul class="list-group">
        {displayArticleChoices()}
        </ul>




    </div>);

    }
    else {
      return(
        <div>
        <div className="form-group">
          <label >Article name</label>
          <button type="button" className="btn btn-secondary ml-2" >{articleName}</button>

        </div>
        </div>);
    }
  }

  const searchForExisting = (e) => {
    // pull reviews from user profile
    // check each one and see if the article matches
    axios.get(stem + '/api/reviews/getbyreviewer/'+authTokens[0].usernameID+'/'+e).then((res) => {

      if (res["data"].length > 0)  {
        console.log("you have already reviewed this article");
        setExisting(true);
        setReviewId(res["data"][0]);
        axios.get(stem + "/api/reviews/get/"+res["data"][0]).then((res2) => {

          setOldRating(res2["data"]["rating"]);
          setOldApproved(res2["data"]["approved"]);
        });
      }
      else {

      }
    });

  }

  const returnAverageandCount = async(d, e) => {
    var collectiveAverage = 0;
    var collectiveCount = 0;
    var collectivePeercount = 0;
    var articleinfo = axios.get(stem + "/api/articles/getarticleinfobytaganduser/"+ d +"/"+e);
    console.log(stem + "/api/articles/getarticleinfobytaganduser/"+ d +"/"+e);
    return articleinfo.then(async(data) => {
       for(var elem in data["data"]) {
         console.log("Av "+  data["data"][elem]["averageReview"]);
         collectiveAverage = (collectiveAverage*collectiveCount + data["data"][elem]["averageReview"] * data["data"][elem]["numberOfReviews"])/(collectiveCount + data["data"][elem]["numberOfReviews"]);
         collectiveCount += data["data"][elem]["numberOfReviews"];
         collectivePeercount += data["data"][elem]["peercount"];
       }


       return (
         {
           "average" : collectiveAverage,
           "count" : collectiveCount,
           "peercount" : collectivePeercount
         }
       )
    });
  }

  const showExtraOptions = () => {
    if(extraOptions) {
      return(<div className="form-group"> <input className="form-control" type="checkbox" onClick={() => {
        if(approved) {
          setApproved(false);
          console.log("you no longer approve!");
        }
        else {
          setApproved(true);
          console.log("you have approved!");
        }
      }} /> </div>);
    }
    else {
      return(<p></p>);
    }
  }

  const onSubmit = async(e) => {
    e.preventDefault();
    console.log("submitting");

      const review = {
        "articleId": articleID,
        "reviewer": authTokens[0].usernameID,
        "reviewee" : authorID,
        "title": title,
        "description": description,
        "rating": rating,
        "approved": approved
      }
      if(!existing) {
        axios.post(stem + "/api/reviews/add", review).then(res => (console.log(res))).catch(err => console.log("Error: " + err));
        axios.post(stem + "/api/articles/rate/"+articleID, review).then(res => (console.log(res))).catch(err => console.log("Error: " + err));
        // above are working


        axios.get(stem + '/api/reviews/getbyreviewer/'+authTokens[0].usernameID+'/'+articleID)
        .then((res) => {
          const update = {
            "reviewID": res["data"][0]
          }
          axios.post(stem + "/api/users/updateuserreviews/"+authTokens[0].usernameID, update);
        });
      }
      else {

        // update review
        axios.post(stem + "/api/reviews/update/"+reviewId, review).then(res => (console.log(res))).catch(err => console.log("Errors: " + err));
        // update article (pass old review)
        const updateRating = {
          "rating": rating,
          "approved": approved,
          "oldRating": oldRating,
          "oldApproved": oldApproved
        }

        console.log(updateRating);
        console.log(stem + "/api/articles/updaterate/"+articleID);
        console.log(updateRating);
        axios.post(stem + "/api/articles/updaterate/"+articleID, updateRating).then(res => {

        }).catch(err => console.log(err));

      }

    // do this for every tag
    axios.get(stem + "/api/articles/gettags/"+ articleID).then((data) => {
      for(var elem in data["data"]) {
        returnAverageandCount(authorID, data["data"][elem]).then((data2) => {
          console.log(data2);
          if(data2["average"] > 2) {
            console.log("it was greater than 2");
            axios.post(stem + "/api/users/updatespecialties/"+authorID+"/"+data["data"][elem]);
          }
        });
      }
    });


    // need to pull tags from article

    //console.log(show);
    setDepart("home");

  }


  return (
    <div>
      <h1> Review a Recipe </h1>
      <form onSubmit={onSubmit}>

        {usernameSwitcher()}
        {articleSwitcher()}

      <div className="form-group">
        <label >Title of Review</label>
        <input type="text"
        required
        className="form-control"
        onChange= {e => {
          setTitle(e.target.value);
        }}
        />
      </div>

      <div className="form-group">
        <label>Thoughts on the recipe</label>
        <textarea className="form-control"
        required
        onChange={e => {
          setDescription(e.target.value);
        }}
        rows="5"></textarea>
      </div>
      <div className="form-group">
        <label >Rating</label>
        <select class="form-control" >
          <option  onClick={(e) => {
            setRating(1);
          }}>1</option>
          <option  onClick={(e) => {
            setRating(2);
          }}>2</option>
          <option  onClick={(e) => {
            setRating(3);
          }}>3</option>
          <option  onClick={(e) => {
            setRating(4);
          }}>4</option>
          <option  onClick={(e) => {
            setRating(5);
          }}>5</option>

        </select>
      </div>
      {showExtraOptions()}

      <button type="submit" className="btn btn-primary">Submit</button>


      </form>

    </div>
  )

}
export default CreateReview;
