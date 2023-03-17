import express from 'express';
import Review from '../models/review.js';
import User from '../models/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post("/create", auth, async(req, res) => {
    const{name, review} = req.body;
    try {
        const user = await User.findById(req.user).select('-password');
        
        if(user.role !== 'admin'){
            return res.json({message: "Unauthorized"});
        }

        let message = new Review({
            name,
            review
        })
        await message.save();
        res.status(201).json({message: 'Review Created'});
    } catch (error) { 
        res.status(400).json(error);
    }
});

router.get("/", async(req, res) => {
    try {
        const review = await Review.find();
        return res.status(200).json(review);
    } catch (error) {
        console.log(error);
    }
})


router.put("/update/:id", auth, async(req,res) => {
    try {
        const{name, review} = req.body;
        const reviewId = req.params.id;

        if(!name && !review){
            return res.status(401).json({error: "Fields missing"});
        }

        if(!reviewId){
            return res.status(401).json({error: "Server Error!!!, Contact developer"});
        }

        const user = await User.findById(req.user).select('-password');
        
        if(user.role !== 'admin'){
            return res.json({message: "Unauthorized"});
        }

        const originalReview = await Review.findById(reviewId);
        if(!originalReview){
            return res.status(500).json({error: "Review missing"});
        }

        originalReview.name = name;
        originalReview.review = review;

        const savedReview = await originalReview.save();

        return res.status(200).json(savedReview);
    } catch (error) {
        
    }
});

router.delete("/delete/:id", auth, async(req, res) => {
    try {
        const reviewId = req.params.id;
        const user = await User.findById(req.user).select('-password');
        
        if(user.role !== 'admin'){
            return res.json({message: "Unauthorized"});
        } 

        if(!reviewId){
            return res.status(401).json({error: "Server Error!!!, Contact developer"});
        }

        const reviewd = await Review.findById(reviewId);

        if(!reviewd){
            return res.status(401).json({error: "No such review"});
        }

        const deletedReview = await Review.findOneAndDelete({_id: reviewId});

        return res.status(200).json(deletedReview);
    } catch (error) {
        console.log(error);
    }
})



export default router;