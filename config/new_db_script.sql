DROP SEQUENCE IF EXISTS my_incremen_2;
CREATE SEQUENCE my_increment_2 
	START WITH 100
	INCREMENT BY 1;

CREATE OR REPLACE FUNCTION set_approval_date()
RETURNS TRIGGER AS $$
BEGIN

    IF NEW.status = 'CONFIRMED' THEN
        NEW.approval_date = NOW()
    END IF;


    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_set_approval_date
BEFORE UPDATE ON orders
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION set_approval_date();


-- this script creates new database for this task
DROP TABLE IF EXISTS order_product;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS statuses;

DROP SEQUENCE IF EXISTS my_increment;
CREATE SEQUENCE my_increment 
	START WITH 100
	INCREMENT BY 10;

CREATE TABLE categories (
    name TEXT PRIMARY KEY
);

CREATE TABLE statuses (
    name TEXT PRIMARY KEY
);

CREATE TABLE products (
    id INT DEFAULT NEXTVAL('my_increment') PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_unit NUMERIC(10, 2) NOT NULL,
    weight_unit NUMERIC(10, 4) NOT NULL,
    category TEXT NOT NULL,
        CONSTRAINT fk_category FOREIGN KEY (category) REFERENCES categories(name)
	);

CREATE TABLE orders (
	id INT DEFAULT NEXTVAL('my_increment') PRIMARY KEY,
    approval_date TIMESTAMP,
    status TEXT NOT NULL,
        CONSTRAINT fk_status FOREIGN KEY (status) REFERENCES statuses(name),
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL
);

CREATE TABLE order_product (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
        CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id),
    product_id INT NOT NULL,
        CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0)
);
--D2
CREATE TABLE users (
    id INT DEFAULT NEXTVAL('my_increment_2') PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('CLIENT', 'WORKER')) NOT NULL
);

INSERT INTO categories (name) VALUES
('Electronics'),
('Clothing'),
('Food');

INSERT INTO statuses (name) VALUES
('UNCONFIRMED'),
('CONFIRMED'),
('CANCELLED'),
('COMPLETED');

CREATE TABLE opinions (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- test data

INSERT INTO products (name, description, price_unit, weight_unit, category) VALUES
('Laptop', 'A high-performance laptop.', 1200.00, 2.5, 'Electronics'),
('Smartphone', 'Latest model with advanced features.', 800.00, 0.4, 'Electronics'),
('Headphones', 'Noise-cancelling headphones.', 150.00, 0.3, 'Electronics'),
('T-Shirt', 'Cotton T-shirt.', 20.00, 0.2, 'Clothing'),
('Jeans', 'Comfortable denim jeans.', 50.00, 1.0, 'Clothing'),
('Sneakers', 'Stylish running shoes.', 75.00, 1.2, 'Clothing'),
('Bread', 'Freshly baked bread.', 2.50, 0.5, 'Food'),
('Milk', '1 liter of whole milk.', 1.20, 1.0, 'Food'),
('Cheese', 'Aged cheddar cheese.', 5.50, 0.3, 'Food'),
('Chocolate', 'Dark chocolate bar.', 2.00, 0.2, 'Food');

INSERT INTO orders (approval_date, status, username, email, phone_number) VALUES
('2024-11-20 10:00:00', 'CONFIRMED', 'John Doe', 'john.doe@example.com', '123456789'),
('2024-11-19 15:30:00', 'UNCONFIRMED', 'Jane Smith', 'jane.smith@example.com', '987654321'),
('2024-11-18 14:00:00', 'COMPLETED', 'Alice Johnson', 'alice.j@example.com', '456123789'),
('2024-11-17 11:00:00', 'CANCELLED', 'Bob Brown', 'bob.b@example.com', '789456123'),
('2024-11-16 09:00:00', 'CONFIRMED', 'Charlie Green', 'charlie.g@example.com', '321654987');

INSERT INTO users (username, password, role) VALUES
('client1', 'test_1', 'KLIENT'), 
('worker1', 'test_2', 'PRACOWNIK');
