-- migrate:up
CREATE TABLE comments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  content VARCHAR(3000) NOT NULL,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- migrate:down
DROP TABLE comments
