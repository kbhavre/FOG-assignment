import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoMdShare } from "react-icons/io";
import { MdCompareArrows } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product, onLike }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const truncateText = (text, limit) =>
    text?.length > limit ? text.substring(0, limit) + "..." : text;

  const handleLike = () => {
    setIsLiked(!isLiked); // Toggle like state
    onLike(product, !isLiked); // Notify parent component
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="relative overflow-hidden"
      onMouseEnter={() => setHoveredIndex(product.id)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Overlay */}
      <motion.div
        className="absolute z-[100] top-0 left-0 bg-black opacity-60 flex items-center justify-center"
        initial={{ x: "-100%" }}
        animate={{ x: hoveredIndex === product.id ? "0%" : "-100%" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ height: "100%", width: "100%" }}
      >
        <div className=" flex flex-col items-center justify-center gap-4">
          <button className="bg-primary text-secondary font-bold px-10 py-2">Add to Cart</button>
          <div className="flex gap-4">
            <div className="text-white">
              <button className="flex justify-center items-center gap-1">
                <IoMdShare />
                <span>Share</span>
              </button>
            </div>
            <div className="text-white">
              <button className="flex justify-center items-center gap-1">
                <MdCompareArrows />
                <span>Compare</span>
              </button>
            </div>
            <div className="text-white">
              <button
                className="flex justify-center items-center gap-1"
                onClick={(e) => {
                  e.preventDefault(); // Prevent Link navigation
                  handleLike();
                }}
              >
                {isLiked ? <FaHeart /> :<FaRegHeart />}
                <span>Like</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* "Discount" Badge */}
      {
        product.discount && (
          <div className="absolute z-10 right-0 top-0 h-12 w-12 rounded-full flex items-center justify-center bg-red-500 m-4">
        {product.discount}%
      </div>
        )}
      

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-56 object-cover rounded-md mb-5"
      />

      {/* Product Details */}
      <div className="px-2 flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{product.title}</h2>
        <p className="text-gray-600 leading-none">
          {truncateText(product?.subtitle, 100)}
        </p>
        <div className="flex items-center gap-4 mb-6">
          <p className="font-bold text-lg">${product.price}</p>
          {product.oldPrice && (
            <p className="text-lg line-through">${product.oldPrice}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    oldPrice: PropTypes.number,
  }).isRequired,
  onLike: PropTypes.func.isRequired, // Parent callback for like action
};

export default ProductCard;