-- migrate:up
ALTER TABLE posts ADD post_image varchar(1000) NOT NULL AFTER title

-- migrate:down
DROP TABLE posts
