--------------
-- database --
--------------
drop database if exists helpdesk;

create database helpdesk;

use helpdesk;

-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------

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
(10,'dunglh+supporter@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Ngộ Không','Tôn','0222222220','','ROLE_SUPPORTER','Active'),
(11,'dunglh+supporter1@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Bát Giới','Trư','0222222221','','ROLE_SUPPORTER','Active'),
(12,'dunglh+supporter2@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Ngộ Tịnh','Sa','0222222222','','ROLE_SUPPORTER','Active'),
(13,'dunglh+supporter3@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Huyền Trang','Trần','0222222223','','ROLE_SUPPORTER','Active'),
(14,'dunglh+supporter4@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Long Mã','Bạch','0222222224','','ROLE_SUPPORTER','Active'),
(15,'dunglh+supporter5@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Ma Vương','Ngưu','0222222225','','ROLE_SUPPORTER','Active'),
(16,'dunglh+supporter6@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Hài Nhi','Hồng','0222222226','','ROLE_SUPPORTER','Active'),
(17,'dunglh+supporter7@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Tiên','Hạnh','0222222227','','ROLE_SUPPORTER','Active'),
(18,'dunglh+supporter8@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thúy Lan','Cao','0222222228','','ROLE_SUPPORTER','Active'),
(19,'dunglh+supporter9@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Nga','Hằng','0222222229','','ROLE_SUPPORTER','Active'),
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

create table `category` (

	`id` int not null auto_increment,
	`name` varchar(255) not null,
	`status`varchar(255) not null,

	primary key (`id`)
    
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into `category`(id, name, status) values 
(1, 'Laptop', 'Active'),
(2, 'PC', 'Active'),
(3, 'Printer', 'Active'),
(4, 'Networking', 'Active'),
(5, 'Office365', 'Active'),
(6, 'Software', 'Active'),
(7, 'Access card', 'Active'),
(8, 'Seat', 'Active'),
(9, 'Other', 'Active');

-- -----------------------------------------------------
-- Table `priority`
-- -----------------------------------------------------

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

-- -----------------------------------------------------
-- Table `team`
-- -----------------------------------------------------

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
(1, 'Pepsi', 'A', 'Active');

-- -----------------------------------------------------
-- Table `teamSupporter`
-- -----------------------------------------------------

drop table if exists `teamSupporter`;

create table `teamSupporter` (

	`teamid` int not null,
	`supporterid` int not null,

	primary key (`teamid`, `supporterid`),

	constraint `FK_teamid_teamSupporter` foreign key(`teamid`) references `team` (`id`) 
	on delete no action on update no action,

	constraint `FK_supporterid_teamSupporter` foreign key (`supporterid`) references `user` (`id`) 
	on delete no action on update no action
  
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into `teamSupporter`(teamid, supporterid) values 
(1, 10),
(1, 11),
(1, 12);

-- -----------------------------------------------------
-- Table `ticketStatus`
-- -----------------------------------------------------

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


-- -----------------------------------------------------
-- Table `ticket`
-- -----------------------------------------------------

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
	`fileUrl` varchar(255) default null,
	`createDatetime` datetime not null,
	`lastUpdateDatetime` datetime not null,
    
	primary key (`ticketid`),
    
	key `FK_categoryid_ticket` (`categoryid`),
	key `FK_creatorid_ticket` (`creatorid`),
	key `FK_teamid_ticket` (`teamid`),
	key `FK_priorityid_ticket` (`priorityid`),
	key `FK_ticketStatusid_ticket` (`ticketStatusid`),
    
	constraint `FK_categoryid_ticket` foreign key (`categoryid`) references `category` (`id`),
	constraint `FK_creatorid_ticket` foreign key (`creatorid`) references `user` (`id`),
	constraint `FK_priorityid_ticket` foreign key (`priorityid`) references `priority` (`id`),
	constraint `FK_teamid_ticket` foreign key (`teamid`) references `team` (`id`),
	constraint `FK_ticketStatusid_ticket` foreign key (`ticketStatusid`) references `ticketstatus` (`statusid`)
  
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into `ticket`(ticketid, subject, categoryid, creatorid, teamid, priorityid, assigneeid, ticketStatusid, content, fileUrl, createDatetime, lastUpdateDatetime) values 
(1,'Laptop bị hỏng',1,1,1,1,10,3,'Laptop bị hỏng. Vui lòng thay laptop mới',null,'2023-03-18 08:30:00','2023-03-18 11:30:00'),
(2,'Máy in bị hết mực',3,1,1,1,null,1,'Máy in bị hết mực. Đề nghị thay mực máy in',null,'2023-03-23 22:05:00','2023-03-23 22:05:00'),
(3,'Không thể kết nối mạng wifi',4,2,1,2,11,3,'Không tìm thấy mạng wifi nên không thể kết nối internet qua wifi',null,'2023-03-26 11:18:00','2023-03-27 15:18:00'),
(4,'Không thể xuất báo cáo từ phần mềm',6,2,1,3,11,4,'Không thể xuất báo cáo từ phần. Nhờ đợi kỹ thuật kiểm tra giúp',null,'2023-03-28 08:00:00','2023-03-28 10:00:00'),
(5,'Xin cài phần mềm Visio cho laptop',6,1,1,2,11,5,'Nhờ IT cài phần mềm Visio cho máy laptop cá nhân',null,'2023-03-29 10:40:00','2023-03-29 11:00:00'),
(6,'Nhờ reset password email account: abc@xyz.com',5,2,1,2,10,2,'Nhờ IT reset password cho email account abc@xyz.com. Cảm ơn IT nhiều!',null,'2023-03-30 21:30:00','2023-03-31 10:00:00');


-- -----------------------------------------------------
-- Table `comment`
-- -----------------------------------------------------

drop table if exists `comment`;

create table `comment` (

	`ticketid` int not null,
	`commentid` int not null auto_increment,
	`commentDescription` varchar(255) not null,
	`commenterid` int not null,
	`commentDatetime` datetime not null,
    
	PRIMARY key (`commentid`),
    
	key `FK_ticketid_comment` (`ticketid`),
	key `FK_commenterid_comment` (`commenterid`),
	constraint `FK_commenterid_comment` foreign key (`commenterid`) references `user` (`id`),
	constraint `FK_ticketid_comment` foreign key (`ticketid`) references `ticket` (`ticketid`)
  
) engine=InnoDB auto_increment=101 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into `comment`(ticketid, commentid, commentDescription, commenterid, commentDatetime) values 
(1, 1, 'Sẽ thay laptop mới cho bạn', 10 , '2023-03-19 08:30:00'),
(3, 2, 'Vui lòng khởi động lại laptop sau đó kết nối lại wifi', 11 , '2023-03-26 13:30:00');




