-- migrate:up
alter table likes drop foreign key likes_post_id_fkey;
alter table likes drop foreign key likes_user_id_fkey;
alter table likes drop CONSTRAINT user_id;
alter table likes drop CONSTRAINT post_id;



-- migrate:down
drop table likes
