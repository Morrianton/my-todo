
import { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import LoginPage from "./pages/Login.page";
import SignupPage from "./pages/Signup.page";
import TasksPage from "./pages/Tasks.page";
import AuthContext from "./contexts/Auth.context";
import AuthReducer from "./reducers/Auth.reducer";

function App() {
  const abortController = new AbortController();
  const [user, dispatchAuth] = useReducer(AuthReducer, null);

  useEffect(() => {
    axios(`/api/v1/users/${user._id}`, { signal: abortController.signal })
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchAuth({ type: 'SET_USERS', payload: response.data });
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
        <AuthContext.Provider value={ user }>
          <Route path="/" element={ <TasksPage /> } />
          <Route path="/login" element={ <LoginPage /> } />
            <Route path="/signup" element={ <SignupPage /> } />
      </Routes>
    </Router>
  );
}

export default App;
