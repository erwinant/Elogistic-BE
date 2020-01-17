"use strict";

exports.checkUserRegis =
  "SELECT COUNT(1) AS count_user FROM [dbo].[users] WHERE is_active = 1 AND deleted = 0 AND username = $1;";

exports.deleteUsersExpiredToken =
  "DELETE FROM [dbo].[users_login] WHERE user_id = (SELECT id FROM users WHERE username = $1) AND application_id = $2 AND DATEDIFF(hour,created_date,getdate()) >= $3 AND token IS NOT NULL;";

exports.checkUserLoginAnotherDevice =
  "SELECT count(1) loggedIn FROM users_login ul inner join users u on u.id = ul.user_id  where u.username = $1 and ul.application_id = $2;";

exports.updateWronggPassAndBlockAfter3XWrong =
  "UPDATE users SET count_wrong_password = count_wrong_password + 1, is_active = CASE WHEN count_wrong_password = 2 THEN 0 ELSE 1 END WHERE username = $1";

exports.resetCountWrongPassAfterLoginSuccess =
  "UPDATE users SET count_wrong_password = 0 WHERE username = $1;";

exports.profileUser =
  "SELECT id, username, full_name, gender, email, no_handphone, is_active, deleted FROM [dbo].[users] WHERE is_active = 1 AND deleted = 0 AND username = $1 AND password = CONVERT(VARCHAR(32), HashBytes('MD5', $2 ), 2);";

exports.profileJob =
  "SELECT DISTINCT j.id, j.job_code, j.job_desc FROM [dbo].[users] u INNER JOIN [dbo].[users_jobs] uj ON u.id = uj.user_id INNER JOIN [dbo].[jobs] j ON j.id = uj.job_id WHERE u.is_active = 1 AND u.deleted = 0 AND uj.is_active = 1 AND uj.deleted = 0 AND j.is_active = 1 AND j.deleted = 0 AND u.username = $1 AND u.password = CONVERT(VARCHAR(32), HashBytes('MD5', $2), 2);";

exports.profileRole =
  "SELECT DISTINCT r.id, r.role_code, r.role_desc FROM [dbo].[users] u INNER JOIN [dbo].[users_jobs] uj ON u.id = uj.user_id INNER JOIN [dbo].[jobs] j ON j.id = uj.job_id INNER JOIN [dbo].[roles_jobs] rj ON RJ.job_id = j.id INNER JOIN [dbo].[roles] r ON r.id = rj.role_id WHERE u.is_active = 1 AND u.deleted = 0 AND uj.is_active = 1 AND uj.deleted = 0 AND j.is_active = 1 AND j.deleted = 0 AND rj.is_active = 1 AND rj.deleted = 0 AND r.is_active = 1 AND r.deleted = 0 AND u.username = $1 AND u.password = CONVERT(VARCHAR(32), HashBytes('MD5', $2), 2);";

exports.profileMenu =
  "SELECT DISTINCT a.id, a.application_name, a.application_type, a.route, a.icon FROM [dbo].[users] u INNER JOIN [dbo].[users_jobs] uj ON u.id = uj.user_id INNER JOIN [dbo].[jobs] j ON j.id = uj.job_id INNER JOIN [dbo].[roles_jobs] rj ON RJ.job_id = j.id INNER JOIN [dbo].[roles] r ON r.id = rj.role_id INNER JOIN [dbo].[applications_roles] ar ON ar.role_id = r.id INNER JOIN [dbo].[applications] a ON ar.application_id = a.id WHERE u.is_active = 1 AND u.deleted = 0 AND uj.is_active = 1 AND uj.deleted = 0 AND j.is_active = 1 AND j.deleted = 0 AND rj.is_active = 1 AND rj.deleted = 0 AND r.is_active = 1 AND r.deleted = 0 AND ar.is_active = 1 AND ar.deleted = 0 AND a.is_active = 1 AND a.deleted = 0 AND u.username = $1 AND u.password = CONVERT ( VARCHAR ( 32 ), HashBytes ( 'MD5', $2 ), 2 ) AND a.application_id = $3;";

exports.profilePlant =
  "SELECT DISTINCT up.plant_code, up.project_name FROM users_projects up INNER JOIN users u ON up.user_id = u.id WHERE up.is_active = 1 AND up.deleted = 0 AND u.is_active = 1 AND u.deleted = 0 AND u.username = $1;";

exports.profileZone =
  "SELECT a.plant_code, a.zone_id FROM user_project_zone a INNER JOIN users b on a.user_id = b.id WHERE a.is_active = 1 AND a.deleted = 0 AND b.is_active = 1 AND b.deleted = 0 AND b.username = $1";

exports.profileArea =
  "SELECT a.id,a.plant_code,a.zone_id,a.area_id FROM user_project_zone_area a INNER JOIN users b on a.user_id = b.id WHERE a.is_active = 1 AND a.deleted = 0 AND b.is_active = 1 AND b.deleted = 0 AND b.username = $1;";

exports.historyLogin =
  "INSERT INTO [dbo].[history_login] ([user_id] ,[application_id] ,[ip_addr]) VALUES ($1 ,$2 ,$3);";

exports.deleteUserLogin =
  "DELETE FROM [dbo].[users_login] WHERE user_id = $1 AND application_id = $2;";

exports.insertUserLogin =
  "INSERT INTO [dbo].[users_login] ([user_id] ,[application_id] ,[token], [token_fcm] ,[created_by] , [email], [ip_addr]) VALUES ($1 ,$2 ,$3 ,$4 ,$5, $6, $7);";

exports.getUsers =
  "SELECT id, username, full_name, gender, email, no_handphone, is_active, deleted FROM [dbo].[users] WHERE deleted = 0;";

exports.addUser =
  "INSERT INTO [dbo].[users] ([username] ,[full_name] ,[gender] ,[email] ,[no_handphone] ,[password] ,[created_by] ,[ip_addr]) VALUES ($1 ,$2 ,$3 ,$4 ,$5 ,CONVERT(VARCHAR(32), HashBytes('MD5', $6 ), 2) ,$7 ,$8);";

exports.logout =
  "DELETE FROM [dbo].[users_login] WHERE user_id = $1 AND application_id = $2;";

exports.activateUser =
  "UPDATE users SET is_active = $1, count_wrong_password = case when is_active = 1 THEN count_wrong_password ELSE 0 END, updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteUser =
  "UPDATE users SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.updateUser =
  "UPDATE users SET full_name = $1, gender = $2, email = $3, no_handphone = $4, updated_by = $5, updated_date = getdate(), ip_addr = $6 WHERE id = $7;";

exports.changePass =
  "UPDATE users SET updated_date = getdate(), updated_by = $1, ip_addr = $2, password = CONVERT(VARCHAR(32), HashBytes('MD5', $3 ), 2) WHERE id = $4;";

exports.getUserProject =
  "SELECT up.id, u.username, u.full_name, up.plant_code, up.project_name, up.is_active, up.deleted FROM users_projects up INNER JOIN users u ON up.user_id = u.id WHERE up.deleted = 0 AND u.deleted = 0 AND up.plant_code = $1;";

exports.activateUserProject =
  "UPDATE users_projects SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteUserProject =
  "UPDATE users_projects SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.addUserProject =
  "INSERT INTO [dbo].[users_projects] ([user_id] ,[plant_code] ,[project_name] ,[created_by] ,[ip_addr]) VALUES ($1 ,$2 ,$3 ,$4 ,$5);";

exports.getUserProjectZone =
  "SELECT a.id, b.username, b.full_name, a.is_active, a.deleted FROM user_project_zone a INNER JOIN users b on a.user_id = b.id WHERE a.deleted = 0 AND b.deleted = 0 AND a.plant_code = $1 AND a.zone_id = $2;";

exports.addUserProjectZone =
  "INSERT INTO [dbo].[user_project_zone] ([plant_code] ,[zone_id] ,[user_id] ,[created_by] ,[ip_addr]) VALUES ($1 ,$2 ,$3 ,$4 ,$5);";

exports.activateUserProjectZone =
  "UPDATE user_project_zone SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteUserProjectZone =
  "UPDATE user_project_zone SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.getSMForPushNotifNewOrder =
  "SELECT DISTINCT ul.token_fcm FROM roles r INNER JOIN roles_jobs rj on r.id = rj.role_id INNER JOIN users_jobs uj on uj.job_id = rj.job_id INNER JOIN user_project_zone_area upza on upza.user_id = uj.user_id INNER JOIN users_login ul on upza.user_id = ul.user_id WHERE r.deleted = 0 AND r.is_active = 1 AND rj.deleted = 0 AND rj.is_active = 1 AND uj.deleted = 0 AND uj.is_active = 1 AND upza.deleted = 0 AND upza.is_active =1 AND ul.application_id = $1 AND upza.plant_code = $2 AND upza.zone_id = $3 AND upza.area_id = $4 AND r.role_code = $5;";

exports.getEmailSMForNotifEmail =
  "SELECT DISTINCT u.email,u.full_name FROM roles r INNER JOIN roles_jobs rj on r.id = rj.role_id INNER JOIN users_jobs uj on uj.job_id = rj.job_id INNER JOIN user_project_zone_area upza on upza.user_id = uj.user_id INNER JOIN users u on upza.user_id = u.id WHERE r.deleted = 0 AND r.is_active = 1 AND rj.deleted = 0 AND rj.is_active = 1 AND uj.deleted = 0 AND uj.is_active = 1 AND upza.deleted = 0 AND upza.is_active =1 AND upza.plant_code = $1 AND upza.zone_id = $2 AND upza.area_id = $3 AND r.role_code = $4;";

exports.getALForPushNotifApprove =
  "SELECT DISTINCT ul.token_fcm FROM roles r INNER JOIN roles_jobs rj on r.id = rj.role_id INNER JOIN users_jobs uj on uj.job_id = rj.job_id INNER JOIN users_projects up on up.user_id = uj.user_id INNER JOIN users_login ul on up.user_id = ul.user_id WHERE r.deleted = 0 AND r.is_active = 1 AND rj.deleted = 0 AND rj.is_active = 1 AND uj.deleted = 0 AND uj.is_active = 1 AND up.deleted = 0 AND up.is_active =1 AND up.plant_code = $1 AND ul.application_id = $2 AND r.role_code = $3;";

exports.getEmailALForNotifEmail =
  "SELECT DISTINCT u.email,u.full_name FROM roles r INNER JOIN roles_jobs rj on r.id = rj.role_id INNER JOIN users_jobs uj on uj.job_id = rj.job_id INNER JOIN users_projects up on up.user_id = uj.user_id INNER JOIN users u on up.user_id = u.id WHERE r.deleted = 0 AND r.is_active = 1 AND rj.deleted = 0 AND rj.is_active = 1 AND uj.deleted = 0 AND uj.is_active = 1 AND up.deleted = 0 AND up.is_active =1 AND up.plant_code = $1 AND r.role_code = $2;";

exports.getSPVForPushNotifDelivery =
  "SELECT ul.token_fcm FROM users u INNER JOIN users_login ul on u.id = ul.user_id WHERE u.deleted = 0 AND u.is_active = 1 AND ul.application_id = $1 AND u.username = $2;";

exports.getEmailSPVForNotifEmail =
  "SELECT u.email, u.full_name FROM users u WHERE u.deleted = 0 AND u.is_active = 1 AND u.username = $1;";

exports.getDetailUserByUsername =
  "SELECT u.id, u.username, u.full_name, u.gender, u.email, u.no_handphone FROM users u WHERE u.is_active = 1 and u.deleted = 0 AND u.username = $1;";

exports.getListUserLoginApps =
  "SELECT ul.id,u.username, u.full_name, ul.application_id, a.application_name, FORMAT(ul.created_date,'dd MMM yyyy HH:mm') login_date FROM users_login ul INNER JOIN applications a on ul.application_id = a.id INNER JOIN users u on u.id = ul.user_id WHERE ul.user_id = $1;";

exports.logoutUserFromApp = "DELETE FROM users_login WHERE id = $1;";

exports.getUserProjectZoneArea =
  "SELECT a.id, a.user_id, b.username, b.full_name, a.is_active, a.deleted FROM user_project_zone_area a INNER JOIN users b on a.user_id = b.id WHERE a.deleted = 0 AND a.plant_code = $1 AND a.zone_id = $2 and a.area_id = $3;";

exports.addUserProjectZoneArea =
  "INSERT INTO user_project_zone_area (plant_code, zone_id, area_id, user_id, created_by, ip_addr) VALUES($1,$2,$3,$4,$5,$6);";

exports.activateUserProjectZoneArea =
  "UPDATE user_project_zone_area SET is_active = $1, updated_date = getdate(), updated_by = $2, ip_addr = $3 WHERE id = $4;";

exports.deleteUserProjectZoneArea =
  "UPDATE user_project_zone_area SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.getSPVForPushNotifRequestor =
  "SELECT ul.token_fcm FROM users u INNER JOIN users_login ul on u.id = ul.user_id WHERE u.deleted = 0 and u.is_active = 1 and ul.application_id = $1 and u.username = $2;";

exports.getDetailUserJob =
  "SELECT uj.id, j.job_code, j.job_desc, uj.is_active, uj.deleted FROM users_jobs uj INNER JOIN jobs j ON uj.job_id = j.id WHERE uj.deleted = 0 AND j.deleted = 0 AND uj.user_id = $1;";

exports.getDetailUserProject =
  "SELECT up.id, up.plant_code, up.project_name, up.is_active, up.deleted FROM users_projects up WHERE up.deleted = 0 AND up.user_id = $1;";

exports.getDetailUserProjectZone =
  "SELECT upz.id, p.plant_code, p.project_name, z.zone_name, upz.is_active, upz.deleted FROM [UserManagement].[dbo].[user_project_zone] upz INNER JOIN [e_logistic].[dbo].[project] p ON upz.plant_code = p.plant_code INNER JOIN [e_logistic].[dbo].[zone] z ON upz.zone_id = z.id WHERE upz.deleted = 0 AND p.deleted = 0 AND z.deleted = 0 AND upz.user_id = $1;";

exports.getDetailUserProjectZoneArea =
  "SELECT upza.id, p.plant_code, p.project_name, z.zone_name, a.area_name, upza.is_active, upza.deleted FROM user_project_zone_area upza INNER JOIN [e_logistic].[dbo].[project] p ON upza.plant_code = p.plant_code INNER JOIN [e_logistic].[dbo].[zone] z ON upza.zone_id = z.id INNER JOIN [e_logistic].[dbo].[area] a ON upza.area_id = a.id WHERE upza.deleted = 0 AND p.deleted = 0 AND z.deleted = 0 AND a.deleted = 0 AND upza.user_id = $1;";
