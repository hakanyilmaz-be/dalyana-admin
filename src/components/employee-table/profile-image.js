import React, { useState, useEffect } from 'react';

const ProfileImage = ({ imageName }) => {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const loadImage = async () => {
            try {
                // Dynamically import the image
                const image = await import(`./employee-photos/${imageName}`);
                setImageSrc(image.default);
            } catch (err) {
                console.error("Error loading image:", err);
                // Set a default image or null if loading fails
                setImageSrc(null); 
            }
        };

        loadImage();
    }, [imageName]); // Reload the image when imageName changes

    return (
        <img 
            src={imageSrc} 
            alt={imageName} 
            style={{ height: '50px', width: '50px', borderRadius: '5px', objectFit: 'cover' }} 
        />
    );
};

export default ProfileImage;
