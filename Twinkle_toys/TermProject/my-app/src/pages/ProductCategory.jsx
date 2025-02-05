import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Dropdown, Modal } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaBasketShopping } from "react-icons/fa6";
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

const ProductCategory = () => {
    const [products, setProducts] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [showDiscount, setShowDiscount] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const placeholderImage = '/images/placeholder.png';
    const navigate = useNavigate();
    const { categoryId } = useParams();

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

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/products/category/${categoryId}`);
                let productData = response.data;

                if (showDiscount) {
                    productData = productData.filter(product => product.discount > 0);
                }

                if (sortOrder === 'asc') {
                    productData.sort((a, b) => a.price - b.price);
                } else {
                    productData.sort((a, b) => b.price - a.price);
                }

                setProducts(productData);
            } catch (error) {
                console.error('Error fetching the products:', error);
            }
        };

        fetchCategoryProducts();
    }, [categoryId, sortOrder, showDiscount]);

    const handleSort = (order) => {
        setSortOrder(order);
    };

    const handleFilterDiscount = () => {
        setShowDiscount(prev => !prev);
    };

    return (
        <div>
            <Navbar />
            <div style={{ paddingLeft: '110px', paddingTop: '130px' }}>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => navigate('/')}>หน้าแรก</Breadcrumb.Item>
                    <Breadcrumb.Item active>{products.length > 0 && products[0].categories ? products[0].categories.name : 'สินค้าตามหมวดหมู่'}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <h1 className="text-center text-title" style={{ marginTop: '40px' }}>
                {products.length > 0 && products[0].categories ? products[0].categories.name : 'สินค้าตามหมวดหมู่'}
            </h1>


            <div className="text-center mb-5 d-flex justify-content-center gap-3" style={{ marginBottom: '40px', marginTop: '40px' }}>
                <p>เรียงโดย : </p>
                <Dropdown>
                    <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                        จัดเรียงตามราคา
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleSort('asc')}>น้อยไปมาก</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSort('desc')}>มากไปน้อย</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Button
                    variant={showDiscount ? 'primary' : 'outline-primary'}
                    className="ms-2"
                    onClick={handleFilterDiscount}
                >
                    แสดงเฉพาะสินค้าที่มีส่วนลด
                </Button>
            </div>

            <Container className="my-4 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh', width: '75%' }}>
                <Row className="justify-content-center text-center">
                    {products.length > 0 ? (
                        products.map((product) => {
                            const primaryImage = product.image_url;
                            const oldPrice = (product.price / (1 - product.discount / 100)).toFixed(2);

                            return (
                                <Col md={4} key={product.product_id} className="d-flex justify-content-center">
                                    <Card
                                        className="text-center card-hover"
                                        style={{ margin: '0.5rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', transition: '0.3s' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
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
                                        <Card.Body>
                                            <Card.Title><strong>{product.name}</strong></Card.Title>
                                            <Card.Text style={{ color: "#5e5e5e" }}>ร้านค้า : {product.seller.name}</Card.Text>
                                            <Card.Text style={{ color: "#5e5e5e" }}>หมวดหมู่ : {product.categories.name}</Card.Text>
                                            <Card.Text style={{ color: "#5e5e5e" }}>สินค้าคงเหลือ : {product.inventory.quantity}</Card.Text>
                                            <hr style={{ border: '1px solid #808080', margin: '10px 0' }} />

                                            {product.discount > 0 && oldPrice && (
                                                <Card.Text className="card-text" style={{ textDecoration: 'line-through', color: 'red' }}>
                                                    <strong>ราคา: ฿{oldPrice}</strong>
                                                </Card.Text>
                                            )}

                                            <Card.Text>
                                                <strong style={{ fontSize: "19px" }}>ราคา : ฿{product.price}</strong>
                                            </Card.Text>

                                            {product.discount > 0 && (
                                                <Card.Text style={{ color: 'green' }}>
                                                    <strong>ลดราคา: {product.discount}%</strong>
                                                </Card.Text>
                                            )}

                                            <Button
                                                variant="primary"
                                                style={{ width: '80%' }}
                                                onClick={() => addToCart(product)} // เพิ่มสินค้าจำนวน 1 ชิ้นในตะกร้า
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
            <Footer />
        </div>
    );
}

export default ProductCategory;
