"use strict";

exports.getRole =
  "SELECT [id] ,[role_code] ,[role_desc] ,[is_active] ,[deleted] FROM [UserManagement].[dbo].[roles] WHERE [deleted] = 0;";

exports.addRole =
  "INSERT INTO roles (role_code, role_desc, created_by, created_date, ip_addr) VALUES ($1, $2, $3, getdate(), $4);";

exports.activateRole =
  "UPDATE roles SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteRole =
  "UPDATE roles SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.updateRole =
  "UPDATE roles SET role_desc = $1, updated_by = $2, updated_date = getdate(), ip_addr = $3 WHERE id = $4;";

exports.getRoleJobByJobId =
  "SELECT rj.id, j.job_desc, r.role_code, r.role_desc, rj.is_active, rj.deleted FROM roles_jobs rj INNER JOIN roles r ON r.id = rj.role_id INNER JOIN jobs j ON j.id = rj.job_id WHERE rj.deleted = 0 AND j.deleted = 0 AND r.deleted = 0 AND r.id = $1;";

exports.addRoleJob =
  "INSERT INTO [dbo].[roles_jobs] ([role_id] ,[job_id] ,[created_by] ,[ip_addr]) VALUES ($1 ,$2 ,$3 ,$4);";

exports.activateRoleJob =
  "UPDATE roles_jobs SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteRoleJob =
  "UPDATE roles_jobs SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";
