-- migrate:up
ALTER TABLE users CHANGE userProfileImage profile_image_url varchar(500);
ALTER TABLE posts CHANGE imageUrl thumbnail_image_url varchar(500);

-- migrate:down

