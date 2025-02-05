import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Profile.css';

const placeholderImage = '../assets/images/placeholder.jpg';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userID = sessionStorage.getItem('userID');
  console.log(userID);
  // const userId = "1";  // กำหนด ID ของผู้ใช้ที่ต้องการดึงข้อมูล

  const fetchUserDetails = () => {
    axios
      .get(`/api/v1/users/${userID}`)
      .then((response) => {
        console.log("response", response);
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้: ' + error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div id="root" className="page-container">
      <Navbar />
      <div className="content-wrap">
        <div style={{ paddingTop: "100px" }}>
          <div style={{ paddingLeft: '110px', marginTop: '50px' }}></div>
          <Container className="my-5">
            <Row>
              <Col md={4}>
                <Card className="user-profile-card">
                  <Card.Body>
                    <Card.Img
                      variant="top"
                      src={user.profile_picture_url || placeholderImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImage;
                      }}
                      className="profile-picture"
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={8}>
                <Card className="user-details-card">
                  <Card.Body>
                    <h2 className="user-name">{user.display_name}</h2>
                    <p><strong>อีเมล:</strong> {user.email}</p>
                    <p><strong>เบอร์โทร:</strong> {user.phone}</p> {/* อาจจะเปลี่ยนเป็นเบอร์จริง */}
                    <p><strong>ที่อยู่:</strong> {user.address}</p> {/* อาจจะเปลี่ยนเป็นที่อยู่จริง */}
                    <p><strong>เข้าร่วมครั้งแรก:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                    <p><strong>แก้ไขครั้งล่าสุด:</strong> {new Date(user.updated_at).toLocaleDateString()}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;