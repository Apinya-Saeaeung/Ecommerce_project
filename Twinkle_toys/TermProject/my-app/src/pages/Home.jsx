import './Home.css';
import Navbar from '../components/Navbar/Navbar';
import Slideshow from '../components/Slideshow/Slideshow';
import NewProducts from '../components/NewProducts/NewProducts';
import Retailers from '../components/Retailers/Retailers'
import SaleProducts from '../components/SaleProducts/SaleProducts'
import Footer from '../components/Footer/Footer'
import RecommedProducts from '../components/RecommendProducts/RecommendProducts';

const Home = () => {
    return (
        <div>
            <Navbar />
            <Slideshow />
            <RecommedProducts />
            <NewProducts />
            <Retailers />
            <SaleProducts />
            <Footer />
        </div>
    );
}

export default Home;
