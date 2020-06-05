import React, {Component, useState, useEffect} from 'react';
import {useAuth} from '../context/auth';
import axios from 'axios';

export function useAsyncHook(request) {
  const [result, setResult] = React.useState();
  const [finished, setFinished] = React.useState("false");

  React.useEffect(() => {
    async function fetchUserData() {
      try {
        const useless = await
        axios.get(request)
        .then(importantinfo => {
          assist(importantinfo);
        }).catch(err => {
          setResult("heya");
          setFinished("error");
        });



      } catch (error) {
        setFinished("error");
      }

    }

    async function assist(e) {
      var arbitrary = await setResult(e);
      setFinished(arbitrary);
    }

    if (request !== "") {
      fetchUserData();
    }
  }, [request]);
  return [result, finished];
}
