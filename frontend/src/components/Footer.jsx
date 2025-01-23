import React from "react";
import { footerData } from "../constants/index";

const Footer = () => {
  return (
    <div className="bg-primary py-24">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-0">
        {footerData.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-center"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-12 h-12 mr-4"
            />
            <div className="flex flex-col -space-y-2">
              <h3 className="text-[25px] font-medium d mb-1">{item.title}</h3>
              <p className="text-gray-500">{item.subTitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;