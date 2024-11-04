export interface ImageData {
  attributes: {
    url: string;
    name?: string;
  };
}

export interface Specialty {
  data: {
    attributes: {
      name: string;
    };
  };
}

export interface DocInfo {
  data: {
    attributes: {
      name: string;
      imageUrl: string;
      image: {
        data: ImageData;
      };
      specialty: Specialty;
      experienceYears: string;
    };
  };
}

export interface ParsedDocInfo {
  name: string;
  imageUrl: string;
  specialty: string;
  experienceYears: string;
}

export interface GenericButton {
  btnText: string;
  bgColor: string;
  textColor: string;
}

export enum DietChartStatus {
  'AWAITING_INPUT' = 'AWAITING_INPUT',
  'PREPARING' = 'PREPARING',
  'READY' = 'READY',
  'REJECTED' = 'REJECTED',
}
