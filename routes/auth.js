const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Admin = require('../model/user');
const sendMail = require ('../nodeMailer/sendMail');
const router = express.Router();

//userRegistration

router.post('/register',async(req,res) => {
    try {
        const { username,password,email } = req.body;
        const hashedPassword = await bcrypt.hash( password , 10 );
        const user = new User({ username : username , password : hashedPassword , email : email });
        await user.save();
        res.status(201).json({ message : "User Registration Successfull" });
    } catch (error) {
        //console.log(error);
        res.status(500).json({ error : "Registration Failed" });
    }
})

//userLogin

router.post('/login',async(req,res) => {
    try {
        const { username,password } = req.body;
        const user = await User.findOne({ username });
        if(!user){
            return res.status(401).json({ error : "Authentication failed" })
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(401).json({ error : "Authentication failed" })
        }
        const token = jwt.sign({userId : user._id},"secret key",{expiresIn:'1h'});
        res.status(200).json({ token })
    } catch (error) {
        //console.log(error);
        res.status(500).json({error : "Login Failed"});
    }
})

//otp generation 

router.post('/forgotPassword',async(req,res) => {
    try { 
        const { username } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }
        const otp = Math.floor(Math.random()*100000);
        const updateOtp=await User.findByIdAndUpdate(user._id,{otp:otp},{new:true})
        if(updateOtp){
            sendMail(user.email,otp);
            console.log(user.email);
            return res.status(200).json({message:"OTP send to mail"});
        }
    
     res.status(400).json({ message: 'OTP sent Failed' });
    }catch (error) {
        console.log(error)
    }

})

module.exports = router;
