-- -------------
-- database   --
-- -------------
drop database if exists helpdesk;

create database helpdesk;

use helpdesk;

-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------

set foreign_key_checks = 0;

drop table if exists `user`;

create table `user` (

	`id` int not null auto_increment,
	`email` varchar(255) not null,
	`password` varchar(255) not null,
	`firstName` varchar(255) not null,
	`lastName` varchar(255) not null,
	`phone` varchar(255) not null,
	`address` varchar(255) null,

	-- "ROLE_CUSTOMER", "ROLE_SUPPORTER", "ROLE_ADMIN"
	`role` varchar(255) not null,
	-- "Active", "Inactive"
	`status` varchar(255) not null,

	primary key (`id`),
	unique (`email`)
    
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into `user`(id, email, password, firstName, lastName, phone, address, role, status) values
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
(10,'dunglh+supporter@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Minh Thảo','Lâm','0222222220','','ROLE_SUPPORTER','Active'),
(11,'dunglh+supporter1@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thúy Hà','Nguyễn','0222222221','','ROLE_SUPPORTER','Active'),
(12,'dunglh+supporter2@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Hồng Đào','Trịnh','0222222222','','ROLE_SUPPORTER','Active'),
(13,'dunglh+supporter3@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Chí Thiện','Trần','0222222223','','ROLE_SUPPORTER','Active'),
(14,'dunglh+supporter4@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Quân Bảo','Trương','0222222224','','ROLE_SUPPORTER','Active'),
(15,'dunglh+supporter5@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Hoài Linh','Võ','0222222225','','ROLE_SUPPORTER','Active'),
(16,'dunglh+supporter6@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Nguyệt','Lê','0222222226','','ROLE_SUPPORTER','Active'),
(17,'dunglh+supporter7@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Ngọc Yến','Nguyễn','0222222227','','ROLE_SUPPORTER','Active'),
(18,'dunglh+supporter8@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Yến Quyên','Lý','0222222228','','ROLE_SUPPORTER','Active'),
(19,'dunglh+supporter9@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Ngọc Tư','Nguyễn','0222222229','','ROLE_SUPPORTER','Active'),
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

set foreign_key_checks = 1;

-- -----------------------------------------------------
-- Table `category`
-- -----------------------------------------------------

set foreign_key_checks = 0;

drop table if exists `category`;

create table `category` (

	`id` int not null auto_increment,
	`name` varchar(255) not null,
	`status`varchar(255) not null,

	primary key (`id`)
    
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into `category`(id, name, status) values 
(1, 'Hardward(Laptop / PC / Printer)', 'Active'),
(2, 'Networking', 'Active'),
(3, 'Software(Office365 / Microsoft project / Visio)', 'Active'),
(4, 'Annual leave', 'Active'),
(5, 'Access office(access card / face recognition)', 'Active'),
(6, 'Business trip', 'Active'),
(7, 'Other', 'Active');

set foreign_key_checks = 1;

-- -----------------------------------------------------
-- Table `priority`
-- -----------------------------------------------------

set foreign_key_checks = 0;

drop table if exists `priority`;

create table `priority` (

	`id` int not null auto_increment,
	`name` varchar(255) not null,
	`resolveIn` int not null,

	-- "Active", "Inactive"
	`status` varchar(255) not null,
    
	primary key (`id`)
    
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into `priority`(id, name, resolveIn, status) values 
(1, 'High', 12, 'Active'),
(2, 'Normal', 24, 'Active'),
(3, 'Low', 36, 'Active');

set foreign_key_checks = 1;

-- -----------------------------------------------------
-- Table `team`
-- -----------------------------------------------------

set foreign_key_checks = 0;

drop table if exists `team`;

create table `team` (

	`id` int not null auto_increment,
	`name` varchar(255) not null,

	-- 'A': Auto, 'M': Manual
	`assignmentMethod` varchar(255) not null,
    
	-- "Active", "Inactive"
	`status` varchar(255) not null,

	primary key (`id`)
  
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into `team`(id, name, assignmentMethod, status) values 
(1, 'Information technology', 'A', 'Active'),
(2, 'Human resource', 'M', 'Active'),
(3, 'Finance', 'A', 'Active');

set foreign_key_checks = 1;

-- -----------------------------------------------------
-- Table `teamSupporter`
-- -----------------------------------------------------

set foreign_key_checks = 0;

drop table if exists `teamSupporter`;

create table `teamSupporter` (

	`teamid` int not null,
	`supporterid` int not null,

	primary key (`teamid`, `supporterid`),

	constraint `fk_teamid_teamSupporter` foreign key(`teamid`) references `team` (`id`) 
	on delete no action on update no action,

	constraint `fk_supporterid_teamSupporter` foreign key (`supporterid`) references `user` (`id`) 
	on delete no action on update no action
  
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into `teamSupporter`(teamid, supporterid) values 
(1, 10),
(1, 11),
(1, 12),
(2, 13),
(3, 14);


set foreign_key_checks = 1;

-- -----------------------------------------------------
-- Table `ticketStatus`
-- -----------------------------------------------------

set foreign_key_checks = 0;

drop table if exists `ticketStatus`;

create table `ticketStatus` (

	`statusid` int not null,
	`name` varchar(255) not null,
    
	primary key (`statusid`)
  
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into `ticketStatus`(statusid, name) values 
(1,'Open'),
(2,'Assigned'),
(3,'Resolved'),
(4,'Closed'),
(5,'Cancel');

set foreign_key_checks = 1;

-- -----------------------------------------------------
-- Table `ticket`
-- -----------------------------------------------------

set foreign_key_checks = 0;

drop table if exists `ticket`;

create table `ticket` (

	`ticketid` int not null auto_increment,
	`subject` varchar(2000) not null,
	`categoryid` int not null,
	`creatorid` int not null,
	`teamid` int not null,
	`priorityid` int not null,
	`assigneeid` int default null,
	`ticketStatusid` int not null,
	`content` text not null,
    
    -- customFilename = timestamp + UUID + extension(ex: .jpg)
	`customFilename` varchar(255) default null,
    
	`createDatetime` datetime not null,
	`lastUpdateDatetime` datetime not null,
	`lastUpdateByUserid` int not null,
    
	primary key (`ticketid`),
    
	key `fk_categoryid_ticket` (`categoryid`),
	key `fk_creatorid_ticket` (`creatorid`),
	key `fk_teamid_ticket` (`teamid`),
	key `fk_priorityid_ticket` (`priorityid`),
	key `fk_ticketStatusid_ticket` (`ticketStatusid`),
	key `fk_lastUpdateByUserid_ticket` (`lastUpdateByUserid`),
    
	constraint `fk_categoryid_ticket` foreign key (`categoryid`) references `category` (`id`),
	constraint `fk_creatorid_ticket` foreign key (`creatorid`) references `user` (`id`),
	constraint `fk_priorityid_ticket` foreign key (`priorityid`) references `priority` (`id`),
	constraint `fk_teamid_ticket` foreign key (`teamid`) references `team` (`id`),
	constraint `fk_ticketStatusid_ticket` foreign key (`ticketStatusid`) references `ticketstatus` (`statusid`),
	constraint `fk_lastUpdateByUserid_ticket` foreign key (`lastUpdateByUserid`) references `user` (`id`)
  
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

INSERT INTO `ticket` VALUES (101,'Laptop bị hỏng nhờ IT thay laptop mới dùm',1,1,1,1,10,4,'<p>Dear phòng IT,</p><p>Laptop của mình bị hỏng. Nhờ phòng IT kiểm tra và thay laptop mới dùm.</p><p>Cảm ơn nhiều.</p>','20230422145436_e42c2cc4-0d0b-44ec-8734-de7d27b7d4e0.jpg','2023-04-22 14:54:40','2023-04-22 15:08:56',10),(102,'Laptop không thể kết nối wifi được',2,1,1,1,11,4,'<p>Dear IT,</p><p>Laptop mình không thể kết nối wifi được.</p><p>Nhờ IT kiểm tra giúp.</p><p>Cảm ơn.</p>','20230423102047_ad43fa70-2701-4095-86fa-b284631a3205.jpg','2023-04-23 10:20:52','2023-04-23 10:39:46',11),(103,'Xin nghỉ phép năm',4,1,2,2,13,4,'<p>Dear phòng HR,</p><p>Do có việc cá nhân nên xin phép phòng HR cho mình nghỉ phép ngày 25/4 nhé.</p><p>Cảm ơn nhiều.</p>','','2023-04-23 15:16:08','2023-04-23 15:22:50',13),(104,'Nhờ phòng IT cài Visio trên máy cá nhân',3,1,1,1,10,5,'<p>Dear phòng IT,</p><p>Nhờ phòng IT cài giúp phần mềm Visio trên máy cá nhân để phục vụ cho công việc.</p><p>Cảm ơn phòng IT nhiều.</p>','','2023-04-23 16:46:01','2023-04-23 16:49:48',10),(105,'Nhờ IT reset password cho email abc@xyz.com',3,1,1,2,12,4,'<p>Dear IT,</p><p>Nhờ IT reset password cho email abc@xyz.com dùm.</p><p>Cảm ơn nhiều.</p>','','2023-04-23 20:33:24','2023-04-24 09:18:12',12),(106,'Xin tạm ứng tiền đi công tác',6,1,3,1,14,2,'<p>Dear phòng Finance,</p><p>Nhờ phòng finance tạm ứng tiền cho mình để mình đi công tác ở Đà Nẵng.</p><p>Cảm ơn nhiều.</p>','','2023-04-24 09:23:56','2023-04-24 09:23:56',1);

set foreign_key_checks = 1;

-- -----------------------------------------------------
-- Table `comment`
-- -----------------------------------------------------

set foreign_key_checks = 0;

drop table if exists `comment`;

create table `comment` (

	`ticketid` int not null,
	`commentid` int not null auto_increment,
	`commentDescription` text not null,
	`commenterid` int not null,
	`commentDatetime` datetime not null,
    
	-- commentCustomFilename = timestamp + UUID + extension(ex: .jpg)
	`commentCustomFilename` varchar(255) default null,
    
	PRIMARY key (`commentid`),
    
	key `fk_ticketid_comment` (`ticketid`),
	key `fk_commenterid_comment` (`commenterid`),
	constraint `fk_commenterid_comment` foreign key (`commenterid`) references `user` (`id`),
	constraint `fk_ticketid_comment` foreign key (`ticketid`) references `ticket` (`ticketid`)
  
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

INSERT INTO `comment` VALUES (101,101,'<p>Chào bạn,</p><p>Bạn vui lòng mang laptop lên phòng IT để chúng tôi kiểm tra nhé.</p><p>Cảm ơn bạn nhiều.</p>',10,'2023-04-22 14:56:29',''),(101,102,'<p>Chào bạn,</p><p>Phòng IT đã thay laptop mới cho bạn.</p><p>Cần hỗ trợ gì thêm thì bạn vui lòng liên hệ phòng IT nhé.</p><p>Cảm ơn bạn nhiều.</p>',10,'2023-04-22 14:59:05',''),(101,103,'<p>Cảm ơn phòng IT nhiều nhé!</p>',1,'2023-04-22 15:08:22',''),(102,104,'<p>Chào bạn,</p><p>Bạn vui lòng làm theo hình đính kèm ở đây thử xem nhé!</p><p>Nếu không được nữa thì đem máy lên phòng IT để mình kiểm tra cho nhé!</p><p>Cảm ơn nhiều.</p>',11,'2023-04-23 10:36:01','20230423103516_41bae1e6-6352-4faa-a58e-7e9222b367ea.jpg'),(102,105,'<p>Chào IT,</p><p>Mình đã kết nối wifi được rồi.</p><p>Cảm ơn bạn nhiều nhé!</p>',1,'2023-04-23 10:38:13',''),(103,106,'<p>OK. phòng HR ghi nhận nhé!</p>',13,'2023-04-23 15:18:59',''),(104,107,'<p>Chào bạn,</p><p>Phòng IT chỉ hỗ trợ cài Visio trên máy công ty. Phòng IT không hỗ trợ cài cho máy cá nhân.</p><p>Mong bạn thông cảm.</p>',10,'2023-04-23 16:49:31',''),(105,108,'<p>Chào bạn,</p><p>IT đã reset password cho bạn rồi nhé!</p><p>Cảm ơn.</p>',12,'2023-04-24 09:16:46','');

set foreign_key_checks = 1;

-- -----------------------------------------------------
-- Table `fileStorage`
-- -----------------------------------------------------

set foreign_key_checks = 0;

drop table if exists `fileStorage`;

create table `fileStorage` (

	`id` int not null auto_increment,
    
    -- customFilename = timestamp + UUID + extension(ex: .jpg)
	`customFilename` varchar(255) not null,
    
    -- ex: abc.jpg
    `originalFilename` varchar(255) not null,
    
    -- ex: 'image/jpeg', 'text/plain'
	`fileType` varchar(255) not null,
    
	PRIMARY key (`id`),
    unique (`customFilename`)
      
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

INSERT INTO `filestorage` VALUES (1,'20230422145436_e42c2cc4-0d0b-44ec-8734-de7d27b7d4e0.jpg','beach4.jpg','image/jpeg'),(2,'20230423102047_ad43fa70-2701-4095-86fa-b284631a3205.jpg','leaf1.jpg','image/jpeg'),(3,'20230423103516_41bae1e6-6352-4faa-a58e-7e9222b367ea.jpg','ketnoiwifi.jpg','image/jpeg');

set foreign_key_checks = 1;



