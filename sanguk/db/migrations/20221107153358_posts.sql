-- migrate:up
    CREATE TABLE posts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    postingId INT NOT NULL,
    Image_Url VARCHAR(500) NOT NULL,
    Content VARCHAR(1000) NOT NULL,
    userId INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- migrate:down

