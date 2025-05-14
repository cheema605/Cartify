-- Sample SQL script to insert test data for Orders and RentalOrders

-- Insert sample products
INSERT INTO Products (product_id, name, price, category_id, is_rentable)
VALUES (101, 'Sample Product 1', 100.00, 1, 0),
       (102, 'Sample Product 2', 150.00, 1, 0),
       (201, 'Sample Rental Product 1', 50.00, 2, 1),
       (202, 'Sample Rental Product 2', 75.00, 2, 1);

-- Insert sample order
INSERT INTO Orders (buyer_id, total_price, status, order_date)
VALUES (1, 250.00, 'Processing', GETDATE());

DECLARE @order_id INT = SCOPE_IDENTITY();

-- Insert order items
INSERT INTO Order_Items (order_id, product_id, quantity, price)
VALUES (@order_id, 101, 1, 100.00),
       (@order_id, 102, 1, 150.00);

-- Insert sample rental order
INSERT INTO RentalOrders (buyer_id, rental_start_date, rental_period_days, status)
VALUES (1, GETDATE(), 7, 'Processing');

DECLARE @rental_order_id INT = SCOPE_IDENTITY();

-- Insert rental order items
INSERT INTO RentalOrder_Items (rental_order_id, product_id, quantity, price)
VALUES (@rental_order_id, 201, 1, 50.00),
       (@rental_order_id, 202, 1, 75.00);
