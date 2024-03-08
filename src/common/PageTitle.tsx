import React from "react";
import vikinLogo from "../assets/vikin-transparent.png";

interface props {
  title: string;
}

const PageTitle: React.FC<props> = ({ title }) => {
  const displayTitle = (): React.ReactNode | string => {
    const splitTitle = title.split("-");

    return splitTitle[0].trim().toLowerCase() === "vikin" ? (
      <span className="flex items-center">
        <img src={vikinLogo} alt="logo" width={180} /> - {splitTitle[1]}
      </span>
    ) : (
      title
    );
  };

  return (
    <>
      <h1 className="my-12 text-center lg:text-left font-bold uppercase text-lg lg:text-3xl text-gray-600">
        {displayTitle()}
      </h1>
    </>
  );
};

export default PageTitle;
