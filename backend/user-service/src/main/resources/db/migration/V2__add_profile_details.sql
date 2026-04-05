ALTER TABLE user_profiles
    ADD COLUMN bio         VARCHAR(255) DEFAULT 'Welcome to my City Pulse profile!',
    ADD COLUMN job_title   VARCHAR(64)  DEFAULT 'User',
    ADD COLUMN avatar_url  VARCHAR(255);
