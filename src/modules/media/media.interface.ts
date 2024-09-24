import { ImageData } from 'src/common/interfaces/common.interface';

export interface EmbryoImagesRaw {
  embryoImage: {
    data: {
      attributes: {
        images: {
          data: ImageData[];
        };
      };
    };
  };
}

export interface EmbryoImageResponseObj {
  imageUrl: string;
}
