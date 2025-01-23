import bannerImg from "../assets/bannerImg.png";
import Products from "../components/Products";

const Shop = () => {
  return (
    <div>
      {/* Banner Section */}
      <div className="relative">
        <img
          src={bannerImg}
          alt="BannerImg"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-medium tracking-wide">Shop</h1>
          <h3 className="text-[16px] mt-2 font-medium">Home &gt; Shop</h3>
        </div>
      </div>

      {/* Pagination Section */}
      {/* <div className="min-h-screen w-full bg-green-400"></div> */}
      <Products/>
    </div>


  );
};

export default Shop;
