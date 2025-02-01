from faker import Faker
from random import randint
from app import app, db
from models import CustomerType, Customer, ProductCategory, Product, CustomerProduct

fake = Faker()

# Function to seed data
def seed_data():
    # Drop all tables before seeding new data
    db.drop_all()
    db.create_all()  # Recreate the tables based on updated models

    # Seed Customer Types
    customer_types = ['Regular', 'Premium', 'VIP']
    for customer_type in customer_types:
        db.session.add(CustomerType(customer_type=customer_type))
    
    db.session.commit()

    # Seed Product Categories
    categories = ['Electronics', 'Clothing', 'Toys', 'Books']
    for category in categories:
        db.session.add(ProductCategory(name=category))

    db.session.commit()

    # Seed Products
    categories = ProductCategory.query.all()
    for _ in range(20):  # Generate 20 products
        category = categories[randint(0, len(categories)-1)]
        db.session.add(Product(
            stock=randint(1, 100),
            product_name=fake.word(),
            price=randint(100, 1000),
            image=f"https://via.placeholder.com/150?text={fake.word()}",  # Adding fake image URL
            category_id=category.id,
            description=fake.sentence(),
            cart= False
        ))

    db.session.commit()

    # Seed Customers
    customer_types = CustomerType.query.all()
    for _ in range(15):  # Generate 15 customers
        customer_type = customer_types[randint(0, len(customer_types)-1)]
        db.session.add(Customer(
            username=fake.user_name(),
            email=fake.email(),
            password=fake.password(),
            customer_type_id=customer_type.id
        ))

    db.session.commit()

    # Seed Customer Products (Orders)
    customers = Customer.query.all()
    products = Product.query.all()
    for _ in range(30):  # Generate 30 orders
        customer = customers[randint(0, len(customers)-1)]
        product = products[randint(0, len(products)-1)]
        db.session.add(CustomerProduct(
            customer_id=customer.customer_id,
            product_id=product.product_id,
            quantity=randint(1, 5)
        ))

    db.session.commit()
    print("Database seeded successfully!")

# Run the seed function inside the app context
if __name__ == '__main__':
    with app.app_context():
        seed_data()
