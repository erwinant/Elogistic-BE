"use strict";

exports.getJob =
  "SELECT [id] ,[job_code] ,[job_desc] ,[is_active] ,[deleted] FROM [UserManagement].[dbo].[jobs] WHERE [deleted] = 0;";

exports.addJob =
  "INSERT INTO jobs (job_code, job_desc, created_by, created_date, ip_addr) VALUES ($1, $2, $3, getdate(), $4);";

exports.updateJob =
  "UPDATE jobs SET job_desc = $1, updated_by = $2, updated_date = getdate(), ip_addr = $3 WHERE id = $4;";

exports.activateJob =
  "UPDATE jobs SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteJob =
  "UPDATE jobs SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.getUserJobByJobId =
  "SELECT uj.id, u.username, j.job_code, j.job_desc, uj.is_active, uj.deleted FROM users_jobs uj INNER JOIN jobs j ON j.id = uj.job_id INNER JOIN users u ON u.id = uj.user_id WHERE uj.deleted = 0 AND j.deleted = 0 AND u.deleted = 0 AND j.id = $1;";

exports.addUserJob =
  "INSERT INTO [dbo].[users_jobs] ([user_id] ,[job_id] ,[created_by] ,[ip_addr]) VALUES ($1 ,$2 ,$3 ,$4);";

exports.activateUserJob =
  "UPDATE users_jobs SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteUserJob =
  "UPDATE users_jobs SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";
