export interface ImageData {
  attributes: {
    url: string;
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
