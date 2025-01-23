const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const streamifier = require("streamifier");

const upload = multer({ storage: multer.memoryStorage() });

// Controller to add a product
exports.addProduct = async (req, res) => {
  try {
    const { title, subtitle, discount, newTag, oldPrice, price } = req.body;

    // Validate required fields
    if (!title || !subtitle || !price) {
      return res.status(400).json({ message: "Title, subtitle, and price are required." });
    }

    let imageUrl = "https://via.placeholder.com/150"; // Default image URL

    // If an image is uploaded, upload it to Cloudinary
    if (req.file) {
      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      imageUrl = await uploadStream();
    }

    // Create the new product with optional fields
    const newProduct = new Product({
      title,
      subtitle,
      discount: discount || null,
      newTag: newTag === "true", // Convert string to boolean if provided
      oldPrice: oldPrice || null,
      price,
      image: imageUrl,
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
    });
  }
};

// Controller to fetch all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};