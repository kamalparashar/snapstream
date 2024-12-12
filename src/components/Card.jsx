import React from "react";


function Card(post) {
  return (
    <>
      <div className="w-full h-full">
        <img src={post.FeaturedImage} className="object-cover w-full h-full border border-gray-600"/>
      </div>
      
    </>
  );
}

export default Card;
