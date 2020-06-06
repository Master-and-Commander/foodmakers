import React, {useState} from 'react';
import axios from 'axios';
import {useAuth} from '../context/auth';
import { Link, Redirect } from "react-router-dom";
import {useAsyncHook} from './useAsyncHook';

const Search = () => {
   
  const [query, setQuery] = useState();
  const [depart, setDepart] = useState();
  const [extra, setExtra] = useState();
  const [search, setSearch] = useState("Title");
  const [sortBy, setSortBy] = useState("by created date")
  const [results, setResults] = useState([]);
  const [primary, setPrimary] = useState("http://192.168.99.104:6200/api/articles/search/title");
  const [secondary, setSecondary] = useState("/updatedAt");
  const [searchID, setSearchID] = useState("notset");
  const [searchName, setSearchName] = useState("notset");
  const [mode, setMode] = useState(1);
  const [choices, setChoices] = useState([]);



  const choiceHandler = async(str) => {
    var arr = [];
    var promise = "";
    console.log("req: " + primary + secondary + "/" + str);
    if(mode === 1) {
      axios.get(primary + secondary + "/" + str).then(async(data) => {
        console.log(data["data"]);
        if (data["data"].length > 0) {
          data["data"].map(async(item) => {
             arr.push(<div>
               <div className="card border-0">
                 <div className="card-body">
                 <div className="row no-gutters">
                   <div className="col-md-1">
                   <img src={"/"+item["author"]+"/"+item["_id"]+".PNG"} className="card-img rounded-0" alt="..." />
                   </div>

                 <div className="col-md-8">
                   <div className = "row">
                     <h3 className="card-title" ><Link to={{
                            pathname: '/article',
                            state: { articleID: item }}}>{item["title"]}</Link> by <Link to={{
                                   pathname: '/user',
                                   state: { userID: item["author"] }}}>{item["author"]}</Link> </h3>
                                   <div className="dropdown ml-auto">
                                     <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                         Options
                                     </button>
                                     <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                       <button className="dropdown-item" onClick={() => {setDepart("review")}} >Review</button>
                                       <button className="dropdown-item" onClick={() => {setDepart("recommend")}} >Recommend</button>
                                       <button className="dropdown-item" onClick={() => {setDepart("add to list")}} >Add to list</button>
                                     </div>
                                   </div>

                   </div>
                    <p className="card-text"> Description: {item["description"]} </p>

                 </div>

                 </div>
                 </div>
               </div>
             </div>);
           });
             console.log("pushing 1");

          setResults(arr);
        }
        else {
          setResults([]);
        }

      });

    }
    else {
      // need to pull choices list
      console.log(primary + secondary + "/" + str);
      pullUsers(str);
    }

  }

  const showSearchIDResults = async(id) => {
    var arr = [];
    console.log("id search: " + primary + secondary + "/" + id);
    axios.get( primary + secondary + "/" + id).then(async(data) => {
      if(data["data"].length > 0) {
        setResults(await auxilliary(data["data"]));


      }
      else {
        setResults([]);
        console.log("nothing for this user");
      }
    });

  }

  const pullUsers = async(str) => {
    var arr = [];
    console.log("http://192.168.99.104:6200/api/users/getidsbyusernamestring/" + str);
    axios.get("http://192.168.99.104:6200/api/users/getidsbyusernamestring/" + str).then((data) => {
      if(data["data"].length > 0) {
        data["data"].map(async(item) => {
          arr.push(<p><button type="button" className="btn btn-secondary list-group-item list-group-item-action" onClick={(e) => {
          setSearchID(item["id"]);
          setSearchName(item["username"]);
          setChoices([]);
          showSearchIDResults(item["id"]);

        }}>{item["username"]} </button></p>);
        });
        setChoices(arr);
      }
      else {
        console.log("no user found with that name");
        setChoices([]);
      }
    })
  }

  const auxilliary = async(e) => {
    return Promise.all(e.map( async(item) => {
        return returnReviews(item);
    }));
  }

  const returnReviews = async(item) => {
    var title = await axios.get("http://192.168.99.104:6200/api/articles/fetchtitle/" + item["articleId"]);
    var author = await axios.get("http://192.168.99.104:6200/api/articles/fetchauthor/" + item["articleId"]);
    return Promise.all([title, author]).then(async([fetTitle, fetAuthor]) => {
      var authorName = await axios.get("http://192.168.99.104:6200/api/users/fetchusername/" + author["data"]);
      return (<div>
        <div className="card border-0">
          <div className="card-body">
          <div className="row no-gutters">
            <div className="col-md-1">
            <img src={"/"+item["author"]+"/"+item["articleId"]+".PNG"} className="card-img rounded-0" alt="..." />
            </div>

          <div className="col-md-8">

            <div className = "row">
                            <h3 className="card-title" >{item["title"]}</h3>


                            <div className="dropdown ml-auto">
                              <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  Options
                              </button>
                              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <button className="dropdown-item" onClick={() => {setDepart("review")}} >Review</button>
                                <button className="dropdown-item" onClick={() => {setDepart("create")}} >Create</button>
                                <button className="dropdown-item" onClick={() => {setDepart("editprofile")}} >Edit</button>
                              </div>
                            </div>

            </div>
            <h2><Link to={{
                   pathname: '/article',
                   state: { articleID: item["articleId"] }}}>{fetTitle["data"]}</Link> by <Link to={{
                          pathname: '/user',
                          state: { userID: item["reviewee"] }}}> {authorName["data"]}</Link> {item["rating"]}/5  {item["approved"]}</h2>
             <p className="card-text"> Description: {item["description"]} </p>

          </div>

          </div>
          </div>
        </div>
      </div>);
    });
  }


  const showSearchType = () => {
    if(searchID === "notset")
       return(<input type="text" className="fieldwidth" onChange={e => {choiceHandler(e.target.value)}} placeholder="Search.." />);

    else {
      return(<button type="button" className="btn btn-secondary ml-2" >{searchName}</button>);
    }
  }



  return (
    <div>

    <div className="row">
    <div className="dropdown">
      <button className="btn-lg btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {search}
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <button className="dropdown-item" onClick={() => {
          setSearch("Author");
          setPrimary("http://192.168.99.104:6200/api/articles/search/author");
          setMode(1);
        }}>Author</button>
        <button className="dropdown-item" onClick={() => {
          setSearch("Title");
          setPrimary("http://192.168.99.104:6200/api/articles/search/title");
          setMode(1);
        }}>Title</button>
        <button className="dropdown-item" onClick={() => {
          setSearch("Tag");
          setPrimary("http://192.168.99.104:6200/api/articles/search/tag");
          setMode(1);
        }}>Tag</button>
        <button className="dropdown-item" onClick={() => {
          setSearch("Reviewer");
          setPrimary("http://192.168.99.104:6200/api/reviews/search/reviewer");
          setResults([]);
          setMode(2);
        }}>Reviewer</button>
        <button className="dropdown-item" onClick={() => {
          setSearch("Reviewee");
          setPrimary("http://192.168.99.104:6200/api/reviews/search/reviewee");
          setResults([]);
          setMode(2);
      }}>Reviewee</button>
      </div>
    </div>
    <div className="dropdown">
      <button className="btn-lg btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {sortBy}
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <button className="dropdown-item" onClick={() => {
          setSortBy("by updated date");
          setSecondary("/updatedAt");
        }}>Created</button>
        <button className="dropdown-item" onClick={() => {
          setSortBy("by ratings");
          setSecondary("/averageReview");
        }}>Ratings</button>
        <button className="dropdown-item" onClick={() => {
          setSortBy("by approvals");
          setSecondary("/peerApprovals");
        }}>Approvals</button>
      </div>
    </div>

      {showSearchType()}
      <div>
      </div>
      </div>
      {results}
      {choices}

    </div>
  )
}

export default Search;
// {treatJSON(result)}
