// ProductCreateForm.js (React Component)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './productform.css'

function ProductCreateForm() {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState(1);  // Default value of 1
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories from your API to populate the category dropdown
        axios.get('http://127.0.0.1:5555/categories')  // This route should return the list of categories
        .then(response => {
            setCategories(response.data.categories);  // Adjust based on actual API response structure
        })
        .catch(error => {
            console.error('There was an error fetching the categories!', error);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const productData = {
        product_name: productName,
        price: parseInt(price),
        stock: stock,
        image: image,
        description: description,
        category_id: categoryId
        };

        axios.post('http://127.0.0.1:5555/products', productData)
        .then(response => {
            alert('Product created successfully');
            // Reset form or navigate to another page if needed
        })
        .catch(error => {
            alert('Error creating product');
            console.error(error);
        });
    };

    return (
        <div>
        <h2>Create a New Product</h2>
        <form onSubmit={handleSubmit} className='formtable'>
            <div>
            <label htmlFor="product_name">Product Name</label>
            <input
                type="text"
                id="product_name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
            />
            </div>
            <div>
            <label htmlFor="price">Price</label>
            <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />
            </div>
            <div>
            <label htmlFor="stock">Stock</label>
            <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="image">Image URL</label>
            <input
                type="text"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="description">Description</label>
            <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="category_id">Category</label>
            <select
                id="category_id"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
            >
                <option value="">Select a category</option>
                {categories.map((category) => (
                <option key={category.id} value={category.id}>
                    {category.name}
                </option>
                ))}
            </select>
            </div>
            <button type="submit">Create Product</button>
        </form>
        </div>
    );
}

export default ProductCreateForm;
