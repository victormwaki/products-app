import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './update.css'; // Custom styling

const UpdateProduct = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const navigate = useNavigate(); // Hook to navigate programmatically
    const [product, setProduct] = useState({
        product_name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        image: ''
    });
    const [categories, setCategories] = useState([]); // State for available categories
    const [error, setError] = useState('');

    // Fetch product and categories
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productResponse = await fetch(`http://localhost:5555/products/${id}`);
                console.log('Product response:', productResponse);  // Log the response for debugging
                if (!productResponse.ok) {
                    throw new Error('Failed to fetch product');
                }
                const productData = await productResponse.json();
                setProduct(productData);
            } catch (err) {
                setError(`Error fetching product: ${err.message}`);
            }
        };

        const fetchCategories = async () => {
            try {
                const categoryResponse = await fetch('http://localhost:5555/categories');
                console.log('Category response:', categoryResponse); // Log the response object
                if (!categoryResponse.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const categoryData = (await categoryResponse.json()).categories;
                console.log('Category data:', categoryData); // Log the parsed JSON
                if (Array.isArray(categoryData)) {
                    setCategories(categoryData);
                } else {
                    throw new Error('Categories data is not in the expected format');
                }
            } catch (err) {
                setError(`Error fetching categories: ${err.message}`);
            }
        };
        

        fetchProduct();
        fetchCategories();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5555/products/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            // Redirect to the updated product page
            navigate(`/products/${id}`);
        } catch (err) {
            setError('Error updating product');
        }
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="update-product-container">
            <h2>Update Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="product_name"
                        value={product.product_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Category</label>
                    <select
                        name="category"
                        value={product.category || ''}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))
                        ) : (
                            <option disabled>No categories available</option>
                        )}
                    </select>
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={product.image}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" className="update-button">Update Product</button>
            </form>
        </div>
    );
};

export default UpdateProduct;
