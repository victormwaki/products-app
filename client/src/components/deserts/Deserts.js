import React, { useState, useEffect } from 'react';
import './desert.css';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch all products from the backend
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5555/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError('Error fetching products');
            }
        };

        fetchProducts();
    }, []);

    // Handle Add/Remove from Cart
    const toggleCart = async (productId, isInCart) => {
        try {
            const response = await fetch(`http://localhost:5555/toggle_cart/${productId}`, {
                method: 'PUT',
            });
            if (response.ok) {
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.product_id === productId
                            ? { ...product, cart: !isInCart }
                            : product
                    )
                );

                // Add or remove from the cart state
                if (isInCart) {
                    setCart(cart.filter((item) => item.product_id !== productId));
                } else {
                    const product = products.find((item) => item.product_id === productId);
                    setCart([...cart, product]);
                }
            }
        } catch (error) {
            setError('Error toggling cart');
        }
    };

    return (
        <div className="products-container">
            <h2>My Products</h2>
            {error && <p className="error">{error}</p>}
            <div className="products-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div className="product-item" key={product.product_id}>
                            <Link to={`/products/${product.product_id}`} className="product-link">
                                <h3>{product.product_name}</h3>
                            </Link>
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.product_name}
                                    className="product-image"
                                />
                            )}
                            <p>Price: ${product.price}</p>
                            <p>Category: {product.category}</p>
                            <button onClick={() => toggleCart(product.product_id, product.cart)}>
                                {product.cart ? 'Remove from Cart' : 'Add to Cart'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
        </div>
    );
};

export default Products;
