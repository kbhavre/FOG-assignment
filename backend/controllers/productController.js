const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');

// Set up multer for image handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Controller to add a product
exports.addProduct = async (req, res) => {
  try {
    const uploadSingle = upload.single('image');

    // Use multer to handle the image file
    uploadSingle(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading image', error: err.message });
      }

      // Destructure product details from the request body
      const { title, subtitle, discount, newTag, oldPrice, price } = req.body;

      // Validate required fields
      if (!title || !subtitle || !discount || !newTag || !oldPrice || !price) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if image file is present
      if (!req.file) {
        return res.status(400).json({ message: 'Product image is required' });
      }

      // Upload image to Cloudinary using a stream
      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'FOG', resource_type: 'image' }, // Store images in the FOG folder
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await uploadStream();

      // Create the new product
      const newProduct = new Product({
        title,
        subtitle,
        discount,
        newTag: newTag === 'true', // Convert string to boolean
        oldPrice,
        price,
        image: result.secure_url, // Store the Cloudinary URL of the image
      });

      // Save the product to the database
      await newProduct.save();

      res.status(201).json({
        message: 'Product added successfully',
        product: newProduct,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// Controller to fetch all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.status(200).json(products); // Send the list of products as the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};