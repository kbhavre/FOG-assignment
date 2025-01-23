import { useState, useRef, useEffect } from "react";
import { productsData } from "../constants/index";
import filterIcon from '../../public/filterIcon.svg';
import gridIcon from '../../public/gridView.svg';
import singleIcon from '../../public/singleView.svg';
import ProductCard from "./ProductCard";
const BASE_URL = "https://fog-assignment-bo1o.onrender.com/"

function Filter({ 
  showCount, 
  setShowCount, 
  sortOption, 
  setSortOption, 
  setFilterVisible, 
  filterVisible, 
  setPriceRange, 
  setBrandFilter, 
  setCategoryFilter,
  viewMode,
  setViewMode 
}) {
  const filterButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: "0px", left: "0px" });

  useEffect(() => {
    if (filterButtonRef.current && filterVisible) {
      const buttonRect = filterButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: `${buttonRect.bottom + window.scrollY}px`,
        left: `${buttonRect.left + window.scrollX}px`,
      });
    }
  }, [filterVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setFilterVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyPress = (e, setter, isPriceRange = false) => {
    if (e.key === "Enter") {
      if (isPriceRange) {
        setter(e.target.value);
      } else {
        setter(e.target.value);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-[#f9f3eb] p-4 space-y-4 px-16 sm:space-y-0">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto justify-between">
        <button
          ref={filterButtonRef}
          className="flex items-center text-black"
          onClick={() => setFilterVisible(!filterVisible)}
        >
          <img src={filterIcon} alt="" />
          <span className="ml-1">Filter</span>
        </button>
        <div className="flex gap-4">
        <button onClick={() => setViewMode('grid')}>
          <img src={gridIcon} alt="gridIcon" />
        </button>
        <button onClick={() => setViewMode('single')}>
          <img src={singleIcon} alt="singleIcon" />
        </button>
        <span className="text-gray-600 border-l-2 border-gray-600 py-1 px-4">Showing 1-{showCount} results</span>
        </div>
        

        
      </div>

      <div>
        <button className="py-2 px-6 bg-white font-semibold text-secondary">Add Products</button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <span className="text-gray-600">Show</span>
          <input
            type="number"
            className="w-10 flex items-center justify-center text-center"
            value={showCount}
            onChange={(e) => setShowCount(e.target.value)}
            onKeyDown={(e) =>  setShowCount(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-gray-600">Sort by</span>
          <select
            className="p-1 flex items-center justify-center"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="Default">Default</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {filterVisible && (
        <div
          ref={dropdownRef}
          className="absolute bg-white shadow-lg p-4 space-y-4 z-50"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: "30%",
          }}
        >
          <h3 className="text-lg font-semibold">Filters</h3>
          <div className="flex items-center justify-between">
            <label htmlFor="brand" className="text-gray-600">Brand</label>
            <input
              type="text"
              id="brand"
              className="p-1 border"
              placeholder="Enter brand"
              onChange={(e) => setBrandFilter(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, setBrandFilter)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="category" className="text-gray-600">Category</label>
            <input
              type="text"
              id="category"
              className="p-1 border"
              placeholder="Enter category"
              onChange={(e) => setCategoryFilter(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, setCategoryFilter)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="minPrice" className="text-gray-600">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              className="p-1 border"
              placeholder="0"
              onChange={handlePriceRangeChange}
              onKeyDown={(e) => handleKeyPress(e, setPriceRange, true)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="maxPrice" className="text-gray-600">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              className="p-1 border"
              placeholder="1000"
              onChange={handlePriceRangeChange}
              onKeyDown={(e) => handleKeyPress(e, setPriceRange, true)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
// [Previous Filter component remains the same]

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCount, setShowCount] = useState(16);
  const [sortOption, setSortOption] = useState("Default");
  const [filterVisible, setFilterVisible] = useState(false);
  const [priceRange, setPriceRange] = useState({ minPrice: "", maxPrice: "" });
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState('grid');
  
  const getProductsFromBackend = async() => {
    try {
      const response = await fetch("https://fog-assignment-bo1o.onrender.com/api/products/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setProducts(data);
    } catch(err) {
      console.log("Error in fetching product data : ", err);
    }
  }

  useEffect(() => {
    getProductsFromBackend();
    setLoading(false);
  }, []);

  useEffect(() => {
    // Adjust showCount based on view mode
    setShowCount(viewMode === 'grid' ? 16 : 8);
  }, [viewMode]);

  // Robust filtering with fallback for empty inputs
  const filteredProducts = products.filter((product) => {
    // Handle price range
    const minPrice = priceRange.minPrice !== "" ? parseFloat(priceRange.minPrice) : 0;
    const maxPrice = priceRange.maxPrice !== "" ? parseFloat(priceRange.maxPrice) : Infinity;

    // Robust input matching
    const matchesBrand = !brandFilter || 
      product.brand.toLowerCase().includes(brandFilter.toLowerCase().trim());
    
    const matchesCategory = !categoryFilter || 
      product.category.toLowerCase().includes(categoryFilter.toLowerCase().trim());

    return (
      product.price >= minPrice &&
      product.price <= maxPrice &&
      matchesBrand &&
      matchesCategory
    );
  });

  // Validate and sanitize show count
  const sanitizedShowCount = Math.max(1, parseInt(showCount) || 16);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Price: Low to High") {
      return a.price - b.price;
    }

    if (sortOption === "Price: High to Low") {
      return b.price - a.price;
    }

    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <h1>Loading...</h1>
      </div>
    );
  }

  const productsPerPage = sanitizedShowCount;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <Filter
        showCount={showCount}
        setShowCount={setShowCount}
        sortOption={sortOption}
        setSortOption={setSortOption}
        filterVisible={filterVisible}
        setFilterVisible={setFilterVisible}
        setPriceRange={setPriceRange}
        setBrandFilter={setBrandFilter}
        setCategoryFilter={setCategoryFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Featured Products</h1>

        <div className={`grid ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1 md:grid-cols-2'
        } gap-8`}>
          {currentProducts.map((product) => (
            <ProductCard key={product?.title} product={product} />
          ))}
        </div>

        <div className="flex justify-center items-center mt-8 gap-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-[#b88e2f] text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="mx-1 px-4 py-2 rounded bg-gray-200 text-gray-800"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Products;