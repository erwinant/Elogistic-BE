"use strict";

exports.getProjects =
  "SELECT [id] ,[project_name] ,[project_status] ,[plant_code] FROM [e_logistic].[dbo].[project] WHERE [deleted] = 0 AND [is_active] = 1 ORDER by [project_name] ASC;";
