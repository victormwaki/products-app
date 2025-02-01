import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import SignUp from './components/signup/Signin';
import Login from './components/login/Login';
import Products from './components/deserts/Deserts';
import SingleProduct from './components/singleproduct/SingleProduct';
import ProductCreateForm from './components/addproduct/Productform';
import CartProducts from './components/cart/Cart';
import UpdateProduct from './components/updateform/Update';

function App() {
    return (
        <div>
        <Navbar />
        <Router>
            <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<Products />}/>
            <Route path="/cart" element={<CartProducts />}/>
            <Route path="/edit-product/:id" element={<UpdateProduct />} />
            <Route path="/createproducts" element={<ProductCreateForm />}/>
            <Route path="/products/:id" element={<SingleProduct />} />

            </Routes>
        </Router>
        </div>
    );
}

export default App;
