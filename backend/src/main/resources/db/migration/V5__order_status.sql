CREATE TABLE order_status (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              order_id UUID NOT NULL,
                              status VARCHAR(50) NOT NULL,
                              status_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              CONSTRAINT fk_order_status_order FOREIGN KEY (order_id)
                                  REFERENCES coffee_order(id)
                                  ON DELETE CASCADE
);
