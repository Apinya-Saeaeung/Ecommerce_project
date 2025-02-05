import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBasketShopping } from "react-icons/fa6";
import './NewProduct.css'
import axios from 'axios';

const NewProducts = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const placeholderImage = '/images/placeholder.png';
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // เรียก API เพื่อดึงสินค้าทั้งหมดที่แนะนำ
                const response = await axios.get('http://localhost:8080/api/v1/products/new');

                // ใช้ข้อมูลที่ได้จากการตอบกลับ
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching the products:', error);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = async (product) => {
        try {
            await axios.post('http://localhost:8080/api/v1/cart/addcart', {
                product_id: product.product_id,
                quantity: 1,
            });
            setSelectedProduct(product); // กำหนดสินค้าที่เพิ่มในตะกร้า
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
    return (
        <div>
            <h1 className="text-center text-title" style={{ marginTop: '40px' }}>สินค้ามาใหม่</h1>
            <Container className="my-4 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh', width: '75%' }}>
                <Row className="justify-content-center text-center">
                    {products.length > 0 ? (
                        products.map((product) => {
                            const primaryImage = product.image_url;

                            return (
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
                                                src={primaryImage || placeholderImage}
                                                alt={product.name}
                                                style={{ width: '300px', height: '300px' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = placeholderImage;
                                                }}
                                            />
                                        </Link>
                                        <div className="new-badge">New</div>
                                        <Card.Body>
                                            <Card.Title><strong>{product.name}</strong></Card.Title>
                                            <Card.Text style={{ color: "#5e5e5e" }}>ร้านค้า : {product.seller.name}</Card.Text>
                                            <Card.Text style={{ color: "#5e5e5e" }}>หมวดหมู่ : {product.categories.name}</Card.Text>
                                            <Card.Text style={{ color: "#5e5e5e" }}>สินค้าคงเหลือ : {product.inventory.quantity}</Card.Text>
                                            <hr style={{ border: '1px solid #808080', margin: '10px 0' }} />
                                            <Card.Text>
                                                <strong style={{ fontSize: "19px" }}>ราคา : ฿{product.price}</strong>
                                            </Card.Text>
                                            <Button
                                                variant="primary"
                                                style={{ width: '100%' }}
                                                onClick={() => addToCart(product, 1)} // ใช้จำนวนที่กรอกเป็น 1 ชิ้น
                                            >
                                                <FaBasketShopping style={{ marginRight: "2px" }} /> เพิ่มไปยังรถเข็น
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })
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
        </div>
    );
}

export default NewProducts;
