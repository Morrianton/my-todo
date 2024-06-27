import { useState } from "react";
import axios from "axios";

/**
 * Account Settings Page component.
 * 
 * @component
 * @returns {React.JSX.Element} The account settings page component to render.
 */
const AccountSettingsPage = () => {
  const [error, setError] = useState(null);
  const [messageSent, setMessageSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  /**
   * Sends an email invitation to sign up to use the app.
   * @param {Event} event Event object to prevent default form submission behavior.
   */
  const sendInvitation = (event) => {
    event.preventDefault();
    setPending(true);

    axios.post(
      '/api/v1/settings/invite',
      { email: recipientEmail },
      { headers: { Authorization: user.token } }
    )
    .then((response) => {
      if (response.statusText === 'OK') {
        setTimeout(() => {
          setRecipientEmail('');
          setMessageSent(false);
        }, 5000);
      }
    })
    .catch((error) => setError(error))
    .finally(() => setPending(false));
  };

  return (
    <>
      <h1>Account Settings</h1>
      <h2>Social</h2>
      <p>Invite a friend to use the My To-do app.</p>
      <form action={sendInvitation}>
        <label>
          Email
          <input
            onChange={(event) => setRecipientEmail(event.target.value)}
            placeholder="genie@ofthelamp.net"
            type="email"
            value={recipientEmail}
          />
        </label>
        <button disabled={pending} type="submit">Invite</button>
        { error && <p>{error.message}</p> }
        { messageSent && <p>Hurray! We've sent an invitation to {recipientEmail}!</p> }
      </form>
    </>
  );
}

export default AccountSettingsPage;
