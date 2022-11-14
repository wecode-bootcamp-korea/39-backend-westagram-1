const { AppDataSource } = require('./data-source');

const createLike = async (userId, postId) => {
  await AppDataSource.query(
    `
  INSERT INTO
    likes (user_id, post_id)
  VALUES (?, ?)`,
    [userId, postId]
  );
};

const deleteLike = async (userId, postId) => {
  await AppDataSource.query(
    `
  DELETE FROM
    likes
  WHERE user_id = ? and
  post_id = ?`,
    [userId, postId]
  );
};

module.exports = { createLike, deleteLike };
