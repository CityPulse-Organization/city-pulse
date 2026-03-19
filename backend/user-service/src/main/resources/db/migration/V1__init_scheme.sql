CREATE TABLE user_profiles (
                               id UUID PRIMARY KEY,
                               username VARCHAR(32) NOT NULL UNIQUE,
                               created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
