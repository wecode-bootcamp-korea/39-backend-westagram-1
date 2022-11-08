-- migrate:up
ALTER TABLE posts RENAME COLUMN post_image to post_image_url

-- migrate:down
DROP TABLE posts
