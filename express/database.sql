-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema studentportal
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema studentportal
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `studentportal` DEFAULT CHARACTER SET utf8 ;
USE `studentportal` ;

-- -----------------------------------------------------
-- Table `studentportal`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentportal`.`user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(250) NULL,
  `last_name` VARCHAR(250) NULL,
  `password_hash` VARCHAR(250) NULL,
  `email` VARCHAR(250) NULL,
  `is_admin` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentportal`.`student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentportal`.`student` (
  `student_id` INT NOT NULL,
  `User_user_id` INT NOT NULL,
  PRIMARY KEY (`student_id`),
  INDEX `fk_student_User1_idx` (`User_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_student_User1`
    FOREIGN KEY (`User_user_id`)
    REFERENCES `studentportal`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentportal`.`teacher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentportal`.`teacher` (
  `teacher_id` INT NOT NULL,
  `User_user_id` INT NOT NULL,
  PRIMARY KEY (`teacher_id`),
  INDEX `fk_teacher_User_idx` (`User_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_teacher_User`
    FOREIGN KEY (`User_user_id`)
    REFERENCES `studentportal`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentportal`.`class`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentportal`.`class` (
  `class_id` VARCHAR(250) NOT NULL,
  `name` VARCHAR(250) NULL,
  `teacher_teacher_id` INT NOT NULL,
  PRIMARY KEY (`class_id`),
  INDEX `fk_class_teacher1_idx` (`teacher_teacher_id` ASC) VISIBLE,
  CONSTRAINT `fk_class_teacher1`
    FOREIGN KEY (`teacher_teacher_id`)
    REFERENCES `studentportal`.`teacher` (`teacher_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentportal`.`assignment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentportal`.`assignment` (
  `assignment_id` INT NOT NULL,
  `due_date` DATE NULL,
  `class_class_id` VARCHAR(250) NOT NULL,
  `file` VARCHAR(250) NULL,
  PRIMARY KEY (`assignment_id`),
  INDEX `fk_assignment_class1_idx` (`class_class_id` ASC) VISIBLE,
  CONSTRAINT `fk_assignment_class1`
    FOREIGN KEY (`class_class_id`)
    REFERENCES `studentportal`.`class` (`class_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentportal`.`student_has_class`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentportal`.`student_has_class` (
  `student_student_id` INT NOT NULL,
  `class_class_id` VARCHAR(250) NOT NULL,
  PRIMARY KEY (`student_student_id`, `class_class_id`),
  INDEX `fk_student_has_class_class1_idx` (`class_class_id` ASC) VISIBLE,
  INDEX `fk_student_has_class_student1_idx` (`student_student_id` ASC) VISIBLE,
  CONSTRAINT `fk_student_has_class_student1`
    FOREIGN KEY (`student_student_id`)
    REFERENCES `studentportal`.`student` (`student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_student_has_class_class1`
    FOREIGN KEY (`class_class_id`)
    REFERENCES `studentportal`.`class` (`class_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentportal`.`student_has_assignment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentportal`.`student_has_assignment` (
  `student_student_id` INT NOT NULL,
  `assignment_assignment_id` INT NOT NULL,
  `file_path` VARCHAR(250) NULL,
  `notes` VARCHAR(250) NULL,
  `grade` DECIMAL(4,2) NULL,
  PRIMARY KEY (`student_student_id`, `assignment_assignment_id`),
  INDEX `fk_student_has_assignment_assignment1_idx` (`assignment_assignment_id` ASC) VISIBLE,
  INDEX `fk_student_has_assignment_student1_idx` (`student_student_id` ASC) VISIBLE,
  CONSTRAINT `fk_student_has_assignment_student1`
    FOREIGN KEY (`student_student_id`)
    REFERENCES `studentportal`.`student` (`student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_student_has_assignment_assignment1`
    FOREIGN KEY (`assignment_assignment_id`)
    REFERENCES `studentportal`.`assignment` (`assignment_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentportal`.`lecture`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentportal`.`lecture` (
  `lecture_id` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NULL,
  `duration_hours` INT NULL,
  `content` TEXT NULL,
  `class_class_id` VARCHAR(250) NOT NULL,
  PRIMARY KEY (`lecture_id`),
  INDEX `fk_lecture_class1_idx` (`class_class_id` ASC) VISIBLE,
  CONSTRAINT `fk_lecture_class1`
    FOREIGN KEY (`class_class_id`)
    REFERENCES `studentportal`.`class` (`class_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentportal`.`Security Logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentportal`.`Security_Logs` (
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `action` VARCHAR(255) NULL,
  `timestamp` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ip_address` VARCHAR(255) NULL,
  `severity` VARCHAR(255) NULL,
  `outcome` VARCHAR (255) NULL,
  `user_user_id` INT,
  PRIMARY KEY (`log_id`),
  INDEX `fk_Security_Logs_user1_idx` (`user_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_Security_Logs_user1`
    FOREIGN KEY (`user_user_id`)
    REFERENCES `studentportal`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
