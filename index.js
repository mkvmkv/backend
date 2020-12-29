const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const todoRouter = require("./routes/todoRoutes");

require("dotenv").config();

// setup express

const app = express();
app.use(express.json());
app.use(cors());

//setup routes
app.use("/users", userRouter);

app.use("/todo", todoRouter);


// setup mongoose
mongoose.connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
    if (err) throw err;
    console.log('DB Connection done');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server is running on", PORT)
});