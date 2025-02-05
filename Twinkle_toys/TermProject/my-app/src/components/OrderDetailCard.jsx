import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import './OrderDetailCard.css';

const OrderDetailCard = () => {
    const cartItems = sessionStorage.getItem('cartItems');
    const parsedCartItems = JSON.parse(cartItems);
    console.log("ตรวจสอบข้อมูล parsedCartItems:", parsedCartItems);

    if (!parsedCartItems || parsedCartItems.length === 0) {
        return <p>ข้อมูลคำสั่งซื้อไม่ถูกต้อง หรือไม่มีรายการสินค้า</p>;
    }

    // จัดกลุ่มสินค้าตามชื่อร้าน
    const groupedBySeller = parsedCartItems.reduce((groups, cartItem) => {
        const sellerName = cartItem.product[0].seller.name; // ใช้ชื่อร้านจากสินค้าแรกของ cartItem
        if (!groups[sellerName]) {
            groups[sellerName] = [];
        }
        groups[sellerName].push(cartItem);
        return groups;
    }, {});

    // แปลงข้อมูลกลุ่มร้านเป็น cart แยกออก
    const separateCarts = Object.keys(groupedBySeller).map(sellerName => ({
        sellerName: sellerName,
        cartItems: groupedBySeller[sellerName]
    }));

    return (
        <div className="order-detail-card-container">
            <Card className="order-detail-card">
                <Card.Body>
                    {/* แสดงสินค้าทั้งหมดใน cart ใหญ่ */}
                    <Card.Title>รายละเอียดคำสั่งซื้อ</Card.Title>
                    <hr />
                    {separateCarts.map((cart, index) => {
                        let sellerTotalPrice = 0; // คำนวณราคาของแต่ละร้าน
                        return (
                            <div key={index} className="seller-group">
                                {/* แสดงชื่อร้าน */}
                                <h5>ร้าน {cart.sellerName}</h5>
                                <ListGroup variant="flush" className="product-list-group">
                                    {cart.cartItems.map((cartItem, cartItemIndex) => {
                                        cartItem.product.forEach(product => {
                                            sellerTotalPrice += cartItem.total_price; // คำนวณราคาของแต่ละร้าน
                                        });

                                        return (
                                            <div key={cartItem.cart_item_id}>
                                                {cartItem.product.map((product, productIndex) => (
                                                    <ListGroup.Item key={product.product_id} className="product-list-item">
                                                        <div className="product-info">
                                                            <strong>{product.name}</strong> <br />
                                                            จำนวน: {cartItem.quantity} <br />
                                                            ราคาต่อหน่วย: ฿{product.price.toFixed(2)} <br />
                                                        </div>
                                                        <div className="product-image">
                                                            <img src={product.image_url} alt={product.name} />
                                                        </div>
                                                    </ListGroup.Item>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </ListGroup>
                                {/* แสดงยอดรวมสำหรับแต่ละร้าน */}
                                <div className="total-price">
                                    <strong>คำสั่งซื้อทั้งหมดจากร้านนี้:</strong> ฿{sellerTotalPrice.toFixed(2)}
                                </div>
                                {/* คั่นร้านด้วย <hr /> */}
                                {index < separateCarts.length - 1 && (
                                    <hr/>
                                )}
                            </div>
                        );
                    })}
                </Card.Body>
            </Card>
        </div>
    );
};

export default OrderDetailCard;
