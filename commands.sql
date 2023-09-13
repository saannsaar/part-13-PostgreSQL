
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url  text NOT NULL,
    title  text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('Wilma Koira', 'www', 'Wilman koirablogi', 2);

insert into blogs (author, url, title, likes) values ('Wilma Koira', 'qwww', 'Wilman kissablogi',2);