-- function returns doctors that have an appointment history of skills required (doctor_type)
-- commands to call in mysql:
-- cp procdure below into mysql, CALL getDocType('gastroenterologist', @out_total); , SELECT @out_total

DROP PROCEDURE IF EXISTS getDocType;

DELIMITER //

CREATE PROCEDURE getDocType (IN doc_type VARCHAR(50), OUT list varchar(500))

BEGIN
DECLARE noMoreRow int default 0;
DECLARE d_type varchar(50);
DECLARE name_id varchar(50);
DECLARE id int(11);
DECLARE num INT;

DECLARE cur CURSOR FOR SELECT a.employee_ID, a.doctor_type, b.name FROM Employee_Info b JOIN Appointments_Table a where a.employee_ID = b.employee_ID;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET noMoreRow = 1;
OPEN cur;

set list = "";
set num = 0;

getList:LOOP
	FETCH cur INTO id, d_type, name_id;
	IF (noMoreRow = 1) THEN
		LEAVE getList;
	END IF;
IF d_type = doc_type then
IF num = 0 then
set list = CONCAT(list, name_id);
ELSE
set list = CONCAT(list,", ", name_id);
END IF;
SET num = num + 1;
END IF;

END LOOP getList;
CLOSE cur;

END //
DELIMITER ;