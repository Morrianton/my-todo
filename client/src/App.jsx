
import { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import LoginPage from "./pages/login.page";
import TasksPage from "./pages/tasks.page";
import UserContext from "./contexts/User.context";
import UserReducer from "./reducers/User.reducer";

function App() {
  const abortController = new AbortController();
  const [user, dispatchForUser] = useReducer(UserReducer, null);

  useEffect(() => {
    axios(`/api/v1/users/${user._id}`, { signal: abortController.signal })
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchForUser({ type: 'SET_USERS', payload: response.data });
      }
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error(error)
      }
    });

    return () => abortController.abort();
  }, []);

  return (
    <Router>
      <Routes>
        <UserContext.Provider value={user}>
          <Route path="/" element={ <TasksPage /> } />
          <Route path="/login" element={ <LoginPage /> } />
        </UserContext.Provider>
      </Routes>
    </Router>
  );
}

export default App;
