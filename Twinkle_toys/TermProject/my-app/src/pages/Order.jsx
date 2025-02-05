import React, { useEffect, useState } from 'react';
import AddressCard from '../components/AddressCard';
import OrderDetailCard from '../components/OrderDetailCard';
import PaymentCard from '../components/PaymentCard';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ใช้ axios ในการดึงข้อมูลจาก API
import './Order.css'; // นำเข้า CSS

const Order = () => {
  const [addresses, setAddresses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const savedCartItems = sessionStorage.getItem('cartItems');
        if (!savedCartItems) {
          setError("ไม่มีข้อมูลในตะกร้า");
          setLoading(false);
          return;
        }

        const parsedCartItems = JSON.parse(savedCartItems);
        if (!Array.isArray(parsedCartItems)) {
          setError("ข้อมูลในตะกร้าไม่ถูกต้อง");
          setLoading(false);
          return;
        }

        setCartItems(parsedCartItems);

        // ดึงข้อมูลที่อยู่จาก API
        const userID = sessionStorage.getItem('userID');
        const response = await axios.get(`http://localhost:8080/api/v1/users/${userID}`);
        setAddresses(response.data); // อัปเดตข้อมูลที่อยู่ใน state
        console.log("data", response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [navigate]);

  if (cartItems.length === 0) {
    return <p className="error-message">ไม่มีข้อมูลในตะกร้า</p>;
  }

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const totalPrice = cartItems.reduce((total, item) => total + item.total_price, 0);

  return (
    <div id="root" className="page-container">
      <div className="order-container">
        <Navbar />
        {/* <div className="content-wrap"> */}
          <h2 className="order-header">ทำการสั่งซื้อ</h2>

          {addresses ? <AddressCard address={addresses} /> : <p className="loading-message">Loading address...</p>}

          {/* <div>
            <Card className="order-summary-card">
              <Card.Title>รายละเอียดคำสั่งซื้อ</Card.Title>
            </Card>
          </div> */}

          {/* {cartItems.map(item => (
            <div key={item.cart_item_id}>
              {item.product.map(product => (
                <OrderDetailCard key={product.product_id} order={item} product={product} />
              ))}
            </div>
          ))} */}
          <OrderDetailCard />

          <PaymentCard
            totalPrice={totalPrice}
            key="paymentCard"
            order={cartItems}
          />
        {/* </div> */}
      </div>
        <Footer />
    </div>
  );
};

export default Order;
