CREATE TABLE user_profiles
(
    id         UUID PRIMARY KEY,
    username   VARCHAR(32) NOT NULL UNIQUE,
    bio        VARCHAR(512),
    job_title  VARCHAR(128),
    avatar_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions
(
    id            BIGSERIAL PRIMARY KEY,
    subscriber_id UUID                     NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    target_id     UUID                     NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_subscription UNIQUE (subscriber_id, target_id),
    CONSTRAINT chk_no_self_follow CHECK (subscriber_id != target_id)
);

CREATE INDEX idx_subscriptions_subscriber_id ON subscriptions (subscriber_id);
CREATE INDEX idx_subscriptions_target_id ON subscriptions (target_id);