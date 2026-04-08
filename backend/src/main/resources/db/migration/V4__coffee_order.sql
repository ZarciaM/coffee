create table coffee_order (
                              id uuid primary key,
                              total_price int,
                              date timestamp,
                              id_delivery uuid,
    constraint fk_order_delivery foreign key (id_delivery)
        references delivery(id)
);


create table coffee_order_to_coffee (
                                        id_coffee uuid,
                                        id_coffee_order uuid,
                                        primary key (id_coffee, id_coffee_order),
                                        constraint fk_coffee_order_coffee foreign key (id_coffee)
                                            references coffee(id),
                                        constraint fk_coffee_coffee_order foreign key (id_coffee_order)
                                            references coffee_order(id)
);
