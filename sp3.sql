-- function returns all patients in the portal between an input range for age, inclusive
-- commands to call in mysql:
-- cp procdure below into mysql, CALL patientsInRange(15, 20, @out_total); , SELECT @out_total

DROP PROCEDURE IF EXISTS patientsInRange;

DELIMITER //

CREATE PROCEDURE patientsInRange (IN beg_age int(11), IN end_age int(11), OUT list varchar(500))

BEGIN
DECLARE noMoreRow int default 0;
DECLARE name_id varchar(50);
DECLARE patient_age int(11);
DECLARE num INT;

DECLARE cur CURSOR FOR SELECT age, name FROM Basic_Patient_Info;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET noMoreRow = 1;
OPEN cur;

set list = "";
set num = 0;

getList:LOOP
	FETCH cur INTO patient_age, name_id;
	IF (noMoreRow = 1) THEN
		LEAVE getList;
	END IF;
IF patient_age >= beg_age AND patient_age <= end_age then
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