const { AppDataSource } = require('./dataSource');

const createPost = async (title, postImageUrl, content, userId) => {
  await AppDataSource.query(
    `INSERT INTO posts(
    title,
    post_image_url,
    content,
    user_id
  ) VALUES (?, ?, ?, ?);
  `,
    [title, postImageUrl, content, userId]
  );
};

const readPosts = async () => {
  const posts = await AppDataSource.query(
    `SELECT
        users.id as userId,
        users.profile_image as userProfileImage,
        posts.id as postingId,
        posts.post_image_url as postingImageUrl,
        posts.content as postingContent
      FROM posts
      INNER JOIN users ON posts.user_id = users.id`
  );
  return posts;
};

const readUserPost = async (id) => {
  const userPost = await AppDataSource.query(
    `SELECT
    u.id userID,
    u.profile_image userProfileImage,
    JSON_ARRAYAGG(JSON_OBJECT(
      "postingId", p.id,
      "postingImageUrl", p.post_image_url,
      "postingContent", p.content
    )) postings
  FROM users u
  INNER JOIN posts p ON p.user_id = u.id
  WHERE u.id = ?
  GROUP BY u.id`,
    [id]
  );

  return userPost;
};

const updateUserPost = async (id, title, postImageUrl, content, userId) => {
  const result = await AppDataSource.query(
    `UPDATE posts
      SET
        title = ?,
        post_image_url = ?,
        content = ?
      WHERE id = ? and user_id = ?
      `,
    [title, postImageUrl, content, id, userId]
  );
  return result;
};

const deleteUserPost = async (userId, postId) => {
  const result = await AppDataSource.query(
    `
  DELETE FROM posts
  WHERE user_id = ? and
    id = ?`,
    [userId, postId]
  );
  return result;
};

module.exports = {
  createPost,
  readPosts,
  readUserPost,
  updateUserPost,
  deleteUserPost,
};
