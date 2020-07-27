create database order_management;
use order_management;
CREATE TABLE `inventory` (
  `productCode` varchar(45) NOT NULL,
  `productName` varchar(45) NOT NULL,
  `category` varchar(45) NOT NULL,
  `quantity` int(11) DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`productCode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
