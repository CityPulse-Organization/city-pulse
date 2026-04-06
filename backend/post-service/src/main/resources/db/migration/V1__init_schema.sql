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
    parent_id  BIGINT,
    post_id    BIGINT                   NOT NULL,
    user_id    UUID                     NOT NULL,
    text       VARCHAR(256)             NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT fk_post_comment
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_parent_comment
        FOREIGN KEY (parent_id)
            REFERENCES comments (id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment_likes
(
    comment_id BIGINT NOT NULL,
    user_id    UUID   NOT NULL,

    CONSTRAINT fk_comment_like
        FOREIGN KEY (comment_id)
            REFERENCES comments (id)
            ON DELETE CASCADE,

    PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS saved_posts
(
    post_id    BIGINT                   NOT NULL,
    user_id    UUID                     NOT NULL,
    saved_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT fk_saved_post
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE,

    PRIMARY KEY (post_id, user_id)
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);
CREATE INDEX idx_saved_posts_user_id ON saved_posts(user_id);
