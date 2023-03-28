--------------
-- database --
--------------
DROP DATABASE IF EXISTS helpdesk;

create database helpdesk;

use helpdesk;

-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------

drop table if exists `user`;

CREATE TABLE `user` (
  -- `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) not NULL,
  `password` VARCHAR(255) not NULL,   
  `firstName` VARCHAR(255) not NULL,
  `lastName` VARCHAR(255) not NULL,
  `phone` VARCHAR(255) not NULL,
  `address` VARCHAR(255) NULL,
  `role` VARCHAR(255) not NULL,  
  `status` VARCHAR(255) not NULL,
  PRIMARY KEY (`id`),
  UNIQUE (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user`(id, email, password, firstName, lastName, phone, address, role, status) VALUES
-- customer
(1,'dunglh+customer1@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Quân','Châu','0111111111','','ROLE_CUSTOMER','Active'),
(2,'dunglh+customer2@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Vân','Hoàng','0111111112','','ROLE_CUSTOMER','Active'),
(3,'dunglh+customer3@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Quyên','Bùi','0111111113','','ROLE_CUSTOMER','Active'),
(4,'dunglh+customer4@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Mỹ Linh','Phạm','0111111114','','ROLE_CUSTOMER','Active'),
(5,'dunglh+customer5@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Kim Huệ','Âu','0111111115','','ROLE_CUSTOMER','Active'),
(6,'dunglh+customer6@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Minh Trí','Nguyễn','0111111116','','ROLE_CUSTOMER','Active'),
(7,'dunglh+customer7@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Ngọc Hân','Nguyễn','0111111117','','ROLE_CUSTOMER','Active'),
(8,'dunglh+customer8@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Trần Lan Anh','Phạm','0111111118','','ROLE_CUSTOMER','Active'),
(9,'dunglh+customer9@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Hồng Hạc','Nguyễn','0111111119','','ROLE_CUSTOMER','Active'),
-- supporter
(10,'dunglh+supporter@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Minh Tâm','Tạ','0222222220','','ROLE_SUPPORTER','Active'),
(11,'dunglh+supporter1@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Hồng Đào','Trịnh','0222222221','','ROLE_SUPPORTER','Active'),
(12,'dunglh+supporter2@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Ngọc Tư','Nguyễn','0222222222','','ROLE_SUPPORTER','Active'),
(13,'dunglh+supporter3@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Ngọc Yến','Nguyễn','0222222223','','ROLE_SUPPORTER','Active'),
(14,'dunglh+supporter4@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Yến Quyên','Lý','0222222224','','ROLE_SUPPORTER','Active'),
(15,'dunglh+supporter5@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Đức Nhân','Bùi','0222222225','','ROLE_SUPPORTER','Active'),
(16,'dunglh+supporter6@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Sanh Minh','Lư','0222222226','','ROLE_SUPPORTER','Active'),
(17,'dunglh+supporter7@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Hiếu','Lý','0222222227','','ROLE_SUPPORTER','Active'),
(18,'dunglh+supporter8@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thanh Danh','Phạm','0222222228','','ROLE_SUPPORTER','Active'),
(19,'dunglh+supporter9@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Viết Cường','Bùi','0222222229','','ROLE_SUPPORTER','Active'),
-- admin
(20,'dunglh+admin@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Công Phượng','Nguyễn','0333333330','','ROLE_ADMIN','Active'),
(21,'dunglh+admin1@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Tuấn Anh','Nguyễn','0333333331','','ROLE_ADMIN','Active'),
(22,'dunglh+admin2@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Quang Hải','Nguyễn','0333333332','','ROLE_ADMIN','Active'),
(23,'dunglh+admin3@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Minh Vương','Trần','0333333333','','ROLE_ADMIN','Active'),
(24,'dunglh+admin4@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Văn Thanh','Nguyễn','0333333334','','ROLE_ADMIN','Active'),
(25,'dunglh+admin5@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Tuấn Hải','Nguyễn','0333333335','','ROLE_ADMIN','Active'),
(26,'dunglh+admin6@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Văn Lâm','Nguyễn','0333333336','','ROLE_ADMIN','Active'),
(27,'dunglh+admin7@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Tiến Linh','Nguyễn','0333333337','','ROLE_ADMIN','Active'),
(28,'dunglh+admin8@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thành Chung','Nguyễn','0333333338','','ROLE_ADMIN','Active'),
(29,'dunglh+admin9@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Hoàng Việt Anh','Bùi','0333333339','','ROLE_ADMIN','Active');
-- other
-- (30,'nguoiquantri@proton.me','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Văn Khiêm','Tô','0555555550','','ROLE_ADMIN','Active'),
-- (31,'dunglh@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Hồng Dũng','Lâm','0555555551','','ROLE_ADMIN','Active'),
-- (32,'nguoihotro@proton.me','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thu Hiền','Đinh','0555555552','','ROLE_SUPPORTER','Active'),
-- (33,'khachhang_hd@proton.me','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Ngọc Duyên','Trần','0555555553','','ROLE_CUSTOMER','Active');

-- -----------------------------------------------------
-- Table `category`
-- -----------------------------------------------------

drop table if exists `category`;

CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) not NULL,
  `status` VARCHAR(255) not NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `category`(id, name, status) VALUES 
(1, 'Laptop', 'Active'),
(2, 'PC', 'Active'),
(3, 'Printer', 'Active'),
(4, 'Networking', 'Active'),
(5, 'Office365', 'Active'),
(6, 'Access card', 'Active'),
(7, 'Seat', 'Active'),
(8, 'Other', 'Active');

-- -----------------------------------------------------
-- Table `priority`
-- -----------------------------------------------------

drop table if exists `priority`;

CREATE TABLE `priority` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) not NULL,
  `resolveIn` int not NULL,
  `status` VARCHAR(255) not NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `priority`(id, name, resolveIn, status) VALUES 
(1, 'High', 12, 'Active'),
(2, 'Normal', 24, 'Active'),
(3, 'Low', 36, 'Active');

-- -----------------------------------------------------
-- Table `team`
-- -----------------------------------------------------

drop table if exists `team`;

CREATE TABLE `team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) not NULL,
  `assignmentMethod` VARCHAR(255) not NULL,
  `status` VARCHAR(255) not NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `team`(id, name, assignmentMethod, status) VALUES 
(1, 'Pepsi', 'A', 'Active');

-- -----------------------------------------------------
-- Table `teamSupporter`
-- -----------------------------------------------------

drop table if exists `teamSupporter`;

CREATE TABLE `teamSupporter` (
  `teamid` int NOT NULL,
  `supporterid` int NOT NULL,
  
  PRIMARY KEY (`teamid`, `supporterid`),
  
  CONSTRAINT `FK_teamid_teamSupporter` FOREIGN KEY (`teamid`) REFERENCES `team` (`id`) 
  ON DELETE NO ACTION ON UPDATE NO ACTION,
  
  CONSTRAINT `FK_supporterid_teamSupporter` FOREIGN KEY (`supporterid`) REFERENCES `user` (`id`) 
  ON DELETE NO ACTION ON UPDATE NO ACTION
  
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `teamSupporter`(teamid, supporterid) VALUES 
(1, 10),
(1, 11),
(1, 12);

-- -----------------------------------------------------
-- Table `ticketStatus`
-- -----------------------------------------------------

drop table if exists `ticketStatus`;

CREATE TABLE `ticketStatus` (

	`statusid` int NOT NULL,
	`name` varchar(255) NOT NULL,
    
	PRIMARY KEY (`statusid`)
  
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ticketStatus`(statusid, name) VALUES 
(1,'Open'),
(2,'Cancel'),
(3,'Assigned'),
(4,'Resolved'),
(5,'Closed');

-- -----------------------------------------------------
-- Table `ticket`
-- -----------------------------------------------------

drop table if exists `ticket`;

CREATE TABLE `ticket` (

	`ticketid` int NOT NULL AUTO_INCREMENT,
	`subject` varchar(2000) NOT NULL,
	`categoryid` int NOT NULL,
	`creatorid` int NOT NULL,
	`teamid` int NOT NULL,
	`priorityid` int NOT NULL,
	`assigneeid` int DEFAULT NULL,
	`ticketStatusid` int NOT NULL,
	`content` text NOT NULL,
	`fileUrl` varchar(255) DEFAULT NULL,
	`createDatetime` datetime NOT NULL,
	`lastUpdateDatetime` datetime NOT NULL,
    
	PRIMARY KEY (`ticketid`),
    
	KEY `FK_categoryid_ticket` (`categoryid`),
	KEY `FK_creatorid_ticket` (`creatorid`),
	KEY `FK_teamid_ticket` (`teamid`),
	KEY `FK_priorityid_ticket` (`priorityid`),
	KEY `FK_ticketStatusid_ticket` (`ticketStatusid`),
    
	CONSTRAINT `FK_categoryid_ticket` FOREIGN KEY (`categoryid`) REFERENCES `category` (`id`),
	CONSTRAINT `FK_creatorid_ticket` FOREIGN KEY (`creatorid`) REFERENCES `user` (`id`),
	CONSTRAINT `FK_priorityid_ticket` FOREIGN KEY (`priorityid`) REFERENCES `priority` (`id`),
	CONSTRAINT `FK_teamid_ticket` FOREIGN KEY (`teamid`) REFERENCES `team` (`id`),
	CONSTRAINT `FK_ticketStatusid_ticket` FOREIGN KEY (`ticketStatusid`) REFERENCES `ticketstatus` (`statusid`)
  
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ticket`(ticketid, subject, categoryid, creatorid, teamid, priorityid, assigneeid, ticketStatusid, content, fileUrl, createDatetime, lastUpdateDatetime) VALUES 
(1,'Laptop bị hỏng',1,1,1,1,10,3,'Laptop bị hỏng. Vui lòng thay laptop mới',NULL,'2023-03-18 08:30:00','2023-03-18 11:30:00'),
(2,'Máy in bị hết mực',3,1,1,1,null,1,'Máy in bị hết mực. Đề nghị thay mực máy in',NULL,'2023-03-23 22:05:00','2023-03-23 22:05:00'),
(3,'Không thể kết nối mạng wifi',4,2,1,2,11,3,'Không tìm thấy mạng wifi nên không thể kết nối internet qua wifi',NULL,'2023-03-26 11:18:00','2023-03-27 15:18:00');


-- -----------------------------------------------------
-- Table `comment`
-- -----------------------------------------------------

drop table if exists `comment`;

CREATE TABLE `comment` (

	`ticketid` int NOT NULL,
	`commentid` int NOT NULL AUTO_INCREMENT,
	`commentDescription` varchar(255) NOT NULL,
	`commenterid` int NOT NULL,
	`commentDatetime` datetime NOT NULL,
    
	PRIMARY KEY (`commentid`),
    
	KEY `FK_ticketid_comment` (`ticketid`),
	KEY `FK_commenterid_comment` (`commenterid`),
	CONSTRAINT `FK_commenterid_comment` FOREIGN KEY (`commenterid`) REFERENCES `user` (`id`),
	CONSTRAINT `FK_ticketid_comment` FOREIGN KEY (`ticketid`) REFERENCES `ticket` (`ticketid`)
  
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `comment`(ticketid, commentid, commentDescription, commenterid, commentDatetime) VALUES 
(1, 1, 'Sẽ thay laptop mới cho bạn', 10 , '2023-03-19 08:30:00'),
(3, 2, 'Vui lòng khởi động lại laptop sau đó kết nối lại wifi', 11 , '2023-03-26 13:30:00');





