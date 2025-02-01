from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

from models import db,Customer, CustomerProduct,CustomerType,Product, ProductCategory

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trial.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)
migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)

BLACKLIST = set()

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']
        customer_type = data['customer_type']
        # Check if the customer type exists
        customer_type_obj = CustomerType.query.filter_by(customer_type=customer_type).first()
        if not customer_type_obj:
            return jsonify({"message": "Invalid customer type"}), 400
        # Hash the password
        hashed_password = generate_password_hash(password, method='sha256')
        # Create a new customer
        new_customer = Customer(
            username=username,
            email=email,
            password=hashed_password,
            customer_type_id=customer_type_obj.id
        )
        # Add customer to the database
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({"message": "Customer created successfully"}), 201
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/customer_types', methods=['GET'])
def get_customer_types():
    customer_types = CustomerType.query.all()
    customer_types_list = [ct.customer_type for ct in customer_types]
    return jsonify(customer_types_list)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    # Query the database to find the user by username
    user = Customer.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):  # Validate password
        return jsonify({'message': 'Login Successful!', 'user_id': user.customer_id}), 200
    else:
        return jsonify({'message': 'Invalid username or password.'}), 401

@app.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        products_list = [product.to_dict() for product in products]
        return jsonify(products_list), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    try:
        product = Product.query.get(id)  # Get the product by ID
        if product:
            return jsonify(product.to_dict()), 200  # Return the product data as JSON
        else:
            return jsonify({"message": "Product not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@app.route('/categories', methods=['GET'])
def get_categories():
    categories = ProductCategory.query.all()
    return jsonify({
        'categories': [{'id': category.id, 'name': category.name} for category in categories]
    })

@app.route('/products', methods=['POST'])
def create_product():
    # Get data from the request
    data = request.get_json()

    # Ensure required fields are present
    if not data.get('product_name') or not data.get('price') or not data.get('category_id'):
        return jsonify({'error': 'Missing required fields'}), 400

    # Create new product
    try:
        new_product = Product(
            product_name=data['product_name'],
            price=data['price'],
            stock=data['stock'],
            image=data.get('image', None),
            description=data.get('description', None),
            category_id=data['category_id']
        )

        # Add the product to the session and commit to the database
        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            'message': 'Product created successfully',
            'product': {
                'product_id': new_product.product_id,
                'product_name': new_product.product_name,
                'price': new_product.price,
                'stock': new_product.stock,
                'image': new_product.image,
                'description': new_product.description,
                'category_id': new_product.category_id
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/toggle_cart/<int:product_id>', methods=['PUT'])
def toggle_cart(product_id):
    product = Product.query.get_or_404(product_id)
    product.cart = not product.cart  # Toggle the cart boolean
    db.session.commit()
    return jsonify(product.to_dict())

@app.route('/products/cart', methods=['GET'])
def get_cart_products():
    cart_products = Product.query.filter_by(cart=True).all()
    # Convert the list of product objects to a list of dictionaries
    return jsonify([product.to_dict() for product in cart_products])

@app.route('/products/<int:id>', methods=['PATCH'])
def update_product(id):
    product = Product.query.get_or_404(id)
    
    data = request.get_json()
    
    if 'product_name' in data:
        product.product_name = data['product_name']
    if 'price' in data:
        product.price = data['price']
    if 'stock' in data:
        product.stock = data['stock']
    if 'category' in data:
        product.category_id = data['category']  # Assuming category is passed as ID
    if 'description' in data:
        product.description = data['description']
    if 'image' in data:
        product.image = data['image']
    
    db.session.commit()
    
    return jsonify(product.to_dict()), 200

# Route for deleting a product (DELETE request)
@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return '', 204  # No content

if __name__ == '__main__':
    app.run(port=5555, debug=True)
