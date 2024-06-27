import User from "../models/userModel.mjs";

/**
 * Sends an invitation to create an account by email to a recipient.
 * @param {Request} req Request object.
 * @param {Response} res Response object.
 */
export const sendInvitation = async (req, res) => {
  const { email } = req.body;
  const senderId = req.user._id;

  try {
    const sender = await User.findOne({ _id: senderId });
    const alreadyRegisteredUser = await User.findOne({ email });
    // check if email already sent
    // can't invite self
    
    if (!sender) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    if (alreadyRegisteredUser) {
      return res.status(400).json({ error: 'Recipient already registered.'})
    }
    
    // generate invitation code
    // add invitation code to database
    // construct invitation link URL
    // construct email
    // send email including the invitation URL
    // if (success) 
    res.status(200).json({ message: 'SUCCESS' });
    // else send failure response

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
