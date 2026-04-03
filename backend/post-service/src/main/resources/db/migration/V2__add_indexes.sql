CREATE INDEX idx_comments_post_id ON comments(post_id);

CREATE INDEX idx_posts_user_id ON posts(user_id);

CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
