-- phpMyAdmin SQL Dump
-- https://www.phpmyadmin.net/
--
DROP TABLE IF EXISTS Basic_Patient_Info;
DROP TABLE IF EXISTS Employee_Info;
DROP TABLE IF EXISTS Appointments_Table;
DROP TABLE IF EXISTS Insurance;
DROP TABLE IF EXISTS Login_Info;
DROP TABLE IF EXISTS Employee_Accesses;
--
-- Table structure for table `Basic_Patient_Info`
--

CREATE TABLE IF NOT EXISTS `Basic_Patient_Info` (
  `patient_ID` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `age` int(11) NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `gender` varchar(50) NOT NULL,
  `phone_number` BIGINT NOT NULL,
  `address` varchar(50) NOT NULL,
  `current_medication` varchar(50) NOT NULL,
  `underlying_health_condition` varchar(50) NOT NULL,
  `insurance_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `Basic_Patient_Info`
  ADD PRIMARY KEY (`patient_id`);

--
-- Dumping data for table `Employee_Info`
--

CREATE TABLE IF NOT EXISTS `Employee_Info` (
  `employee_ID` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `employee_type` varchar(50) NOT NULL,
  `office_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `Employee_Info`
  ADD PRIMARY KEY (`employee_ID`);

--
-- Dumping data for table `Appointments_Table`
--

CREATE TABLE IF NOT EXISTS `Appointments_Table` (
  `appointment_ID` int(11) NOT NULL,
  `employee_ID` int(11) NOT NULL,
  `patient_ID` int(11) NOT NULL,
  `symptoms` varchar(50) NOT NULL,
  `treatment` varchar(50) NOT NULL,
  `appointment_time` DATETIME NOT NULL,
  `doctor_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `Appointments_Table`
  ADD PRIMARY KEY (`appointment_ID`);

--
-- Dumping data for table `Insurance`
--

CREATE TABLE IF NOT EXISTS `Insurance` (
  `insurance_ID` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `company_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `Insurance`
  ADD PRIMARY KEY (`insurance_ID`);

--
-- Dumping data for table `Login_Info`
--

CREATE TABLE IF NOT EXISTS `Login_Info` (
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `type_of_user` varchar(50) NOT NULL,
  `employee_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `Login_Info`
  ADD PRIMARY KEY (`username`);

--
-- Dumping data for table `Employee_Accesses`
--

CREATE TABLE IF NOT EXISTS `Employee_Accesses` (
  `appointment_time` varchar(50) NOT NULL,
  `access_type` varchar(50) NOT NULL,
  `employee_ID` int(11) NOT NULL,
  `patient_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `Employee_Accesses`
  ADD PRIMARY KEY (`appointment_time`);


INSERT INTO `Basic_Patient_Info` (`patient_ID`, `name`, `age`, `date_of_birth`, `gender`, `phone_number`, `address`, `current_medication`, `underlying_health_condition`, `insurance_ID`) VALUES
(1250, 'Bob', 21, '2000-12-20', 'male', 4087449840, '125 Sesame Street', 'percocet', 'Moderate pain', 1),
(1251, 'Hailey', 12, '2009-08-25', 'female', 6507843840, '332 State Street', 'tylenol', 'none', 2),
(1252, 'Sara', 57, '1964-05-05', 'female', 4056349840, '370 South Street', 'vitamin', 'Iron deficiency', 3),
(1253, 'Anisha', 42, '1979-01-13', 'female', 4087673840, '154 Season Street', 'N/A', 'N/A', 2),
(1254, 'Naya', 33,'1998-02-16', 'female', 4784849840, '384 Saratoga Street', 'N/A', 'N/A', 1),
(1255, 'Gabe', 25, '1996-04-18', 'male', 4087840230, '496 Seeme Street', 'N/A', 'N/A', 1),
(1256, 'Timothy', 17, '2004-07-02', 'male', 4087573840, '204 Sequioa Street', 'N/A', 'N/A', 3);


INSERT INTO `Employee_Info` (`employee_ID`, `name`, `employee_type`, `office_name`) VALUES
(1000, 'Aarushi', 'doctor', 'A'),
(1001, 'Khushi', 'receptionist', 'A'),
(1002, 'Miranda', 'doctor', 'B'),
(1003, 'Natasha', 'receptionist', 'B');

INSERT INTO `Appointments_Table` (`appointment_ID`, `employee_ID`, `patient_ID`, `symptoms`, `treatment`, `appointment_time`, `doctor_type`) VALUES
(1, 1000, 1256, 'cough', 'motrin prescribed', '2020-11-21 11:23:43', 'family med'),
(2, 1002, 1254, 'runny nose', 'nasal spray prescribed', '2021-1-19 10:02:56', 'ENT'),
(3, 1000, 1253, 'stomache ache', 'N/A', '2021-11-16 13:07:22', 'gastroenterologist'),
(4, 1002, 1251, 'rash', 'ointment prescribed', '2020-11-03 18:27:24', 'dermatologist');

INSERT INTO `Insurance` (`insurance_ID`, `type`, `company_name`) VALUES
(1, 'health', 'aetna'),
(2, 'dental', 'blue'),
(3, 'health', 'green');
