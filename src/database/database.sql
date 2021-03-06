CREATE TABLE IF NOT EXISTS location (
    id INTEGER PRIMARY KEY,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS company (
    id INTEGER PRIMARY KEY,
    name VARCHAR(45) NOT NULL UNIQUE,
    location INTEGER NOT NULL,
    FOREIGN KEY (location) REFERENCES location(id)
);

CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    name VARCHAR(45) NOT NULL UNIQUE,
    company_id INTEGER NOT NULL,
    homelocation INTEGER NOT NULL,
    FOREIGN KEY (company_id) REFERENCES company(id),
    FOREIGN KEY (homelocation) REFERENCES location(id)
);

INSERT INTO location (longitude, latitude)
VALUES 
(52.0963932, 4.3278064),
(52.08025, 4.3228275);

INSERT INTO company (name, location)
VALUES("ANWB", (SELECT id 
FROM location
WHERE longitude = 52.0963932 AND latitude = 4.3278064));

INSERT INTO user (name, company_id, homelocation)
VALUES (
    "Gebruiker",
    (
        SELECT id
        FROM company
        WHERE name = "ANWB"
    ),
    (
        SELECT id
        FROM location
        WHERE longitude = 52.08025 AND latitude = 4.3228275
    )
);