"use strict";

exports.getMaterialByProject =
  "SELECT A.project_id, B.material_code, B.material_desc, CASE WHEN D.UNRESTRICTED IS NULL THEN 0 ELSE D.UNRESTRICTED END unrestricted , B.base_unit_of_measure, C.storage_location_desc, C.storage_location_code FROM MAP_MATERIAL_PROJECT_STORAGE_LOCATION A INNER JOIN project p ON A.project_id = p.id INNER JOIN MATERIAL B ON A.MATERIAL_ID = B.ID LEFT JOIN MAP_PROJECT_STORAGE_LOCATION C ON A.PROJECT_ID = C.PROJECT_ID AND A.STORAGE_LOCATION_CODE = C.STORAGE_LOCATION_CODE LEFT JOIN STOCK_BALANCE D ON A.MATERIAL_ID = D.MATERIAL_ID AND A.PROJECT_ID = D.PROJECT_ID AND A.STORAGE_LOCATION_CODE = D.STORAGE_LOCATION_CODE WHERE p.plant_code = $1 AND B.MATERIAL_DESC LIKE CONCAT($2,'%') ORDER BY D.unrestricted DESC,  B.material_desc ASC";

exports.getMaterialByProjectAndSloc =
  "SELECT d.project_id, p.project_name , B.material_code, B.material_desc, CASE WHEN D.UNRESTRICTED IS NULL THEN 0 ELSE D.UNRESTRICTED END unrestricted, B.base_unit_of_measure, C.storage_location_desc, C.storage_location_code FROM stock_balance D INNER JOIN material b ON d.material_id = b.id INNER JOIN project p ON d.project_id = p.id LEFT JOIN MAP_PROJECT_STORAGE_LOCATION c ON d.storage_location_code = c.storage_location_code WHERE p.id = $1 AND C.storage_location_code = $2 GROUP BY d.project_id, p.project_name , B.material_code, B.material_desc,D.UNRESTRICTED ,B.base_unit_of_measure, C.storage_location_desc, C.storage_location_code ORDER BY D.unrestricted DESC,  B.material_desc ASC;";

exports.getLastUpdateStock =
  "SELECT MAX(createdAt) last_update_stock FROM StgStockBalances";

exports.getSlocProject =
  "SELECT a.id, a.project_id, b.plant_code, b.project_name, a.storage_location_code, a.storage_location_desc FROM map_project_storage_location a INNER JOIN project b on a.project_id = b.id WHERE a.deleted = 0 AND b.deleted = 0";

exports.getSlocProjectByProjectId =
  "SELECT a.id, a.project_id, b.plant_code, b.project_name, a.storage_location_code, a.storage_location_desc FROM map_project_storage_location a INNER JOIN project b on a.project_id = b.id WHERE a.deleted = 0 AND b.deleted = 0 AND a.project_id = $1";

exports.reportOutgoingMaterial =
  "SELECT P.project_name, TOD.material_name, count(TOD.material_name) order_quantity, sum(TDD.quantity) order_amount FROM tr_delivery_d TDD INNER JOIN tr_order_d TOD ON TDD.tr_order_d_id = TOD.ID INNER JOIN tr_order TOR ON TOD.tr_order_id = TOR.ID INNER JOIN project P ON TOR.project_id = P.id WHERE TDD.delivery_status = 3 AND P.plant_code = $1 AND CONVERT(varchar,TDD.created_date,23) BETWEEN $2 AND $3 GROUP BY P.project_name, TOD.material_name ORDER BY order_amount DESC;";

exports.top10OutgoingMaterialByQuantity =
  "SELECT TOP (10) TOD.material_name name, count(TOD.material_name) value FROM tr_delivery_d TDD INNER JOIN tr_order_d TOD ON TDD.tr_order_d_id = TOD.ID INNER JOIN tr_order TOR ON TOD.tr_order_id = TOR.ID INNER JOIN project P ON TOR.project_id = P.id WHERE TDD.delivery_status = 3 AND P.plant_code = $1 AND CONVERT(varchar,TDD.created_date,23) BETWEEN $2 AND $3 GROUP BY TOD.material_name ORDER BY value DESC;";

exports.top10OutgoingMaterialByOrderAmount =
  "SELECT TOP (10) TOD.material_name name, SUM(TDD.quantity) value FROM tr_delivery_d TDD INNER JOIN tr_order_d TOD ON TDD.tr_order_d_id = TOD.ID INNER JOIN tr_order TOR ON TOD.tr_order_id = TOR.ID INNER JOIN project P ON TOR.project_id = P.id WHERE TDD.delivery_status = 3 AND P.plant_code = $1 AND CONVERT(varchar,TDD.created_date,23) BETWEEN $2 AND $3 GROUP BY TOD.material_name ORDER BY value DESC;";

exports.reportEmptyStock =
  "SELECT c.project_name, b.material_name, count(b.material_name) order_quantity , sum(b.quantity) order_amount FROM tr_order a INNER JOIN tr_order_d b ON a.id = b.tr_order_id INNER JOIN project c ON a.project_id = c.id WHERE b.status = 2 AND b.stock = 1 AND c.plant_code = $1 AND CONVERT(varchar,b.created_date,23) BETWEEN $2 AND $3 GROUP BY c.project_name, b.material_name ORDER BY order_amount DESC;";

exports.top10EmptyStockByQuantity =
  "SELECT TOP (10) b.material_name name, count(b.material_name) value FROM tr_order a INNER JOIN tr_order_d b ON a.id = b.tr_order_id INNER JOIN project c ON a.project_id = c.id WHERE b.status = 2 AND b.stock = 1 AND c.plant_code = $1 AND CONVERT(varchar,b.created_date,23) BETWEEN $2 AND $3 GROUP BY b.material_name ORDER BY value DESC;";

exports.top10EmptyStockByOrderAmount =
  "SELECT TOP (10) b.material_name name, sum(b.quantity) value FROM tr_order a INNER JOIN tr_order_d b ON a.id = b.tr_order_id INNER JOIN project c ON a.project_id = c.id WHERE b.status = 2 AND b.stock = 1 AND c.plant_code = $1 AND CONVERT(varchar,b.created_date,23) BETWEEN $2 AND $3 GROUP BY b.material_name ORDER BY value DESC;";

exports.reportRequestOrder =
  "SELECT c.project_name projectName, a.order_no orderNo, a.created_by requestBy, d.status_name statusName, COUNT(b.material_name) materialAmount, FORMAT(a.order_date,'dd MMM yyyy HH:mm') orderDate, FORMAT(appr.created_date,'dd MMM yyyy HH:mm') approvalDate, CAST(DATEDIFF(HOUR,a.order_date,appr.created_date) as varchar) + ' Jam ' + CAST(DATEDIFF(MINUTE,a.order_date,appr.created_date)%60 as varchar) + ' Menit' prosesTime, appr.created_by approvalBy, FORMAT(pckg.created_date,'dd MMM yyyy HH:mm') packingDate, CAST(DATEDIFF(HOUR,appr.created_date,pckg.created_date) as varchar) + ' Jam ' + CAST(DATEDIFF(MINUTE,appr.created_date,pckg.created_date)%60 as varchar) + ' Menit' prosesTime2, pckg.created_by packingBy, FORMAT(dlvr.created_date,'dd MMM yyyy HH:mm') deliveryDate, CAST(DATEDIFF(HOUR,pckg.created_date,dlvr.created_date) as varchar) + ' Jam ' + CAST(DATEDIFF(MINUTE,pckg.created_date,dlvr.created_date)%60 as varchar) + ' Menit' prosesTime3, dlvr.created_by deliveryBy, FORMAT(rciv.created_date,'dd MMM yyyy HH:mm') recieveDate, CAST(DATEDIFF(HOUR,dlvr.created_date,rciv.created_date) as varchar) + ' Jam ' + CAST(DATEDIFF(MINUTE,dlvr.created_date,rciv.created_date)%60 as varchar) + ' Menit' prosesTime4, rciv.created_by recieveBy, FORMAT(rjct.created_date,'dd MMM yyyy HH:mm') rejectDate, CAST(DATEDIFF(HOUR,a.order_date,rjct.created_date) as varchar) + ' Jam ' + CAST(DATEDIFF(MINUTE,a.order_date,rjct.created_date)%60 as varchar) + ' Menit' prosesTime5, rjct.created_by rejectBy, FORMAT(rjct2.created_date,'dd MMM yyyy HH:mm') rejectLogisticDate, CAST(DATEDIFF(HOUR,appr.created_date,rjct2.created_date) as varchar) + ' Jam ' + CAST(DATEDIFF(MINUTE,appr.created_date,rjct2.created_date)%60 as varchar) + ' Menit' prosesTime6, rjct2.created_by rejectLogisticBy FROM tr_order a INNER JOIN tr_order_d b ON a.id = b.tr_order_id INNER JOIN project c ON a.project_id = c.id INNER JOIN proses_status d ON a.order_status = d.status_id LEFT JOIN prosess_history appr ON a.id = appr.order_id AND appr.status_id = 2 LEFT JOIN prosess_history pckg ON a.id = pckg.order_id AND pckg.status_id = 3 LEFT JOIN prosess_history dlvr ON a.id = dlvr.order_id AND dlvr.status_id = 4 LEFT JOIN prosess_history rciv ON a.id = rciv.order_id AND rciv.status_id = 5 LEFT JOIN prosess_history rjct ON a.id = rjct.order_id AND rjct.status_id = 6 LEFT JOIN prosess_history rjct2 ON a.id = rjct2.order_id AND rjct2.status_id = 7 WHERE c.plant_code = $1 AND CONVERT(varchar,a.order_date,23) >= $2 AND CONVERT(varchar,a.order_date,23) <= $3 GROUP BY c.project_name,a.order_no, a.created_by, a.order_date, d.status_name, appr.created_date, appr.created_by, pckg.created_date, pckg.created_by, dlvr.created_date, dlvr.created_by, rciv.created_date, rciv.created_by, rjct.created_date, rjct.created_by, rjct2.created_date, rjct2.created_by ORDER BY a.order_date DESC;";

exports.vBarChartReportRequestOrder =
  "WITH mycte AS ( SELECT CAST($1 AS DATETIME) DateValue UNION ALL SELECT  DateValue + 1 FROM    mycte WHERE   DateValue + 1 <= $2 )  SELECT  FORMAT(d.DateValue,'dd MMM yyyy') name,COUNT(a.order_no)value,FORMAT(d.DateValue,'yyyy-MM-dd') FROM    mycte d LEFT JOIN tr_order a on FORMAT(d.DateValue,'dd MMM yyyy') = FORMAT(a.order_date,'dd MMM yyyy') AND CONVERT(varchar,a.order_date,23) >= $3 AND CONVERT(varchar,a.order_date,23) <= $4 LEFT join project c on a.project_id = c.id AND c.plant_code = $5 group by FORMAT(d.DateValue,'dd MMM yyyy'),FORMAT(d.DateValue,'yyyy-MM-dd') order by FORMAT(d.DateValue,'yyyy-MM-dd') ASC;";

exports.getMaterialForElastic =
  "SELECT P.PLANT_CODE, A.PROJECT_ID, B.ID MATERIAL_ID, B.MATERIAL_CODE, B.MATERIAL_DESC, B.BASE_UNIT_OF_MEASURE, A.STORAGE_LOCATION_CODE, C.STORAGE_LOCATION_DESC FROM MAP_MATERIAL_PROJECT_STORAGE_LOCATION A INNER JOIN PROJECT P ON A.PROJECT_ID = P.ID INNER JOIN MATERIAL B ON A.MATERIAL_ID = B.ID LEFT JOIN MAP_PROJECT_STORAGE_LOCATION C ON A.PROJECT_ID = C.PROJECT_ID AND A.STORAGE_LOCATION_CODE = C.STORAGE_LOCATION_CODE ORDER BY  B.MATERIAL_DESC ASC";

exports.countStockMaterial =
  "SELECT CASE WHEN B.UNRESTRICTED IS NULL THEN 0 ELSE B.UNRESTRICTED END COUNTSTOCK FROM MAP_MATERIAL_PROJECT_STORAGE_LOCATION A LEFT JOIN STOCK_BALANCE B ON A.PROJECT_ID = B.PROJECT_ID AND A.MATERIAL_ID = B.MATERIAL_ID AND A.STORAGE_LOCATION_CODE = B.STORAGE_LOCATION_CODE WHERE A.PROJECT_ID = $1 AND A.MATERIAL_ID = $2 AND A.STORAGE_LOCATION_CODE = $3";

exports.hasNotBeenSent =
  "SELECT tod.material_code, tod.material_name, SUM(tod.quantity)quantity, SUM(tod.quantity_shipping)quantity_shipping FROM tr_order_d tod WHERE tod.status = 2 AND tod.stock <> 1 AND tod.quantity_shipping < tod.quantity AND tod.created_by = $1 AND tod.material_code = $2 GROUP BY tod.material_code, tod.material_name;";

exports.reportMaterialRecieve =
  "SELECT " +
  "tdr.order_no OrderNo " +
  ",p.project_name Project " +
  ",z.zone_name Zona " +
  ",a.area_name Area " +
  ",tdr.created_by Requestor " +
  ",tdr.description Description " +
  ",m.material_desc MaterialName " +
  ",tdrd.quantity QuantityOrder " +
  ",tdlvd.quantity Quantity " +
  ",trod.recieve_note RecieveNote " +
  ",tdlvd.delivery_by DeliveryBy " +
  ",FORMAT(trod.created_date,'dd MMM yyyy HH:mm') DeliveryDate " +
  ",FORMAT(trod.updated_date,'dd MMM yyyy HH:mm') RecieveDate " +
  "FROM tr_order tdr " +
  "INNER JOIN tr_order_d tdrd ON tdr.id = tdrd.tr_order_id " +
  "INNER JOIN tr_delivery_d tdlvd ON tdrd.id = tdlvd.tr_order_d_id " +
  "INNER JOIN tr_recieve_order_d trod ON trod.tr_delivery_d_id = tdlvd.id " +
  "INNER JOIN project p ON tdr.project_id = p.id " +
  "INNER JOIN zone z ON tdr.zone_id = z.id " +
  "INNER JOIN area a ON tdr.area_id = a.id " +
  "INNER JOIN material m ON tdrd.material_code = m.material_code " +
  "WHERE trod.status = 2 " +
  "AND CONVERT(varchar,trod.updated_date,23) BETWEEN $1 AND $2 " +
  "AND p.plant_code = $3;";
