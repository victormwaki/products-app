from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

# Customer Type Model
class CustomerType(db.Model, SerializerMixin):
    __tablename__ = 'customer_type'

    id = db.Column(db.Integer, primary_key=True)
    customer_type = db.Column(db.String, nullable=False, unique=True)

    # Relationship: A customer type has many customers
    customers = relationship('Customer', back_populates='customer_type')

# Customer Model
class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'

    customer_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)

    # Foreign Key
    customer_type_id = db.Column(db.Integer, db.ForeignKey('customer_type.id'), nullable=False)

    # Relationships
    customer_type = relationship('CustomerType', back_populates='customers')
    customer_products = relationship('CustomerProduct', back_populates='customer', cascade="all, delete-orphan")

# Product Category Model
class ProductCategory(db.Model, SerializerMixin):
    __tablename__ = 'product_category'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    # Relationship: A product category has many products
    products = relationship('Product', back_populates='category')
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

# Product Model
class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    product_id = db.Column(db.Integer, primary_key=True)
    stock = db.Column(db.Integer, nullable=False)
    product_name = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String, nullable=True)  # Assuming this field exists
    description = db.Column(db.String, nullable=True)
    cart = db.Column(db.Boolean, default=False, nullable=False)


    # Foreign Key
    category_id = db.Column(db.Integer, db.ForeignKey('product_category.id'), nullable=False)

    # Relationships
    category = relationship('ProductCategory', back_populates='products')
    customer_products = relationship('CustomerProduct', back_populates='product', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'product_id': self.product_id,
            'product_name': self.product_name,
            'price': self.price,
            'stock': self.stock,
            'image': self.image,
            'description': self.description,
            'category_id': self.category_id,
            'cart' : self.cart,
            'category': self.category.name if self.category else None  # Assuming 'name' field exists in ProductCategory
        }
# CustomerProduct Model (Order Tracking)
class CustomerProduct(db.Model, SerializerMixin):
    __tablename__ = 'customer_product'

    order_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    datetime = db.Column(db.DateTime, default=datetime.utcnow)
    quantity = db.Column(db.Integer, nullable=False)

    # Relationships
    customer = relationship('Customer', back_populates='customer_products')
    product = relationship('Product', back_populates='customer_products')
