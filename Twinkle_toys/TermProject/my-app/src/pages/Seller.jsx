import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Modal } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBasketShopping } from 'react-icons/fa6';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

// Image data
const images = [
    { seller_id: 1, src: '/images/HappyHippo.png' },
    { seller_id: 2, src: '/images/HappyLand.png' },
    { seller_id: 3, src: '/images/TeddyBear.png' },
    { seller_id: 4, src: '/images/FunZone.png' },
    { seller_id: 5, src: '/images/DinoShop.png' },
];

const placeholderImage = '/images/default_product.png';

const Seller = () => {
    const { sellerId } = useParams();
    const [seller, setSeller] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const addToCart = async (product, quantityToAdd) => {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/cart/addcart', {
                product_id: product.product_id,
                quantity: quantityToAdd,
            });
            console.log('API Response:', response.data);
            setSelectedProduct(product);
            setShowModal(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('ไม่สามารถเพิ่มสินค้าไปยังรถเข็นได้');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        window.location.reload(); // Reload the page
    };

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/v1/seller/${sellerId}`);
                setSeller(response.data);
            } catch (error) {
                setError('Error fetching seller data');
                console.error("Error fetching seller data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSellerData();
    }, [sellerId]);

    const sellerImage = images.find(image => image.seller_id === Number(sellerId))?.src;

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <p>{error}</p>
            </Container>
        );
    }

    if (!seller) {
        return <p>Seller not found</p>;
    }

    return (
        <div>
            <Navbar />
            <div className="store-info-section" style={{ paddingTop: '130px' }}>
                <div style={{ paddingLeft: '110px' }}>
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() => navigate('/')}>หน้าแรก</Breadcrumb.Item>
                        <Breadcrumb.Item active>ร้านค้า</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Container className="my-2">
                    <table className="table table-bordered" style={{ width: '100%' }}>
                        <tbody>
                            <tr>
                                <td className="text-center" style={{ width: '30%' }}>
                                    {sellerImage ? (
                                        <img
                                            src={sellerImage}
                                            alt="Store Logo"
                                            className="img-fluid rounded-circle"
                                            style={{ height: '200px', width: '200px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <p>ไม่พบรูปภาพร้านนี้</p>
                                    )}
                                </td>
                                <td style={{ width: '70%' }}>
                                    <p><strong>ชื่อร้าน:</strong> {seller.name}</p>
                                    <p><strong>คำอธิบายร้านค้า:</strong> {seller.description}</p>
                                    <p><strong>อีเมล:</strong> {seller.email}</p>
                                    <p><strong>ที่ตั้ง:</strong> {seller.address}</p>
                                    <p><strong>เบอร์ติดต่อ:</strong> {seller.phone_number}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Container>
            </div>

            <h2 className="text-center" style={{ marginTop: '10px' }}>สินค้าทั้งหมดจากร้านค้า</h2>
            <Container className="my-4 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh', width: '75%' }}>
                <Row className="justify-content-center text-center">
                    {seller.products && seller.products.length > 0 ? (
                        seller.products.map((product) => (
                            <Col md={4} key={product.product_id} className="d-flex justify-content-center">
                                <Card
                                    className="text-center card-hover"
                                    style={{
                                        margin: '0.5rem',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        transition: '0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <Link to={`/product/${product.product_id}`} style={{ textDecoration: 'none' }}>
                                        <Card.Img
                                            variant="top"
                                            src={product.image_url || placeholderImage}
                                            alt={product.name}
                                            style={{ width: '300px', height: '300px' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = placeholderImage;
                                            }}
                                        />
                                    </Link>
                                    <Card.Body>
                                        <Card.Title><strong>{product.name}</strong></Card.Title>
                                        <Card.Text style={{ color: "#5e5e5e" }}>ร้านค้า : {seller.name}</Card.Text>
                                        <Card.Text style={{ color: "#5e5e5e" }}>หมวดหมู่ : {product.category?.name}</Card.Text>
                                        <Card.Text style={{ color: "#5e5e5e" }}>สินค้าคงเหลือ : {product.product_status}</Card.Text>
                                        <hr style={{ border: '1px solid #808080', margin: '10px 0' }} />
                                        <Card.Text>
                                            <strong style={{ fontSize: "19px" }}>ราคา : ฿{product.price}</strong>
                                        </Card.Text>
                                        <Button
                                            variant="primary"
                                            style={{ width: "100%" }}
                                            onClick={() => addToCart(product, 1)}
                                        >
                                            <FaBasketShopping style={{ marginRight: "2px" }} /> เพิ่มไปยังรถเข็น
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p className="text-center">ไม่พบสินค้าที่ค้นหา</p>
                    )}
                </Row>
            </Container>

            {selectedProduct && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>เพิ่มสินค้าในตะกร้า</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        เพิ่มสินค้า {selectedProduct.name} ลงในตะกร้าเรียบร้อยแล้ว!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            ปิด
                        </Button>
                        <Button variant="primary" onClick={() => { navigate('/cart'); handleCloseModal(); }}>
                            ไปที่ตะกร้า
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            <Footer />
        </div>
    );
};

export default Seller;