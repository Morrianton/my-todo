// Libraries
import { Link } from "react-router-dom";
import { useContext } from "react";

// Contexts
import AuthContext from "../../contexts/Auth.context";
import ListsContext from "../../contexts/Lists.context";

/**
 * Navigation bar component.
 * 
 * @component
 * @returns {React.JSX.Element} The nav bar component to render.
 */
const NavBar = () => {
  const { dispatchLists } = useContext(ListsContext);
  const { user, dispatchAuth } = useContext(AuthContext);

  /**
   * Logs the user out of the app by removing their user data from state and local storage.
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatchLists({ payload: null, type: 'SET_LISTS'});
    dispatchAuth({ type: 'LOG_OUT' });
  };

  return (
    <header>
      <Link to="/">
        <h1>My To-do</h1>
      </Link>
      <nav>
        {
          (user) ? (
            <>
              <span>Hello {user.email}!</span>
              <Link to="/settings">Account Settings</Link>
              <Link to="/login" onClick={handleLogout}>Log out</Link>
            </>
           ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )
        }
      </nav>
    </header>
  );
};

export default NavBar;
