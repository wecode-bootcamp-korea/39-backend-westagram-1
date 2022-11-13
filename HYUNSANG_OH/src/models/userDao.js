const { appDataSource } = require("./data-source");

const getUserByEmail = async (email) => {
  const [check] = await appDataSource.query(
    `
    SELECT * 
    FROM users
    WHERE users.email = ?
    `,
    [email]
  );
  return check;
};

const createUser = async (name, email, hashedPassword, profile_image) => {
  await appDataSource.query(
    `
      INSERT INTO users(
        user_name,
        email,
        user_password,
        profile_image
      ) VALUES (?, ?, ?, ?);
      `,
    [name, email, hashedPassword, profile_image]
  );
};
module.exports = { createUser, getUserByEmail };
