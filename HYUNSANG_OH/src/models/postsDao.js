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
      p.user_id as postingId,
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

const checkPost = async (postId) => {
  try {
    const userPost = await appDataSource.query(
      `
      SELECT EXISTS
      (SELECT * FROM posts
      WHERE id = ?)
      AS postExist
      `,
      [postId]
    );
    return userPost;
    console.log(userPost); ////////
  } catch (err) {
    return res.status(404).json({ message: "Non Existing Post" });
  }
};

const deletePost = async (userId, postId) => {
  try {
    const deletePost = await appDataSource.query(
      `
        DELETE
        FROM posts
        WHERE posts.user_id = ? and posts.id = ?
      `,
      [userId, postId]
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { creatingPost, posts, postsByUser, checkPost, deletePost };
