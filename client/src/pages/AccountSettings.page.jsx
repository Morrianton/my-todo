import { useState } from "react";

/**
 * 
 * @returns {JSX.Element} The account settings page component to render.
 */
const AccountSettingsPage = () => {
  const [entry, setEntry] = useState('');
  const [error, setError] = useState(null);

  /**
   * 
   */
  const sendInvitation = (event) => {
    event.preventDefault();
    // send off email
  };

  return (
    <>
      <h1>Account Settings</h1>
      <h2>Social</h2>
      <form action={sendInvitation}>
        <button type="submit">Send</button>
        { error && <p>{error}</p> }
      </form>

    </>
  );
}

export default AccountSettingsPage;
