-- CreateTable
CREATE TABLE `User` (
    `userId` VARCHAR(50) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `birthday` DATE,
    `nickname` VARCHAR(10) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `emailToken` VARCHAR(100) NOT NULL,
    `profilePicture` VARCHAR(200) NOT NULL DEFAULT '/public/docs/soma_logo.png',
    `followerCnt` INTEGER NOT NULL DEFAULT 0,
    `description` TEXT NOT NULL,
    `uploadVideoCnt` INTEGER NOT NULL DEFAULT 0,
    `proTag` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3),

    UNIQUE INDEX `User.nickname_unique`(`nickname`),
    INDEX `email`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VideoLiker` (
    `liker` VARCHAR(50) NOT NULL,
    `videoId` VARCHAR(191) NOT NULL,
    `uploader` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3),

    PRIMARY KEY (`liker`, `uploader`, `videoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Video` (
    `id` VARCHAR(191) NOT NULL,
    `uploader` VARCHAR(50) NOT NULL,
    `title` VARCHAR(50) NOT NULL,
    `discription` TEXT NOT NULL,
    `url` VARCHAR(200) NOT NULL,
    `thumbnail` VARCHAR(200) NOT NULL,
    `likeCnt` INTEGER NOT NULL DEFAULT 0,
    `viewCnt` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3),

    UNIQUE INDEX `Video.id_unique`(`id`),
    PRIMARY KEY (`uploader`, `id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VideoTag` (
    `videoId` VARCHAR(191) NOT NULL,
    `uploader` VARCHAR(50) NOT NULL,
    `tagName` VARCHAR(30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3),

    PRIMARY KEY (`videoId`, `uploader`, `tagName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Follower` (
    `followerId` VARCHAR(50) NOT NULL,
    `followingId` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3),

    PRIMARY KEY (`followerId`, `followingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VideoLiker` ADD FOREIGN KEY (`liker`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoLiker` ADD FOREIGN KEY (`uploader`) REFERENCES `Video`(`uploader`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoLiker` ADD FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD FOREIGN KEY (`uploader`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoTag` ADD FOREIGN KEY (`uploader`) REFERENCES `Video`(`uploader`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoTag` ADD FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follower` ADD FOREIGN KEY (`followerId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follower` ADD FOREIGN KEY (`followingId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
