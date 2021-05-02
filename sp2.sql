-- function returns all patients in the portal of a specific gender
-- commands to call in mysql:
-- cp procdure below into mysql, CALL retPatients('male', @out_total); , SELECT @out_total

DROP PROCEDURE IF EXISTS retPatients;

DELIMITER //

CREATE PROCEDURE retPatients (IN gender_type VARCHAR(50), OUT list varchar(500))

BEGIN
DECLARE noMoreRow int default 0;
DECLARE name_id varchar(50);
DECLARE gender_types varchar(50);
DECLARE num INT;

DECLARE cur CURSOR FOR SELECT gender, name FROM Basic_Patient_Info;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET noMoreRow = 1;
OPEN cur;

set list = "";
set num = 0;

getList:LOOP
	FETCH cur INTO gender_types, name_id;
	IF (noMoreRow = 1) THEN
		LEAVE getList;
	END IF;
IF gender_types = gender_type then
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
