const { appDataSource } = require("./data-source");

const creatingPost = async (title, content, image_url, userId) => {
  try {
    await appDataSource.query(
      `
    INSERT INTO posts(
        title,
        content,
        image_url,
        user_id
    ) VALUES (?, ?, ?, ?);
    `,
      [title, content, image_url, userId]
    );
  } catch (error) {
    return res.status(422).json({ message: "Wrong Input" });
  }
};

const posts = async () => {
  try {
    const posts = await appDataSource.query(
      `
    SELECT
      u.id as userId,
      u.profile_image as userProfileImage,
      p.id as postingId,
      p.image_url as postingImageUrl,
      p.content as postingContent
    FROM users u
    JOIN posts p ON u.id = p.user_id;
    `
    );
    return posts;
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postsByUser = async (userId) => {
  try {
    const userPost = await appDataSource.query(
      `
      SELECT 
        users.id,
        users.profile_image,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "postingId",posts.id,
            "postingImageUrl", posts.image_url,
            "postingContent",posts.content
          )
        ) as postings
      FROM users
      LEFT JOIN posts ON users.id = posts.user_id
      WHERE users.id = ?
      GROUP BY users.id;
      `,
      [userId]
    );
    return userPost;
  } catch (error) {
    return res.status(200).json({ message: "No Posts Existed" });
  }
};

const deletePost = async (postId) => {
  try {
    await appDataSource.query(
      `DELETE FROM posts
      WHERE id = ?;
      `,
      [postId]
    );
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const checkPost = async (postId) => {
  const check = await appDataSource.query(
    `
    SELECT EXISTS
    (SELECT * FROM posts
    WHERE id = ?)
    AS postExist
    `,
    [postId]
  );
  console.log(check);
  return check;
};

const edit = async (postId, title, content, image_url) => {
  await appDataSource.query(
    `
      UPDATE posts SET
        title = ?,
        content = ?,
        image_url = ?
      WHERE posts.id = ?
      `,
    [title, content, image_url, postId]
  );
};

const editedPost = async (postId) => {
  const edited = await appDataSource.query(
    `
    SELECT
      users.id as userId,
      users.user_name as userName,
      posts.id as postingId,
      posts.title as postingTitle,
      posts.content as postingContent
    FROM users
    JOIN posts ON users.id = posts.user_id
    WHERE posts.id = ?
    `,
    [postId]
  );
  return edited;
};

module.exports = {
  creatingPost,
  posts,
  postsByUser,
  deletePost,
  checkPost,
  edit,
  editedPost,
};
