import React from "react";

function Header() {
  return (
    <div className="w-full h-[225px] flex flex-col justify-evenly items-center bg-gradient-to-t from-[#179696] to-[#330867] text-white">
      <p className="text-5xl lg:text-7xl font-bold tracking-wider lg:tracking-wider text-center">
        The Unlisted Marketplace
      </p>
      <p className="text-md lg:text-xl tracking-tight text-center">
        Discover, analyze, and invest in India's most promising unlisted
        companies with cutting-edge data and insights.
      </p>
    </div>
  );
}

export default Header;
