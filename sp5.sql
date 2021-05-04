-- Stored procedure skeleton. Returns the number of patients currently taking medication
-- commands to call in mysql:
-- cp procdure below into mysql, CALL getNum_on_Medication(@out_total); , SELECT @out_total;

DROP PROCEDURE IF EXISTS getNum_on_Medication;

DELIMITER //

CREATE PROCEDURE getNum_on_Medication (OUT total INT)

BEGIN
SELECT COUNT(*)
INTO total
FROM Basic_Patient_Info
WHERE current_medication != 'N/A';

END //
DELIMITER ;
