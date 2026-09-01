-- CreateTable
CREATE TABLE `Teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Teacher_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Department_name_key`(`name`),
    UNIQUE INDEX `Department_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `academicYear` VARCHAR(191) NOT NULL,
    `teacherId` INTEGER NOT NULL,
    `departmentId` INTEGER NOT NULL,

    UNIQUE INDEX `Subject_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseOutcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `statement` VARCHAR(191) NOT NULL,
    `subjectId` INTEGER NOT NULL,

    UNIQUE INDEX `CourseOutcome_subjectId_code_key`(`subjectId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProgramOutcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `statement` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProgramOutcome_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProgramSpecificOutcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `statement` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProgramSpecificOutcome_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoPoMapping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coId` INTEGER NOT NULL,
    `poId` INTEGER NULL,
    `psoId` INTEGER NULL,
    `level` DOUBLE NOT NULL,
    `subjectId` INTEGER NOT NULL,

    INDEX `CoPoMapping_coId_idx`(`coId`),
    INDEX `CoPoMapping_poId_idx`(`poId`),
    INDEX `CoPoMapping_psoId_idx`(`psoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentMark` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentRollNo` VARCHAR(191) NOT NULL,
    `marks` DOUBLE NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `coId` INTEGER NOT NULL,

    INDEX `StudentMark_studentRollNo_idx`(`studentRollNo`),
    INDEX `StudentMark_subjectId_idx`(`subjectId`),
    INDEX `StudentMark_coId_idx`(`coId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseOutcome` ADD CONSTRAINT `CourseOutcome_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoPoMapping` ADD CONSTRAINT `CoPoMapping_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoPoMapping` ADD CONSTRAINT `CoPoMapping_coId_fkey` FOREIGN KEY (`coId`) REFERENCES `CourseOutcome`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoPoMapping` ADD CONSTRAINT `CoPoMapping_poId_fkey` FOREIGN KEY (`poId`) REFERENCES `ProgramOutcome`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoPoMapping` ADD CONSTRAINT `CoPoMapping_psoId_fkey` FOREIGN KEY (`psoId`) REFERENCES `ProgramSpecificOutcome`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentMark` ADD CONSTRAINT `StudentMark_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentMark` ADD CONSTRAINT `StudentMark_coId_fkey` FOREIGN KEY (`coId`) REFERENCES `CourseOutcome`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
