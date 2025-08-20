-- A9dhily Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create additional schemas if needed
CREATE SCHEMA IF NOT EXISTS public;

-- Set timezone
SET timezone = 'UTC';

-- Create custom functions for audit trails
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE a9dhily TO a9dhily_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO a9dhily_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO a9dhily_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO a9dhily_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO a9dhily_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO a9dhily_user;
