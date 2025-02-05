// src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const locations = [
  "สาขาทั้งหมดของเราในประเทศไทย",
  "No.123, Happiness Road 101/1",
  "Grand Central Nakhon Pathom, 6th Floor",
  "Grand Central Bangkok, 3rd Floor",
  "Grand Central Phuket, 3rd Floor",
  "Grand Central Pattaya, 2nd Floor",
  "Grand Central Chiang Mai, 4th Floor",
  "Grand Central Khon Kaen, 3rd Floor"
];

const Footer = () => {
  return (
    <div style={{ marginTop: '50px' }}>
      <footer className="bg-dark text-white py-4 mt-4">
        <Container style={{ marginTop: "10px" }}>
          <Row>
            <Col md={4}>
              <h5>Twinkle Toy</h5>
              <p>
                ผู้นำเข้าและจัดจำหน่ายของเล่นเด็ก
                ของเล่นเสริมพัฒนาการ 
                ของเล่นเด็กเสริมทักษะ
                ของเล่นสำหรับเด็กเล็ก <br />
                ของเล่นเด็กเสริมพัฒนาการ ราคาถูก ทั้งปลีกและส่ง <br />
                สินค้าคุณภาพสูง ปลอดภัย จัดส่งถึงหน้าบ้านทั่วประเทศ
              </p>
            </Col>
            <Col md={2}>
              <h5>About Us</h5>
              <ul className="list-unstyled">
                <li>Careers</li>
                <li>Our Stores</li>
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
              </ul>
            </Col>
            <Col md={2}>
              <h5>Customer Care</h5>
              <ul className="list-unstyled">
                <li>Help Center</li>
                <li>How to Buy</li>
                <li>Track Your Order</li>
                <li>Returns & Refunds</li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>สาขา Twinkle Toy Shop</h5>
              <p className="store-locations">
                {locations.map((location, index) => (
                  <span key={index}>{location}<br /></span>
                ))}
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
