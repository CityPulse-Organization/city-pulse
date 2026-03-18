CREATE TABLE IF NOT EXISTS credentials
(
    id            UUID PRIMARY KEY             DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role          VARCHAR(16)         NOT NULL DEFAULT 'USER',
    status        VARCHAR(16)         NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS linked_accounts
(
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID         NOT NULL,
    provider    VARCHAR(16)  NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    CONSTRAINT uq_provider_provider_id UNIQUE (provider, provider_id),
    CONSTRAINT fk_linked_accounts_credential
        FOREIGN KEY (user_id) REFERENCES credentials (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS refresh_tokens
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    UUID                     NOT NULL,
    token_hash VARCHAR(44) UNIQUE       NOT NULL,
    issued_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked    BOOLEAN                  NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_refresh_tokens_credential
        FOREIGN KEY (user_id) REFERENCES credentials (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_credentials_email ON credentials (email);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_user_id ON linked_accounts (user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens (token_hash);
