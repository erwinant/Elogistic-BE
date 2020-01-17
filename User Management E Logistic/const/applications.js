"use strict";

exports.getApplication =
  "SELECT [id] ,[application_name] ,[application_type] ,[parent_id] ,[application_id] ,[is_active] ,[deleted] FROM [UserManagement].[dbo].[applications] WHERE [deleted] = 0 AND [application_type] = 1;";

exports.addApplication =
  "INSERT INTO applications (application_name, application_type, created_by, created_date, ip_addr) VALUES ($1, $2, $3, getdate(), $4);";

exports.updateApplication =
  "UPDATE applications SET application_name = $1, updated_by = $2, updated_date = getdate(), ip_addr = $3 WHERE id = $4;";

exports.getApplicationById =
  "SELECT id, application_name, route, icon, application_type, parent_id, application_id, is_active, deleted FROM applications WHERE deleted = 0 AND application_id = $1;";

exports.addApplicationMenu =
  "INSERT INTO applications (application_name, application_type, parent_id, application_id, route, icon, created_by, ip_addr) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);";

exports.activateApp =
  "UPDATE applications SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteApp =
  "UPDATE applications SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.updateApplicationMenu =
  "UPDATE applications SET application_name = $1, route = $2, icon = $3, updated_by = $4, ip_addr = $5, updated_date = GETDATE() WHERE id = $6;";

exports.getApplicationRoleById =
  "SELECT ar.id, r.role_code, r.role_desc, ar.is_active, ar.deleted FROM applications_roles ar INNER JOIN roles r on ar.role_id = r.id WHERE ar.deleted = 0 AND ar.application_id = $1;";

exports.addApplicationRole =
  "INSERT INTO [dbo].[applications_roles] ([application_id] ,[role_id] ,[created_by] ,[ip_addr]) VALUES ($1 ,$2 ,$3 ,$4);";

exports.activateAppRole =
  "UPDATE applications_roles SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteAppRole =
  "UPDATE applications_roles SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";
