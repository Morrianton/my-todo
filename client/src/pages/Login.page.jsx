// Libraries
import axios from "axios";
import { useContext, useState } from "react";

// Contexts
import AuthContext from "../contexts/Auth.context";

/**
 * Login page component.
 * 
 * @component
 * @returns {JSX.Element} The rendered login page component.
 */
const LoginPage = () => {
  const { dispatchAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');

  /**
   * Handles submission of the login form.
   * @param {Event} event Used to prevent default form submission behavior.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    axios.post(
      '/api/v1/user/login',
      { email, password }
    )
    .then((response) => {
      localStorage.setItem('user', JSON.stringify(response.data));
      dispatchAuth({ payload: response.data, type: 'LOG_IN'});
      setEmail('')
      setPassword('')
    })
    .catch((error) => setError(error.response.data.error))
    .finally(() => setIsLoading(false));
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log in</h3>
      <label>Email</label>
      <input
        type="email"
        onChange={(event) => setEmail(event.target.value)}
        value={email}
      />
      <label>Password</label>
      <input
        type="password"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
      />
      <button disabled={isLoading}>{(isLoading) ? '...please wait' : 'Log in'}</button>
      { error && <p>{error}</p> }
    </form>
  )
}

export default LoginPage;
