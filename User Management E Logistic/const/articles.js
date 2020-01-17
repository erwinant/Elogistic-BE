"use strict";

exports.getArticle =
  "SELECT a.id, a.title, a.description, CONCAT('" +
  process.env.BASE_URL +
  "/images/articles/" +
  "'," +
  "a.image) image, CASE WHEN a.application_id = 0 THEN 'ALL' ELSE app.application_name END application_name FROM articles a LEFT JOIN applications app on a.application_id = app.id WHERE a.is_active = 1 AND a.deleted = 0 AND a.start_date <= CAST(GETDATE() as date) AND a.end_date >= CAST(GETDATE() as date);";

exports.getArticleByAppId =
  "SELECT a.id, a.title, a.description, CONCAT('" +
  process.env.BASE_URL +
  "/images/articles/" +
  "'," +
  "a.image) image FROM articles a  WHERE a.is_active = 1 AND a.deleted = 0 AND a.start_date <= CAST(GETDATE() as date) AND a.end_date >= CAST(GETDATE() as date) AND (a.application_id = 0 OR a.application_id = $1);";

exports.getAllArticle =
  "SELECT a.id, a.title, a.description, a.start_date, a.end_date, CONCAT('" +
  process.env.BASE_URL +
  "/images/articles/" +
  "'," +
  "a.image) image,a.is_active, a.application_id, CASE WHEN a.application_id = 0 THEN 'ALL' ELSE app.application_name END application_name FROM articles a LEFT JOIN applications app on a.application_id = app.id WHERE a.deleted = 0;";

exports.addArticle =
  "INSERT INTO articles(title,description,image,application_id,start_date,end_date,created_by, ip_addr) VALUES($1,$2,$3,$4,$5,$6,$7,$8);";

exports.updateArticle =
  "UPDATE articles SET title = $1, description = $2, image = $3, application_id = $4, start_date = $5, end_date = $6,ip_addr = $7, updated_by = $8, updated_date = getdate() WHERE id = $9;";

exports.deleteArticle =
  "UPDATE articles SET deleted = 1, updated_date = getdate(), updated_by = $1, ip_addr = $2 WHERE id = $3;";

exports.activatedArticle =
  "UPDATE articles SET is_active = $1, updated_by = $2, ip_addr = $3, updated_date = getdate() WHERE id = $4;";
