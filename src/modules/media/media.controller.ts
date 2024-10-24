import { Controller, Get } from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Week } from 'src/decorators/week/week.decorator';

@Controller('media')
@ApiTags('Embryo Media')
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiParam({
    name: 'week',
    type: 'string',
    required: true,
    description: 'Week of pregnancy',
    allowEmptyValue: false,
    examples: {
      'Week 1': {
        value: '1',
      },
      'Week 2': {
        value: '2',
      },
    },
  })
  @Get('images/embryo/:week')
  getEmbryoImage(@Week() week: number) {
    try {
      return this.mediaService.getEmbryoImage(week);
    } catch (error) {
      throw error;
    }
  }
}
