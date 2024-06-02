// ImageGallery.js
import React, { useState } from "react";
import "../styles/ImageGallery.css"; // assuming your styles are defined here

function ImageGallery({ images, initialImage }) {
  const [mainImage, setMainImage] = useState(initialImage);

  return (
    <div className="gallery">
      <div className="main-image">
        <img src={mainImage} alt="Main view" />
      </div>
      <div className="thumbnail-container">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            className="thumbnail"
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
