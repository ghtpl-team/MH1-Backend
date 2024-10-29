export interface IImage {
  data: {
    attributes: {
      url: string;
    };
  };
}

export interface IBannerHeading {
  id: string;
  color_type: 'solid' | 'gradient';
  text: string;
}

export interface IBannerSlide {
  id: string;
  title: string;
  subTitle: string;
  image: IImage;
}

export interface ITestimonialUser {
  profile_name: string;
  profile_image: IImage;
  pregnancy_duration_in_weeks: number;
  hospital_location: string;
}

export interface ITestimonial {
  id: string;
  user: ITestimonialUser;
  rating: number;
  review_text: string;
}

export interface IPackageContent {
  id: string;
  title: string;
  image: IImage;
}

export interface IVideoAsset {
  id: string;
  title: string;
  video_url: string;
  thumbnail: IImage;
}

export interface IFaq {
  id: string;
  title: string;
  content: string;
}

export interface ISubscriptionPageData {
  mhOneSubscriptionPage: {
    data: {
      id: string;
      attributes: {
        banner_heading: Array<IBannerHeading>;
        banner_subheading: string;
        banner_slides: Array<IBannerSlide>;
        banner_support_text: string;
        marquee_cards: {
          data: {
            attributes: {
              url: string;
            };
          }[];
        };
        testimonial_section_header: string;
        testimonials: Array<ITestimonial>;
        package_content_section_header: string;
        package_contents: Array<IPackageContent>;
        videos_section_header: string;
        videos: Array<IVideoAsset>;
        faq_header: string;
        faqs: Array<IFaq>;
      };
    };
  };
}

export interface TermsAndConditionsRawData {
  termsAndCondition: {
    data: {
      attributes: {
        title: string;
        content: string;
        updatedDate: string;
      };
    };
  };
}

export interface ParsedTermsAndConditions {
  title: string;
  content: string;
  updatedAt: string;
}
