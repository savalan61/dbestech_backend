const express = require('express')
const app = express()
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const categoryRoute = require('./routes/category');
const restaurantRoute = require('./routes/restaurant');
const foodRoute = require('./routes/food');
const ratingRoute = require('./routes/rating');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const addressRoute = require('./routes/address');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');


const generateOtp = require('./utils/otp_generator')
const sendEmal = require('./utils/smtp_function');
const otp_generator = require('./utils/otp_generator');


dotenv.config();

//console.log(process.env.SECRET)
mongoose.connect(process.env.MONGOURL).then(() => { console.log('Foody database connected!') }).catch((err) => { console.log(err) });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/category", categoryRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/foods", foodRoute);
app.use("/api/rating", ratingRoute);
app.use("/", authRoute);
app.use("/api/users", userRoute);
app.use("/api/address", addressRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);



//const opt = otp_generator();
//sendEmal('abbasshiralipoor61@gmail.com', opt)

app.listen(process.env.PORT || 6013, () => console.log(`Foody Backend is running on ${process.env.PORT}!`))