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
  ): string {
    try {
      const embryoImages =
        imagesRaw.embryoImage.data.attributes?.images?.data?.map((image) => {
          return {
            imageUrl: image.attributes.url,
            id: image.attributes.name.split('.')[0],
          };
        }) ?? [];

      const selectedImage = embryoImages.find(
        (image) => image.id === week.toString(),
      );

      if (!selectedImage) {
        throw new NotFoundException('Image not found');
      }

      return getImageUrl(selectedImage.imageUrl);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getEmbryoImage(week: number): Promise<EmbryoImageResponseObj> {
    try {
      let selectedImage = await this.cacheService.get<string>(
        `embryoImage-${week}`,
      );

      if (!selectedImage) {
        const embryoImagesRaw = await this.graphqlClient.query(
          EMBRYO_IMAGES,
          {},
        );

        selectedImage = this.selectedEmbryoImage(embryoImagesRaw, week);

        await this.cacheService.set(
          `embryoImage-${week}`,
          selectedImage,
          60 * 60 * 24 * 15 * 100,
        );
      }

      return { imageUrl: selectedImage };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
