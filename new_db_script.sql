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

INSERT INTO categories (name) VALUES
('Electronics'),
('Clothing'),
('Food');

INSERT INTO statuses (name) VALUES
('UNCONFIRMED'),
('CONFIRMED'),
('CANCELLED'),
('COMPLETED');

