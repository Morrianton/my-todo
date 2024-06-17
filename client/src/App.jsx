
// Libraries
import { useEffect, useReducer } from "react";
import { Navigate, BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Contexts
import AuthContext from "./contexts/Auth.context";

// Reducers
import AuthReducer from "./reducers/Auth.reducer";

// Styles
import "./App.css";

// Components
import NavBar from "./components/ui/NavBar";

// Pages
import LoginPage from "./pages/Login.page";
import SignupPage from "./pages/Signup.page";
import TasksPage from "./pages/Tasks.page";

/**
 * Root/App component.
 * 
 * @component
 * @returns {JSX.element} The rendered root/app component.
 */
const App = () => {
  const [user, dispatchAuth] = useReducer(AuthReducer, null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    if (loggedInUser) {
      dispatchAuth({
        payload: JSON.parse(localStorage.getItem('user')),
        type: 'LOG_IN',
      });
    }
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, dispatchAuth }}>
        <Router>
          <NavBar />
          <Routes>
              <Route path="/" element={(user) ? <TasksPage /> : <Navigate to="/login" />} />
              <Route path="/login" element={(!user) ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/signup" element={(!user) ? <SignupPage /> : <Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </>
  );
};

export default App;
