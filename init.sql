-- init.sql
-- Drop the database if it exists (USE WITH CAUTION!)#
--DROP DATABASE IF EXISTS portfolio;

-- Create the database
--CREATE DATABASE portfolio;

-- Connect to the database
\c portfolio

-- Grant all privileges on the database to the postgres user
GRANT ALL PRIVILEGES ON DATABASE portfolio TO postgres;

-- Create the public schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Grant all privileges on the public schema to the postgres user
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;

-- Set the default schema to public
SET search_path TO public;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> b83e45c8fd13

CREATE TABLE admin_users (
    id SERIAL NOT NULL, 
    username VARCHAR NOT NULL, 
    email VARCHAR NOT NULL, 
    hashed_password VARCHAR NOT NULL, 
    is_active BOOLEAN NOT NULL, 
    is_superuser BOOLEAN NOT NULL, 
    last_login TIMESTAMP WITHOUT TIME ZONE, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_admin_users_email ON admin_users (email);

CREATE INDEX ix_admin_users_id ON admin_users (id);

CREATE UNIQUE INDEX ix_admin_users_username ON admin_users (username);

CREATE TABLE experiences (
    id SERIAL NOT NULL, 
    company VARCHAR(100) NOT NULL, 
    position VARCHAR(100) NOT NULL, 
    start_date DATE NOT NULL, 
    end_date DATE, 
    description TEXT NOT NULL, 
    location VARCHAR(100), 
    current BOOLEAN NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_experiences_id ON experiences (id);

CREATE TABLE personal_data (
    id SERIAL NOT NULL, 
    name VARCHAR(100) NOT NULL, 
    title VARCHAR(100) NOT NULL, 
    bio TEXT NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    phone VARCHAR(20), 
    location VARCHAR(100), 
    avatar_url VARCHAR(255), 
    social_links JSON, 
    skills JSON, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_personal_data_id ON personal_data (id);

CREATE TABLE projects (
    id SERIAL NOT NULL, 
    title VARCHAR(100) NOT NULL, 
    description TEXT NOT NULL, 
    technologies JSON NOT NULL, 
    image_url VARCHAR(255), 
    github_url VARCHAR(255), 
    live_url VARCHAR(255), 
    featured BOOLEAN NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_projects_id ON projects (id);

INSERT INTO alembic_version (version_num) VALUES ('b83e45c8fd13') RETURNING alembic_version.version_num;
COMMIT; 