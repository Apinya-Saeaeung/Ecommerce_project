import React, { useEffect, useState } from "react"; // นำเข้า useState
import { Button, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom"; // นำเข้า useNavigate


const QRCodePage = () => {
    const [countdown, setCountdown] = useState(10); // สร้าง state สำหรับนับถอยหลัง
    const navigate = useNavigate(); // เรียกใช้ useNavigate
    const location = useLocation();
    const { order = [], totalPrice = 0 } = location.state || {}; // ดึงข้อมูลจาก state

    console.log("Order", order);
    console.log("totalPrice", totalPrice);

    useEffect(() => {
        const savedCartItems = sessionStorage.getItem("cartItems");
      
        if (savedCartItems) {
          try {
            const parsedCartItems = JSON.parse(savedCartItems);
            console.log("given cartItems:", parsedCartItems);
          } catch (error) {
            console.error("Error parsing cartItems:", error);
          }
        } else {
          console.warn("No cartItems found in sessionStorage.");
        }
      
        // console.log("Order:", order || "ไม่มีข้อมูล");
        console.log("totalPrice:", totalPrice || "ไม่มีข้อมูล");
      }, [order, totalPrice]);      

    useEffect(() => {
        // เริ่มนับถอยหลัง
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    sessionStorage.setItem('cartItems', JSON.stringify(order));
                    clearInterval(timer); // เคลียร์ timer เมื่อหมดเวลา
                    navigate("/order-success", { state: {totalPrice}}); // เปลี่ยนเส้นทางไปยังหน้า OrderSuccess
                    return 0; // ตั้งค่า countdown เป็น 0
                }
                return prev - 1; // ลดค่าลง 1 ทุก ๆ วินาที
            });
        }, 1000); // อัปเดตทุก ๆ 1000 มิลลิวินาที (1 วินาที)

        // เคลียร์ timer เมื่อคอมโพเนนต์ถูกยกเลิก
        return () => clearInterval(timer);
    }, [navigate, order, totalPrice]);

   
const handleSave = async () => {
    const qrElement = document.getElementById("qr-code-element"); // กำหนด ID ให้ QR Code 

    if (qrElement) {
        const link = document.createElement("a");
        link.href = qrElement.src;
        link.download = "QRCode.png";
        link.click();

        alert("QR Code ถูกบันทึกเรียบร้อยแล้ว!");
    } else {
        alert("ไม่พบ QR Code ที่ต้องการบันทึก");
    }
};

    const handleConfirm = () => {
        // เปลี่ยนเส้นทางไปยังหน้า OrderSuccess
        sessionStorage.setItem('cartItems', JSON.stringify(order));
        navigate("/order-success", { state: {totalPrice}});
    };

    return (
        <div style={{ 
            // backgroundColor: '#bce0f3', 
            width: '100%', 
            height: '100%', 
            minHeight: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            <Card style={{ padding: "2rem", textAlign: "center", width: '60%' }}>
                <h1>QR Code</h1>
                <p>นี่คือ QR Code ของคุณ</p>
                <img 
                    id="qr-code-element"
                    src="/images/qrcode_localhost.png" 
                    alt="QR Code" 
                    style={{ 
                        width: '400px', 
                        height: '400px', 
                        display: 'block', 
                        margin: '0 auto' 
                    }} 
                />
                <p>กำลังเปลี่ยนไปยังหน้าสั่งซื้อในอีก {countdown} วินาที...</p> {/* แสดงเวลานับถอยหลัง */}
                <div style={{ marginTop: '1rem' }}>
                    <Button variant="success" onClick={handleSave} style={{ marginRight: '1rem' }}>
                        บันทึก
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        ตกลง
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default QRCodePage;
