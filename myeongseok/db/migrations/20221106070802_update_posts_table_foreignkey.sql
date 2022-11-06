-- migrate:up
alter table posts add foreign key (user_id) references users (id)

-- migrate:down
drop table posts;
