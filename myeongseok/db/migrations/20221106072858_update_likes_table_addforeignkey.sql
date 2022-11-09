-- migrate:up
alter table likes add foreign key (user_id) references users (id);

alter table likes add foreign key (post_id) references posts (id)

-- migrate:down
drop table likes
