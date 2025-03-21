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
