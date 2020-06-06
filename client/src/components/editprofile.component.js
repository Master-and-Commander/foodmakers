import React, {useState} from 'react';
import axios from 'axios';
import {useAuth} from '../context/auth';
import { Link, Redirect } from "react-router-dom";
import {useAsyncHook} from './useAsyncHook';
import {useAsyncHookforList} from './useAsyncHookforList';

const EditProfile = () => {
 const { setAuthTokens, authTokens } = useAuth();
  
 const [user, loadingForUser] = useAsyncHook("http://192.168.99.104:6200/api/users/get/"+authTokens[0].usernameID);
 const [list, done] = useAsyncHookforList("http://192.168.99.104:6200/api/users/get/"+authTokens[0].usernameID, "http://192.168.99.104:6200/api/tags/get/", "tags");
 console.log("authTokens " + authTokens[0].usernameID);
 console.log("done " + done);



  const [query, setQuery] = useState();
  const [result, finished] = useAsyncHook(query);
  const [leave, setLeave] = useState("false");
  const [buttons, setButtons] = useState([]);
  const [search, setSearch] = useState();
  const [username, setUsername] = useState();
  const [description, setDescription] = useState();
  const [picture, setPicture] = useState();

  React.useEffect(() => {
    if(loadingForUser !== "false" && loadingForUser !== "error") {
      initializeExistingValues();
    }
  },[loadingForUser]);

  const initializeExistingValues = () => {
    setUsername(user["data"].username);
    setDescription(user["data"].description);
    setPicture(user["data"].picture);


  }

  React.useEffect(() => {
    if(done === "Success") {
      var initialization = [];
      console.log("length of list " + list.length);
      for(var i = 0;i < list.length;i++) {
        try{throw i}
        catch(ii) {
        console.log( list[i]["data"]["name"]);
        console.log( list[i]["data"]["_id"]);
        initialization.push({
          "name" : list[i]["data"]["name"],
          "id" : list[i]["data"]["_id"]
        });
        }
      }
    setButtons(initialization);

    }

  }, [done]);






  if(leave !== "false") {
    console.log("hello");
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

  const assister = (e) => {
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

  const returnResults = (e) => {
    setQuery("http://192.168.99.104:6200/api/tags/getbystring/"+e);
    console.log(e);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    var updatedTags = returnTags();
    const profile = {
      username: username,
      description: description,
      picture: "IMAGE-"+username,
      tags: updatedTags
    }
      axios.post('http://192.168.99.104:6200/api/users/updateprofile/'+authTokens[0].usernameID, profile).then(res => console.log(res.data)).catch(err => console.log(err.response));
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
      console.log("method removing " + buttons[e]);
      var str = [];
      buttons.splice(e,1);
      for(var i = 0; i < buttons.length; i++) {
        str.push(buttons[i]);
      }
      setButtons(str);

      console.log("sup " + buttons);

    }




  }





  const fileupload = (e) => {
    const formData = new FormData();
    formData.append('myImage', e);
    const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        };

    console.log("E: " + e);


    axios.post("http://192.168.99.104:6200/api/picture/upload/"+authTokens[0].username, formData, config).then((res) => {
      console.log(res);
    });
  };

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
  renderButtons();

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

  return (
    <div>
    <form onSubmit={onSubmit}>

    <div className="form-group">
      <label className="mr-2"> Profile Picture </label>
      <input type="file"
       accept="image/png, image/jpeg" onChange={(e) => fileupload(e.target.files[0])}/>
      <label >Description</label>
      <textarea className="form-control"
      required
      value={description}
      onChange= {e => {
        setDescription(e.target.value);
      }}
      rows="5"></textarea>
    </div>
      <div>
      {renderButtons()}
      </div>

      <div>
      <input
      type="text"
      value={search}
      onChange={
        e => {
          setSearch(e.target.value);
          returnResults(e.target.value);


        }} placeholder="Search for tags" />
      </div>
      <div>
      {
        finished === "false" ? (<span> no description found </span>)
        : result  === "heya" ? (<span> no description found </span>)
        : (<p> {treatJSON(result)} </p>)
      }

      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>




    </div>
  )
}

export default EditProfile;
