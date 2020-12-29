const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Auth = require("../middleware/auth");
const auth = require("../middleware/auth");

//user registraion route
router.post("/register", async(req, res) => {
    try {
        const { email, password, confirmpassword, displayName } = req.body;
        //validation
        if (!email || !password || !displayName)
            return res.status(400).json({ msg: "Not all fields have entered!" });
        if (password.length < 5)
            return res.status(400).json({ msg: "Password must have at least 5 charachers long!" });
        if (password !== confirmpassword)
            return res.status(400).json({ msg: "Password does not matched !!" })
        const existingUser = await User.findOne({ email: email });
        if (existingUser)
            res.status(400).json({ msg: "User already Exist" });
        if (!displayName) displayName = email;
        const salt = await bcrypt.genSalt();
        const hashPassowrd = await bcrypt.hash(password, salt);
        const newUser = new User({
            email,
            password: hashPassowrd,
            displayName
        });
        const saveUser = await newUser.save();
        res.json(saveUser);
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }
});

//login route
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password)
            return res.status(400).json({ msg: "Email and password should not be empty!" });
        const user = await User.findOne({ email: email });
        if (!user)
            return res.status(400).json({ msg: "User account not found with the given email!!" })
        const isMatchedPassword = await bcrypt.compare(password, user.password);
        if (!isMatchedPassword)
            return res.status(400).json({ msg: "Password does not matched!!" });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email
            }
        })
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }
});

// delete route after login
router.delete("/delete", Auth, async(req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.user);
        res.status(200).json({ msg: "User Deleted Succesfully" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

router.post("/tokenisValid", async(req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token)
            return res.status(400).json(false);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);
        const user = User.findById(verified.id);
        if (!user) return res.json(false);
        res.json(true);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

router.get("/", auth, async(req, res)=>{
    const user = await User.findById(req.user);
    res.json({
        displayName:user.displayName,
        id:user._id,
    });
})
module.exports = router;