use CartifyDB

select * from Users

CREATE TABLE BuyerPreferences (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    preference_key VARCHAR(255),
    preference_value VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE SellerStores (
    id INT PRIMARY KEY IDENTITY(1,1), -- Auto-incremented store ID
    user_id INT NOT NULL,             -- Foreign key to Users table
    store_name VARCHAR(255) NOT NULL, -- Store name
    store_description VARCHAR(500),  -- Optional store description
    created_at DATETIME DEFAULT GETDATE(), -- Timestamp for creation
    FOREIGN KEY (user_id) REFERENCES Users(id) -- Link to user
);


select * from SellerStores

select * from BuyerPreferences








use CartifyDB

drop database CartifyDB



drop table Users
drop table BuyerPreferences
drop table SellerStores
drop table Categories
drop table Products
drop table Orders

-- Users Table
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(100) UNIQUE NOT NULL,
	Email VARCHAR(100) UNIQUE NOT NULL,
	Password VARCHAR(100) NOT NULL
);

-- Categories Table
CREATE TABLE Categories (
    category_id INT PRIMARY KEY IDENTITY(1,1),
    category_name VARCHAR(100) UNIQUE NOT NULL
);

-- Products Table
CREATE TABLE Products (
    product_id INT PRIMARY KEY IDENTITY(1,1),
    product_name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- Orders Table
CREATE TABLE Orders (
    order_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    order_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Buyer Preferences Table
CREATE TABLE BuyerPreferences (
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    last_purchased DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);


-- Insert Users
INSERT INTO Users (username) VALUES ('Alice'), ('Bob');

-- Insert Categories
INSERT INTO Categories (category_name) VALUES ('Gaming'), ('Furniture'), ('Books'), ('Electronics');

-- Insert Products
INSERT INTO Products (product_name, category_id) VALUES
('Gaming Mouse', 1),
('Office Chair', 2),
('Fantasy Novel', 3),
('Smartphone', 4);


select * from Users
