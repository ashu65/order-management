use order_management;
CREATE TABLE `accounts` (
  `accountId` varchar(45) NOT NULL,
  `userName` varchar(45) NOT NULL,
  `gender` enum('MALE', 'FEMALE', 'OTHER', 'DONT_WANT_TO_SPECIFY'),
  `emailId` varchar(45) DEFAULT '0',
  `phoneNumber` varchar(10) NOT NULL,
  `disabled` boolean NOT NULL DEFAULT false,
  `lastLoginDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`accountId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
