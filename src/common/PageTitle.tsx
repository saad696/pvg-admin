import React from "react";

interface props {
  title: string;
}

const PageTitle: React.FC<props> = ({title}) => {
  return (
    <>
      <h1 className="my-12 text-center lg:text-left font-bold uppercase text-lg lg:text-3xl text-gray-600">
        {title}
      </h1>
    </>
  );
};

export default PageTitle;
