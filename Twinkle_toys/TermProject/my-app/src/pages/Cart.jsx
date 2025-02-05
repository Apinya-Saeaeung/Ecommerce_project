import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/Cart/Cart.css';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [navbarKey, setNavbarKey] = useState(0); // กำหนด key สำหรับ Navbar

    // ดึงข้อมูลตะกร้าเมื่อ component ถูก mount
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/cart/allcart');
                setCartItems(response.data);
            } catch (err) {
                setError('ไม่มีสินค้าในตะกร้า');
            } finally {
                setLoading(false);
            }
        };
        fetchCartData();
    }, []);

    // ฟังก์ชันคำนวณยอดรวมทั้งหมดในตะกร้า
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const product = item.product[0];
            return total + product.price * item.quantity;
        }, 0).toFixed(2);
    };

    // จัดกลุ่มสินค้าตามร้านค้า
    const groupedBySeller = cartItems.reduce((acc, item) => {
        const product = item.product[0];
        const sellerId = product.seller.seller_id;
        const sellerName = product.seller.name;

        if (!acc[sellerId]) {
            acc[sellerId] = {
                sellerName: sellerName,
                items: []
            };
        }

        acc[sellerId].items.push(item);
        return acc;
    }, {});

    // ฟังก์ชันอัปเดตจำนวนสินค้า
    const updateQuantity = async (cartItemID, newQuantity) => {
        try {
            await axios.put('http://localhost:8080/api/v1/cart/updatecart', {
                cart_item_id: cartItemID.toString(),
                quantity: newQuantity
            });
            const response = await axios.get('http://localhost:8080/api/v1/cart/allcart');
            setCartItems(response.data);
            setNavbarKey(prevKey => prevKey + 1); // รีเฟรช Navbar ด้วยการเพิ่ม key
        } catch (err) {
            setError('ไม่มีสินค้าในตะกร้า');
            setNavbarKey(prevKey => prevKey + 1); // รีเฟรช Navbar ด้วยการเพิ่ม key
        }
    };

    // ฟังก์ชันลบสินค้า
    const deleteCartItem = async (cartItemID) => {
        try {
            await axios.delete('http://localhost:8080/api/v1/cart/deletecart', {
                data: {
                    cart_item_id: cartItemID.toString()
                }
            });

            // รีเฟรชข้อมูลตะกร้า
            const response = await axios.get('http://localhost:8080/api/v1/cart/allcart');
            setCartItems(response.data);
            setNavbarKey(prevKey => prevKey + 1); // รีเฟรช Navbar ด้วยการเพิ่ม key

        } catch (err) {
            setError('ไม่มีสินค้าในตะกร้า');
            setNavbarKey(prevKey => prevKey + 1); // รีเฟรช Navbar ด้วยการเพิ่ม key
        }
    };

    // ฟังก์ชันเมื่อกดปุ่ม "สั่งซื้อสินค้า"
    const handleCheckout = async () => {
        // เรียงข้อมูล cartItems ตาม cart_item_id ก่อน
        const sortedCartItems = [...cartItems].sort((a, b) => a.cart_item_id - b.cart_item_id);

        // เก็บข้อมูลลงใน sessionStorage หลังจากเรียงลำดับแล้ว
        sessionStorage.setItem('cartItems', JSON.stringify(sortedCartItems));

        // Debug เพื่อตรวจสอบข้อมูลที่เก็บ
        console.log("Sorted cartItems:", sortedCartItems);

        // ไปยังหน้าสั่งซื้อ
        navigate('/order');
    };

    if (loading) return <p className="loading">กำลังโหลดข้อมูล...</p>;
    // if (error) return <p className="error">{error}</p>;
    if (error) {
        return (
            <div id="root" className="page-container">
                <Navbar key={navbarKey} /> {/* เพิ่ม key เพื่อให้ Navbar รีเฟรช */}
                <div className="content-wrap">
                <div className="cart" style={{ marginTop: '160px', textAlign: "center" }}>
                    <h1>Twinkle Toys</h1>
                    <h2>รายการในตะกร้าของคุณ</h2>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: '20px' }}>
                        <Card style={{ width: "100vw", margin: "10px", position: 'relative' }}>
                            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                                <h4>{error}</h4> {/* แสดงข้อความ error */}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div id="root" className="page-container">
            <Navbar key={navbarKey} />
            <div className="content-wrap">
            <div className="cart" style={{ marginTop: '160px' }}>
                <h1>Twinkle Toys</h1>
                <h2>รายการในตะกร้าของคุณ</h2>

                {Object.keys(groupedBySeller).map(sellerId => {
                    const seller = groupedBySeller[sellerId];
                    return (
                        <div key={sellerId} className="seller-section">
                            <h3>{seller.sellerName}</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>สินค้า</th>
                                        <th>ราคา</th>
                                        <th>จำนวน</th>
                                        <th>ยอดรวม</th>
                                        <th>การดำเนินการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {seller.items.map(item => {
                                        const product = item.product[0];
                                        return (
                                            <tr key={item.cart_item_id}>
                                                <td>
                                                    <div className="item-container">
                                                        <img src={product.image_url} alt={product.name} className="item-image" />
                                                        <div className="item-info">
                                                            <strong>{product.name}</strong>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>฿{product.price}</td>
                                                <td>
                                                    <div className="quantity-controls">
                                                        <button className="quantity-btn" onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}>-</button>
                                                        <span className="quantity-display">{item.quantity}</span>
                                                        <button className="quantity-btn" onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}>+</button>
                                                    </div>
                                                </td>
                                                <td>฿{(product.price * item.quantity).toFixed(2)}</td>
                                                <td>
                                                    <button className="delete-btn" onClick={() => deleteCartItem(item.cart_item_id)}>
                                                        ลบ
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
                <div style={{ textAlign: "right", marginTop: "1rem" }}>
                    <h3>ยอดรวมทั้งหมด: ฿{calculateTotal()}</h3>
                </div>
                <button className="checkout-button" onClick={handleCheckout}>สั่งซื้อสินค้า</button>
            </div>
            </div>
            <Footer />
        </div>
    );
};

export default Cart;
