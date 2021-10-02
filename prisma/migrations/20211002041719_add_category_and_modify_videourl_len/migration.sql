-- AlterTable
ALTER TABLE `Video` ADD COLUMN `category` VARCHAR(20),
    MODIFY `url` VARCHAR(500) NOT NULL,
    MODIFY `thumbnail` VARCHAR(500) NOT NULL;
