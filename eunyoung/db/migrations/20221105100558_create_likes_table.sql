-- migrate:up
CREATE TABLE likes (
    id INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    postId INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users (id),
    FOREIGN KEY (postId) REFERENCES posts (id)
);

-- migrate:down
DROP TABLE likes;
