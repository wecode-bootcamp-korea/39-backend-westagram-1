const { AppDataSource } = require('./data-source');

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

module.exports = { createUser, getUserByEmail };
