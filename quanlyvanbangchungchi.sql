/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `quanlyvanbang` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `quanlyvanbang`;

CREATE TABLE IF NOT EXISTS `accounts` (
  `account_username` varchar(12) COLLATE utf8_unicode_ci NOT NULL,
  `account_address` varchar(42) COLLATE utf8_unicode_ci DEFAULT NULL,
  `account_status` varchar(6) COLLATE utf8_unicode_ci NOT NULL,
  `account_password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `account_type` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  `school_id` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  `issuer_id` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`account_username`) USING BTREE,
  UNIQUE KEY `account_address` (`account_address`),
  UNIQUE KEY `issuer_id` (`issuer_id`),
  UNIQUE KEY `school_id` (`school_id`,`issuer_id`) USING BTREE,
  UNIQUE KEY `student_id` (`user_id`) USING BTREE,
  CONSTRAINT `FK_accounts_issuers` FOREIGN KEY (`issuer_id`) REFERENCES `issuers` (`issuer_id`),
  CONSTRAINT `FK_accounts_schools` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`),
  CONSTRAINT `FK_accounts_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` (`account_username`, `account_address`, `account_status`, `account_password`, `account_type`, `user_id`, `school_id`, `issuer_id`) VALUES
	('admin', '0x07f8d0185A8822734Da52F2e8A4db9A6DD4fCc7e', 'active', '$2b$10$JE2dvBpVJy.f2eIaecfUIODzzomOIZ6WhUkUNg6HB7Kv0Iwo2UoK6', 'admin', NULL, NULL, NULL);
-- 	('ctu', '0xa0fEC0106eAe31874cEfF9E35B4eC5bdD0a0FA67', 'active', '$2b$10$NxGxDFXdUmWh5hFnjWPqCu3nl8qDm3xAZFnBe0uK1kZebqLZGnYu.', 'school', NULL, 'SCH0001', NULL),
-- 	('ctu_kcn', NULL, 'lock', '$2b$10$tMoRhaIwiAqevBr0ZsHCmuWIYX3yO8lunp9vnUzFcLryVw6X4K71y', 'issuer', NULL, 'SCH0001', 'ISR0003'),
-- 	('ctu_kcntt', NULL, 'active', '$2b$10$eygbZac.Q6oVS27Aq9XrWOJZqKWDkWkaRHuZMDTVnZbvyY8ElhjL.', 'issuer', NULL, 'SCH0001', 'ISR0002'),
-- 	('ctu_knn', NULL, 'active', '$2b$10$/eiAOlnS.3Sf1KxlXc5H5.W5EKxk5FAMVijqhNOHFrYDoozGPOsf6', 'issuer', NULL, 'SCH0001', 'ISR0004'),
-- 	('ctu_tttn', NULL, 'active', '$2b$10$JE2dvBpVJy.f2eIaecfUIODzzomOIZ6WhUkUNg6HB7Kv0Iwo2UoK6', 'issuer', NULL, 'SCH0001', 'ISR0001'),
-- 	('cusc', '0xA48f948E315E036a598cb6a2C9cEd36E429aC801', 'active', '$2b$10$J7cUc3cMhuczSafu/TuzweSacsVzCFkPZsxyvg7BUCy4JH10KKS5O', 'school', NULL, 'SCH0002', NULL),
-- 	('cusc_pdt', NULL, 'active', '$2b$10$xkZ0ymM8TIrY/3zbjEHA1eiFVrkNAEV6YmQlTfo50bbA9y2K8XYA.', 'issuer', NULL, 'SCH0002', 'ISR0005'),
-- 	('vttu', '0x202F48C6B700839341a45c10F4e29fE9f9b1D2C7', 'active', '$2b$10$1qN.rEp5Zd8349rMC7Mg7u376FX3vTisA/BzviZFRIGq9OK4NClKa', 'school', NULL, 'SCH0004', NULL),
-- 	('vttu_pdt', NULL, 'active', '$2b$10$xVyaIcUElr1uDHnKKbs3O.G5unTUpHKyyyse9P2r9Fav8E49P.JVW', 'issuer', NULL, 'SCH0004', 'ISR0006'),
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `certificates` (
  `number` varchar(10) COLLATE utf8_unicode_ci NOT NULL COMMENT 'S??? hi???u',
  `regno` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ck_id` int(11) NOT NULL,
  `cn_id` int(11) NOT NULL,
  `issuer_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `user_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_idNumber` varchar(12) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_birth` date NOT NULL DEFAULT '1999-09-03',
  `status` varchar(10) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Tr???ng th??i',
  `ipfs_hash` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'IPFS',
  `createTime` datetime NOT NULL COMMENT 'Ng??y t???o file',
  `modifyTime` datetime NOT NULL,
  `hash` varchar(66) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`number`) USING BTREE,
  UNIQUE KEY `regno` (`regno`),
  KEY `FK_certificates_certkind` (`ck_id`),
  KEY `FK_certificates_certname` (`cn_id`),
  KEY `FK_certificates_issuers` (`issuer_id`),
  CONSTRAINT `FK_certificates_certkind` FOREIGN KEY (`ck_id`) REFERENCES `certkind` (`ck_id`),
  CONSTRAINT `FK_certificates_certname` FOREIGN KEY (`cn_id`) REFERENCES `certname` (`cn_id`),
  CONSTRAINT `FK_certificates_issuers` FOREIGN KEY (`issuer_id`) REFERENCES `issuers` (`issuer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
-- INSERT INTO `certificates` (`number`, `regno`, `ck_id`, `cn_id`, `issuer_id`, `user_name`, `user_idNumber`, `user_birth`, `status`, `ipfs_hash`, `createTime`, `modifyTime`, `hash`) VALUES
-- 	('5', 'CERT_5', 6, 8, 'ISR0001', 'Nguy???n Tr?????ng Giang', '331321123', '2003-03-23', 'incorrect', NULL, '2021-12-24 00:24:23', '2021-12-24 00:25:25', ''),
-- 	('6', 'CERT_6', 6, 8, 'ISR0001', 'Tr???n ????nh Nam', '331323412', '2000-09-24', 'deactivate', 'QmYENSVmMDJrtMzVTWda6PVHXwsWyJXJMG2yuJ1TaGJouU', '2021-12-24 00:24:23', '2021-12-24 00:25:43', ''),
-- 	('C1', 'CIT_1', 5, 13, 'ISR0002', 'Tr???n Ho??i Nam', '331833000', '1999-09-03', 'done', 'Qmdh9TsdANmAScPyT8KA2pxTjFNgoKxFx41cPDx21sAtz1', '2021-12-24 00:27:34', '2021-12-24 10:23:07', ''),
-- 	('C10', 'CIT_10', 5, 13, 'ISR0002', 'Tr???n Duy Anh', '331563009', '1998-12-13', 'done', 'QmNuXu7wjgu4iYQhHzwQthEHt6otGPiTuN29a7ngy2Wg4k', '2021-12-24 00:27:34', '2021-12-24 01:10:08', ''),
-- 	('C11', 'CIT_11', 5, 13, 'ISR0002', 'Nguy???n Ho??ng T??nh', '331533010', '1991-05-04', 'done', 'QmTsPu1HiF3LPW6HeddMk9FxfxtLC1EJnprrwCEEuBu7xg', '2021-12-24 00:27:34', '2021-12-24 01:10:28', ''),
-- 	('C12', 'CIT_12', 5, 13, 'ISR0002', 'L?? Th??? Kim Ng??n', '331503011', '1994-10-02', 'done', 'QmbSK68Pz4khDcrtRgviqpu94ZGS8ihVoaWFqAhXzkeBfm', '2021-12-24 00:27:34', '2021-12-24 01:10:36', ''),
-- 	('C13', 'CIT_13', 5, 13, 'ISR0002', 'H??? Th??? Ng???c ??i???p', '331473012', '1999-12-04', 'incorrect', NULL, '2021-12-24 00:27:34', '2021-12-24 01:10:42', ''),
-- 	('C14', 'CIT_14', 5, 13, 'ISR0002', 'Tr???n Ph????ng Nam', '331443013', '1999-06-15', 'incorrect', NULL, '2021-12-24 00:27:34', '2021-12-24 01:10:44', ''),
-- 	('C15', 'CIT_15', 5, 13, 'ISR0002', 'Nguy???n H?? Ph????ng', '331413014', '1998-11-17', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C16', 'CIT_16', 5, 13, 'ISR0002', 'Tr????ng Qu???c B???o', '331383015', '1997-09-04', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C17', 'CIT_17', 5, 13, 'ISR0002', 'Nguy???n Th??? Ng???c Nh??', '331353016', '1998-07-23', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C18', 'CIT_18', 5, 13, 'ISR0002', 'H??? T???n Tr?????ng', '331323017', '1999-06-29', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C19', 'CIT_19', 5, 13, 'ISR0002', 'Nguy???n Ho??ng Minh Ch??nh', '331293018', '1995-03-23', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C2', 'CIT_2', 5, 13, 'ISR0002', 'Nguy???n Tr???n H????ng Giang', '331803001', '1999-01-01', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C20', 'CIT_20', 5, 13, 'ISR0002', 'Nguy???n Th??? Thu T??m', '331263019', '1997-03-16', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C21', 'CIT_21', 5, 13, 'ISR0002', 'B??i Th??i Ho??', '331233020', '2004-02-01', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C22', 'CIT_22', 5, 13, 'ISR0002', 'Ph???m Ng???c Hi???n', '331203021', '1999-04-13', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C23', 'CIT_23', 5, 13, 'ISR0002', 'Nguy???n Gia H??n', '331173022', '1995-04-13', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C24', 'CIT_24', 5, 13, 'ISR0002', 'Ng?? Th??? Kim Ng??n', '331143023', '1998-07-23', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C25', 'CIT_25', 5, 13, 'ISR0002', 'L?? T???n Hi???p', '331113024', '2002-04-13', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C26', 'CIT_26', 5, 13, 'ISR0002', 'Nguy???n B??ch Thu???', '331083025', '1998-07-23', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C27', 'CIT_27', 5, 13, 'ISR0002', 'Giang Thanh Xu??n', '331053026', '1995-04-13', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C28', 'CIT_28', 5, 13, 'ISR0002', 'L?? Th??? M??? Xuy??n', '331023027', '1995-02-23', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C29', 'CIT_29', 5, 13, 'ISR0002', 'Nguy???n Ph?? Vinh', '330993028', '2004-02-03', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C3', 'CIT_3', 5, 13, 'ISR0002', 'Tr???n Th??? Thu H??', '331773002', '1997-11-11', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C30', 'CUSC_1', 12, 32, 'ISR0005', 'Tr???n Ho??i Nam', '331833000', '1999-09-03', 'done', 'Qmf46V9YeuCq2MT7dw9bXpoxfodJLz2RgoV12o6p7inevr', '2021-12-24 01:41:41', '2021-12-24 01:44:43', ''),
-- 	('C31', 'CUSC_2', 12, 32, 'ISR0005', 'Nguy???n Tr???n H????ng Giang', '331803001', '1999-01-01', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C32', 'CUSC_3', 12, 32, 'ISR0005', 'Tr???n Th??? Thu H??', '331773002', '1997-11-11', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C33', 'CUSC_4', 12, 32, 'ISR0005', 'Nguy???n Th??? H???ng H???nh', '331743003', '1999-09-09', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C34', 'CUSC_5', 12, 32, 'ISR0005', 'Mai Ph????ng Linh', '331713004', '2003-03-23', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C35', 'CUSC_6', 12, 32, 'ISR0005', 'Nguy???n Th??? Thanh S??n', '331683005', '2000-09-24', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C36', 'CUSC_7', 12, 32, 'ISR0005', 'Tr???n Th???o Nguy??n', '331653006', '1995-06-02', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C37', 'CUSC_8', 12, 32, 'ISR0005', 'Nguy???n Kh??nh Duy', '331623007', '2004-02-01', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C38', 'CUSC_9', 12, 32, 'ISR0005', 'Nguy???n ????nh Nh???t T??i', '331593008', '1993-07-03', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C39', 'CUSC_10', 12, 32, 'ISR0005', 'Tr???n Duy Anh', '331563009', '1998-12-13', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C4', 'CIT_4', 5, 13, 'ISR0002', 'Nguy???n Th??? H???ng H???nh', '331743003', '1999-09-09', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C40', 'CUSC_11', 12, 32, 'ISR0005', 'Nguy???n Ho??ng T??nh', '331533010', '1991-05-04', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C41', 'CUSC_12', 12, 32, 'ISR0005', 'L?? Th??? Kim Ng??n', '331503011', '1994-10-02', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C42', 'CUSC_13', 12, 32, 'ISR0005', 'H??? Th??? Ng???c ??i???p', '331473012', '1999-12-04', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C43', 'CUSC_14', 12, 32, 'ISR0005', 'Tr???n Ph????ng Nam', '331443013', '1999-06-15', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C44', 'CUSC_15', 12, 32, 'ISR0005', 'Nguy???n H?? Ph????ng', '331413014', '1998-11-17', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C45', 'CUSC_16', 12, 32, 'ISR0005', 'Tr????ng Qu???c B???o', '331383015', '1997-09-04', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C46', 'CUSC_17', 12, 32, 'ISR0005', 'Nguy???n Th??? Ng???c Nh??', '331353016', '1998-07-23', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C47', 'CUSC_18', 12, 32, 'ISR0005', 'H??? T???n Tr?????ng', '331323017', '1999-06-29', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C48', 'CUSC_19', 12, 32, 'ISR0005', 'Nguy???n Ho??ng Minh Ch??nh', '331293018', '1995-03-23', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C49', 'CUSC_20', 12, 32, 'ISR0005', 'Nguy???n Th??? Thu T??m', '331263019', '1997-03-16', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C5', 'CIT_5', 5, 13, 'ISR0002', 'Mai Ph????ng Linh', '331713004', '2003-03-23', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C50', 'CUSC_21', 12, 32, 'ISR0005', 'B??i Th??i Ho??', '331233020', '2004-02-01', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C51', 'CUSC_22', 12, 32, 'ISR0005', 'Ph???m Ng???c Hi???n', '331203021', '1999-04-13', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C52', 'CUSC_23', 12, 32, 'ISR0005', 'Nguy???n Gia H??n', '331173022', '1995-04-13', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C53', 'CUSC_24', 12, 32, 'ISR0005', 'Ng?? Th??? Kim Ng??n', '331143023', '1998-07-23', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C54', 'CUSC_25', 12, 32, 'ISR0005', 'L?? T???n Hi???p', '331113024', '2002-04-13', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C55', 'CUSC_26', 12, 32, 'ISR0005', 'Nguy???n B??ch Thu???', '331083025', '1998-07-23', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C56', 'CUSC_27', 12, 32, 'ISR0005', 'Giang Thanh Xu??n', '331053026', '1995-04-13', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C57', 'CUSC_28', 12, 32, 'ISR0005', 'L?? Th??? M??? Xuy??n', '331023027', '1995-02-23', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C58', 'CUSC_29', 12, 32, 'ISR0005', 'Nguy???n Ph?? Vinh', '330993028', '2004-02-03', 'checking', NULL, '2021-12-24 01:41:41', '0000-00-00 00:00:00', ''),
-- 	('C6', 'CIT_6', 5, 13, 'ISR0002', 'Nguy???n Th??? Thanh S??n', '331683005', '2000-09-24', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C7', 'CIT_7', 5, 13, 'ISR0002', 'Tr???n Th???o Nguy??n', '331653006', '1995-06-02', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C8', 'CIT_8', 5, 13, 'ISR0002', 'Nguy???n Kh??nh Duy', '331623007', '2004-02-01', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('C9', 'CIT_9', 5, 13, 'ISR0002', 'Nguy???n ????nh Nh???t T??i', '331593008', '1993-07-03', 'checking', NULL, '2021-12-24 00:27:34', '0000-00-00 00:00:00', ''),
-- 	('V1', 'VTTU_1', 13, 34, 'ISR0006', 'Tr???n Ho??i Nam', '331833000', '1999-09-03', 'done', 'QmeYUb3yeWZh2ScHdFcTosPtQ2ZJkUGtPmWEDAHTqbYvWo', '2021-12-24 10:45:20', '2021-12-24 10:49:04', '0xa58bfcb685feebaf8fc3ee641acdacfb23b93953b43940550e566484caa87ff2'),
-- 	('V11', 'VTTU_11', 13, 34, 'ISR0006', 'Nguy???n Ho??ng T??nh', '331533010', '1991-05-04', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V12', 'VTTU_12', 13, 34, 'ISR0006', 'L?? Th??? Kim Ng??n', '331503011', '1994-10-02', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V13', 'VTTU_13', 13, 34, 'ISR0006', 'H??? Th??? Ng???c ??i???p', '331473012', '1999-12-04', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V14', 'VTTU_14', 13, 34, 'ISR0006', 'Tr???n Ph????ng Nam', '331443013', '1999-06-15', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V15', 'VTTU_15', 13, 34, 'ISR0006', 'Nguy???n H?? Ph????ng', '331413014', '1998-11-17', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V16', 'VTTU_16', 13, 34, 'ISR0006', 'Tr????ng Qu???c B???o', '331383015', '1997-09-04', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V17', 'VTTU_17', 13, 34, 'ISR0006', 'Nguy???n Th??? Ng???c Nh??', '331353016', '1998-07-23', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V18', 'VTTU_18', 13, 34, 'ISR0006', 'H??? T???n Tr?????ng', '331323017', '1999-06-29', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V19', 'VTTU_19', 13, 34, 'ISR0006', 'Nguy???n Ho??ng Minh Ch??nh', '331293018', '1995-03-23', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V2', 'VTTU_2', 13, 34, 'ISR0006', 'Nguy???n Tr???n H????ng Giang', '331803001', '1999-01-01', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V20', 'VTTU_20', 13, 34, 'ISR0006', 'Nguy???n Th??? Thu T??m', '331263019', '1997-03-16', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V21', 'VTTU_21', 13, 34, 'ISR0006', 'B??i Th??i Ho??', '331233020', '2004-02-01', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V22', 'VTTU_22', 13, 34, 'ISR0006', 'Ph???m Ng???c Hi???n', '331203021', '1999-04-13', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V23', 'VTTU_23', 13, 34, 'ISR0006', 'Nguy???n Gia H??n', '331173022', '1995-04-13', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V24', 'VTTU_24', 13, 34, 'ISR0006', 'Ng?? Th??? Kim Ng??n', '331143023', '1998-07-23', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V25', 'VTTU_25', 13, 34, 'ISR0006', 'L?? T???n Hi???p', '331113024', '2002-04-13', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V26', 'VTTU_26', 13, 34, 'ISR0006', 'Nguy???n B??ch Thu???', '331083025', '1998-07-23', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V27', 'VTTU_27', 13, 34, 'ISR0006', 'Giang Thanh Xu??n', '331053026', '1995-04-13', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V28', 'VTTU_28', 13, 34, 'ISR0006', 'L?? Th??? M??? Xuy??n', '331023027', '1995-02-23', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V29', 'VTTU_29', 13, 34, 'ISR0006', 'Nguy???n Ph?? Vinh', '330993028', '2004-02-03', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V3', 'VTTU_3', 13, 34, 'ISR0006', 'Tr???n Th??? Thu H??', '331773002', '1997-11-11', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V4', 'VTTU_4', 13, 34, 'ISR0006', 'Nguy???n Th??? H???ng H???nh', '331743003', '1999-09-09', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V5', 'VTTU_5', 13, 34, 'ISR0006', 'Mai Ph????ng Linh', '331713004', '2003-03-23', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V50', 'VTTU-50', 13, 34, 'ISR0006', 'Tr????ng Qu???c Th??i', '331830000', '1999-09-03', 'deactivate', 'QmeB66aKfzTcEQahNEpGjuaXNSw2AVEPtgAcXdF6Qk3hF6', '2021-12-24 10:46:33', '2021-12-24 10:48:01', ''),
-- 	('V6', 'VTTU_6', 13, 34, 'ISR0006', 'Nguy???n Th??? Thanh S??n', '331683005', '2000-09-24', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V7', 'VTTU_7', 13, 34, 'ISR0006', 'Tr???n Th???o Nguy??n', '331653006', '1995-06-02', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V8', 'VTTU_8', 13, 34, 'ISR0006', 'Nguy???n Kh??nh Duy', '331623007', '2004-02-01', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('V9', 'VTTU_9', 13, 34, 'ISR0006', 'Nguy???n ????nh Nh???t T??i', '331593008', '1993-07-03', 'checking', NULL, '2021-12-24 10:45:20', '0000-00-00 00:00:00', ''),
-- 	('W1_5', 'CUSC_W15', 12, 32, 'ISR0005', 'Nguy???n Tr?????ng Giang', '331321123', '2003-03-23', 'checking', NULL, '2021-12-24 01:44:13', '0000-00-00 00:00:00', ''),
-- 	('W1_6', 'CUSC_W16', 12, 32, 'ISR0005', 'Tr???n ????nh Nam', '331323412', '2000-09-24', 'checking', NULL, '2021-12-24 01:44:13', '0000-00-00 00:00:00', ''),
-- 	('W2_5', 'CUSC_W25', 12, 33, 'ISR0005', 'Nguy???n Tr?????ng Giang', '331321123', '2003-03-23', 'checking', NULL, '2021-12-24 01:42:58', '0000-00-00 00:00:00', ''),
-- 	('W2_6', 'CUSC_W26', 12, 33, 'ISR0005', 'Tr???n ????nh Nam', '331323412', '2000-09-24', 'checking', NULL, '2021-12-24 01:42:58', '0000-00-00 00:00:00', ''),
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `certkind` (
  `ck_id` int(11) NOT NULL AUTO_INCREMENT,
  `ck_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `school_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`ck_id`),
  KEY `FK_certkind_issuers` (`school_id`) USING BTREE,
  CONSTRAINT `FK_certkind_schools` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*!40000 ALTER TABLE `certkind` DISABLE KEYS */;
-- INSERT INTO `certkind` (`ck_id`, `ck_name`, `school_id`) VALUES
-- 	(5, 'V??n b???ng ', 'SCH0001'),
-- 	(6, 'Ch???ng ch???', 'SCH0001'),
-- 	(8, 'Ch???ng nh???n', 'SCH0001'),
-- 	(12, 'Ch???ng nh???n', 'SCH0002'),
-- 	(13, 'V??n b???ng', 'SCH0004'),
-- 	(14, 'Ch???ng ch???', 'SCH0004');
/*!40000 ALTER TABLE `certkind` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `certname` (
  `cn_id` int(11) NOT NULL AUTO_INCREMENT,
  `cn_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `ck_id` int(11) NOT NULL,
  `school_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`cn_id`),
  KEY `FK_certname_issuers` (`school_id`) USING BTREE,
  KEY `FK_certname_certkind` (`ck_id`),
  CONSTRAINT `FK_certname_certkind` FOREIGN KEY (`ck_id`) REFERENCES `certkind` (`ck_id`),
  CONSTRAINT `FK_certname_schools` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*!40000 ALTER TABLE `certname` DISABLE KEYS */;
-- INSERT INTO `certname` (`cn_id`, `cn_name`, `ck_id`, `school_id`) VALUES
-- 	(8, 'Ch???ng ch??? tin h???c c??n b???n', 6, 'SCH0001'),
-- 	(13, 'C??? nh??n C??ng ngh??? th??ng tin', 5, 'SCH0001'),
-- 	(25, 'Ch???ng ch??? ti???ng anh A2', 6, 'SCH0001'),
-- 	(26, 'Ch???ng ch??? ti???ng Anh B1', 6, 'SCH0001'),
-- 	(27, 'Ch???ng ch??? ti???ng Anh B2', 6, 'SCH0001'),
-- 	(32, 'Ch???ng nh???n ho??n th??nh kho?? h???c Web1', 12, 'SCH0002'),
-- 	(33, 'Ch???ng nh???n ho??n th??nh kho?? h???c Web2', 12, 'SCH0002'),
-- 	(34, 'B???ng t???t nghi???p ?????i h???c Y ??a khoa', 13, 'SCH0004');
/*!40000 ALTER TABLE `certname` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `issuers` (
  `issuer_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_phoneNumber` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `issuer_email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`issuer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*!40000 ALTER TABLE `issuers` DISABLE KEYS */;
-- INSERT INTO `issuers` (`issuer_id`, `issuer_name`, `issuer_phoneNumber`, `issuer_email`) VALUES
-- 	('ISR0001', 'Trung t??m Tin h???c', '0908574311', 'pth@email.com'),
-- 	('ISR0002', 'Khoa C??ng ngh??? th??ng tin v?? Truy???n th??ng', '0908574310', 'cit@email.com'),
-- 	('ISR0003', 'Khoa C??ng ngh???', '0908574321', 'cet@email.com'),
-- 	('ISR0004', 'Khoa N??ng nghi???p', '0908574445', 'coa@email.com'),
-- 	('ISR0005', 'Ph??ng ????o t???o', '0909999999', 'pdt@cusc.edu.vn'),
-- 	('ISR0006', 'Ph??ng ????o t???o', '0908832123', 'pdt@email.com');
/*!40000 ALTER TABLE `issuers` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `schools` (
  `school_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `isValid` tinyint(1) NOT NULL,
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

/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
-- INSERT INTO `schools` (`school_id`, `isValid`, `school_code`, `school_name`, `school_placeAddress`, `school_website`, `school_email`, `school_phoneNumber`, `school_fax`, `school_createTime`, `school_modifyTime`) VALUES
-- 	('SCH0001', 1, 'CTU', '?????i h???c C???n Th??', 'Khu II, ??. 3/2, Xu??n Kh??nh, Ninh Ki???u, C???n Th??', 'www.ctu.edu.vn', 'dhct@ctu.edu.vn', '(84-292) 383266', '(84-292) 383847', '2021-10-20 13:46:29', '2021-12-18 12:08:51'),
-- 	('SCH0002', 1, 'CUSC', 'Trung t??m C??ng ngh??? ph???n m???m ?????i h???c C???n Th??', '01 L?? T??? Tr???ng, Qu???n Ninh Ki???u, TP. C???n Th??', 'aptech.cusc.vn', 'cusc@ctu.edu.vn', '+84 292 373 107', '+84 292 383 558', '2021-12-24 00:01:29', '2021-12-24 01:38:24'),
-- 	('SCH0004', 1, 'VTTU', 'Tr?????ng ?????i h???c V?? Tr?????ng To???n', 'Qu???c L??? 1A, T??n Ph?? Th???nh, Ch??u Th??nh A, t???nh H???u ', 'vttu.edu.vn', 'info@vttu.edu.vn', '(0293) 3953 200', '(0293) 3953 222', '2021-12-24 10:38:50', '2021-12-24 10:39:51');
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `user_isAuth` tinyint(1) NOT NULL DEFAULT 0,
  `user_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `user_placeAddress` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `user_gender` tinyint(1) NOT NULL DEFAULT 0,
  `user_birth` date NOT NULL,
  `user_idNumber` varchar(12) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `user_phoneNumber` varchar(12) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_email` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE KEY `student_idNumber` (`user_idNumber`) USING BTREE,
  UNIQUE KEY `student_email` (`user_email`) USING BTREE,
  UNIQUE KEY `student_phone` (`user_phoneNumber`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE DEFINER=`root`@`localhost` TRIGGER `certificates_before_insert` BEFORE INSERT ON `certificates` FOR EACH ROW BEGIN
	SET NEW.createTime = CURTIME();
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE DEFINER=`root`@`localhost` TRIGGER `certificates_before_update` BEFORE UPDATE ON `certificates` FOR EACH ROW BEGIN
	SET NEW.modifyTime = CURTIME();
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE DEFINER=`root`@`localhost` TRIGGER `issuer_before_insert` BEFORE INSERT ON `issuers` FOR EACH ROW BEGIN
 SET
	NEW.issuer_id = CONCAT("ISR",LPAD((SELECT COALESCE(MAX(RIGHT( issuer_id ,4)), 0)+1 FROM issuers), 4, 0));
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE DEFINER=`root`@`localhost` TRIGGER `schools_before_insert` BEFORE INSERT ON `schools` FOR EACH ROW BEGIN
 SET 
 	NEW.school_createTime = CURTIME(),
	NEW.school_id = CONCAT("SCH",LPAD((SELECT COALESCE(MAX(RIGHT( school_id ,4)), 0)+1 FROM schools), 4, 0));
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE DEFINER=`root`@`localhost` TRIGGER `schools_before_update` BEFORE UPDATE ON `schools` FOR EACH ROW BEGIN
SET
	NEW.school_modifyTime = CURTIME();
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE DEFINER=`root`@`localhost` TRIGGER `users_before_insert` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
SET 
 	NEW.user_id = CONCAT("USR",LPAD((SELECT COALESCE(MAX(RIGHT(user_id,4)), 0) +1 FROM users), 4, 0));
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
