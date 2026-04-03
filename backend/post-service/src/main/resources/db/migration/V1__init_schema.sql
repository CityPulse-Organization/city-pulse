CREATE TABLE IF NOT EXISTS posts
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    UUID                     NOT NULL,
    image_url  TEXT                     NOT NULL,
    caption    TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_likes
(
    post_id BIGINT NOT NULL,
    user_id UUID   NOT NULL,

    CONSTRAINT fk_post_like
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE,

    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS comments
(
    id         BIGSERIAL PRIMARY KEY,
    post_id    BIGINT                   NOT NULL,
    user_id    UUID                     NOT NULL,
    text       VARCHAR(256)             NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT fk_post_comment
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
