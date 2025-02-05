import React from "react";
import { Card, ListGroup, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from "axios";
import "./OrderTrackingCard.css"; // นำเข้าไฟล์ CSS

const OrderTrackingCard = ({ order, onStatusUpdate }) => {
    const statusMap = {
        "processing": "กำลังดำเนินการ",
        "shipping": "กำลังจัดส่ง",
        "delivered": "จัดส่งสำเร็จ",
        "received": "ได้รับสินค้า"
    };

    const getStatusInThai = (status) => {
        return statusMap[status] || "ไม่ทราบสถานะ";
    };

    const handleApprove = async (cartItems) => {
        try {
            console.log("Cart items before processing:", cartItems);

            if (!Array.isArray(cartItems) || cartItems.length === 0) {
                throw new Error("ไม่มีข้อมูลสินค้าที่จะอัปเดต");
            }

            const response = await axios.put(`http://localhost:8080/api/v1/order/update`, {
                order_id: order.order_id,
                seller_id: cartItems[0].product[0].seller.seller_id,
            });

            console.log("Status updated:", response.data);

            if (onStatusUpdate) {
                onStatusUpdate(cartItems, order.order_id);
            }

            window.location.reload();
        } catch (error) {
            console.error("Error updating status:", error.message);
            alert(error.message);
        }
    };

    const itemsGroupedBySeller = order.cart_item_id.reduce((grouped, cartItem) => {
        const sellerName = cartItem.product?.[0]?.seller?.name || "ไม่ทราบร้าน";
        if (!grouped[sellerName]) {
            grouped[sellerName] = [];
        }
        grouped[sellerName].push(cartItem);
        return grouped;
    }, {});

    return (
        <div className="card-container">
            {Object.entries(itemsGroupedBySeller).map(([sellerName, cartItems], sellerIndex) => {
                const totalPricePerSeller = cartItems.reduce((total, cartItem) => total + cartItem.total_price, 0);
                const sellerId = cartItems[0]?.product?.[0]?.seller?.seller_id; // ดึง seller_id จาก cartItems
                console.log("sellerName:", sellerName);
                console.log("cartItems:", cartItems);
                console.log("sellerIndex:", sellerIndex);
                return (
                    <Card key={sellerIndex} className="card-wrapper">
                        <Card.Body className="card-body">
                            <div className="status-badge">
                                {getStatusInThai(cartItems[0].status)}
                            </div>

                            <div className="seller-info">
                                <strong>
                                    {/* ใช้ Link เพื่อทำให้ชื่อร้านสามารถคลิกได้ */}
                                    <Link to={`/seller/${sellerId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        ร้าน: {sellerName}
                                    </Link>
                                </strong>
                            </div>

                            <ListGroup variant="flush" className="list-group">
                                {cartItems.map((cartItem, index) => {
                                    const product = cartItem.product?.[0] || {};
                                    return (
                                        <ListGroup.Item
                                            key={index}
                                            className="list-item"
                                        >
                                            <div className="product-info">
                                                <strong>{product.name || "ไม่มีชื่อสินค้า"}</strong> <br />
                                                จำนวน: {cartItem.quantity} <br />
                                                <strong>ราคาต่อหน่วย:</strong> ฿{product.price}
                                            </div>
                                            <div style={{ marginLeft: "10px" }}>
                                                <img
                                                    src={product.image_url || "/images/default-image.jpg"}
                                                    alt={product.name || "ไม่มีภาพ"}
                                                    className="product-img"
                                                    onError={(e) => (e.target.src = "/images/default-image.jpg")}
                                                />
                                            </div>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>

                            <div className="total-price">
                                <strong>คำสั่งซื้อทั้งหมด:</strong> ฿{totalPricePerSeller.toFixed(2)}
                            </div>

                            <div className="button-container">
                                <Button
                                    variant={cartItems[0].status === "delivered" || cartItems[0].status === "received" ? "primary" : "secondary"}
                                    onClick={() => handleApprove(cartItems)}
                                    disabled={cartItems[0].status === "received"}
                                >
                                    {cartItems[0].status === "progress"
                                        ? "ยืนยันการดำเนินการ"
                                        : cartItems[0].status === "shipping"
                                            ? "ยืนยันการจัดส่ง"
                                            : "ได้รับสินค้าแล้ว"}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                );
            })}
        </div>
    );
};

export default OrderTrackingCard;
