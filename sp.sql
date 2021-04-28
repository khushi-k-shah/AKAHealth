-- Stored procedure skeleton. Write your code here and then submit to Brightspace.
-- commands to call in mysql:
-- cp procdure below into mysql, CALL getDeptNum('doctor', @out_total); , SELECT @out_total

DROP PROCEDURE IF EXISTS getDeptNum;

DELIMITER //

CREATE PROCEDURE getDeptNum (IN dept VARCHAR(50), OUT total INT)

BEGIN
SELECT COUNT(*)
INTO total
FROM Employee_Info
WHERE employee_type = dept;

END //
DELIMITER ;
