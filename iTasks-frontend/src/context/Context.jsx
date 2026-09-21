/* eslint-disable no-unused-vars */
import React, { createContext, useCallback, useEffect, useState } from "react";
import App from "../App";
import axios from "axios";

export const URL = import.meta.env.VITE_APP_URL;

// Create context once outside the component
// eslint-disable-next-line react-refresh/only-export-components
export const TaskContext = createContext();

function ContextProvider() {
  const [isError, setIsError] = useState(false);
  const [addedTask, setAddedTask] = useState(false);
  const [taskCards, setTaskCards] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState("");

  const refreshData = useCallback(async () => {
    if (!userName) return; // Guard: don't call without username

    try {
      const response = await axios.get(`${URL}/tasks`, {
        withCredentials: true,
      });
      setTaskCards(response.data);
      setIsError(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsError(true);
    }
  }, [userName]);
  async function checkAuth() {
    console.log("check Auth");
    try {
      const response = await axios.get(`${URL}/check-token`, {
        withCredentials: true,
      });
      setUserName(response.data);
      setIsLogged(true);
    } catch (error) {
      setIsLogged(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLogged && userName) {
      refreshData();
    }
  }, [isLogged, userName, refreshData]);

  return (
    <TaskContext.Provider
      value={{
        addedTask,
        setAddedTask,
        taskCards,
        setTaskCards,
        isError,
        setIsError,
        refreshData,
        isLogged,
        setIsLogged,
        userName,
        setUserName,
        checkAuth,
      }}
    >
      <App />
    </TaskContext.Provider>
  );
}

export default ContextProvider;
