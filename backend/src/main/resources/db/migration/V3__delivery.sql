create type delivery_status as enum (
    'DELIVERED',
    'DELIVERING',
    'CANCELED',
    'LOST'
);

create table vehicle(
                        id uuid primary key,
                        name varchar(100) not null,
                        price integer not null,
                        time_gain integer not null
);

create table delivery(
                         id uuid primary key,
                         date timestamp,
                         place_to_deliver text,
                         duration int
);

create table status_properties(
                                  id uuid primary key,
                                  status delivery_status not null,
                                  date timestamp,
                                  id_delivery uuid not null,
                                  constraint fk_status_delivery foreign key (id_delivery)
                                      references delivery(id)
);

create table vehicle_delivery(
                                 id_vehicle uuid not null,
                                 id_delivery uuid not null,
                                 primary key (id_vehicle, id_delivery),
                                 constraint fk_delivery_vehicle foreign key (id_delivery)
                                     references delivery(id),
                                 constraint fk_vehicle_delivery foreign key (id_vehicle)
                                     references vehicle(id)
);
