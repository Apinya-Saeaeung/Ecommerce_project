import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Spinner } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import Navbar from '../components/Navbar/Navbar';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Footer from '../components/Footer/Footer';
import axios from 'axios';

const images = [
    { seller_id: 1, src: '/images/HappyHippo.png', link: '/seller/1' },
    { seller_id: 2, src: '/images/HappyLand.png', link: '/seller/2' },
    { seller_id: 3, src: '/images/TeddyBear.png', link: '/seller/3' },
    { seller_id: 4, src: '/images/FunZone.png', link: '/seller/4' },
    { seller_id: 5, src: '/images/DinoShop.png', link: '/seller/5' },
];

const placeholderImage = './images/placeholder.jpg';

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const addToCart = async (product, quantityToAdd) => {
        try {
          const response = await axios.post('http://localhost:8080/api/v1/cart/addcart', {
            product_id: product.product_id,
            quantity: quantityToAdd,
          });
          console.log('API Response:', response.data);
        } catch (error) {
          console.error('Error adding to cart:', error);
          alert('ไม่สามารถเพิ่มสินค้าไปยังรถเข็นได้');
        }
      };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/products/${productId}`);

                if (!response.ok) {
                    throw new Error(`ไม่สามารถดึงข้อมูลสินค้าได้: ${response.statusText}`);
                }

                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);

    const handleBuyNow = () => {
        alert(`คุณได้ซื้อสินค้า: ${product.name} จำนวน ${quantity} ชิ้น ในราคา ฿${(product.price * quantity).toFixed(2)}`);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity); // Pass the selected quantity to addToCart
        setShowModal(true);
    };
    const increaseQuantity = () => {
        if (quantity < product.inventory.quantity) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        window.location.reload(); // Reload the page
    };
    

    if (loading) {
        return <Spinner animation="border" role="status"><span className="visually-hidden">กำลังโหลด...</span></Spinner>;
    }

    if (error) {
        return <p>ข้อผิดพลาด: {error}</p>;
    }

    const storeImage = images.find((image) => image.seller_id === product.seller.seller_id);

    return (
        <div>
            <Navbar />
            <div style={{ paddingTop: "100px" }}>
                <div style={{ paddingLeft: '110px', marginTop: '50px' }}>
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() => navigate('/')}>หน้าแรก</Breadcrumb.Item>
                        <Breadcrumb.Item active>รายละเอียดสินค้า</Breadcrumb.Item>
                    </Breadcrumb>

                </div>
                <Container className="my-5">
                    <Row>
                        <Col md={6} className="mb-4">
                            <Card>
                                <Card.Img
                                    variant="top"
                                    src={product.image_url || placeholderImage}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = placeholderImage;
                                    }}
                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                />
                                <Card.Body className="text-muted">

                                    <p><small><strong>วันที่สร้าง:</strong> {product.created_at}</small></p>
                                    <p><small><strong>วันที่อัพเดท:</strong> {product.updated_at}</small></p>

                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <h2>{product.name}</h2>
                            <p><strong>ประเภทสินค้า:</strong> {product.categories.name}</p>
                            <p><strong>ราคา:</strong> {product.price ? `฿${product.price}` : 'ไม่ระบุ'}</p>
                            <p><strong>รายละเอียดสินค้า:</strong> {product.description}</p>
                            <p><strong>ยี่ห้อ:</strong> {product.brand}</p>
                            <p><strong>สถานะสินค้า:</strong> {product.product_status}</p>
                            <p><strong>สต็อก:</strong> {product.inventory?.quantity || 'ไม่ระบุ'}</p>

                            <div className="mt-3">
                                <Button variant="secondary" onClick={decreaseQuantity}>-</Button>
                                <span className="mx-2">{quantity}</span>
                                <Button variant="secondary" onClick={increaseQuantity}>+</Button>
                            </div>

                            <div className="mt-3">
                                <Button variant="primary" className="me-2" onClick={handleAddToCart}>
                                    <FaShoppingCart /> เพิ่มไปยังตะกร้า
                                </Button>
                                <Button variant="success" onClick={handleBuyNow}>ซื้อสินค้า</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>เพิ่มสินค้าในตะกร้า</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        เพิ่มสินค้า {product.name} จำนวน {quantity} ชิ้น ลงในตะกร้าเรียบร้อยแล้ว!
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
                <h3 style={{ paddingLeft: '110px' }}>ข้อมูลร้านค้า</h3>
                <Container className="my-5">

                        {/* Table Structure */}

                            <table className="table table-bordered" style={{ width: '100%' }}>
                                <tbody>
                                    {/* รูปภาพร้าน */}
                                    <tr>
                                        <td className="text-center" style={{ width: '30%' }}>
                                            {storeImage ? (
                                                <Link to={storeImage.link} className="d-block mb-3">
                                                    <img
                                                        src={storeImage.src}
                                                        alt={storeImage.caption}
                                                        className="img-fluid rounded-circle"
                                                        style={{ height: '200px', width: '200px', objectFit: 'cover' }}
                                                    />
                                                    <div>{storeImage.caption}</div>
                                                </Link>
                                            ) : (
                                                <p>ไม่พบรูปภาพร้านนี้</p>
                                            )}
                                        </td>

                                        {/* ข้อมูลร้าน */}
                                        <td style={{ width: '70%' }}>
                                            <p><strong>ชื่อร้าน:</strong> {product.seller.name}</p>
                                            <p><strong>คำอธิบายร้านค้า:</strong> {product.seller.description}</p>
                                            <p><strong>ที่ตั้ง:</strong> {product.seller.address}</p>
                                            <p><strong>เบอร์ติดต่อ:</strong> {product.seller.phone_number}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                </Container>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;