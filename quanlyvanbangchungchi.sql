-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.19-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.1.0.6116
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for quanlyvanbang
CREATE DATABASE IF NOT EXISTS `quanlyvanbang` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `quanlyvanbang`;

-- Dumping structure for table quanlyvanbang.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `account_username` varchar(12) COLLATE utf8_unicode_ci NOT NULL,
  `account_address` varchar(42) COLLATE utf8_unicode_ci NOT NULL,
  `account_status` varchar(6) COLLATE utf8_unicode_ci NOT NULL,
  `account_password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `account_type` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `student_id` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  `school_id` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`account_username`) USING BTREE,
  UNIQUE KEY `account_address` (`account_address`),
  UNIQUE KEY `student_id` (`student_id`),
  UNIQUE KEY `school_id` (`school_id`),
  CONSTRAINT `FK_accounts_schools` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`),
  CONSTRAINT `FK_accounts_students` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table quanlyvanbang.accounts: ~4 rows (approximately)
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` (`account_username`, `account_address`, `account_status`, `account_password`, `account_type`, `student_id`, `school_id`) VALUES
	('admin', '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79', 'active', '$2b$10$lPH5Gg7KasgUHuYiP75ZUe.5gf/EC999pk.ta7YkSBmT5ONVe/EA6', 'admin', NULL, NULL),
	('asdasd', '', 'active', '', 'school', NULL, 'SCH0003'),
	('ctu', '0x70cE91A72dbE08aaD8766aE09E977d559C13B806', 'active', '$2b$10$4aQm14i7o289c49QdA3Vj.K.Xhpz78s.mwERdrpOfumV9wkdYw4pO', 'school', NULL, 'SCH0001'),
	('thaitruong', '0xe729e45f44ebd8aec64460f1f0ccaa76d5024701', 'active', '$2b$10$4aQm14i7o289c49QdA3Vj.K.Xhpz78s.mwERdrpOfumV9wkdYw4pO', 'student', 'STU0001', NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;

-- Dumping structure for table quanlyvanbang.certificates
CREATE TABLE IF NOT EXISTS `certificates` (
  `number` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Số hiệu',
  `ck_id` int(11) NOT NULL,
  `cn_id` int(11) NOT NULL,
  `school_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `student_id` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  `filename` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Trạng thái',
  `ipfs_hash` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'IPFS',
  `hash` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `createTime` datetime NOT NULL COMMENT 'Ngày tạo file',
  `modifyTime` datetime NOT NULL,
  PRIMARY KEY (`number`) USING BTREE,
  KEY `FK_certificates_certkind` (`ck_id`),
  KEY `FK_certificates_certname` (`cn_id`),
  KEY `FK_certificates_students` (`student_id`),
  KEY `FK_certificates_schools` (`school_id`),
  CONSTRAINT `FK_certificates_certkind` FOREIGN KEY (`ck_id`) REFERENCES `certkind` (`ck_id`),
  CONSTRAINT `FK_certificates_certname` FOREIGN KEY (`cn_id`) REFERENCES `certname` (`cn_id`),
  CONSTRAINT `FK_certificates_schools` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`),
  CONSTRAINT `FK_certificates_students` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table quanlyvanbang.certificates: ~3 rows (approximately)
/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
INSERT INTO `certificates` (`number`, `ck_id`, `cn_id`, `school_id`, `student_id`, `filename`, `status`, `ipfs_hash`, `hash`, `createTime`, `modifyTime`) VALUES
	('1', 2, 7, '', NULL, 'cert_1_1634289552682.json', 'Done', 'QmQuL6CTaJqUxKzMm7UCNaRWWMSUhCVu3ugNPqGEnVCZUJ', '019e728cd09412e77d7e63485409fc8f9453780cdde3ef4d10', '2021-10-15 15:11:38', '2021-10-15 18:17:11'),
	('12', 1, 7, '', NULL, 'cert_12_1634299207574.json', 'CHECKING', NULL, '019e728cd09412e77d7e63485409fc8f9453780cdde3ef4d10', '2021-10-15 19:00:07', '0000-00-00 00:00:00'),
	('2', 1, 7, '', NULL, 'cert_2_1634299407305.json', 'CHECKING', NULL, '019e728cd09412e77d7e63485409fc8f9453780cdde3ef4d10', '2021-10-15 19:03:27', '0000-00-00 00:00:00');
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;

-- Dumping structure for table quanlyvanbang.certkind
CREATE TABLE IF NOT EXISTS `certkind` (
  `ck_id` int(11) NOT NULL AUTO_INCREMENT,
  `ck_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`ck_id`),
  KEY `FK_certkind_issuers` (`issuer_id`),
  CONSTRAINT `FK_certkind_issuers` FOREIGN KEY (`issuer_id`) REFERENCES `issuers` (`issuer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table quanlyvanbang.certkind: ~2 rows (approximately)
/*!40000 ALTER TABLE `certkind` DISABLE KEYS */;
INSERT INTO `certkind` (`ck_id`, `ck_name`, `issuer_id`) VALUES
	(1, 'Chứng chỉ anh văn', 'ISR0001'),
	(2, 'Chứng chỉ tin học', 'ISR0001');
/*!40000 ALTER TABLE `certkind` ENABLE KEYS */;

-- Dumping structure for table quanlyvanbang.certname
CREATE TABLE IF NOT EXISTS `certname` (
  `cn_id` int(11) NOT NULL AUTO_INCREMENT,
  `cn_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `issuer_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`cn_id`),
  KEY `FK_certname_issuers` (`issuer_id`),
  CONSTRAINT `FK_certname_issuers` FOREIGN KEY (`issuer_id`) REFERENCES `issuers` (`issuer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table quanlyvanbang.certname: ~0 rows (approximately)
/*!40000 ALTER TABLE `certname` DISABLE KEYS */;
INSERT INTO `certname` (`cn_id`, `cn_name`, `issuer_id`) VALUES
	(7, 'Chứng chỉ tin học căn bản', 'ISR0001');
/*!40000 ALTER TABLE `certname` ENABLE KEYS */;

-- Dumping structure for table quanlyvanbang.degree
CREATE TABLE IF NOT EXISTS `degree` (
  `d_number` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `dn_id` int(11) NOT NULL,
  `dk_id` int(11) NOT NULL,
  `school_id` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  `student_id` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  `d_major` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `d_degreer` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `d_gender` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `d_birth` date NOT NULL,
  `d_yearofgraduation` varchar(4) COLLATE utf8_unicode_ci NOT NULL,
  `d_classification` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `d_modeofstudy` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `d_signdate` date NOT NULL,
  `d_regNo` int(11) NOT NULL,
  `d_status` int(11) NOT NULL,
  `createtime` date NOT NULL,
  `modifitime` datetime DEFAULT NULL,
  PRIMARY KEY (`d_number`),
  KEY `FK_degree_degreename` (`dn_id`),
  KEY `FK_degree_degreekind` (`dk_id`),
  KEY `FK_degree_students` (`student_id`),
  KEY `FK_degree_schools` (`school_id`),
  CONSTRAINT `FK_degree_degreekind` FOREIGN KEY (`dk_id`) REFERENCES `degreekind` (`dk_id`),
  CONSTRAINT `FK_degree_degreename` FOREIGN KEY (`dn_id`) REFERENCES `degreename` (`dn_id`),
  CONSTRAINT `FK_degree_schools` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`),
  CONSTRAINT `FK_degree_students` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table quanlyvanbang.degree: ~0 rows (approximately)
/*!40000 ALTER TABLE `degree` DISABLE KEYS */;
/*!40000 ALTER TABLE `degree` ENABLE KEYS */;

-- Dumping structure for table quanlyvanbang.degreekind
CREATE TABLE IF NOT EXISTS `degreekind` (
  `dk_id` int(11) NOT NULL AUTO_INCREMENT,
  `dk_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`dk_id`),
  KEY `FK_degreekind_issuers` (`issuer_id`),
  CONSTRAINT `FK_degreekind_issuers` FOREIGN KEY (`issuer_id`) REFERENCES `issuers` (`issuer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table quanlyvanbang.degreekind: ~0 rows (approximately)
/*!40000 ALTER TABLE `degreekind` DISABLE KEYS */;
/*!40000 ALTER TABLE `degreekind` ENABLE KEYS */;

-- Dumping structure for table quanlyvanbang.degreename
CREATE TABLE IF NOT EXISTS `degreename` (
  `dn_id` int(11) NOT NULL AUTO_INCREMENT,
  `dn_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`dn_id`),
  KEY `FK_degreename_issuers` (`issuer_id`),
  CONSTRAINT `FK_degreename_issuers` FOREIGN KEY (`issuer_id`) REFERENCES `issuers` (`issuer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table quanlyvanbang.degreename: ~0 rows (approximately)
/*!40000 ALTER TABLE `degreename` DISABLE KEYS */;
/*!40000 ALTER TABLE `degreename` ENABLE KEYS */;

-- Dumping structure for table quanlyvanbang.issuers
CREATE TABLE IF NOT EXISTS `issuers` (
  `issuer_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `shool_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_website` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_username` varchar(12) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_password` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_phoneNumber` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_createTime` datetime NOT NULL,
  `issuer_modifyTime` datetime DEFAULT NULL,
  PRIMARY KEY (`issuer_id`),
  KEY `FK_issuers_schools` (`shool_id`),
  CONSTRAINT `FK_issuers_schools` FOREIGN KEY (`shool_id`) REFERENCES `schools` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table quanlyvanbang.issuers: ~2 rows (approximately)
/*!40000 ALTER TABLE `issuers` DISABLE KEYS */;
INSERT INTO `issuers` (`issuer_id`, `shool_id`, `issuer_website`, `issuer_name`, `issuer_username`, `issuer_password`, `issuer_phoneNumber`, `issuer_email`, `issuer_createTime`, `issuer_modifyTime`) VALUES
	('ISR0001', '', 'ctu.edu.vn', 'Đại học Cần Thơ', '', '', '(84-292) 3832663', 'dhct@ctu.edu.vn', '2021-09-16 01:05:55', '2021-09-27 08:44:15'),
	('ISR0002', '', 'aptech.cusc.vn', 'Trung tâm Công nghệ phần mềm Đại học Cần Thơ', '', '', '+84 292 383 5581', 'cusc@ctu.edu.vn', '2021-09-16 01:41:02', '2021-09-27 08:44:28');
/*!40000 ALTER TABLE `issuers` ENABLE KEYS */;

-- Dumping structure for table quanlyvanbang.schools
CREATE TABLE IF NOT EXISTS `schools` (
  `school_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `school_code` varchar(6) COLLATE utf8_unicode_ci NOT NULL,
  `school_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `school_placeAddress` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `school_website` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `school_email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `school_phoneNumber` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `school_fax` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `school_createTime` datetime NOT NULL,
  `school_modifyTime` datetime DEFAULT NULL,
  PRIMARY KEY (`school_id`),
  UNIQUE KEY `school_code` (`school_code`),
  UNIQUE KEY `school_website` (`school_website`),
  UNIQUE KEY `school_email` (`school_email`),
  UNIQUE KEY `school_phoneNumber` (`school_phoneNumber`),
  UNIQUE KEY `school_fax` (`school_fax`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table quanlyvanbang.schools: ~2 rows (approximately)
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
INSERT INTO `schools` (`school_id`, `school_code`, `school_name`, `school_placeAddress`, `school_website`, `school_email`, `school_phoneNumber`, `school_fax`, `school_createTime`, `school_modifyTime`) VALUES
	('SCH0001', 'CTU', 'Đại học Cần Thơ', 'Khu II, Đ. 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ', 'www.ctu.edu.vn', 'dhct@ctu.edu.vn', '(84-292) 383266', '(84-292) 383847', '2021-10-20 13:46:29', '2021-10-20 13:51:55'),
	('SCH0002', 'CUSC', 'Trung tâm Công nghệ phần mềm Đại học Cần Thơ', '01 Lý Tự Trọng, Quận Ninh Kiều, TP. Cần Thơ', 'aptech.cusc.vn', 'cusc@ctu.edu.vn', '+84 292 373 107', ' +84 292 383 55', '2021-10-20 16:00:27', '2021-10-23 13:57:48'),
	('SCH0003', 'asd', 'asd', 'asd', 'asd', 'asd', 'asd', 'asd', '2021-10-24 11:26:56', NULL);
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;

-- Dumping structure for table quanlyvanbang.students
CREATE TABLE IF NOT EXISTS `students` (
  `student_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `student_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `student_placeAddress` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `student_gender` tinyint(1) NOT NULL DEFAULT 0,
  `student_birth` date NOT NULL,
  `student_idNumber` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `student_phoneNumber` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `student_email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`student_id`) USING BTREE,
  UNIQUE KEY `student_email` (`student_email`),
  UNIQUE KEY `student_phone` (`student_phoneNumber`) USING BTREE,
  UNIQUE KEY `student_idNumber` (`student_idNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table quanlyvanbang.students: ~1 rows (approximately)
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` (`student_id`, `student_name`, `student_placeAddress`, `student_gender`, `student_birth`, `student_idNumber`, `student_phoneNumber`, `student_email`) VALUES
	('STU0001', 'Trương Quốc Thái', 'Hồng Loan, Hưng Thạnh, huyện Cái Răng, tp. Cần Thơ', 1, '1999-09-03', '123123123123123', '0706823211', 'thaitruong1605@gmail.com');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;

-- Dumping structure for trigger quanlyvanbang.certificates_before_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `certificates_before_insert` BEFORE INSERT ON `certificates` FOR EACH ROW BEGIN
	SET NEW.createTime = CURTIME();
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger quanlyvanbang.certificates_before_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `certificates_before_update` BEFORE UPDATE ON `certificates` FOR EACH ROW BEGIN
	SET NEW.modifyTime = CURTIME();
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger quanlyvanbang.degree_before_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `degree_before_insert` BEFORE INSERT ON `degree` FOR EACH ROW BEGIN
	SET NEW.createTime = CURTIME();
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger quanlyvanbang.degree_before_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `degree_before_update` BEFORE UPDATE ON `degree` FOR EACH ROW BEGIN
	SET NEW.modifitime = CURTIME();
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger quanlyvanbang.issuer_before_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `issuer_before_insert` BEFORE INSERT ON `issuers` FOR EACH ROW BEGIN
 SET NEW.issuer_createTime = CURTIME(),
	NEW.issuer_id = CONCAT("ISR",LPAD((SELECT COALESCE(MAX(RIGHT( issuer_id ,4)), 0)+1 FROM issuers), 4, 0));
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger quanlyvanbang.issuer_before_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `issuer_before_update` BEFORE UPDATE ON `issuers` FOR EACH ROW BEGIN
	SET NEW.issuer_modifyTime = CURTIME();
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger quanlyvanbang.schools_before_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `schools_before_insert` BEFORE INSERT ON `schools` FOR EACH ROW BEGIN
 SET 
 	NEW.school_createTime = CURTIME(),
	NEW.school_id = CONCAT("SCH",LPAD((SELECT COALESCE(MAX(RIGHT( school_id ,4)), 0)+1 FROM schools), 4, 0));
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger quanlyvanbang.schools_before_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `schools_before_update` BEFORE UPDATE ON `schools` FOR EACH ROW BEGIN
SET
	NEW.school_modifyTime = CURTIME();
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger quanlyvanbang.students_before_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `students_before_insert` BEFORE INSERT ON `students` FOR EACH ROW BEGIN
SET 
 	NEW.student_id = CONCAT("STU",LPAD((SELECT COALESCE(MAX(RIGHT(student_id,4)), 0) +1 FROM students), 4, 0));
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
