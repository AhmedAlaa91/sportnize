import React, { useState } from 'react';
import './SlideShow.css';

const Slide = ({ image_url, caption, active }) => {
  return (
    <div className={`slide ${active ? 'active' : ''}`}>
      <img src={image_url} alt={caption} />
      <span>{caption}</span>
    </div>
  );
};

const Slider = ({ initialImages }) => {
  const [images, setImages] = useState(initialImages);  // Use state for images
  const [active, setActive] = useState(0);
  const [captionName, setCaptionName] = useState('');
  const [message, setMessage] = useState('');

  const onNext = () => {
    if (active < images.length - 1) {
      setActive(active + 1);
    }
  };

  const onPrev = () => {
    if (active > 0) {
      setActive(active - 1);
    }
  };

  const handleImageClick = (i, caption) => {
    setActive(i);            // Set the active index
    setCaptionName(caption);  // Set the active caption
  };

  const handleDeletePhoto = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/api/upload/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: captionName }),  // Send the caption as the identifier
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message);

      // Update the images array by removing the deleted photo
      const updatedImages = images.filter((image) => image.caption !== captionName);

      // Reset active index if necessary
      if (active >= updatedImages.length && updatedImages.length > 0) {
        setActive(updatedImages.length - 1);
      }

      // Update the images state to trigger a re-render
      setImages(updatedImages);

    } catch (error) {
      setMessage(`Failed to delete photo: ${error.message}`);
    }
  };

  return (
    <div className="slider">
      <div className="slides">
        {images.map((e, i) => (
          <Slide key={e.caption} {...e} active={i === active} />
        ))}
      </div>
      <div className="navigation">
        <div className="navigation-bottom">
          {images.map((e, i) => (
            <img
              className={`preview ${i === active ? 'active' : ''}`}
              key={e.caption}
              onClick={() => handleImageClick(i, e.caption)}
              src={e.image_url}
              alt={e.caption}
              style={{ width: `${100 / images.length}%` }}
            />
          ))}
        </div>
        <div className="navigation-next-prev">
          <div className="next-prev prev" onClick={onPrev}>
            &lt;
          </div>
          <div className="next-prev next" onClick={onNext}>
            &gt;
          </div>
        </div>
      </div>
      <button onClick={handleDeletePhoto}>Delete Photo</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Slider;
