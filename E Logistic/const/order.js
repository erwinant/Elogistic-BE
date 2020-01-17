"use strict";

exports.countOutstandingRecieveOrder =
  "SELECT count(1) countOrderNotRecieve FROM tr_recieve_order tro INNER JOIN tr_recieve_order_d trd on tro.id = trd.tr_recieve_order_id INNER JOIN tr_delivery td ON tro.tr_delivery_id = td.id INNER JOIN tr_order tor ON td.tr_order_id = tor.id WHERE trd.status = 1 AND tor.created_by = $1;";

exports.getOrderNo =
  "SELECT CASE WHEN MAX(ORDER_NO) IS NULL THEN 'EL/'+convert(varchar, getdate(), 3)+'/000001' ELSE CASE WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6)))+1) = 1 THEN 'EL/'+ convert(varchar, getdate(), 3) + '/' + '00000' + CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6))) +1) WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6)))+1) = 2 THEN 'EL/'+ convert(varchar, getdate(), 3) + '/' + '0000' + CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6))) +1) WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6)))+1) = 3 THEN 'EL/'+ convert(varchar, getdate(), 3) + '/' + '000' + CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6))) +1) WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6)))+1) = 4 THEN 'EL/'+ convert(varchar, getdate(), 3) + '/' + '00' + CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6))) +1) WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6)))+1) = 5 THEN 'EL/'+ convert(varchar, getdate(), 3) + '/' + '0' + CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6))) +1) WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6)))+1) = 6 THEN 'EL/'+ convert(varchar, getdate(), 3) + '/' + CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.order_no,13,6))) +1) END END order_no FROM tr_order a WHERE SUBSTRING(a.order_no,4,8) = convert(varchar, getdate(), 3);";

exports.insertIntoTrOrder =
  "INSERT INTO [dbo].[tr_order] ([order_no] ,[order_date] ,[project_id] ,[zone_id] ,[area_id] ,[no_reservasi], [description], [created_by] ,[ip_addr]) VALUES ($1 ,getdate() ,(SELECT id FROM project where plant_code = $2) ,$3 ,$4 ,(SELECT CASE WHEN MAX(a.no_reservasi) IS NULL THEN '000001' ELSE CASE WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6)))+1) = 1 THEN '00000' + CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6))) +1) WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6)))+1) = 2 THEN '0000' + CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6))) +1) WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6)))+1) = 3 THEN '000' + CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6))) +1) WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6)))+1) = 4 THEN '00' + CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6))) +1) WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6)))+1) = 5 THEN '0' + CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6))) +1) WHEN LEN(CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6)))+1) = 6 THEN CONVERT(VARCHAR,CONVERT(INT,MAX(SUBSTRING(a.no_reservasi,1,6))) +1) END END no_reservasi FROM tr_order a INNER JOIN project b ON a.project_id = b.id WHERE FORMAT(a.order_date,'yyyy-MM-dd') = FORMAT(getdate(),'yyyy-MM-dd') AND b.plant_code = $5) ,$6 ,$7, $8);";

exports.insertIntoTrOrderD =
  "INSERT INTO [dbo].[tr_order_d] ([tr_order_id] ,[material_code] ,[material_name] ,[quantity] ,[storage_location_code] ,[storage_location_desc] ,[description] ,[last_hour_meter] ,[status] ,[created_by] ,[ip_addr]) VALUES ( (SELECT id FROM tr_order WHERE order_no = $1 AND created_by = $2 and ip_addr = $3) ,$4 ,$5 ,$6 ,$7 ,$8 , $9 ,$10 ,$11 ,$12, $13);";

exports.getOrderByProject =
  "SELECT a.id, a.order_no, a.created_by, a.no_reservasi, b.plant_code, b.project_name, c.zone_name, d.area_name, 0 panel_state FROM [e_logistic].[dbo].[tr_order] a INNER JOIN [e_logistic].[dbo].[project] b on a.project_id = b.id INNER JOIN [e_logistic].[dbo].[zone] c on a.zone_id = c.id INNER JOIN [e_logistic].[dbo].[area] d on a.area_id = d.id WHERE a.order_status = 1 AND b.plant_code = $1 AND c.id = $2";

exports.trackingOrderByProjectId =
  "SELECT ps.status_name, CASE WHEN ph.status_id = 1 THEN 'Pemesanan material ' + ph.created_by + ' (SPV)' WHEN ph.status_id = 2 THEN 'Disetujui oleh ' + ph.created_by + ' (SM)' WHEN ph.status_id = 3 THEN 'Menyipkan material' WHEN ph.status_id = 4 THEN 'Material sedang dikirim ' + ph.delivery_by WHEN ph.status_id = 5 THEN 'Material diterima ' + ph.created_by + ' (SPV)' ELSE ps.status_name +' by ' + ph.created_by END process_desc, FORMAT(ph.created_date, 'ddd MMM dd yyyy hh:mm:ss') created_date FROM prosess_history ph inner join proses_status ps on ph.status_id = ps.status_id WHERE ph.order_id = $1 ORDER by ph.created_date desc;";

//remove pick_up_by_here
exports.getHistoryOrder =
  "SELECT a.id, a.order_no, a.created_by, FORMAT(a.created_date,'dd MMMM yyyy') created_date, a.no_reservasi, b.project_name, c.zone_name, d.area_name, a.order_status, 0 panel_state, count(e.id) count_print, COALESCE(appr.created_by,'-') approve_by, COALESCE(FORMAT(appr.created_date,'dd MMMM yyyy'),'-') approve_date, COALESCE(dlvr.created_by,'-') hand_over_by, COALESCE(FORMAT(dlvr.created_date,'dd MMMM yyyy'),'-') hand_over_date, '' pick_up_by, COALESCE(FORMAT(dlvr.created_date,'dd MMMM yyyy'),'-') pick_up_date, a.description FROM [e_logistic].[dbo].[tr_order] a INNER JOIN [e_logistic].[dbo].[project] b on a.project_id = b.id INNER JOIN [e_logistic].[dbo].[zone] c on a.zone_id = c.id INNER JOIN [e_logistic].[dbo].[area] d on a.area_id = d.id LEFT JOIN [e_logistic].[dbo].[tr_history_print] e on a.id = e.order_id LEFT JOIN [e_logistic].[dbo].[prosess_history] appr on a.id = appr.order_id and appr.status_id in (2,6) LEFT JOIN [e_logistic].[dbo].[tr_delivery] dlvr on a.id = dlvr.tr_order_id WHERE a.id IN (SELECT order_id FROM prosess_history WHERE created_by = $1) AND CONVERT(varchar,a.order_date,23) >= $2 AND CONVERT(varchar,a.order_date,23) <= $3 GROUP BY a.id, a.order_no, a.created_by, FORMAT(a.created_date,'dd MMMM yyyy'), a.no_reservasi, b.project_name, c.zone_name, d.area_name, a.order_status,appr.created_by, dlvr.created_by,FORMAT(appr.created_date,'dd MMMM yyyy'),FORMAT(dlvr.created_date,'dd MMMM yyyy'), a.description ORDER BY a.created_by desc;";

exports.getHistoryOrderByOrderId =
  "SELECT a.id, a.order_no, a.created_by, FORMAT(a.created_date,'dd MMMM yyyy') created_date, a.no_reservasi, b.project_name, c.zone_name, d.area_name, a.order_status, 0 panel_state, count(e.id) count_print, COALESCE(appr.created_by,'-') approve_by, COALESCE(FORMAT(appr.created_date,'dd MMMM yyyy'),'-') approve_date, COALESCE(dlvr.created_by,'-') hand_over_by, COALESCE(FORMAT(dlvr.created_date,'dd MMMM yyyy'),'-') hand_over_date, '' pick_up_by, COALESCE(FORMAT(dlvr.created_date,'dd MMMM yyyy'),'-') pick_up_date FROM [e_logistic].[dbo].[tr_order] a INNER JOIN [e_logistic].[dbo].[project] b on a.project_id = b.id INNER JOIN [e_logistic].[dbo].[zone] c on a.zone_id = c.id INNER JOIN [e_logistic].[dbo].[area] d on a.area_id = d.id LEFT JOIN [e_logistic].[dbo].[tr_history_print] e on a.id = e.order_id LEFT JOIN [e_logistic].[dbo].[prosess_history] appr on a.id = appr.order_id and appr.status_id in (2,6) LEFT JOIN [e_logistic].[dbo].[tr_delivery] dlvr on a.id = dlvr.tr_order_id WHERE a.id = $1 GROUP BY a.id, a.order_no, a.created_by, FORMAT(a.created_date,'dd MMMM yyyy'), a.no_reservasi, b.project_name, c.zone_name, d.area_name, a.order_status,appr.created_by, dlvr.created_by,FORMAT(appr.created_date,'dd MMMM yyyy'),FORMAT(dlvr.created_date,'dd MMMM yyyy') ORDER BY a.created_by desc;";
//end remove pick_up_by_here

exports.getPackingOrderByProject =
  "SELECT DISTINCT a.id, a.order_no, a.created_by, a.no_reservasi, b.project_name, c.zone_name, d.area_name, 0 panel_state, a.order_status, 0 tr_delivery_id FROM [e_logistic].[dbo].[tr_order] a INNER JOIN [e_logistic].[dbo].[project] b on a.project_id = b.id INNER JOIN [e_logistic].[dbo].[zone] c on a.zone_id = c.id INNER JOIN [e_logistic].[dbo].[area] d on a.area_id = d.id WHERE a.order_status = 2 AND  b.plant_code = $1 UNION SELECT DISTINCT a.id, a.order_no, a.created_by, a.no_reservasi, b.project_name, c.zone_name, d.area_name, 0 panel_state, a.order_status, td.id FROM tr_delivery td INNER JOIN tr_delivery_d tdd ON td.id = tdd.tr_delivery_id INNER JOIN tr_order a ON td.tr_order_id = a.id INNER JOIN tr_order_d tod ON tdd.tr_order_d_id = tod.id INNER JOIN [e_logistic].[dbo].[project] b on a.project_id = b.id INNER JOIN [e_logistic].[dbo].[zone] c on a.zone_id = c.id INNER JOIN [e_logistic].[dbo].[area] d on a.area_id = d.id WHERE td.status = 1 AND tdd.delivery_status IN (1,2) AND a.order_status = 5 AND b.plant_code = $1;";

exports.getOrderByOrderId =
  "SELECT a.id, a.tr_order_id, a.material_code, a.material_name, a.quantity, a.quantity_shipping, 0 quantity_shipping_new, a.description, a.last_hour_meter, a.status, a.approval_notes, b.base_unit_of_measure, a.stock, null no_good_issue, case when c.order_status = 1 then '-' else case when a.status = 1 then 'Reject' else 'Approve' end end reject_status, c.created_by FROM tr_order_d a inner join material b on a.material_code = b.material_code inner join tr_order c on a.tr_order_id = c.id WHERE a.tr_order_id = $1;";

exports.getGINo =
  "SELECT DISTINCT tdd.no_good_issue FROM tr_delivery_d tdd INNER JOIN tr_delivery td ON tdd.tr_delivery_id = td.id WHERE td.tr_order_id = $1 AND tdd.no_good_issue IS NOT NULL;";

exports.validateBeforeApprove =
  "SELECT count(1) countApprove FROM tr_order WHERE id = $1 AND order_status = $2;";

exports.approveTrOrder =
  "UPDATE tr_order set order_status = $1, updated_by = $2, updated_date = getdate(), ip_addr = $3 WHERE id = $4 AND order_status = $5;";

exports.approveToProsessHistory =
  "INSERT INTO prosess_history(order_id, status_id, created_by, ip_addr) VALUES($1, $2, $3, $4)";

exports.approveTrOrderD =
  "UPDATE tr_order_d SET status = $1, approval_notes = $2, updated_by = $3, updated_date = getdate(),ip_addr = $4 WHERE id = $5 AND status = $6;";

exports.validateBeforePackingProsess =
  "SELECT count(1) countApprove FROM tr_order WHERE id = $1 AND order_status IN (2,5);";

exports.getDeliveryOrder =
  "SELECT DISTINCT a.id, a.order_no, a.created_by, a.no_reservasi, b.project_name, c.zone_name, d.area_name, 0 panel_state,tdd.tr_delivery_id FROM tr_delivery_d tdd INNER JOIN tr_delivery td ON td.id = tdd.tr_delivery_id INNER JOIN tr_order a ON a.id = td.tr_order_id inner join [e_logistic].[dbo].[project] b on a.project_id = b.id inner join [e_logistic].[dbo].[zone] c on a.zone_id = c.id inner join [e_logistic].[dbo].[area] d on a.area_id = d.id WHERE tdd.delivery_status IN (1,2) AND tdd.status = 1 AND b.plant_code = $1 AND tdd.quantity != 0;";

exports.getLocationByProjectId =
  "SELECT DISTINCT storage_location_desc FROM [e_logistic].[dbo].[tr_order_d] where tr_order_id = $1;";

exports.getRecieveOrder =
  "SELECT DISTINCT trod.tr_recieve_order_id, a.order_no, tdd.delivery_by, tdd.delivery_picture,tdd.delivery_picture_2, a.no_reservasi, b.project_name, c.zone_name, d.area_name, 0 panel_state FROM tr_recieve_order_d trod INNER JOIN tr_delivery_d tdd ON trod.tr_delivery_d_id = tdd.id INNER JOIN tr_delivery td ON tdd.tr_delivery_id = td.id INNER JOIN tr_order a ON td.tr_order_id = a.id INNER JOIN project b on a.project_id = b.id INNER JOIN zone c on a.zone_id = c.id INNER JOIN area d on a.area_id = d.id WHERE trod.status = 1 AND a.created_by = $1";

exports.getDetailRecieve =
  "SELECT trod.id, trod.tr_recieve_order_id, trod.tr_delivery_d_id, tdd.tr_delivery_id,tdd.tr_order_d_id,tod.tr_order_id, m.material_desc, tod.stock, tod.quantity, tdd.quantity quantity_shipping, trod.recieve_note, m.base_unit_of_measure, trod.created_by FROM tr_recieve_order tro INNER JOIN tr_recieve_order_d trod ON tro.id = trod.tr_recieve_order_id INNER JOIN tr_delivery_d tdd ON trod.tr_delivery_d_id = tdd.id INNER JOIN tr_order_d tod ON tdd.tr_order_d_id = tod.id INNER JOIN material m ON tod.material_code = m.material_code WHERE trod.status = 1 AND tro.id = $1;";

exports.reportOutstandingRecieve =
  "SELECT p.project_name, tor.order_no, tor.created_by request_by,FORMAT(tor.order_date,'dd-MM-yyyy HH:mm') order_date,FORMAT(trod.created_date,'dd-MM-yyyy HH:mm') delivery_date,DATEDIFF(day,trod.created_date,getdate()) overdue FROM tr_recieve_order_d trod INNER JOIN tr_recieve_order tro ON tro.id = trod.tr_recieve_order_id INNER JOIN tr_delivery td ON td.id = tro.tr_delivery_id INNER JOIN tr_order tor ON tor.id = td.tr_order_id INNER JOIN project p ON p.id = tor.project_id WHERE trod.status = 1 AND p.plant_code = $1;";

exports.printFNPBToProsessHistory =
  "INSERT INTO tr_history_print (order_id,print_by,ip_addr) VALUES ($1,$2,$3);";
