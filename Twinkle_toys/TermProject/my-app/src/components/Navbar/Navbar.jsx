import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Button, NavDropdown, Dropdown } from 'react-bootstrap';
import { FaBasketShopping } from "react-icons/fa6";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItemCount, setCartItemCount] = useState(0); // State to store the number of cart items
    const [user, setUser] = useState(null); // User state to store logged in user data
    const navigate = useNavigate();

    const handleCartClick = () => {
        navigate('/cart'); // เปลี่ยนเส้นทางไปที่หน้า /cart
    };

    // Fetch cart items and calculate the number of rows in the cart (items count)
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/cart/allcart');
                const data = await response.json();
                // Calculate the total number of rows (items in the cart)
                const totalItems = data.length; // Count the number of cart items (rows)
                setCartItemCount(totalItems);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        // Get user data from sessionStorage on mount
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchCartItems();
    }, []); // Empty dependency array ensures this runs only once on component mount

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            navigate(`/search?q=${searchTerm}`);
        }
    };

    const handleLoginClick = () => {
        // Redirect to the login page
        navigate('/login');
    };

    const handleLogout = () => {
        // Clear user data from sessionStorage and update user state
        sessionStorage.removeItem('user');
        setUser(null);
        navigate('/'); // Redirect to home page
    };

    return (
        <nav className="navbar-nav navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="/images/TwinkleToy.png" alt="Logo" style={{ width: "60px", height: "70px" }} />
                </Link>
                <form onSubmit={handleSearchSubmit} className="d-flex">
                    <input className="form-control me-2 custom-input"
                        type="search"
                        placeholder="ค้นหาสินค้า"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search" />

                    <button className="submit-button" type="submit">
                        <FaSearch />
                    </button>
                </form>
                <div className="navbar-links">
                    <NavDropdown title="หมวดหมู่สินค้า" id="nav-dropdown">
                        <NavDropdown.Item as={Link} to="/allproducts" eventKey="4.1">สินค้าทั้งหมด</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/category/1" eventKey="4.2">แรกเกิด - 6 เดือน</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/category/2" eventKey="4.3">7 - 11 เดือน</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/category/3" eventKey="4.4">1 - 2 ขวบ</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/category/4" eventKey="4.5">3 ขวบขึ้นไป</NavDropdown.Item>
                    </NavDropdown>

                    <Button variant="light" className="ms-2 navbar-cart" onClick={handleCartClick}>
                        <FaBasketShopping className="cart-icon" />
                        <span className="badge bg-danger">{cartItemCount}</span> {/* จำนวนสินค้าในตะกร้า */}
                    </Button>

                    {user ? (
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center">
                                <img
                                    src={user.picture} // User profile picture (from Google login, for example)
                                    alt="user-profile"
                                    style={{ borderRadius: '50%', width: '40px' }}
                                    referrerPolicy="no-referrer"
                                />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/profile">โปรไฟล์ของฉัน</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/order-tracking">การซื้อของฉัน</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>ออกจากระบบ</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Button variant="light" className="ms-2" onClick={handleLoginClick}>
                            <FaUser /> เข้าสู่ระบบ
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
