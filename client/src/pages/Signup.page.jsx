import { useState } from "react";

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign up</h3>
      <label>Email</label>
      <input
        type="email"
        onChange={ (event) => setEmail(e.target.value) }
        value={ email }
      />
      <label>Password</label>
      <input
        type="email"
        onChange={ (event) => setPassword(e.target.value) }
        value={ password }
      />
      <button>Sign up</button>
    </form>
  )
}

export default SignupPage;
