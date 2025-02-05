import React, { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import OrderTrackingCard from "../components/OrderTrackingCard";
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import axios from 'axios';
import './OrderTrackingPage.css';  // นำเข้าไฟล์ CSS ที่สร้างขึ้น

const OrderTrackingPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("all");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const url = selectedStatus === "all"
                    ? `http://localhost:8080/api/v1/order/allorder`
                    : `http://localhost:8080/api/v1/order/${selectedStatus}`;
                const response = await axios.get(url);
                setOrders(response.data || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [selectedStatus]);

    const sortedOrders = orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

    const onStatusUpdate = async (updatedCartItems, order_id) => {
        try {
            const response = await axios.put('http://localhost:8080/api/v1/order/updateorder', {
                order_id,
                status: updatedCartItems.map(item => item.status).toString(),
            });
            console.log("Status updated:", response.data);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) return <p>กำลังโหลด...</p>;

    return (
        <div className="order-tracking-container">
            <Navbar />
            <div style={{
                display: "flex",
                flexDirection: "column",
                width: '100%',
                height: '100%',
                minHeight: '100vh',
            }}>
                <h3 className="order-tracking-header">
                    การซื้อของฉัน
                </h3>

                <div className="filter-buttons-container">
                    {[
                        { label: "ทั้งหมด", value: "all" },
                        { label: "กำลังดำเนินการ", value: "processing" },
                        { label: "กำลังจัดส่ง", value: "shipping" },
                        { label: "จัดส่งสำเร็จ", value: "delivered" },
                        { label: "ได้รับสินค้า", value: "received" }
                    ].map(status => (
                        <Button
                            key={status.value}
                            variant={selectedStatus === status.value ? "primary" : "secondary"}
                            onClick={() => setSelectedStatus(status.value)}
                            className={`filter-button ${selectedStatus === status.value ? 'active' : ''}`}
                        >
                            {status.label}
                        </Button>
                    ))}
                </div>

                {sortedOrders.length > 0 ? (
                    sortedOrders.map((order) => (
                        <OrderTrackingCard
                            key={order.order_id}
                            order={order}
                            onStatusUpdate={onStatusUpdate}
                        />
                    ))
                ) : (
                    <div className="no-orders-container">
                        <Card className="no-orders-card">
                            <Card.Body className="no-orders-card-body">
                                <Card.Text>ไม่มีสินค้าในคำสั่งซื้อนี้</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default OrderTrackingPage;
