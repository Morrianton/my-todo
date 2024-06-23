import { useState } from "react";

/**
 * 
 * @returns {JSX.Element} The account settings page component to render.
 */
const AccountSettingsPage = () => {
  const [entry, setEntry] = useState('');

  /**
   * 
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    // send off email
  };

  return (
    <>
      <h1>Account Settings</h1>
      <h2>Social</h2>
      <form onSubmit={handleSubmit}>
        <label for="invitee-email" >recipient's email</label>
        <input name="invitee-email" onChange={(event) => setEntry(event.target.value)} type="email" value={entry}/>
        <button type="submit">Send</button>
        { error && <p>{error}</p> }
      </form>

    </>
  );
}

export default AccountSettingsPage;
