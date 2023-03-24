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
(1,'dunglh+customer@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Quân','Châu','3333333330','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),
(2,'dunglh+supporter@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Hồng Đào','Trịnh','2222222221','456 Suong Nguyet Anh','ROLE_SUPPORTER','Active'),
(3,'nguoiquantri@proton.me','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Văn Khiêm','Tô','1444444444','79 Huyen Tran Cong Chua','ROLE_ADMIN','Active'),

(4,'dunglh+supporter2@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Kim Dung','Hồ','2222222222','456 Suong Nguyet Anh','ROLE_SUPPORTER','Active'),
(5,'dunglh+supporter3@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Ngọc Yến','Võ','2222222223','456 Suong Nguyet Anh','ROLE_SUPPORTER','Active'),
(6,'dunglh+supporter4@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Yến Quyên','Trần','2222222224','456 Suong Nguyet Anh','ROLE_SUPPORTER','Active'),
(7,'dunglh+supporter5@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Văn Khá','Đồng','2222222225','456 Suong Nguyet Anh','ROLE_SUPPORTER','Active'),
(8,'dunglh+supporter6@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Xuân Trung','Tô','2222222226','456 Suong Nguyet Anh','ROLE_SUPPORTER','Inactive'),
(9,'nguoihotro@proton.me','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Cúc','Đinh','2666666666','22 Nguyen Thi Minh Khai','ROLE_SUPPORTER','Active'),
(10,'dunglh@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Hồng Dũng','Lâm','0986814665','90/12/1/6 Bong Sao','ROLE_ADMIN','Active'),
(11,'dunglh+admin@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Văn An','Nguyễn','1111111111','123 Pham Hung','ROLE_ADMIN','Active'),
(12,'dunglh+customer2@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Văn Tâm','Hoàng','3333333332','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),
(13,'dunglh+customer3@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Kim Uyên','Phan','3333333333','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),
(14,'dunglh+customer4@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Nguyên Đức','Đặng','3333333334','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),
(15,'dunglh+customer5@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Đăng Khoa','Đỗ','3333333335','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),
(16,'dunglh+customer6@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thu Hằng','Ngô','3333333336','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),
(17,'dunglh+customer7@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Bạch Ngọc','Dương','3333333337','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),
(18,'dunglh+customer8@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Huệ Anh','Âu','3333333338','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),
(19,'dunglh+customer9@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Ngọc Bích','Tạ','3333333339','789 Vo Van Kiet','ROLE_CUSTOMER','Inactive'),
(20,'khachhang_hd@proton.me','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Phương','Bùi','8888888888','789 Pham The Hien','ROLE_CUSTOMER','Active');

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
(1, 2),
(1, 4),
(1, 5);

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
	`subject` varchar(255) NOT NULL,
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
(1,'Laptop bị hỏng',1,1,1,1,2,3,'Laptop bị hỏng. Vui lòng thay laptop mới',NULL,'2023-03-18 08:30:00','2023-03-18 08:30:00'),
(2,'Máy in bị hết mực',3,1,1,1,null,1,'Máy in bị hết mực. Đề nghị thay mực máy in',NULL,'2023-03-23 22:05:00','2023-03-23 22:05:00');


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
(1, 1, 'Sẽ thay laptop mới cho bạn', 2 , '2023-03-19 08:30:00');





