const { AppDataSource } = require('./dataSource');

const createUser = async (name, email, profileImage, password) => {
  await AppDataSource.query(
    `INSERT INTO users(
    name,
    email,
    profile_image,
    password
  ) VALUES (?, ?, ?, ?);
  `,
    [name, email, profileImage, password]
  );
};

const getUserByEmail = async (email) => {
  const [user] = await AppDataSource.query(
    `SELECT *
    FROM users
    WHERE users.email = ?
    `,
    [email]
  );

  return user;
};

const getUserByUserId = async (userId) => {
  const user = await AppDataSource.query(
    `SELECT
    id,
    name,
    email,
    profile_image
    FROM users
    WHERE users.id = ?`,
    [userId]
  );
  return user;
};

module.exports = { createUser, getUserByEmail, getUserByUserId };
