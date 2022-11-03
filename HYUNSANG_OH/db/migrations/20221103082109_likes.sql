-- migrate:up
CREATE TABLE likes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    CONSTRAINT FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- migrate:down
DROP TABLE likes;