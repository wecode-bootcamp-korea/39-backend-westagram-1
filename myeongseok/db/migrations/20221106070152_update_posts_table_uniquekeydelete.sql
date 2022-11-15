-- migrate:up
alter table posts drop foreign key posts_ibfk_1

-- migrate:down
drop table posts;
