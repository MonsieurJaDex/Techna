DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
CREATE TYPE role AS ENUM (
            'employee',
            'HR',
            'manager'
        );
END IF;
END$$;