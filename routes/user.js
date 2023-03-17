import express from "express";
import bcrypt from "bcryptjs"
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async( req, res ) => {
    const{fName, lName, phone, email, password} = req.body;
    try {
        if(fName === "" || lName === "" || phone === "" || email === "" || password === ""){
            return res.status(400).json({error: "Please enter all required field"});
        }

        if(!fName || !lName || !phone || !email || !password){
            return res.status(400).json({error: "Enter all required fields"});
        }

        if(password.length < 6){
            return res.status(500).json({error: "Password length should be minimum of 6"});
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(500).json({error: 'User already exist'})
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fName, 
            lName,
            phone,
            email,
            password: hashedPassword,
        })
        const savedUser = await newUser.save();

        //JWT token 

        const token = jwt.sign({
            id: savedUser._id
        }, 'IZyvra)2H:ixd~,t%K_>~wg?%}izqc_|Fn1kU5\h8F[-C$t,u:!D[s\F7m\Hm+mt.X,4;|gr[Gm9?=vIE/S]S*z:!Hr.H"{2r>h=');

        res.cookie("token", token,{httpOnly: true, 
            sameSite: process.env.NODE_ENV === "development"
                ? "lax" 
                : process.env.NODE_ENV === "production" 
                && "none", 
            secure: process.env.NODE_ENV === "development"
                ? false 
                : process.env.NODE_ENV === "production"
                && true
        }).send();
        
    } catch (err) {
        res.status(500).json({error: err});
    }
});

router.post('/login', async(req, res) => {
    const{email, password} = req.body;

    try {
        if(!email || !password){
            return res.status(401).json({error: "Enter all required fields"});
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(500).json({error: 'Invalid Credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(500).json({error: 'Invalid Credentials'});
        }



        //JWT token 

        const token = jwt.sign({
            id: user._id
        }, 'IZyvra)2H:ixd~,t%K_>~wg?%}izqc_|Fn1kU5\h8F[-C$t,u:!D[s\F7m\Hm+mt.X,4;|gr[Gm9?=vIE/S]S*z:!Hr.H"{2r>h=');

        res.cookie("token", token,{
            httpOnly: true, 
            sameSite: process.env.NODE_ENV === "development"
                ? "lax" 
                : process.env.NODE_ENV === "production" 
                && "none", 
            secure: process.env.NODE_ENV === "development"
                ? false 
                : process.env.NODE_ENV === "production"
                && true
        }).send();
    } catch (error) {
        console.log(error);
    }
});

router.get('/loggedIn', async(req, res) => {
    try {
        const token = req.cookies.token;

        if(!token) return res.json(null);

        const validatedUser = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findById(validatedUser.id);
        res.json(user);
    } catch (error) {
        return res.json(null);
    }
})


router.get("/logout", async(req,res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true, 
            sameSite: process.env.NODE_ENV === "development"
                ? "lax" 
                : process.env.NODE_ENV === "production" 
                && "none", 
            secure: process.env.NODE_ENV === "development"
                ? false 
                : process.env.NODE_ENV === "production"
                && true,
            expires: new Date(0)
        }).send();
    } catch (error) {
        return res.json(null)
    }
})


export default router;
