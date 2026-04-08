create table "user" (
    id uuid primary key not null ,
    name varchar(100),
    email varchar(100) not null ,
    address text not null

);