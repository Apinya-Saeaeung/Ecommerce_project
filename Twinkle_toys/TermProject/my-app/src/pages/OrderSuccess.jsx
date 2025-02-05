import React, { useEffect, useState, useRef } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const orderSentRef = useRef(false);
    const location = useLocation();
    const { totalPrice } = location.state || {}; // ดึงข้อมูลจาก state

    const savedCartItems = sessionStorage.getItem("cartItems");
    const parsedCartItems = JSON.parse(savedCartItems);
    console.log("totalPrice:", totalPrice);
    // console.log("Received savedCartItems:", savedCartItems);
    console.log("Received parsedCartItems:", parsedCartItems);

    // การดึง cart_item_id จาก parsedCartItems ซึ่งเป็น array
    const cartItemIds = parsedCartItems.map(item => item.cart_item_id);
    console.log("Received cartItemIds:", cartItemIds);  // จะได้เป็น array ของ cart_item_id

    useEffect(() => {
        if (!orderSentRef.current) {
            sendOrderData();
            orderSentRef.current = true; // ตั้งค่านี้หลังจากส่งคำสั่งซื้อ
        }
    }); // ตรวจสอบ dependency array


    const sendOrderData = async () => {
        if (orderSentRef.current) {
            console.log("ข้อมูลคำสั่งซื้อถูกส่งไปแล้ว");
            return;
        }

        if (!parsedCartItems) {
            setError("ข้อมูลคำสั่งซื้อไม่ครบถ้วน");
            return;
        }

        console.log("orderSentRef-sendOrderData", orderSentRef.current);

        try {
            setLoading(true);
            console.log("orderSentRef-try", orderSentRef.current);

            const response = await fetch("http://localhost:8080/api/v1/order/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cart_item_id: cartItemIds,
                    total_amount: totalPrice,
                }),
            });
            console.log("orderSentRef-Post", orderSentRef.current);

            if (!response.ok) {
                throw new Error("ไม่สามารถส่งคำสั่งซื้อได้");
            }

            const result = await response.json();
            console.log("ข้อมูลคำสั่งซื้อถูกส่งแล้ว:", result);

            orderSentRef.current = true;
            setSuccess(true);

        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card style={{ width: "50%", padding: "2rem", textAlign: "center" }}>
                <h1>🎉 สั่งซื้อสำเร็จ 🎉</h1>
                <p>ขอบคุณสำหรับการสั่งซื้อของคุณ</p>

                {loading ? (
                    <div>
                        <Spinner animation="border" />
                        <p>กำลังส่งข้อมูลคำสั่งซื้อ...</p>
                    </div>
                ) : error ? (
                    <div>
                        <p style={{ color: "red" }}>เกิดข้อผิดพลาด: {error}</p>
                    </div>
                ) : success ? (
                    <div>
                        <p style={{ color: "green" }}>คำสั่งซื้อของคุณได้รับการบันทึกแล้ว</p>
                    </div>
                ) : null}

                <div style={{ marginTop: "1rem" }}>
                    <Button
                        variant="success"
                        onClick={() => {
                            navigate("/");
                        }}
                        style={{ marginRight: "1rem" }}
                    >
                        กลับหน้าหลัก
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            navigate("/order-tracking");
                        }}
                    >
                        กลับไปยังหน้าติดตามคำสั่งซื้อ
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default OrderSuccess;
