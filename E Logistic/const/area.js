"use strict";

exports.addArea =
  "INSERT INTO [dbo].[area] ([area_name] ,[created_by] ,[ip_addr]) VALUES ($1 ,$2 ,$3);";

exports.getAreaByProjectZone =
  "SELECT b.id,b.area_name FROM [e_logistic].[dbo].[map_project_zone_area] a INNER JOIN [e_logistic].[dbo].[area] b ON a.area_id = b.id INNER JOIN [e_logistic].[dbo].[project] c ON a.project_id = c.id WHERE a.is_active = 1 AND a.deleted = 0 AND b.is_active = 1 AND b.deleted = 0 AND c.plant_code = $1 AND a.zone_id = $2;";

exports.getArea =
  "SELECT id, area_name, is_active, deleted FROM area WHERE deleted = 0;";

exports.activateArea =
  "UPDATE area SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteArea =
  "UPDATE area SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.updateArea =
  "UPDATE area SET area_name = $1, updated_by = $2, updated_date = getdate(), ip_addr = $3 WHERE id = $4;";

exports.getAreaById =
  "SELECT a.id, a.project_id, b.plant_code, b.project_name, a.zone_id, c.zone_name, a.area_id, d.area_name, a.is_active, a.deleted FROM map_project_zone_area a INNER JOIN project b on a.project_id = b.id INNER JOIN zone c on a.zone_id = c.id INNER JOIN area d on a.area_id = d.id WHERE a.deleted = 0 AND b.deleted = 0 AND c.deleted = 0 AND d.deleted = 0 AND a.area_id = $1;";

exports.activateMapAreaProjectZone =
  "UPDATE map_project_zone_area SET is_active = $1,updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";

exports.deleteMapAreaProjectZone =
  "UPDATE map_project_zone_area SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.addAreaProjectZone =
  "INSERT INTO [dbo].[map_project_zone_area] ([project_id] ,[zone_id] ,[area_id] ,[created_by] ,[ip_addr]) VALUES ($1 ,$2 ,$3 ,$4 ,$5);";
