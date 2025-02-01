import React, { useState, useEffect } from 'react';
import './cart.css'
const CartProducts = () => {
    const [cartProducts, setCartProducts] = useState([]);
    const [error, setError] = useState('');

    // Function to handle toggling the cart
    const toggleCart = async (productId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5555/toggle_cart/${productId}`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Failed to toggle cart');
            }
            const updatedProduct = await response.json();
            // Update the cartProducts state by toggling the product in the array
            setCartProducts((prevCartProducts) =>
                prevCartProducts.map((product) =>
                    product.product_id === updatedProduct.product_id
                        ? { ...product, cart: updatedProduct.cart }
                        : product
                )
            );

            // Re-fetch the cart products after the toggle
            fetchCartProducts();
        } catch (err) {
            setError('Error updating cart status');
        }
    };

    // Fetch products where cart is true
    const fetchCartProducts = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5555/products/cart');
            if (!response.ok) {
                throw new Error('Failed to fetch cart products');
            }
            const data = await response.json();
            setCartProducts(data);
        } catch (err) {
            setError('Error fetching cart products');
        }
    };

    useEffect(() => {
        fetchCartProducts();
    }, []);

    return (
        <div className="cart-products-container">
            <h2>Your Cart Products</h2>
            {error && <p className="error">{error}</p>}
            {cartProducts.length > 0 ? (
                <div className="cart-products-list">
                    {cartProducts.map((product) => (
                        <div className="cart-product-item" key={product.product_id}>
                            <h3>{product.product_name}</h3>
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.product_name}
                                    className="cart-product-image"
                                />
                            )}
                            <p>Price: ${product.price}</p>
                            <p>Category: {product.category}</p>
                            <button onClick={() => toggleCart(product.product_id)}>
                                {product.cart ? 'Cancel' : 'Add to Cart'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products in your cart.</p>
            )}
        </div>
    );
};

export default CartProducts;
