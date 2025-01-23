const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = {
  origin: '*', // Explicitly allow the client origin
  credentials: true, // Allow credentials (cookies, headers, etc.)
};
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use('/api/products', productRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// default route
app.get("/", (req,res)=>{
    res.send(`<p> This is default page of FOG Assignment </p>`);
})

