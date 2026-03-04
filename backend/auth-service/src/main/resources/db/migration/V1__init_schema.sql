CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(64) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       role VARCHAR(16) NOT NULL DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
                                              id BIGSERIAL PRIMARY KEY,
                                              user_id BIGINT NOT NULL,
                                              token_hash VARCHAR(44) UNIQUE NOT NULL,
                                              issued_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                              expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                              revoked BOOLEAN NOT NULL DEFAULT FALSE,
                                              CONSTRAINT fk_refresh_tokens_user
                                                  FOREIGN KEY (user_id)
                                                      REFERENCES users(id)
                                                      ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id
    ON refresh_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at
    ON refresh_tokens(expires_at);