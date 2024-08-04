var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../model/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const secretKey = process.env.JWT_SECRET_KEY || 'mysecretkey';
/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ message: err });
  }
});

//////////////////////////////search user
router.get('/users', async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { fname: { $regex: req.query.search, $options: "i" } },
            { lname: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



/////////////////////////////////////////////////////////////////////////////////////signup////////////////
const multer = require('multer');
const Test = require('supertest/lib/test');
const upload = multer({ dest: 'C:/Users/Amine Barguellil/Desktop/projet pi/Ahmed/CatchApp_The_Innovators/public/img' }); // define upload directory

router.post('/signup', upload.single('profilePic'), async (req, res) => {


  const { fname, lname, birthdate, phone, email, password } = req.body;
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomCode = "";
  for (let i = 0; i < 25; i++) {
    randomCode += characters[Math.floor(Math.random() * characters.length)];
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with email verification token
  const user = new User({
    fname,
    lname,
    birthdate,
    phone,
    email,
    password: hashedPassword,
    verificationToken: crypto.randomBytes(20).toString('hex'),
    profilePic: req.file ? req.file.filename : undefined,
  });

  try {
    // Save the user to the database
    await user.save();

    // Send verification email
    const mailOptions = {
      from: 'hkyosri@gmail.com',
      to: user.email,
      subject: 'Verify your email address',
      text: `Please click on this link to verify your email address: ${process.env.REACT_APP_API_URL}/users/verify-email/${user.verificationToken}`
    };

     transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
////////////////////////////////////////////signin//////////////////////////////
router.post('/signin',async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await mongoose.connection.collection('users').findOne({ email });

  // Check if user exists and password is correct
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  ////////////////ckeck if verified///////////
  if (user.isActivated==false){
    return res.status(401).json({ message: 'please verify your email to verify your account' });
  }
  ////////////////ckeck if verified///////////
  if (user.isBanned==true){
    return res.status(401).json({ message: 'your account is banned' });
  }
  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

  // Send response with token
  res.json({ token });
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
//////////////////////////////////////get by id/////////////////////////////////////
router.get('/:id',  async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error getting user', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//////////////////////////update//////////////////////////
router.put('/update/:id', verifyToken, async (req, res) => {
  const { fname, lname, birthdate, phone } = req.body;
  const userId = req.params.id;

  try {
    // Find user by ID
    const user = await User.findOne({ _id: userId });

    // If user not found, return error response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.fname = fname || user.fname;
    user.lname = lname || user.lname;
    user.birthdate = birthdate || user.birthdate;
    user.phone = phone || user.phone;

    // Save updated user to database
    await user.save();

    res.json({ message: 'User updated' });
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//////////////////////////////////////////////////////

router.put('/updateUser/:id', async (req, res) => {
  const { fname, lname, birthdate, phone } = req.body;
  const userId = req.params.id;

  try {
    // Find user by ID
    const user = await User.findOne({ _id: userId });

    // If user not found, return error response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.fname = fname || user.fname;
    user.lname = lname || user.lname;
    user.birthdate = birthdate || user.birthdate;
    user.phone = phone || user.phone;

    // Save updated user to database
    await user.save();

    res.json({ message: 'User updated' });
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.put('/updateAdmin/:id', async (req, res) => {
  const { fname, lname, birthdate, phone } = req.body;
  const userId = req.params.id;

  try {
    // Find user by ID
    const user = await User.findOne({ _id: userId });

    // If user not found, return error response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.fname = fname || user.fname;
    user.lname = lname || user.lname;
    user.birthdate = birthdate || user.birthdate;
    user.phone = phone || user.phone;

    // Save updated user to database
    await user.save();

    res.json({ message: 'User updated' });
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


/////////////////////////////////////////////////

router.put('/updateProvider/:id', async (req, res) => {
  const userId = req.params.id;
  try { 
    // Find user by ID
    const user = await User.findOne({ _id: userId });

    // If user not found, return error response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.provider="Google"
    await user.save();

    res.json({ message: 'User updated' });
  }
  catch (err) {
    console.error('Error updating user', err);
  }
});


router.put('/updateFacebookProvider/:id', async (req, res) => {
  const userId = req.params.id;
  try { 
    // Find user by ID
    const user = await User.findOne({ _id: userId });

    // If user not found, return error response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.provider="Facebook"
    await user.save();

    res.json({ message: 'User updated' });
  }
  catch (err) {
    console.error('Error updating user', err);
  }
});




/////////////////////////////////////////////////



  ///////////////////////////
  router.delete('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findOneAndDelete({ _id: userId });
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User deleted' });
    } catch (err) {
      console.error('Error deleting user', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


//////////////////////update password////////////////////
router.put('/:id', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    // Find user by ID
    const user = await User.findOne({ _id: userId });

    // If user not found, return error response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if old password matches with stored password
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedNewPassword;

    // Save updated user to database
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Error updating password', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hkyosri@gmail.com',
    pass: 'ujglsqtoifiomukc'
  }
});
//////////////////////////////////is verified email
router.get('/verify-email/:verificationToken', async (req, res) => {
  const token = req.params.verificationToken;

  try {
    // Find user by verification token
    const user = await User.findOne({ verificationToken: token });

    // If user not found, return error response
    if (!user) {
      return res.status(404).json({ message: 'Invalid verification token' });
    }

    // Update user's isVerified flag
    user.isActivated = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email address verified' });
  } catch (err) {
    console.error('Error verifying email address', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
////////////forget password///////////
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // generate a new random password
    const newPassword = Math.random().toString(36).slice(-8);

    // update the user's password with the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // send the new password to the user's email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your New Password',
      text: `Dear user, note that after your request to recover password your new one will be
      Password : ${newPassword}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Password updated and email sent successfully' });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

////////////////////////////////ban a user and send an email////////////
router.get('/ban/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Find user by ID
    const user = await User.findOne({ _id: userId });

    // If user not found, return error response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isBanned==true){
      return res.status(404).json({message: 'user is already banned'})
    }
    // Set ban status to true and add reason
    user.isBanned = true;

    // Save updated user to database
    await user.save();

    // Send ban email
    const mailOptions = {
      from: 'hkyosri@gmail.com',
      to: user.email,
      subject: 'Your account has been banned',
      text: `Your account has been banned for more informations you need to contact us.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'User banned' });
  } catch (err) {
    console.error('Error banning user', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
////////////////unban a user////////////////////////////////////////////////
router.get('/unban/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Find user by ID
    const user = await User.findOne({ _id: userId });

    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isBanned==false){
      return res.status(404).json({message: 'the user is not banned'})
    }
    
    user.isBanned = false;

    // Save updated user to database
    await user.save();

    // Send unban email
    const mailOptions = {
      from: 'hkyosri@gmail.com',
      to: user.email,
      subject: 'Your account has been banned',
      text: `your account is now unbanned`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'User unbanned' });
  } catch (err) {
    console.error('Error unbanning user', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/:id/events', async (req, res) => {
  const Id = req.params.id;
  try {
    const user = await User.findById(Id).populate('events');
    if (!user) {
      res.status(404).send({ "message": "User not found" });
      return;
    }
    res.json(user.events);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ "message": "Erreur serveur" });
  }
});

//////////////////////methode to get the number of users////////////////////

router.get('/users/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).send(error);
  }
});

///////////methode to create a chart for providers////////////

module.exports = router;
