import React, {Component, useState, useEffect} from 'react';
import {useAuth} from '../context/auth';
import axios from 'axios';

export function useAsyncHookforList(primary, secondary, value) {
  const [result, setResult] = React.useState([]);
  const [finished, setFinished] = React.useState("false");
  const [time, setTime] = React.useState([]);
  React.useEffect(() => {
  async function fetchPrimary() {
    try {
      const useless = await
      axios.get(primary)
      .then(importantinfo => {

        assist(importantinfo["data"][value]);
      }).catch(err => {
        setResult("heya");
        setFinished("error");
        console.log("Error for primary " + primary + ":  " + err);
      });



    } catch (error) {
      setFinished("error");
    }

  }


  async function waitForEach(e) {
    var showReady = "false";
    var last = "false";

    for (var k = 0; k < e.length; k++) {
      showReady = "false";
      console.log("waiting");
      if(k === e.length-1) {
        last = "true";
      }
      withoutis(e[k], last);

    }
    if (showReady === "next")
      return "completed";
  }

 async function gainTime () {
   var help  = "notready"
   help = await setTime(result);
   if (help !== "notready") {
     setFinished("Success");
     console.log("setting finished to " + finished);
   }


 }

  async function withoutis (e , last) {
    try {
        console.log("last: " + last);
        console.log("trying: " + secondary + e);
        axios.get(secondary + e)
        .then(importantinfo => {
          result.push(importantinfo);
          if(last==="true") {
            gainTime();
          }

        }).catch(err => {
          setResult("heya");
          setFinished("error");
        })

    } catch (error) {
      setFinished("error");
    }

  }


    async function assist(e) {
        var ready = "false";
        console.log("assist e is " + e);
        ready = await waitForEach(e).then(ready => "ready");



    }


    if (primary !== "") {
      fetchPrimary();
    }
  }, [primary]);
  return [result, finished];
}
