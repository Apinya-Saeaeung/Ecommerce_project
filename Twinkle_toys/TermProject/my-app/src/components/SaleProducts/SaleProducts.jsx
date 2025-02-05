import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBasketShopping } from "react-icons/fa6";
import axios from 'axios';
import './SaleProducts.css';

const SaleProducts = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const placeholderImage = '/images/placeholder.png';
    const navigate = useNavigate();

    // ดึงข้อมูลจาก API
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/products/allproducts')
            .then((response) => {
                const fetchedProducts = response.data;

                // กรองเฉพาะสินค้าที่มี discount > 0
                const filteredProducts = fetchedProducts.filter(product => product.discount > 0);

                setProducts(filteredProducts);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
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
            <h1 className="text-center text-title" style={{ marginTop: '40px' }}>สินค้าลดราคา</h1>
            <Container className="my-4 d-flex justify-content-center align-items-center" style={{ minHeight: '10vh', width: '75%' }}>
                <Row className="justify-content-center text-center">
                    {products.length > 0 ? (
                        products.map((product) => {
                            const primaryImage = product.image_url || placeholderImage;

                            // คำนวณราคาลด
                            const discountPercentage = product.discount;
                            const oldPrice = (product.price / (1 - discountPercentage / 100)).toFixed(2);

                            return (
                                <Col md={4} key={product.product_id} className="d-flex justify-content-center">
                                    <Card
                                        className="text-center"
                                        style={{
                                            margin: '0.5rem',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // เงาของการ์ด
                                            position: 'relative', // เพื่อให้แถบ Sale วางอยู่ภายในการ์ด
                                            transition: '0.3s' // การเปลี่ยนแปลงเมื่อ hover
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.02)'; // ขยายเมื่อ hover
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)'; // คืนค่าขนาดเมื่อไม่ hover
                                        }}
                                    >
                                        <Link to={`/product/${product.product_id}`} style={{ textDecoration: 'none' }}> {/* Link รอบรูปภาพ */}
                                            <Card.Img
                                                variant="top"
                                                src={primaryImage}
                                                alt={product.name}
                                                style={{ width: '300px', height: '300px' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = placeholderImage;
                                                }}
                                            />
                                        </Link>
                                        <div className="sale-badge">Sale</div> {/* แถบ Sale */}
                                        <Card.Body>
                                            <Card.Title><strong>{product.name}</strong></Card.Title>
                                            <Card.Text style={{ color: "#5e5e5e" }}>ร้านค้า : {product.seller.name}</Card.Text>
                                            <Card.Text style={{ color: "#5e5e5e" }}>หมวดหมู่ : {product.categories.name}</Card.Text>
                                            <Card.Text style={{ color: "#5e5e5e" }}>สินค้าคงเหลือ : {product.inventory.quantity}</Card.Text>
                                            <hr />

                                            {/* ราคาเดิม (ก่อนลด) */}
                                            <Card.Text className="card-text" style={{ textDecoration: 'line-through', color: 'red' }}>
                                                <strong>ราคา: ฿{oldPrice}</strong>
                                            </Card.Text>

                                            {/* ราคาใหม่ (หลังลด) */}
                                            <Card.Text className="card-text" style={{ fontSize: "20px" }}>
                                                <strong>ราคา: ฿{product.price}</strong>
                                            </Card.Text>

                                            {/* เปอร์เซ็นต์การลดราคา */}
                                            <Card.Text className="card-text" style={{ color: 'green' }}>
                                                <strong>ลดราคา: {discountPercentage}%</strong>
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
                        <p className="text-center">ไม่พบสินค้าที่ลดราคา</p>
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
};

export default SaleProducts;
