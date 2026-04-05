ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS bio         VARCHAR(255) DEFAULT 'Welcome to my City Pulse profile!',
    ADD COLUMN IF NOT EXISTS job_title   VARCHAR(64)  DEFAULT 'User',
    ADD COLUMN IF NOT EXISTS avatar_url  VARCHAR(255);
