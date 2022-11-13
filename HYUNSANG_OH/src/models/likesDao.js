const { appDataSource } = require("./data-source");

const check = async (userId, postId) => {
  const likes = await appDataSource.query(
    `
      SELECT EXISTS
      (SELECT * FROM likes
      WHERE user_id = ? and post_id = ?)
      AS 'LIKED';
      `,
    [userId, postId]
  );
  return likes;
};

const createLikes = async (userId, postId) => {
  await appDataSource.query(
    `
    INSERT INTO likes(
        user_id,
        post_id
    ) VALUES (?,?);
    `,
    [userId, postId]
  );
};

module.exports = { check, createLikes };
