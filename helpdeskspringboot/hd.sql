--------------
-- database --
--------------
DROP DATABASE IF EXISTS hd;

create database hd;

use hd;

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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user`(email, password, firstName, lastName, phone, address, role, status) VALUES
-- Admin
('dunglh@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hồng Dũng', 'Lâm', '0986814665', '90/12/1/6 Bong Sao', 'ROLE_ADMIN', 'Active'),
('dunglh+admin@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Quản Trị', 'Người', '1111111111', '123 Pham Hung', 'ROLE_ADMIN', 'Active'),
('nguoiquantri@proton.me', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Tuấn Nam', 'Trần', '1444444444', '79 Huyen Tran Cong Chua', 'ROLE_ADMIN', 'Active'),

-- supporter
('dunglh+supporter@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hỗ Trợ', 'Người', '2222222221', '456 Suong Nguyet Anh', 'ROLE_SUPPORTER', 'Active'),
('dunglh+supporter2@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hỗ Trợ 2', 'Người', '2222222222', '456 Suong Nguyet Anh', 'ROLE_SUPPORTER', 'Active'),
('dunglh+supporter3@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hỗ Trợ 3', 'Người', '2222222223', '456 Suong Nguyet Anh', 'ROLE_SUPPORTER', 'Active'),
('dunglh+supporter4@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hỗ Trợ 4', 'Người', '2222222224', '456 Suong Nguyet Anh', 'ROLE_SUPPORTER', 'Active'),
('dunglh+supporter5@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hỗ Trợ 5', 'Người', '2222222225', '456 Suong Nguyet Anh', 'ROLE_SUPPORTER', 'Active'),
('dunglh+supporter6@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hỗ Trợ 6', 'Người', '2222222226', '456 Suong Nguyet Anh', 'ROLE_SUPPORTER', 'Inactive'),
('nguoihotro@proton.me', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Anh Trung', 'Nguyễn', '2666666666', '22 Nguyen Thi Minh Khai', 'ROLE_SUPPORTER', 'Active'),

-- customer
('dunglh+customer@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hàng', 'Khách', '3333333330', '789 Vo Van Kiet', 'ROLE_CUSTOMER', 'Active'),
('dunglh+customer2@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hàng 2', 'Khách', '3333333332', '789 Vo Van Kiet', 'ROLE_CUSTOMER', 'Active'),
('dunglh+customer3@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hàng 3', 'Khách', '3333333333', '789 Vo Van Kiet', 'ROLE_CUSTOMER', 'Active'),
('dunglh+customer4@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hàng 4', 'Khách', '3333333334', '789 Vo Van Kiet', 'ROLE_CUSTOMER', 'Active'),
('dunglh+customer5@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hàng 5', 'Khách', '3333333335', '789 Vo Van Kiet', 'ROLE_CUSTOMER', 'Active'),
('dunglh+customer6@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hàng 6', 'Khách', '3333333336', '789 Vo Van Kiet', 'ROLE_CUSTOMER', 'Active'),
('dunglh+customer7@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hàng 7', 'Khách', '3333333337', '789 Vo Van Kiet', 'ROLE_CUSTOMER', 'Active'),
('dunglh+customer8@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hàng 8', 'Khách', '3333333338', '789 Vo Van Kiet', 'ROLE_CUSTOMER', 'Active'),
('dunglh+customer9@gmail.com', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Hàng 9', 'Khách', '3333333339', '789 Vo Van Kiet', 'ROLE_CUSTOMER', 'Inactive'),
('khachhang_hd@proton.me', '$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC', 'Thị Quyên', 'Bùi', '8888888888', '789 Pham The Hien', 'ROLE_CUSTOMER', 'Active');


-- -----------------------------------------------------
-- Table `category`
-- -----------------------------------------------------

drop table if exists `category`;

CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) not NULL,
  `status` VARCHAR(255) not NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `category`(name, status) VALUES 
('Laptop', 'Active'),
('PC', 'Active'),
('Printer', 'Active'),
('Networking', 'Active'),
('Office365', 'Active'),
('Access card', 'Active'),
('Seat', 'Active'),
('Other', 'Active');

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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `priority`(name, resolveIn, status) VALUES 
('Urgent', 8, 'Active'),
('High', 12, 'Active'),
('Normal', 24, 'Active'),
('Low', 36, 'Active'),
('Very Low', 0, 'Active');

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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `team`(name, assignmentMethod, status) VALUES 
('Pepsi', 'A', 'Active'),
('Coca', 'A', 'Active'),
('Honda', 'M', 'Active');

-- -----------------------------------------------------
-- Table `team`
-- -----------------------------------------------------

drop table if exists `teamSupporter`;

CREATE TABLE `teamSupporter` (
  `teamid` int NOT NULL,
  `supporterid` int NOT NULL,
  
  PRIMARY KEY (`teamid`, `supporterid`),
  
  CONSTRAINT `FK_team` FOREIGN KEY (`teamid`) REFERENCES `team` (`id`) 
  ON DELETE NO ACTION ON UPDATE NO ACTION,
  
  CONSTRAINT `FK_user` FOREIGN KEY (`supporterid`) REFERENCES `user` (`id`) 
  ON DELETE NO ACTION ON UPDATE NO ACTION
  
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `teamSupporter`(teamid, supporterid) VALUES 
(1, 4),
(1, 5),
(1, 6);

-- --
-- -- -- ezbank
-- --

-- drop table if exists `customer`;

-- CREATE TABLE `customer` (
--   `customer_id` int NOT NULL AUTO_INCREMENT,
--   `name` varchar(100) NOT NULL,
--   `email` varchar(100) NOT NULL,
--   `mobile_number` varchar(20) NOT NULL,
--   `pwd` varchar(500) NOT NULL,
--   `role` varchar(100) NOT NULL,
--   `create_dt` date DEFAULT NULL,
--   PRIMARY KEY (`customer_id`)
-- );

-- INSERT INTO `customer` (`name`,`email`,`mobile_number`, `pwd`, `role`,`create_dt`)
--  VALUES ('Happy','happy@example.com','9876548337', '$2y$12$oRRbkNfwuR8ug4MlzH5FOeui.//1mkd.RsOAJMbykTSupVy.x/vb2', 'admin',CURDATE());

-- drop table if exists `accounts`;

-- CREATE TABLE `accounts` (
--   `customer_id` int NOT NULL,
--    `account_number` bigint NOT NULL,
--   `account_type` varchar(100) NOT NULL,
--   `branch_address` varchar(200) NOT NULL,
--   `create_dt` date DEFAULT NULL,
--   PRIMARY KEY (`account_number`),
--   KEY `customer_id` (`customer_id`),
--   CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE
-- );

-- INSERT INTO `accounts` (`customer_id`, `account_number`, `account_type`, `branch_address`, `create_dt`)
--  VALUES (1, 186576453434, 'Savings', '123 Main Street, New York', CURDATE());

-- drop table if exists `account_transactions`;

-- CREATE TABLE `account_transactions` (
--   `transaction_id` varchar(200) NOT NULL,
--   `account_number` bigint NOT NULL,
--   `customer_id` int NOT NULL,
--   `transaction_dt` varchar(200) NOT NULL,
--   `transaction_summary` varchar(200) NOT NULL,
--   `transaction_type` varchar(100) NOT NULL,
--   `transaction_amt` int NOT NULL,
--   `closing_balance` int NOT NULL,
--   `create_dt` date DEFAULT NULL,
--   PRIMARY KEY (`transaction_id`),
--   KEY `customer_id` (`customer_id`),
--   KEY `account_number` (`account_number`),
--   CONSTRAINT `accounts_ibfk_2` FOREIGN KEY (`account_number`) REFERENCES `accounts` (`account_number`) ON DELETE CASCADE,
--   CONSTRAINT `acct_user_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE
-- );

-- INSERT INTO `account_transactions` (`transaction_id`, `account_number`, `customer_id`, `transaction_dt`, `transaction_summary`, `transaction_type`,`transaction_amt`,
-- `closing_balance`, `create_dt`)  VALUES (UUID(), 186576453434, 1, now(), 'Coffee Shop', 'Withdrawal', 30,34500,now());

-- INSERT INTO `account_transactions` (`transaction_id`, `account_number`, `customer_id`, `transaction_dt`, `transaction_summary`, `transaction_type`,`transaction_amt`,
-- `closing_balance`, `create_dt`)  VALUES (UUID(), 186576453434, 1, now()-6, 'Uber', 'Withdrawal', 100,34400,now()-6);

-- INSERT INTO `account_transactions` (`transaction_id`, `account_number`, `customer_id`, `transaction_dt`, `transaction_summary`, `transaction_type`,`transaction_amt`,
-- `closing_balance`, `create_dt`)  VALUES (UUID(), 186576453434, 1, now()-5, 'Self Deposit', 'Deposit', 500,34900,now()-5);

-- drop table if exists `loans`;

-- CREATE TABLE `loans` (
--   `loan_number` int NOT NULL AUTO_INCREMENT,
--   `customer_id` int NOT NULL,
--   `start_dt` date NOT NULL,
--   `loan_type` varchar(100) NOT NULL,
--   `total_loan` int NOT NULL,
--   `amount_paid` int NOT NULL,
--   `outstanding_amount` int NOT NULL,
--   `create_dt` date DEFAULT NULL,
--   PRIMARY KEY (`loan_number`),
--   KEY `customer_id` (`customer_id`),
--   CONSTRAINT `loan_customer_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE
-- );

-- INSERT INTO `loans` ( `customer_id`, `start_dt`, `loan_type`, `total_loan`, `amount_paid`, `outstanding_amount`, `create_dt`)
--  VALUES ( 1, '2020-10-13', 'Home', 200000, 50000, 150000, '2020-10-13');

-- INSERT INTO `loans` ( `customer_id`, `start_dt`, `loan_type`, `total_loan`, `amount_paid`, `outstanding_amount`, `create_dt`)
--  VALUES ( 1, '2020-06-06', 'Vehicle', 40000, 10000, 30000, '2020-06-06');

-- INSERT INTO `loans` ( `customer_id`, `start_dt`, `loan_type`, `total_loan`, `amount_paid`, `outstanding_amount`, `create_dt`)
--  VALUES ( 1, '2018-02-14', 'Home', 50000, 10000, 40000, '2018-02-14');

-- INSERT INTO `loans` ( `customer_id`, `start_dt`, `loan_type`, `total_loan`, `amount_paid`, `outstanding_amount`, `create_dt`)
--  VALUES ( 1, '2018-02-14', 'Personal', 10000, 3500, 6500, '2018-02-14');

-- drop table if exists `cards`;

-- CREATE TABLE `cards` (
--   `card_id` int NOT NULL AUTO_INCREMENT,
--   `card_number` varchar(100) NOT NULL,
--   `customer_id` int NOT NULL,
--   `card_type` varchar(100) NOT NULL,
--   `total_limit` int NOT NULL,
--   `amount_used` int NOT NULL,
--   `available_amount` int NOT NULL,
--   `create_dt` date DEFAULT NULL,
--   PRIMARY KEY (`card_id`),
--   KEY `customer_id` (`customer_id`),
--   CONSTRAINT `card_customer_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE
-- );

-- INSERT INTO `cards` (`card_number`, `customer_id`, `card_type`, `total_limit`, `amount_used`, `available_amount`, `create_dt`)
--  VALUES ('4565XXXX4656', 1, 'Credit', 10000, 500, 9500, CURDATE());

-- INSERT INTO `cards` (`card_number`, `customer_id`, `card_type`, `total_limit`, `amount_used`, `available_amount`, `create_dt`)
--  VALUES ('3455XXXX8673', 1, 'Credit', 7500, 600, 6900, CURDATE());

-- INSERT INTO `cards` (`card_number`, `customer_id`, `card_type`, `total_limit`, `amount_used`, `available_amount`, `create_dt`)
--  VALUES ('2359XXXX9346', 1, 'Credit', 20000, 4000, 16000, CURDATE());


-- drop table if exists `notice_details`;

-- CREATE TABLE `notice_details` (
--   `notice_id` int NOT NULL AUTO_INCREMENT,
--   `notice_summary` varchar(200) NOT NULL,
--   `notice_details` varchar(500) NOT NULL,
--   `notic_beg_dt` date NOT NULL,
--   `notic_end_dt` date DEFAULT NULL,
--   `create_dt` date DEFAULT NULL,
--   `update_dt` date DEFAULT NULL,
--   PRIMARY KEY (`notice_id`)
-- );

-- INSERT INTO `notice_details` ( `notice_summary`, `notice_details`, `notic_beg_dt`, `notic_end_dt`, `create_dt`, `update_dt`)
-- VALUES ('Home Loan Interest rates reduced', 'Home loan interest rates are reduced as per the goverment guidelines. The updated rates will be effective immediately',
-- CURDATE() - INTERVAL 30 DAY, CURDATE() + INTERVAL 30 DAY, CURDATE(), null);

-- INSERT INTO `notice_details` ( `notice_summary`, `notice_details`, `notic_beg_dt`, `notic_end_dt`, `create_dt`, `update_dt`)
-- VALUES ('Net Banking Offers', 'Customers who will opt for Internet banking while opening a saving account will get a $50 amazon voucher',
-- CURDATE() - INTERVAL 30 DAY, CURDATE() + INTERVAL 30 DAY, CURDATE(), null);

-- INSERT INTO `notice_details` ( `notice_summary`, `notice_details`, `notic_beg_dt`, `notic_end_dt`, `create_dt`, `update_dt`)
-- VALUES ('Mobile App Downtime', 'The mobile application of the EazyBank will be down from 2AM-5AM on 12/05/2020 due to maintenance activities',
-- CURDATE() - INTERVAL 30 DAY, CURDATE() + INTERVAL 30 DAY, CURDATE(), null);

-- INSERT INTO `notice_details` ( `notice_summary`, `notice_details`, `notic_beg_dt`, `notic_end_dt`, `create_dt`, `update_dt`)
-- VALUES ('E Auction notice', 'There will be a e-auction on 12/08/2020 on the Bank website for all the stubborn arrears.Interested parties can participate in the e-auction',
-- CURDATE() - INTERVAL 30 DAY, CURDATE() + INTERVAL 30 DAY, CURDATE(), null);

-- INSERT INTO `notice_details` ( `notice_summary`, `notice_details`, `notic_beg_dt`, `notic_end_dt`, `create_dt`, `update_dt`)
-- VALUES ('Launch of Millennia Cards', 'Millennia Credit Cards are launched for the premium customers of EazyBank. With these cards, you will get 5% cashback for each purchase',
-- CURDATE() - INTERVAL 30 DAY, CURDATE() + INTERVAL 30 DAY, CURDATE(), null);

-- INSERT INTO `notice_details` ( `notice_summary`, `notice_details`, `notic_beg_dt`, `notic_end_dt`, `create_dt`, `update_dt`)
-- VALUES ('COVID-19 Insurance', 'EazyBank launched an insurance policy which will cover COVID-19 expenses. Please reach out to the branch for more details',
-- CURDATE() - INTERVAL 30 DAY, CURDATE() + INTERVAL 30 DAY, CURDATE(), null);

-- drop table if exists `contact_messages`;

-- CREATE TABLE `contact_messages` (
--   `contact_id` varchar(50) NOT NULL,
--   `contact_name` varchar(50) NOT NULL,
--   `contact_email` varchar(100) NOT NULL,
--   `subject` varchar(500) NOT NULL,
--   `message` varchar(2000) NOT NULL,
--   `create_dt` date DEFAULT NULL,
--   PRIMARY KEY (`contact_id`)
-- );


-- drop table if exists `authorities`;

-- CREATE TABLE `authorities` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `customer_id` int NOT NULL,
--   `name` varchar(50) NOT NULL,
--   PRIMARY KEY (`id`),
--   KEY `customer_id` (`customer_id`),
--   CONSTRAINT `authorities_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
-- );
