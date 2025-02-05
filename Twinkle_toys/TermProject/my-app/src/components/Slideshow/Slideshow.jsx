import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Slideshow.css';

const Slideshow = () => {
    return (
        <Carousel className="carousel-container" interval={5000} fade>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="/images/Banner1.png"
                    alt="First slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="/images/Banner2.png"
                    alt="Second slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="/images/Banner3.png"
                    alt="Third slide"
                />
            </Carousel.Item>
        </Carousel>
    );
}

export default Slideshow;
