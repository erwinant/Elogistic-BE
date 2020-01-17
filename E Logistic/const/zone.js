"use strict";

exports.addZone =
  "INSERT INTO [dbo].[zone] ([zone_name] ,[created_by] ,[ip_addr]) VALUES ($1 ,$2 ,$3);";

exports.getZone =
  "SELECT id, zone_name, is_active, deleted FROM zone WHERE deleted = 0;";

exports.getZoneByProject =
  "SELECT b.id,b.zone_name FROM [e_logistic].[dbo].[map_project_zone] a INNER JOIN [e_logistic].[dbo].[zone] b ON a.zone_id = b.id INNER JOIN [e_logistic].[dbo].[project] c ON a.project_id = c.id WHERE a.is_active = 1 AND a.deleted = 0 AND b.is_active = 1 AND b.deleted = 0 AND c.plant_code = $1;";

exports.activatedZone =
  "UPDATE zone SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteZone =
  "UPDATE zone SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.updateZone =
  "UPDATE zone SET zone_name = $1, updated_by = $2, updated_date = getdate(), ip_addr = $3 WHERE id = $4;";

exports.activatedZoneProject =
  "UPDATE map_project_zone SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteZoneProject =
  "UPDATE map_project_zone SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.addZoneProject =
  "INSERT INTO [dbo].[map_project_zone] ([project_id] ,[zone_id] ,[created_by] ,[ip_addr]) VALUES ($1 ,$2 ,$3 ,$4);";

exports.getZoneByProjectId =
  "SELECT b.id, b.zone_name, b.is_active, b.deleted FROM map_project_zone a INNER JOIN zone b ON a.zone_id = b.id WHERE a.deleted = 0 AND b.deleted = 0 AND a.project_id = $1;";
