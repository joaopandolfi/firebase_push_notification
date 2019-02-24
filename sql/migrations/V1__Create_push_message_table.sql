-- USE push_notification;
-- -----------------------------------------------------
-- Table `push_message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `push_message` (
  `idpush_message` INT NOT NULL AUTO_INCREMENT,
  `pushid` VARCHAR(45) NULL,
  `id_sender`VARCHAR(45) NULL,
  `timestamp` DATETIME NULL,
  `title` TEXT NULL,
  `text` TEXT NULL,
  `filter` VARCHAR(45) NULL,
  `tag` VARCHAR(45) NULL,
  `pushid_list` TEXT NULL,
  PRIMARY KEY (`idpush_message`));



-- -----------------------------------------------------
-- Table `user_push_message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_push_message` (
  `iduser_push_message` INT NOT NULL AUTO_INCREMENT,
  `idpush_message` INT NULL,
  `id_user` VARCHAR(45) NULL,
  `user_pushid` VARCHAR(45) NULL,
  `rec_timestamp` DATETIME NULL,
  `opened_timestamp` DATETIME NULL,
  `sended_timestamp` DATETIME NULL,
  `so` VARCHAR(45) NULL,
  PRIMARY KEY (`iduser_push_message`),
  INDEX `push_message__user_idx` (`idpush_message` ASC),
  CONSTRAINT `push_message__user`
    FOREIGN KEY (`idpush_message`)
    REFERENCES `push_message` (`idpush_message`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);