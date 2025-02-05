import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Retailers.css'; // Import CSS file

const Retailers = () => {
    const images = [
        { src: '/images/HappyHippo.png', caption: 'Happy Hippo', link: '/seller/1' },
        { src: '/images/HappyLand.png', caption: 'Happy Land', link: '/seller/2' },
        { src: '/images/TeddyBear.png', caption: 'Teddy Bear', link: '/seller/3' },
        { src: '/images/FunZone.png', caption: 'Fun Zone', link: '/seller/4' },
        { src: '/images/DinoShop.png', caption: 'Dino Shop', link: '/seller/5' },
    ];

    return (
        <div>
            <h1 className="text-center text-title" style={{ marginTop: '40px' }}>ร้านค้า</h1>
            <Container className="my-4" style={{ width: '80%' }}>
                <Row className="justify-content-center">
                    {images.map((image, index) => (
                        <Col key={index} md={2} className="text-center mb-3 mx-2">
                            <Link to={image.link} className="retailer-link"> {/* ใช้คลาส retailer-link */}
                                <img
                                    src={image.src}
                                    alt={image.caption}
                                    className="retailer-image" /* ใช้คลาส retailer-image */
                                    style={{ height: '200px', width: '200px', objectFit: 'cover' }}
                                />
                                <div>{image.caption}</div>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export default Retailers;
