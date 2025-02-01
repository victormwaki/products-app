import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate for redirecting
import './singleproduct.css'; // Custom styling

const SingleProduct = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const navigate = useNavigate(); // Hook to navigate programmatically
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the single product details from the backend using the product ID
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5555/products/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError('Error fetching product details');
            }
        };

        fetchProduct();
    }, [id]);  // Re-run the effect when the id changes (i.e., when the user clicks on a new product)

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5555/products/${id}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
    
            // Navigate back to the products list after deletion
            navigate('/products');
        } catch (err) {
            setError('Error deleting product');
        }
    };
    

    const handleEdit = () => {
        // Redirect to the create form (assuming your route is "/create-product")
        navigate(`/edit-product/${id}`);
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!product) {
        return <p>Loading product details...</p>;
    }

    return (
        <div className="single-product-container">
            <h2>{product.product_name}</h2>
            <img
                src={product.image}
                alt={product.product_name}
                className="product-image"
            />
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>Category: {product.category}</p>
            <p>Description: {product.description || 'No description available.'}</p>

            {/* Edit and Delete Buttons */}
            <div className="product-actions">
                <button onClick={handleEdit} className="edit-button">Edit</button>
                <button onClick={handleDelete} className="delete-button">Delete</button>
            </div>
        </div>
    );
};

export default SingleProduct;
