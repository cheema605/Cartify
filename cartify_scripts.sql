create database caritfy

use caritfy
--done
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY,
    full_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    created_at DATETIME DEFAULT GETDATE()
);
--done
CREATE TABLE Sellers (
    seller_id INT PRIMARY KEY IDENTITY,
    user_id INT UNIQUE FOREIGN KEY REFERENCES Users(user_id),
    shop_name NVARCHAR(100),
    bio TEXT,
    activated_at DATETIME DEFAULT GETDATE()
);

--done
CREATE TABLE Products (
    product_id INT PRIMARY KEY IDENTITY,
    seller_id INT FOREIGN KEY REFERENCES Sellers(seller_id),
    name NVARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    category_id INT FOREIGN KEY REFERENCES Categories(category_id),
    is_rentable BIT DEFAULT 0,
    is_biddable BIT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available', -- available, sold, rented
    created_at DATETIME DEFAULT GETDATE()
);
--done
CREATE TABLE Categories (
    category_id INT PRIMARY KEY IDENTITY,
    category_name NVARCHAR(50) NOT NULL
);
--done
CREATE TABLE ProductImages (
    image_id INT PRIMARY KEY IDENTITY,
    product_id INT FOREIGN KEY REFERENCES Products(product_id),
    image_url NVARCHAR(255) NOT NULL
);
--done
CREATE TABLE Discounts (
    discount_id INT PRIMARY KEY IDENTITY,
    product_id INT FOREIGN KEY REFERENCES Products(product_id),
    discount_percent INT NOT NULL,                     
    start_date DATE,
    end_date DATE,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY IDENTITY,    -- Unique ID for each order
    buyer_id INT FOREIGN KEY REFERENCES Users(user_id),  -- References the user placing the order
    total_price DECIMAL(10, 2),  -- Total price of the order
    status VARCHAR(20) DEFAULT 'pending',  -- Order status, e.g., 'pending', 'shipped', 'delivered'
    order_date DATETIME DEFAULT GETDATE()  -- The date when the order was placed
);



CREATE TABLE Order_Items (
    order_id INT,  -- Foreign key referencing Orders
    product_id INT,  -- Foreign key referencing Products
    quantity INT DEFAULT 1,  -- The quantity of the product in the order
    price DECIMAL(10, 2),  -- Price of the product at the time of the order
    PRIMARY KEY (order_id, product_id),  -- Composite primary key of order and product
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),  -- Foreign key to Orders table
    FOREIGN KEY (product_id) REFERENCES Products(product_id)  -- Foreign key to Products table
);


CREATE TABLE Payments (
    payment_id INT PRIMARY KEY IDENTITY,
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    order_id INT FOREIGN KEY REFERENCES Orders(order_id),
    amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    payment_date DATETIME DEFAULT GETDATE()
);

CREATE TABLE Bids (
    bid_id INT PRIMARY KEY IDENTITY,
    product_id INT FOREIGN KEY REFERENCES Products(product_id),
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    amount DECIMAL(10, 2) NOT NULL,
    bid_time DATETIME DEFAULT GETDATE()
);

CREATE TABLE Rentals (
    rental_id INT PRIMARY KEY IDENTITY,
    product_id INT FOREIGN KEY REFERENCES Products(product_id),
    renter_id INT FOREIGN KEY REFERENCES Users(user_id),
    rental_start_date DATE NOT NULL,
    rental_end_date DATE NOT NULL,       -- agreed due date
    return_date DATE,                    -- when it was actually returned
    is_damaged BIT DEFAULT 0,            -- 1 if returned in damaged condition
    penalty_amount DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ongoing' -- 'returned', 'late', 'damaged'
);

CREATE TABLE ReturnPolicies (
    policy_id INT PRIMARY KEY IDENTITY,
    daily_late_fee DECIMAL(10, 2),
    damage_fee DECIMAL(10, 2),
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE ShoppingCart (
    cart_id INT PRIMARY KEY IDENTITY,
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    product_id INT FOREIGN KEY REFERENCES Products(product_id),
    quantity INT NOT NULL DEFAULT 1,
    added_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Wishlist (
    wishlist_id INT PRIMARY KEY IDENTITY,
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    product_id INT FOREIGN KEY REFERENCES Products(product_id),
    added_at DATETIME DEFAULT GETDATE(),
    UNIQUE (user_id, product_id) -- Prevent duplicate products in wishlist
);

CREATE TABLE Reviews (
    review_id INT PRIMARY KEY IDENTITY,
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    product_id INT FOREIGN KEY REFERENCES Products(product_id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_image VARCHAR(255),  -- Image file path or URL
    created_at DATETIME DEFAULT GETDATE(),
    UNIQUE (user_id, product_id) -- Ensure a user can only leave one review per product
);

CREATE TABLE Returns (
    return_id INT PRIMARY KEY IDENTITY,
    order_id INT FOREIGN KEY REFERENCES Orders(order_id),
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    product_id INT FOREIGN KEY REFERENCES Products(product_id),
    reason VARCHAR(255),
    return_status VARCHAR(50) CHECK (return_status IN ('Requested', 'Approved', 'Rejected', 'Completed')),
    return_requested_at DATETIME DEFAULT GETDATE(),
    return_approved_at DATETIME,
    return_rejected_at DATETIME,
    refund_amount DECIMAL(10, 2),
    penalty DECIMAL(10, 2),  -- Applied in case of delays or damage
    return_shipping_fee DECIMAL(10, 2),
    exchanged_product_id INT FOREIGN KEY REFERENCES Products(product_id)  -- If the product is exchanged
);


CREATE TABLE Messages (
    message_id INT PRIMARY KEY IDENTITY,
    sender_id INT FOREIGN KEY REFERENCES Users(user_id),
    receiver_id INT FOREIGN KEY REFERENCES Users(user_id),
    product_id INT FOREIGN KEY REFERENCES Products(product_id),
    message_text TEXT,
    sent_at DATETIME DEFAULT GETDATE(),
    message_status VARCHAR(50) CHECK (message_status IN ('Sent', 'Read'))
);
