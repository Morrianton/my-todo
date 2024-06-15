// Libraries
import { Link } from "react-router-dom";

/**
 * Navigation bar component.
 * 
 * @component
 * @returns {React.JSX.Element} The nav bar component to render.
 */
const NavBar = () => {
  return (
    <header>
      <Link to="/">
        <h1>My To-dos</h1>
      </Link>
      <nav>
        <Link to="/login">Log in</Link>
        <Link to="/signup">Sign up</Link>
      </nav>
    </header>
  );
};

export default NavBar;