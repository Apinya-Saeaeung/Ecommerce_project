import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Dropdown, Modal } from 'react-bootstrap';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { FaBasketShopping } from "react-icons/fa6";

const placeholderImage = './images/placeholder.jpg';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [showDiscount, setShowDiscount] = useState(false); // สถานะกรองเฉพาะสินค้าที่มีส่วนลด
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('q');

  const fetchProducts = (query) => {
    if (query) {
      axios
        .get(`/api/v1/products/search?query=${query}`)
        .then((response) => {
          if (response.data) {
            setProducts(response.data);
            setSortedProducts(response.data); // ตั้งค่าให้ sortedProducts เป็น response เดิม
            setError(null);
          } else {
            setError('ไม่พบข้อมูลสินค้าที่ค้นหา');
            setProducts([]);
            setSortedProducts([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching the products:', error);
          setError(<h5 style={{ textAlign: "center" }}>ไม่พบข้อมูลสินค้าที่ค้นหา</h5>);
        });
    } else {
      setProducts([]);
      setSortedProducts([]);
    }
  };

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

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [searchQuery]);

  const handleSort = (order) => {
    let sortedArray = [...products];

    if (order === 'asc') {
      sortedArray.sort((a, b) => a.price - b.price); // เรียงจากน้อยไปมาก
    } else if (order === 'desc') {
      sortedArray.sort((a, b) => b.price - a.price); // เรียงจากมากไปน้อย
    }

    setSortedProducts(sortedArray); // อัพเดทสินค้าที่เรียงแล้ว
  };

  const handleFilterDiscount = () => {
    setShowDiscount(!showDiscount);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload(); // Reload the page
  };

  const filteredProducts = showDiscount
    ? sortedProducts.filter((product) => product.discount > 0) // กรองเฉพาะสินค้าที่มีส่วนลด
    : sortedProducts;

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "140px" }}>
        <div style={{ paddingLeft: '110px' }}>
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => navigate('/')}>หน้าแรก</Breadcrumb.Item>
            <Breadcrumb.Item active>ผลการค้นหา</Breadcrumb.Item>
          </Breadcrumb>

        </div>

        <h2 className="text-center" style={{ marginBottom: '30px' }}>ผลการค้นหาสำหรับ "{searchQuery}"</h2>

        {/* ปุ่มสำหรับจัดเรียงและกรอง */}
        <div className="text-center mb-5 d-flex justify-content-center gap-3" style={{ marginBottom: '40px' }}>
          <p>เรียงโดย : </p>
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
              จัดเรียงตามราคา
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSort('asc')}>
                น้อยไปมาก
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('desc')}>
                มากไปน้อย
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* ปุ่มสำหรับแสดงเฉพาะสินค้าที่มีส่วนลด */}
          <Button
            variant={showDiscount ? 'primary' : 'outline-primary'}
            className="ms-2"
            onClick={handleFilterDiscount}
          >
            แสดงเฉพาะสินค้าที่มีส่วนลด
          </Button>
        </div>

        <Container className="my-3">
          <Row>
            {error ? (
              <p className="text-center">{error}</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const primaryImage = product.image_url || placeholderImage;

                return (
                  <Col md={12} key={product.product_id} className="mb-4">
                    <Card className="product-card p-3" style={{ border: '1px solid #e5e5e5', borderRadius: '10px' }}>
                      <Row>
                        <Col md={3}>
                          <Link to={`/product/${product.product_id}`}>
                            <Card.Img
                              src={primaryImage}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = placeholderImage;
                              }}
                              style={{ maxHeight: '150px', objectFit: 'contain', borderRadius: '8px', cursor: 'pointer' }}
                            />
                          </Link>
                        </Col>
                        <Col md={6}>
                          <Card.Body>
                            <Card.Title style={{ fontSize: '1.5rem', color: '#007bff', fontWeight: 'bold' }}>
                              {product.name}
                            </Card.Title>
                            <div style={{ fontSize: '1.2rem', color: '#ff6600', marginBottom: '10px' }}>
                              <strong>{product.price ? `฿${product.price}` : 'ราคาไม่ระบุ'}</strong>
                            </div>
                            <Card.Text style={{ color: '#6c757d', fontSize: '1rem' }}>
                              {product.description ? product.description : 'ไม่มีคำอธิบายสินค้า'}
                            </Card.Text>
                            <div className="d-flex align-items-center">
                              {product.inventory.quantity > 0 ? (
                                <span className="badge bg-success me-2">In Stock</span>
                              ) : (
                                <span className="badge bg-secondary me-2">Out of Stock</span>
                              )}
                              {product.discount > 0 && (
                                <span className="badge bg-danger me-2">Discount {product.discount}%</span>
                              )}
                            </div>
                          </Card.Body>
                        </Col>
                        <Col md={3} className="d-flex align-items-center justify-content-center">
                          <div>
                            <Button
                              variant="primary" style={{ margin: "5px" }}
                              onClick={() => addToCart(product, 1)} // ใช้จำนวนที่กรอกเป็น 1 ชิ้น
                            >
                              <FaBasketShopping style={{ marginRight: "2px" }} /> เพิ่มไปยังรถเข็น
                            </Button>
                            <Link to={`/product/${product.product_id}`}>
                              <Button variant="outline-secondary">
                                ดูรายละเอียด
                              </Button>
                            </Link>
                          </div>
                        </Col>
                      </Row>
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
      {/* CSS เพิ่มเติม */}
      <style jsx>{`
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
