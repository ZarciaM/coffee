CREATE TABLE payment (
                         id UUID PRIMARY KEY,
                         payment_type VARCHAR(31) NOT NULL,
                         delivery_id UUID,
                         total_amount INTEGER NOT NULL,
                         payment_date TIMESTAMP NOT NULL,
                         transaction_reference VARCHAR(255),
                         card_number VARCHAR(255),
                         phone_number VARCHAR(255),
                         secret_code VARCHAR(255),
                         amount INTEGER,
                         CONSTRAINT fk_payment_delivery FOREIGN KEY (delivery_id)
                             REFERENCES delivery(id) ON DELETE CASCADE
);

