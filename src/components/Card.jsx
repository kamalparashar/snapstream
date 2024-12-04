import React from "react";


function Card(post) {
  return (
    <>
      <div className=" w-[15vmax] h-auto flex flex-col justify-center mb-4 gap-2">
        <img src={post.FeaturedImage} />
      </div>
      
    </>
  );
}

export default Card;
