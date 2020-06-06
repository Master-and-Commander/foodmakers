import React, {useState} from 'react';
import axios from 'axios';
import {useAuth} from '../context/auth';
import {useAsyncHook} from './useAsyncHook';
import {useAsyncHookforList} from './useAsyncHookforList';

const CreateArticle = (e) => {
  var id = ((typeof e["history"]["location"]["state"] === 'undefined') ? "erroneous" : e["history"]["location"]["state"]["articleID"]  );
  const {setAuthTokens, authTokens } = useAuth();   
  const [author, setAuthor] = useState(authTokens[0].id + "");
  const [title,  setTitle] = useState();
  const [description, setDescription] = useState();
  const [ingredients, setIngredients] = useState();
  const [steps, setSteps] = useState();
  const [video, setVideo] = useState();
  const [tags, setTags] = useState();
  const [picture, setPicture] = useState();
  const [existing, setExisting] = useState("false");
  const [result, finished] = useAsyncHook("http://192.168.99.104:6200/api/articles/get/" + ((typeof e["history"]["location"]["state"] === 'undefined') ? "erroneous" : e["history"]["location"]["state"]["articleID"]  )  );
  const [tagsResult, finTags] = useAsyncHookforList("http://192.168.99.104:6200/api/articles/get/" + ((typeof e["history"]["location"]["state"] === 'undefined') ? "erroneous" : e["history"]["location"]["state"]["articleID"]  ), "http://192.168.99.104:6200/api/tags/get/", "tags");
  const [buttons, setButtons] = useState([]);
  const [query, setQuery] = useState();
  const [tagSearch, finTagSearch] = useAsyncHook(query);
  const [search, setSearch] = useState();

  React.useEffect(() => {
    if(finished !== "false" && finished !== "error") {
      initializeExistingValues();
    }
  },[finished]);

  React.useEffect(() => {
    if(finTags === "Success") {
      var initialization = [];
      for(var i = 0;i < tagsResult.length;i++) {
        try{throw i}
        catch(ii) {
        initialization.push({
          "name" : tagsResult[i]["data"]["name"],
          "id" : tagsResult[i]["data"]["_id"]
        });
        }
      }
    setButtons(initialization);

    }

  }, [finTags]);

  const returnResults = (e) => {
    setQuery("http://192.168.99.104:6200/api/tags/getbystring/"+e);
    console.log(e);
  }

  const initializeExistingValues = () => {
    setAuthor(result["data"].author);
    setTitle(result["data"].title);
    setDescription(result["data"].description);
    setIngredients(result["data"].ingredients);
    setSteps(result["data"].steps);
    setVideo(result["data"].video);
    setTags(result["data"].tags);
    setPicture(result["data"].picture);
    setExisting("true");
  }




  const pushButton = (e) => {
    var repeated = false;
    for (var i = 0;  i < buttons.length; i++) {
      if (e["name"] === buttons[i]["name"])
         repeated = true;
    }
    if (!repeated) {
      setButtons([
        ...buttons, e
      ]);
    }

  }

  const removeButton = async(e) => {
    var a = buttons;
    if(a.length === 1) {
      setButtons([]);
    }
    else {
      var str = [];
      buttons.splice(e,1);
      for(var i = 0; i < buttons.length; i++) {
        str.push(buttons[i]);
      }
      setButtons(str);

      console.log("sup " + buttons);

    }




  }

  const assister = (e) => {
    console.log("2: assister")
    var arr = e["array"];
    var index = e["index"];
    //var leavable = JSON.parse(str[j]);
    var usable = JSON.parse(arr[index]);
    //setLeave(JSON.parse(str[j])["_id"]);
    var entry = {
      "name" : usable.name,
      "id" : usable["_id"]
    }
    pushButton(entry);
  }

  const treatJSON = (e) => {
    var starter = JSON.stringify(e["data"]);
    var checker = JSON.stringify(e);
    var tester = checker.lastIndexOf('"data":[]');
    console.log("tester: " + tester);

         if (tester === -1) {

           var test = 0;
           var str;
           var ar = [];
           var usable;

                    test = starter.lastIndexOf('},{');
                    if (test === -1) {
                      // one occurence
                      str = starter.slice(1);

                      str = str.slice(0, str.length-1);

                      usable = JSON.parse(str);
                      ar.push(
                        <div>
                          <div className="card border-0">
                            <div className="card-body">
                              <div>
                                <span className="card-title left-align" ><h6> {usable.name} </h6></span>

                                <button className="btn btn-secondary right-align" onClick=
                               {(e) => {
                                  setSearch("");
                                  var entry = {
                                    "name" : usable.name,
                                    "id" : usable["_id"]
                                  }

                                  pushButton(entry);
                                  console.log("1 submitting here?");
                                  returnResults("");
                                  console.log("2 submitting here?");
                                  renderButtons();
                                  console.log("3 submitting here?");


                               }}> Edit </button>
                              </div>
                            </div>
                            <div className="card-body">
                              <p className="card-text"> {usable.description} </p>
                            </div>
                          </div>
                        </div>

                      );
                    }
                    else {
                      str = starter.split('},{');
                      /// treat first case (remove [ from the front and add } to the back)
                      str[0] = str[0].slice(1);
                      str[0] = str[0] + "}";

                      /// treat last case (remove ] from the back and add { to the front)
                      str[str.length - 1] = str[str.length - 1].slice(0, str[str.length-1].length - 1);
                      str[str.length - 1] = "{" + str[str.length - 1];
                      /// all the middle cases ( add { to the front and } to the back  )
                      for (var i = 1; i < str.length-1; i++) {
                        str[i] = "{" + str[i] + "}";
                      }
                      for (var j = 0; j < str.length; j++) {
                        usable = JSON.parse(str[j]);
                        ar.push(
                          <div id = {j} >
                            <div className="card border-0">
                              <div className="card-body">
                                <div>
                                  <span className="card-title left-align" ><h6> { usable.name } </h6></span>
                                  <button className="btn btn-secondary right-align" id={j} onClick=
                                 {(e) => {
                                   setSearch("");
                                    var passing  = {
                                      "array" : str,
                                      "index" : e.target.id
                                    };
                                    console.log("1: you clicked on " + e.target.id);
                                    assister(passing);
                                    returnResults("");
                                    renderButtons();

                                 }}> Edit </button>
                                </div>
                              </div>
                              <div className="card-body">
                                <p className="card-text"> {usable.description} </p>
                              </div>
                            </div>
                          </div>

                        );
                      }
                    }
                    return ar;
         }

         else {
           return "no records found";
         }


  }

  const renderButtons = () => {
    var toret = [];
    console.log("Buttons array " + buttons);
    for (var i = 0;  i < buttons.length; i++) {
      console.log(i + ": " + buttons[i]);
      toret.push(
        <div class="btn-group" role="group">
        <button type="button" class="btn btn-secondary">{buttons[i]["name"]}</button>
        <button type="button" class="btn btn-secondary mr-2" id={i} onClick={(e) => {
          console.log("removing index " + e.target.id);

          removeButton(e.target.id);



        }

        }>X</button>
        </div>
);


    }

    return toret;

  }

  const returnTags = () => {
    var ar = [];
    for(var i = 0;i < buttons.length;i++) {
      try{throw i}
      catch(ii) {
        ar.push(buttons[i]["id"]);
      }
    }
    return ar;
  }


  const onSubmit = (e) => {
    e.preventDefault();
    var updatedTags = returnTags();

    const article = {
       tags: updatedTags,
       author:  authTokens[0].usernameID,
       title: title,
       description: description,
       ingredients: ingredients,
       steps: steps,
       video: "",
       picture: "",
       peerApprovals: 0,
       numberOfReviews: 0,
    }



    if (existing === "false") {
      axios.post('http://192.168.99.104:6200/api/articles/add', article).then(res =>
        axios.post("http://192.168.99.104:6200/api/users/updatearticles/"+authTokens[0].usernameID+"/"+res["data"])
      ).catch(err => console.log(err.response));
    }
    else
    {
        axios.post('http://192.168.99.104:6200/api/articles/update/'+id, article).then(res => {

          console.log(res.data);
        }).catch(err => console.log(err.response));

    }


    //axios.post("http://localhost:5000/users/updatearticles/"+authTokens[0].usernameID+"/"+);

  }


    return (
      <div>
      <h1>Post a Recipe</h1>
      <div>
      {renderButtons()}
      </div>
      <input
      type="text"
      value={search}
      onChange={
        e => {
          setSearch(e.target.value);
          returnResults(e.target.value);


        }} placeholder="Search for tags" />

        {
          finTagSearch === "false" ? (<span> no description found </span>)
          : tagSearch  === "heya" ? (<span> no description found </span>)
          : (<p> {treatJSON(tagSearch)} </p>)
        }
      <hr />
      <form onSubmit={onSubmit}>

      <div className="form-group">
        <label >Title</label>
        <input type="text"
        required
        className="form-control"
        value={title}
        onChange= {e => {
          setTitle(e.target.value);
        }}
        />
      </div>


      <div className="form-group">
        <label >Description</label>
        <textarea className="form-control"
        required
        value = {description}
        onChange = {e => {
          setDescription(e.target.value);
        }}
        rows="3"></textarea>
      </div>

      <div className="form-group">
        <label >Ingredients</label>
        <textarea className="form-control"
        required
        value={ingredients}
        onChange= {e => {
          setIngredients(e.target.value);
        }}
        rows="4"></textarea>
      </div>

      <div className="form-group">
        <label>Steps</label>
        <textarea className="form-control"
        required
        value={steps}
        onChange={e => {
          setSteps(e.target.value);
        }}
        rows="10"></textarea>
      </div>

      <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      </div>
    );

}

export default CreateArticle;
