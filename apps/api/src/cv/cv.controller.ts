import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UnauthorizedException,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import {
  RateLimitUpload,
  RateLimitApi,
} from '../resilience/rate-limiting.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cv')
@UseGuards(JwtAuthGuard)
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @RateLimitUpload()
  async uploadCv(@Req() req, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Use authenticated user ID from JWT
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedException('User not authenticated');
      }

      const result = await this.cvService.processCv(file, userId);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('extract')
  @RateLimitApi()
  async extractKnowledge(@Body() body: { text: string }) {
    try {
      const result = await this.cvService.extractKnowledge(body.text);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('normalize')
  @RateLimitApi()
  async normalizeKnowledge(@Body() body: { knowledge: any }) {
    try {
      const result = await this.cvService.normalizeKnowledge(body.knowledge);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('build-graph')
  @RateLimitApi()
  async buildGraph(@Body() body: { normalizedKnowledge: any }) {
    try {
      const result = await this.cvService.buildGraph(body.normalizedKnowledge);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('generate-profile')
  @RateLimitApi()
  async generateProfile(@Body() body: { graph: any }) {
    try {
      const result = await this.cvService.generateProfile(body.graph);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
