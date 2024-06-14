
import { useReducer } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import LoginPage from "./pages/Login.page";
import SignupPage from "./pages/Signup.page";
import TasksPage from "./pages/Tasks.page";
import AuthContext from "./contexts/Auth.context";
import AuthReducer from "./reducers/Auth.reducer";

function App() {
  const [user, dispatchAuth] = useReducer(AuthReducer, null);

  return (
    <AuthContext.Provider value={ user }>
      <Router>
        <Routes>
            <Route path="/" element={ <TasksPage /> } />
            <Route path="/login" element={ <LoginPage /> } />
            <Route path="/signup" element={ <SignupPage /> } />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
