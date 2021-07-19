/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `birthday` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `birthday` DATE NOT NULL,
    ADD COLUMN `followerCnt` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `proTag` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `uploadVideoCnt` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `userId` VARCHAR(50) NOT NULL,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `password` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`userId`);

-- CreateTable
CREATE TABLE `VideoLiker` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(50) NOT NULL,
    `videoId` INTEGER NOT NULL,

    INDEX `videoId`(`videoId`),
    PRIMARY KEY (`userId`, `videoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `discription` TEXT NOT NULL,
    `url` VARCHAR(100) NOT NULL,
    `likeCnt` INTEGER NOT NULL DEFAULT 0,
    `viewCnt` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `uploader` VARCHAR(50) NOT NULL,

    INDEX `uploader`(`uploader`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VideoLiker` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoLiker` ADD FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD FOREIGN KEY (`uploader`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
