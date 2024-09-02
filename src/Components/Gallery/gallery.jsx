import "./SlideShow.css";
import { useState } from "react";
import Slider from "./SlideShow"
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
export default function App() {
    const [photos, setPhotos] = useState([]);
    const profile = useSelector((state) => state.data.profile);

    useEffect(() => {
        const fetchFilteredPhotos = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/upload/?user_id=${profile['user_id']}`);
                if (response.ok) {
                    const data = await response.json();
                    setPhotos(data.photos);
                } else {
                    console.error('Failed to fetch filtered photos');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchFilteredPhotos();
    }, []);


    if (photos.length === 0) {
        return <p>Loading photos...</p>;
    }
  return (
    <div className="App">
      <Slider initialImages={photos} />

      
    </div>
  );
}