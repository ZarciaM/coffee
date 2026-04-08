-- Table Coffee
CREATE TABLE coffee (
                        id UUID PRIMARY KEY NOT NULL,
                        name VARCHAR(100) NOT NULL,
                        preparation_time INT NOT NULL,
                        cost INT
);

-- Table AddIn
CREATE TABLE add_in (
                        id UUID PRIMARY KEY NOT NULL,
                        name VARCHAR(100) NOT NULL,
                        price INT
);

-- Table d'association ManyToMany
CREATE TABLE coffee_add_in (
                               coffee_id UUID NOT NULL,
                               add_in_id UUID NOT NULL,
                               CONSTRAINT fk_coffee FOREIGN KEY (coffee_id) REFERENCES coffee(id),
                               CONSTRAINT fk_add_in FOREIGN KEY (add_in_id) REFERENCES add_in(id),
                               PRIMARY KEY (coffee_id, add_in_id)
);

-- Exemples de données pour Coffee
INSERT INTO coffee (id, name, preparation_time, cost) VALUES
                                                          ('11111111-1111-1111-1111-111111111111', 'Espresso', 5, 200),
                                                          ('22222222-2222-2222-2222-222222222222', 'Cappuccino', 7, 300),
                                                          ('33333333-3333-3333-3333-333333333333', 'Latte', 6, 250);

-- Exemples de données pour AddIn
INSERT INTO add_in (id, name, price) VALUES
                                         ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Chocolate', 50),
                                         ('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Vanilla', 40),
                                         ('ccccccc3-cccc-cccc-cccc-ccccccccccc3', 'Caramel', 60);

INSERT INTO coffee_add_in (coffee_id, add_in_id) VALUES
                                                     ('11111111-1111-1111-1111-111111111111', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1'), -- Espresso + Chocolate
                                                     ('22222222-2222-2222-2222-222222222222', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2'), -- Cappuccino + Vanilla
                                                     ('33333333-3333-3333-3333-333333333333', 'ccccccc3-cccc-cccc-cccc-ccccccccccc3'), -- Latte + Caramel
                                                     ('22222222-2222-2222-2222-222222222222', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1'); -- Cappuccino + Chocolate
