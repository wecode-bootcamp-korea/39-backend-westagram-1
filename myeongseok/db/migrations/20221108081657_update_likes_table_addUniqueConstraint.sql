-- migrate:up
alter table likes add constraint unique_likes unique (user_id, post_id)


-- migrate:down
DROP TABLE likes
