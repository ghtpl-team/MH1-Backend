import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { EMBRYO_IMAGES } from './media.query';
import { EmbryoImageResponseObj, EmbryoImagesRaw } from './media.interface';
import { getImageUrl } from 'src/common/utils/helper.utils';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  constructor(
    private readonly graphqlClient: GraphQLClientService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  private selectedEmbryoImage(
    imagesRaw: EmbryoImagesRaw,
    week: number,
  ): { imageUrl: string; videoUrl: string } {
    try {
      const embryoImages =
        imagesRaw.embryoImage.data.attributes?.images?.data?.map((image) => {
          return {
            imageUrl: image.attributes.url,
            id: image.attributes.name.split('.')[0],
          };
        }) ?? [];

      const embryoVideos =
        imagesRaw.embryoImage.data.attributes?.videos?.data?.map((video) => {
          return {
            videoUrl: video.attributes.url,
            id: video.attributes.name
              .replaceAll('foetus_week_', '')
              .split('.')[0],
          };
        });

      const selectedImage = embryoImages.find(
        (image) => image.id === week.toString(),
      );

      const selectedVideo = embryoVideos.find(
        (video) => video.id === week.toString(),
      );

      if (!selectedImage || !selectedVideo) {
        throw new NotFoundException('Image not found');
      }

      return {
        imageUrl: getImageUrl(selectedImage.imageUrl),
        videoUrl: getImageUrl(selectedVideo.videoUrl),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getEmbryoImage(week: number): Promise<EmbryoImageResponseObj> {
    try {
      let embryoMedia = await this.cacheService.get<EmbryoImageResponseObj>(
        `embryoImage-${week}`,
      );

      if (!embryoMedia) {
        const embryoImagesRaw = await this.graphqlClient.query(
          EMBRYO_IMAGES,
          {},
        );

        embryoMedia = this.selectedEmbryoImage(embryoImagesRaw, week);

        await this.cacheService.set(
          `embryoImage-${week}`,
          embryoMedia,
          60 * 60 * 24 * 15 * 100,
        );
      }

      return embryoMedia;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
