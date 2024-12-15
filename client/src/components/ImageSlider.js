import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import './ImageSlider.css';

const images = [
    process.env.PUBLIC_URL + '/assets/image1.jpg',
    process.env.PUBLIC_URL + '/assets/image2.jpg',
    process.env.PUBLIC_URL + '/assets/image3.jpg',
    process.env.PUBLIC_URL + '/assets/image4.jpg'
];

const ImageSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true
    };

    return (
        <Slider {...settings} className="image-slider">
            {images.map((src, index) => (
                <div key={index}>
                    <img src={src} alt={`Slide ${index + 1}`} className="slider-image" onError={(e) => console.log(`Failed to load: ${src}`)} />
                </div>
            ))}
        </Slider>
    );
};

export default ImageSlider;
