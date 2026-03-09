CREATE TABLE IF NOT EXISTS posts (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    image_url   TEXT NOT NULL,
    caption     TEXT,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_likes (
    post_id     BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,

    CONSTRAINT fk_post_like
        FOREIGN KEY(post_id)
            REFERENCES posts(id)
            ON DELETE CASCADE,

    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS comments (
    id          BIGSERIAL PRIMARY KEY,
    post_id     BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
    text        TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT fk_post_comment
        FOREIGN KEY(post_id)
            REFERENCES posts(id)
            ON DELETE CASCADE
);