-- MySQL dump 10.13  Distrib 8.0.37, for Win64 (x86_64)
--
-- Host: localhost    Database: transitify
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `abbonamento`
--

DROP TABLE IF EXISTS `abbonamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `abbonamento` (
  `abbonamentoId` int NOT NULL AUTO_INCREMENT,
  `scadenza` date DEFAULT NULL,
  PRIMARY KEY (`abbonamentoId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `abbonamento`
--

LOCK TABLES `abbonamento` WRITE;
/*!40000 ALTER TABLE `abbonamento` DISABLE KEYS */;
INSERT INTO `abbonamento` VALUES (1,'2024-10-19'),(2,'2026-10-19');
/*!40000 ALTER TABLE `abbonamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `abbonamento_zona`
--

DROP TABLE IF EXISTS `abbonamento_zona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `abbonamento_zona` (
  `abbonamentoId` int NOT NULL,
  `idZona` int NOT NULL,
  PRIMARY KEY (`abbonamentoId`,`idZona`),
  KEY `idZona` (`idZona`),
  CONSTRAINT `abbonamento_zona_ibfk_1` FOREIGN KEY (`abbonamentoId`) REFERENCES `abbonamento` (`abbonamentoId`),
  CONSTRAINT `abbonamento_zona_ibfk_2` FOREIGN KEY (`idZona`) REFERENCES `zona` (`idZona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `abbonamento_zona`
--

LOCK TABLES `abbonamento_zona` WRITE;
/*!40000 ALTER TABLE `abbonamento_zona` DISABLE KEYS */;
INSERT INTO `abbonamento_zona` VALUES (1,1),(2,1),(1,2),(1,3);
/*!40000 ALTER TABLE `abbonamento_zona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `idAccount` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) DEFAULT NULL,
  `password` char(60) DEFAULT NULL,
  `nome` varchar(45) DEFAULT NULL,
  `cognome` varchar(45) DEFAULT NULL,
  `tipo` enum('ADMIN','UTENTE') NOT NULL,
  PRIMARY KEY (`idAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (2,'luca.trianti@gmail.com','$2b$10$K0GpQNcvxP0dE6Z4g3eXz.E4w9n3CP4NQjifoVBS/hgcA2bAF1Sna','Luca','Trianti','UTENTE'),(7,'lorenzo.fabbri@gmail.com','$2b$10$VkmbDbbddacQOOfDeAqExOgnsUJZl2FQZn7XZj1aGYLDOGZ1CmsL.','Lorenzo','Fabbri','UTENTE'),(8,'martina.cardillo2107@gmail.com','$2b$10$6YxeyfswDFM5tH2eY63zQO8gOxYOuYR46neA9YHTGwjcrcKh9ph7u','Martina','Cardillo','UTENTE'),(9,'admin@admin.com','$2b$10$QKOoYW7WO23F5L18YjzuxeMiK4l58OjzCXpU2RLQrYWcwD7EaMOvq','admin','admin','ADMIN'),(10,'mario.rossi@gmail.com','$2b$10$AfZSgAJmc9QOJ/VmpP7QTeIsgVvhfgi.k9nR44WaiDMPe1SkLJCpe','Mario','Rossi','UTENTE'),(11,'test.test@gmail.com','$2b$10$x/yBL3ZIQtRqXXS0u0EN0.ROK8bl10gvLHekCV2/HMhfITLopBBM.','Test','Test','UTENTE');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bacino`
--

DROP TABLE IF EXISTS `bacino`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bacino` (
  `idBacino` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idBacino`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bacino`
--

LOCK TABLES `bacino` WRITE;
/*!40000 ALTER TABLE `bacino` DISABLE KEYS */;
INSERT INTO `bacino` VALUES (1,'Forlì-Cesena'),(2,'Rimini'),(3,'Ravenna');
/*!40000 ALTER TABLE `bacino` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card` (
  `cardId` int NOT NULL AUTO_INCREMENT,
  `saldo` decimal(10,2) DEFAULT NULL,
  `idCliente` int DEFAULT NULL,
  PRIMARY KEY (`cardId`),
  KEY `idCliente` (`idCliente`),
  CONSTRAINT `card_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card`
--

LOCK TABLES `card` WRITE;
/*!40000 ALTER TABLE `card` DISABLE KEYS */;
INSERT INTO `card` VALUES (1,201.00,1),(2,60.00,2),(3,3.00,1),(4,15.00,3),(7,15.00,1),(8,0.00,1);
/*!40000 ALTER TABLE `card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `idCliente` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `cognome` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `idAccount` int DEFAULT NULL,
  PRIMARY KEY (`idCliente`),
  UNIQUE KEY `idAccount` (`idAccount`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`idAccount`) REFERENCES `account` (`idAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Luca','Trianti','luca.trianti@gmail.com',2),(2,'Martina','Cardillo','martina.cardillo@gmail.com',NULL),(3,'Lorenzo','Fabbri','lorenzo.fabbri@gmail.com',7);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linea`
--

DROP TABLE IF EXISTS `linea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linea` (
  `idLinea` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idLinea`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linea`
--

LOCK TABLES `linea` WRITE;
/*!40000 ALTER TABLE `linea` DISABLE KEYS */;
INSERT INTO `linea` VALUES (1,'Linea 1'),(2,'Linea 2'),(3,'Linea 3'),(4,'Linea 1R'),(5,'Linea 2R'),(6,'Linea 3R'),(7,'Linea T1'),(8,'Linea T1R'),(9,'Linea B1'),(10,'Linea B1R'),(11,'Linea B2'),(12,'Linea B2R');
/*!40000 ALTER TABLE `linea` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linea_stazione`
--

DROP TABLE IF EXISTS `linea_stazione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linea_stazione` (
  `idLinea` int NOT NULL,
  `idStazione` int NOT NULL,
  `ordine` int DEFAULT NULL,
  PRIMARY KEY (`idLinea`,`idStazione`),
  KEY `idStazione` (`idStazione`),
  CONSTRAINT `linea_stazione_ibfk_1` FOREIGN KEY (`idLinea`) REFERENCES `linea` (`idLinea`),
  CONSTRAINT `linea_stazione_ibfk_2` FOREIGN KEY (`idStazione`) REFERENCES `stazione` (`idStazione`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linea_stazione`
--

LOCK TABLES `linea_stazione` WRITE;
/*!40000 ALTER TABLE `linea_stazione` DISABLE KEYS */;
INSERT INTO `linea_stazione` VALUES (1,1,1),(1,4,2),(1,10,3),(2,16,1),(2,19,2),(3,1,1),(3,4,3),(3,10,4),(3,19,2),(4,1,3),(4,4,2),(4,10,1),(5,16,2),(5,19,1),(6,1,4),(6,4,2),(6,10,1),(6,19,3),(7,9,2),(7,12,3),(7,15,4),(7,18,1),(8,9,3),(8,12,2),(8,15,1),(8,18,4),(9,2,3),(9,17,1),(9,20,2),(10,2,1),(10,17,3),(10,20,2),(11,5,2),(11,8,1),(12,5,1),(12,8,2);
/*!40000 ALTER TABLE `linea_stazione` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimento`
--

DROP TABLE IF EXISTS `movimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimento` (
  `idMovimento` int NOT NULL AUTO_INCREMENT,
  `idViaggio` int DEFAULT NULL,
  `dataOra` datetime DEFAULT NULL,
  `tipoMovimento` set('CHECKIN','CHECKOUT') DEFAULT NULL,
  `idStazione` int DEFAULT NULL,
  PRIMARY KEY (`idMovimento`),
  KEY `idViaggio` (`idViaggio`),
  KEY `idStazione` (`idStazione`),
  CONSTRAINT `movimento_ibfk_1` FOREIGN KEY (`idViaggio`) REFERENCES `viaggio` (`idViaggio`),
  CONSTRAINT `movimento_ibfk_2` FOREIGN KEY (`idStazione`) REFERENCES `stazione` (`idStazione`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimento`
--

LOCK TABLES `movimento` WRITE;
/*!40000 ALTER TABLE `movimento` DISABLE KEYS */;
INSERT INTO `movimento` VALUES (36,9,'2024-06-17 18:22:51','CHECKIN',10),(37,9,'2024-06-17 18:22:51','CHECKIN',19),(38,9,'2024-06-17 18:22:51','CHECKOUT',16),(39,10,'2024-06-17 18:23:15','CHECKIN',1),(40,10,'2024-06-17 18:23:15','CHECKOUT',4),(41,11,'2024-06-17 18:25:59','CHECKIN',10),(42,11,'2024-06-17 18:25:59','CHECKIN',19),(43,11,'2024-06-17 18:25:59','CHECKOUT',16),(44,12,'2024-06-17 18:27:32','CHECKIN',10),(45,12,'2024-06-17 18:27:32','CHECKIN',19),(46,12,'2024-06-17 18:27:32','CHECKOUT',16),(47,13,'2024-06-17 18:32:25','CHECKIN',10),(48,13,'2024-06-17 18:32:25','CHECKIN',19),(49,13,'2024-06-17 18:32:25','CHECKOUT',16),(50,14,'2024-06-17 18:33:17','CHECKIN',10),(51,14,'2024-06-17 18:33:17','CHECKOUT',4),(52,15,'2024-06-18 13:38:12','CHECKIN',9),(53,15,'2024-06-18 13:38:12','CHECKOUT',18),(54,16,'2024-06-18 13:38:24','CHECKIN',15),(55,16,'2024-06-18 13:38:24','CHECKOUT',12),(56,17,'2024-06-18 15:14:54','CHECKIN',17),(57,17,'2024-06-18 15:14:54','CHECKOUT',20),(58,18,'2024-06-18 15:49:34','CHECKIN',4),(59,18,'2024-06-18 15:49:34','CHECKOUT',10),(60,19,'2024-06-18 15:50:04','CHECKIN',4),(61,19,'2024-06-18 15:50:04','CHECKOUT',10),(62,20,'2024-06-18 15:50:55','CHECKIN',4),(63,20,'2024-06-18 15:50:55','CHECKOUT',10),(64,21,'2024-06-18 15:52:25','CHECKIN',8),(65,21,'2024-06-18 15:52:25','CHECKOUT',5),(66,22,'2024-06-18 15:55:28','CHECKIN',8),(67,22,'2024-06-18 15:55:28','CHECKOUT',5),(68,23,'2024-06-18 15:55:51','CHECKIN',8),(69,23,'2024-06-18 15:55:51','CHECKOUT',5),(70,24,'2024-06-18 15:56:09','CHECKIN',8),(71,24,'2024-06-18 15:56:09','CHECKOUT',5),(72,25,'2024-06-18 15:56:52','CHECKIN',8),(73,25,'2024-06-18 15:56:52','CHECKOUT',5),(74,26,'2024-06-18 15:57:54','CHECKIN',8),(75,26,'2024-06-18 15:57:54','CHECKOUT',5),(76,27,'2024-06-18 15:58:19','CHECKIN',8),(77,27,'2024-06-18 15:58:19','CHECKOUT',5),(78,28,'2024-06-18 15:59:53','CHECKIN',8),(79,28,'2024-06-18 15:59:53','CHECKOUT',5),(80,29,'2024-06-18 16:00:14','CHECKIN',8),(81,29,'2024-06-18 16:00:14','CHECKOUT',5),(82,30,'2024-06-18 16:01:05','CHECKIN',8),(83,30,'2024-06-18 16:01:05','CHECKOUT',5),(84,31,'2024-06-18 16:03:22','CHECKIN',8),(85,31,'2024-06-18 16:03:22','CHECKOUT',5),(86,32,'2024-06-18 16:03:38','CHECKIN',8),(87,32,'2024-06-18 16:03:38','CHECKOUT',5),(88,33,'2024-06-18 16:03:48','CHECKIN',8),(89,33,'2024-06-18 16:03:48','CHECKOUT',5),(90,34,'2024-06-18 16:04:49','CHECKIN',10),(91,34,'2024-06-18 16:04:49','CHECKIN',19),(92,34,'2024-06-18 16:04:49','CHECKOUT',16),(93,35,'2024-06-19 14:54:10','CHECKIN',10),(94,35,'2024-06-19 14:54:10','CHECKIN',19),(95,35,'2024-06-19 14:54:10','CHECKOUT',16),(96,36,'2024-06-19 15:00:41','CHECKIN',10),(97,36,'2024-06-19 15:00:41','CHECKIN',19),(98,36,'2024-06-19 15:00:41','CHECKOUT',16),(101,37,'2024-06-19 15:14:58','CHECKIN',10),(102,37,'2024-06-19 15:14:58','CHECKIN',19),(103,37,'2024-06-19 15:14:58','CHECKOUT',16);
/*!40000 ALTER TABLE `movimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reclamo`
--

DROP TABLE IF EXISTS `reclamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reclamo` (
  `idReclamo` int NOT NULL AUTO_INCREMENT,
  `messaggio` text NOT NULL,
  `cardId` int NOT NULL,
  `idViaggio` int NOT NULL,
  PRIMARY KEY (`idReclamo`),
  KEY `fk_reclamo_card` (`cardId`),
  KEY `fk_idViaggio` (`idViaggio`),
  CONSTRAINT `fk_idViaggio` FOREIGN KEY (`idViaggio`) REFERENCES `viaggio` (`idViaggio`),
  CONSTRAINT `fk_reclamo_card` FOREIGN KEY (`cardId`) REFERENCES `card` (`cardId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reclamo`
--

LOCK TABLES `reclamo` WRITE;
/*!40000 ALTER TABLE `reclamo` DISABLE KEYS */;
/*!40000 ALTER TABLE `reclamo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ricarica`
--

DROP TABLE IF EXISTS `ricarica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ricarica` (
  `idRicarica` int NOT NULL AUTO_INCREMENT,
  `importo` decimal(10,2) DEFAULT NULL,
  `data` date DEFAULT NULL,
  `cardId` int NOT NULL,
  PRIMARY KEY (`idRicarica`),
  KEY `fk_cardId` (`cardId`),
  CONSTRAINT `fk_cardId` FOREIGN KEY (`cardId`) REFERENCES `card` (`cardId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ricarica`
--

LOCK TABLES `ricarica` WRITE;
/*!40000 ALTER TABLE `ricarica` DISABLE KEYS */;
/*!40000 ALTER TABLE `ricarica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shared_card`
--

DROP TABLE IF EXISTS `shared_card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shared_card` (
  `cardId` int NOT NULL,
  PRIMARY KEY (`cardId`),
  CONSTRAINT `shared_card_ibfk_1` FOREIGN KEY (`cardId`) REFERENCES `card` (`cardId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shared_card`
--

LOCK TABLES `shared_card` WRITE;
/*!40000 ALTER TABLE `shared_card` DISABLE KEYS */;
INSERT INTO `shared_card` VALUES (2),(8);
/*!40000 ALTER TABLE `shared_card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stazione`
--

DROP TABLE IF EXISTS `stazione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stazione` (
  `idStazione` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `tipo` enum('BUS','TRENO','TRAM') DEFAULT NULL,
  `idZona` int NOT NULL,
  PRIMARY KEY (`idStazione`),
  KEY `idZona` (`idZona`),
  CONSTRAINT `stazione_ibfk_1` FOREIGN KEY (`idZona`) REFERENCES `zona` (`idZona`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stazione`
--

LOCK TABLES `stazione` WRITE;
/*!40000 ALTER TABLE `stazione` DISABLE KEYS */;
INSERT INTO `stazione` VALUES (1,'Stazione FS Forlì','TRENO',1),(2,'Stazione Bus Forlì','BUS',1),(3,'Tram Forlì Centro Storico','TRAM',1),(4,'Stazione FS Cesena','TRENO',2),(5,'Stazione Bus Cesena Università','BUS',2),(6,'Tram Cesena Stadio','TRAM',2),(7,'Stazione FS Cesenatico','TRENO',2),(8,'Stazione Bus Cesenatico Mare','BUS',2),(9,'Tram Cesenatico Centro Storico','TRAM',2),(10,'Stazione FS Rimini','TRENO',3),(11,'Stazione Bus Rimini Mare','BUS',3),(12,'Tram Rimini Fiera','TRAM',3),(13,'Stazione FS Riccione','TRENO',4),(14,'Stazione Bus Riccione Parco','BUS',4),(15,'Tram Riccione Centro','TRAM',4),(16,'Stazione FS Ravenna','TRENO',5),(17,'Stazione Bus Ravenna Porto','BUS',5),(18,'Tram Ravenna Centro Storico','TRAM',5),(19,'Stazione FS Faenza','TRENO',6),(20,'Stazione Bus Faenza Ospedale','BUS',6),(21,'Tram Faenza Università','TRAM',6);
/*!40000 ALTER TABLE `stazione` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unique_card`
--

DROP TABLE IF EXISTS `unique_card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unique_card` (
  `cardId` int NOT NULL,
  `idAccount` int DEFAULT NULL,
  `abbonamentoId` int DEFAULT NULL,
  PRIMARY KEY (`cardId`),
  KEY `idAccount` (`idAccount`),
  KEY `unique_card_ibfk_3` (`abbonamentoId`),
  CONSTRAINT `unique_card_ibfk_1` FOREIGN KEY (`cardId`) REFERENCES `card` (`cardId`),
  CONSTRAINT `unique_card_ibfk_2` FOREIGN KEY (`idAccount`) REFERENCES `account` (`idAccount`),
  CONSTRAINT `unique_card_ibfk_3` FOREIGN KEY (`abbonamentoId`) REFERENCES `abbonamento` (`abbonamentoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unique_card`
--

LOCK TABLES `unique_card` WRITE;
/*!40000 ALTER TABLE `unique_card` DISABLE KEYS */;
INSERT INTO `unique_card` VALUES (1,2,1),(3,7,NULL),(7,2,2);
/*!40000 ALTER TABLE `unique_card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `viaggio`
--

DROP TABLE IF EXISTS `viaggio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viaggio` (
  `idViaggio` int NOT NULL AUTO_INCREMENT,
  `cardId` int DEFAULT NULL,
  `dataInizio` datetime DEFAULT NULL,
  `dataFine` datetime DEFAULT NULL,
  `prezzo` decimal(10,2) DEFAULT NULL,
  `stato` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idViaggio`),
  KEY `cardId` (`cardId`),
  CONSTRAINT `viaggio_ibfk_1` FOREIGN KEY (`cardId`) REFERENCES `card` (`cardId`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `viaggio`
--

LOCK TABLES `viaggio` WRITE;
/*!40000 ALTER TABLE `viaggio` DISABLE KEYS */;
INSERT INTO `viaggio` VALUES (9,1,'2024-06-17 18:22:51','2024-06-17 18:22:51',3.00,'completato'),(10,1,'2024-06-17 18:23:15','2024-06-17 18:23:15',3.00,'completato'),(11,1,'2024-06-17 18:25:59','2024-06-17 18:25:59',3.00,'completato'),(12,1,'2024-06-17 18:27:32','2024-06-17 18:27:32',3.00,'completato'),(13,1,'2024-06-17 18:32:25','2024-06-17 18:32:25',4.50,'completato'),(14,1,'2024-06-17 18:33:17','2024-06-17 18:33:17',3.00,'completato'),(15,1,'2024-06-18 13:38:12','2024-06-18 13:38:12',3.00,'completato'),(16,1,'2024-06-18 13:38:24','2024-06-18 13:38:24',3.00,'completato'),(17,1,'2024-06-18 15:14:54','2024-06-18 15:14:54',3.00,'completato'),(18,1,'2024-06-18 15:49:34','2024-06-18 15:49:34',3.00,'completato'),(19,1,'2024-06-18 15:50:04','2024-06-18 15:50:04',3.00,'completato'),(20,1,'2024-06-18 15:50:55','2024-06-18 15:50:55',3.00,'completato'),(21,1,'2024-06-18 15:52:25','2024-06-18 15:52:25',1.50,'completato'),(22,1,'2024-06-18 15:55:28','2024-06-18 15:55:28',1.50,'completato'),(23,1,'2024-06-18 15:55:51','2024-06-18 15:55:51',1.50,'completato'),(24,1,'2024-06-18 15:56:09','2024-06-18 15:56:09',1.50,'completato'),(25,1,'2024-06-18 15:56:52','2024-06-18 15:56:52',1.50,'completato'),(26,1,'2024-06-18 15:57:54','2024-06-18 15:57:54',1.50,'completato'),(27,1,'2024-06-18 15:58:19','2024-06-18 15:58:19',1.50,'completato'),(28,1,'2024-06-18 15:59:53','2024-06-18 15:59:53',1.50,'completato'),(29,1,'2024-06-18 16:00:14','2024-06-18 16:00:14',1.50,'completato'),(30,1,'2024-06-18 16:01:05','2024-06-18 16:01:05',0.00,'completato'),(31,1,'2024-06-18 16:03:22','2024-06-18 16:03:22',0.00,'completato'),(32,1,'2024-06-18 16:03:38','2024-06-18 16:03:38',0.00,'completato'),(33,1,'2024-06-18 16:03:48','2024-06-18 16:03:48',0.00,'completato'),(34,1,'2024-06-18 16:04:49','2024-06-18 16:04:49',4.50,'completato'),(35,1,'2024-06-19 14:54:10','2024-06-19 14:54:10',4.50,'completato'),(36,1,'2024-06-19 15:00:41','2024-06-19 15:00:41',4.50,'completato'),(37,2,'2024-06-19 15:14:58','2024-06-19 15:14:58',4.50,'completato');
/*!40000 ALTER TABLE `viaggio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zona`
--

DROP TABLE IF EXISTS `zona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zona` (
  `idZona` int NOT NULL AUTO_INCREMENT,
  `numero` int DEFAULT NULL,
  `idBacino` int NOT NULL,
  PRIMARY KEY (`idZona`),
  KEY `idBacino` (`idBacino`),
  CONSTRAINT `zona_ibfk_1` FOREIGN KEY (`idBacino`) REFERENCES `bacino` (`idBacino`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zona`
--

LOCK TABLES `zona` WRITE;
/*!40000 ALTER TABLE `zona` DISABLE KEYS */;
INSERT INTO `zona` VALUES (1,1,1),(2,2,1),(3,1,2),(4,2,2),(5,1,3),(6,2,3);
/*!40000 ALTER TABLE `zona` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-25 16:32:51
