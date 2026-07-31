import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const Slider = ({ images }) => {
    const showDots = (images.length > 1) ? true : false;
    
    return (
        <Carousel className='w-full' showArrows={true} showThumbs={false} showIndicators={showDots} showStatus={showDots}>
            {images.map((image, index) => (
                <img src={image} key={index} alt="" className="w-full h-96 object-cover " style={{ height: "500px" }} /> 
            ))}
        </Carousel>
    )
}

export default Slider