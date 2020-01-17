"use strict";

exports.validateEmail =
  "SELECT COUNT(email) count_email FROM users WHERE email = $1;";

exports.removeExpiredResetPassword =
  "DELETE FROM reset_password WHERE DATEDIFF(hour,created_date,getdate()) >= 1;";

exports.removeExistEmail =
  "DELETE FROM reset_password WHERE user_id = (SELECT id FROM users WHERE email = $1);";

exports.insertIntoResetPassword =
  "INSERT INTO reset_password (user_id,token_reset_password,ip_addr) SELECT id,$2,$3 FROM users WHERE email = $1;";

exports.checkTokenResetPassword =
  "SELECT COUNT(1) token FROM reset_password WHERE token_reset_password = $1;";

exports.resetPassword =
  "UPDATE users SET users.password = CONVERT(VARCHAR(32), HashBytes('MD5', $1), 2) FROM users INNER JOIN reset_password ON users.id = reset_password.user_id WHERE reset_password.token_reset_password = $2;";

exports.deleteToken =
  "DELETE FROM reset_password WHERE token_reset_password = $1;";

exports.getDetailUser =
  "SELECT u.full_name, u.username, u.email FROM users u INNER JOIN reset_password rp ON u.id = rp.user_id WHERE rp.token_reset_password = $1;";
