DROP FUNCTION IF EXISTS check_age();
DROP ROLE IF EXISTS admin;
DROP ROLE IF EXISTS "user";

-- Käyttäjät-taulu
CREATE TABLE abc123_users (
    user_id SERIAL PRIMARY KEY,
    pseudonym VARCHAR(50) UNIQUE NOT NULL,
    password BYTEA NOT NULL, -- Encrypted password
    email BYTEA UNIQUE NOT NULL, -- Encrypted email
    role VARCHAR(10) CHECK (role IN ('varaaja', 'ylläpitäjä')) NOT NULL,
    age INT CHECK (age >= 0)
);

-- Henkilötiedot-taulu
CREATE TABLE abc123_user_details (
    user_id INT PRIMARY KEY REFERENCES abc123_users(user_id) ON DELETE CASCADE,
    real_name BYTEA, -- Encrypted real name
    address BYTEA, -- Encrypted address
    phone_number BYTEA -- Encrypted phone number
);

-- Resurssit-taulu
CREATE TABLE abc123_resources (
    resource_id SERIAL PRIMARY KEY,
    resource_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Varaukset-taulu
CREATE TABLE abc123_bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES abc123_users(user_id) ON DELETE CASCADE,
    resource_id INT REFERENCES abc123_resources(resource_id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    CHECK (end_time > start_time)
);

-- Funktio tarkistamaan varaajan ikä
CREATE FUNCTION check_age() RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.role = 'varaaja' AND NEW.age < 15) THEN
        RAISE EXCEPTION 'The user must be at least 15 years old';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggeri käyttämään ikätarkistusfunktiota
CREATE TRIGGER age_check
BEFORE INSERT OR UPDATE ON abc123_users
FOR EACH ROW EXECUTE FUNCTION check_age();

-- Näkymä varattujen resurssien näyttämiseksi ilman varaajan tietoja
CREATE VIEW abc123_public_bookings AS
SELECT
    r.resource_name,
    b.start_time,
    b.end_time
FROM
    abc123_bookings b
JOIN
    abc123_resources r ON b.resource_id = r.resource_id;

-- Audit-logit
CREATE TABLE abc123_audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT,
    action VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

-- Käyttöoikeudet ja roolit
CREATE ROLE admin;
CREATE ROLE "user";

GRANT SELECT, INSERT, UPDATE, DELETE ON abc123_users TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON abc123_user_details TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON abc123_resources TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON abc123_bookings TO admin;
GRANT SELECT ON abc123_public_bookings TO "user";

