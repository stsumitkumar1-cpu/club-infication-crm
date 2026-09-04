import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { ImportsService, type UploadedWorkbook } from './imports.service.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, RateLimit, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/** 12 MB. The client's own workbook is 1.5 MB, so this is generous headroom. */
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

/**
 * Legacy Excel import — Master Spec 4.
 *
 * Super Admin only. An import creates customers, memberships, payments,
 * entitlement history AND user accounts in one action; that is more reach than
 * any other endpoint in the CRM, and not something a Manager should have.
 *
 * Two steps, never one. Upload parses and reports; commit writes. A 29-tab,
 * 822-row sheet filled in by hand over two years has too many judgement calls
 * in it to import unseen.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
@Controller('imports')
export class ImportsController {
  constructor(private importsService: ImportsService) {}

  /**
   * Parses a workbook into staging and returns the report. Writes nothing live.
   *
   * Held in memory rather than on disk: the file is read once and then only its
   * parsed form is kept, so there is no upload directory to secure or clean up.
   */
  @RateLimit({ limit: 10, windowSeconds: 600 })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD_BYTES } }),
  )
  upload(
    @UploadedFile() file: UploadedWorkbook | undefined,
    @CurrentUser() user: AuthUser,
  ) {
    if (!file) {
      throw new BadRequestException('No file was uploaded.');
    }
    if (!/\.xlsx?$/i.test(file.originalname)) {
      throw new BadRequestException(
        'Only an Excel workbook (.xlsx) can be imported.',
      );
    }
    return this.importsService.stageWorkbook(file, user);
  }

  @Get()
  findAll() {
    return this.importsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.importsService.findOne(id);
  }

  /** Writes the staged rows. Each row is its own transaction. */
  @RateLimit({ limit: 5, windowSeconds: 600 })
  @Post(':id/commit')
  commit(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.importsService.commit(id, user);
  }

  @Delete(':id')
  discard(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.importsService.discard(id, user);
  }
}
