CREATE DATABASE  IF NOT EXISTS `helpdesk` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `helpdesk`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: helpdesk
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Laptop','Active'),(2,'PC','Active'),(3,'Printer','Active'),(4,'Networking','Active'),(5,'Office365','Active'),(6,'Access card','Active'),(7,'Seat','Active'),(8,'Other','Active');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,1,'Sẽ thay laptop mới cho bạn',2,'2023-03-19 08:30:00');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `priority`
--

DROP TABLE IF EXISTS `priority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `priority` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `resolveIn` int NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `priority`
--

LOCK TABLES `priority` WRITE;
/*!40000 ALTER TABLE `priority` DISABLE KEYS */;
INSERT INTO `priority` VALUES (1,'High',12,'Active'),(2,'Normal',24,'Active'),(3,'Low',36,'Active');
/*!40000 ALTER TABLE `priority` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `assignmentMethod` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (1,'Pepsi','A','Active');
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teamsupporter`
--

DROP TABLE IF EXISTS `teamsupporter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teamsupporter` (
  `teamid` int NOT NULL,
  `supporterid` int NOT NULL,
  
  PRIMARY KEY (`teamid`,`supporterid`),
  
  KEY `FK_user_teamSupporter` (`supporterid`),
  CONSTRAINT `FK_team_teamSupporter` FOREIGN KEY (`teamid`) REFERENCES `team` (`id`),
  CONSTRAINT `FK_user_teamSupporter` FOREIGN KEY (`supporterid`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teamsupporter`
--

LOCK TABLES `teamsupporter` WRITE;
/*!40000 ALTER TABLE `teamsupporter` DISABLE KEYS */;
INSERT INTO `teamsupporter` VALUES (1,2),(1,4),(1,5);
/*!40000 ALTER TABLE `teamsupporter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES (1,'Laptop bị hỏng',1,3,1,1,2,1,'Laptop bị hỏng. Vui long thay laptop mới',NULL,'2023-03-18 08:30:00','2023-03-18 08:30:00');
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticketstatus`
--

DROP TABLE IF EXISTS `ticketstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticketstatus` (
  `statusid` int NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`statusid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticketstatus`
--

LOCK TABLES `ticketstatus` WRITE;
/*!40000 ALTER TABLE `ticketstatus` DISABLE KEYS */;
INSERT INTO `ticketstatus` VALUES (1,'Open'),(2,'Cancel'),(3,'Assigned'),(4,'Resolved'),(5,'Closed');
/*!40000 ALTER TABLE `ticketstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'nguoiquantri@proton.me','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Văn Khiêm','Tô','1444444444','79 Huyen Tran Cong Chua','ROLE_ADMIN','Active'),(2,'dunglh+supporter@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Hồng Đào','Trịnh','2222222221','456 Suong Nguyet Anh','ROLE_SUPPORTER','Active'),(3,'dunglh+customer@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Quân','Châu','3333333330','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),(4,'dunglh+supporter2@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Kim Dung','Hồ','2222222222','456 Suong Nguyet Anh','ROLE_SUPPORTER','Active'),(5,'dunglh+supporter3@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Ngọc Yến','Võ','2222222223','456 Suong Nguyet Anh','ROLE_SUPPORTER','Active'),(6,'dunglh+supporter4@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Yến Quyên','Trần','2222222224','456 Suong Nguyet Anh','ROLE_SUPPORTER','Active'),(7,'dunglh+supporter5@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Văn Khá','Đồng','2222222225','456 Suong Nguyet Anh','ROLE_SUPPORTER','Active'),(8,'dunglh+supporter6@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Xuân Trung','Tô','2222222226','456 Suong Nguyet Anh','ROLE_SUPPORTER','Inactive'),(9,'nguoihotro@proton.me','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Cúc','Đinh','2666666666','22 Nguyen Thi Minh Khai','ROLE_SUPPORTER','Active'),(10,'dunglh@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Hồng Dũng','Lâm','0986814665','90/12/1/6 Bong Sao','ROLE_ADMIN','Active'),(11,'dunglh+admin@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Văn An','Nguyễn','1111111111','123 Pham Hung','ROLE_ADMIN','Active'),(12,'dunglh+customer2@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Văn Tâm','Hoàng','3333333332','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),(13,'dunglh+customer3@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Kim Uyên','Phan','3333333333','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),(14,'dunglh+customer4@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Nguyên Đức','Đặng','3333333334','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),(15,'dunglh+customer5@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Đăng Khoa','Đỗ','3333333335','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),(16,'dunglh+customer6@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thu Hằng','Ngô','3333333336','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),(17,'dunglh+customer7@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Bạch Ngọc','Dương','3333333337','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),(18,'dunglh+customer8@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Huệ Anh','Âu','3333333338','789 Vo Van Kiet','ROLE_CUSTOMER','Active'),(19,'dunglh+customer9@gmail.com','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Ngọc Bích','Tạ','3333333339','789 Vo Van Kiet','ROLE_CUSTOMER','Inactive'),(20,'khachhang_hd@proton.me','$2a$12$CR0useg0GQlwrYMvylhHROZg0Vq5nr7jRILz14lc.ArB9iuw1wsEC','Thị Phương','Bùi','8888888888','789 Pham The Hien','ROLE_CUSTOMER','Active');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-23 21:02:04
