import { Injectable, Logger } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { ISubscriptionPageData } from './subscription-page.interface';
import { SUBSCRIPTION_PAGE } from './subscription-page.query';

@Injectable()
export class SubscriptionPageService {
  private readonly logger = new Logger(SubscriptionPageService.name);
  constructor(private readonly graphqlClient: GraphQLClientService) {}

  private parseData(data: ISubscriptionPageData) {
    const assetsUrl = process.env.STRAPI_BASE_URL;

    const parsed = {
      remainingDiscountCount: 100,
      originalCost: 1999,
      discountedCost: 499,
      banner_heading:
        data.mhOneSubscriptionPage.data.attributes.banner_heading.map(
          (heading) => ({
            id: heading.id,
            color_type: heading.color_type,
            text: heading.text,
          }),
        ),
      banner_subheading:
        data.mhOneSubscriptionPage.data.attributes.banner_subheading,
      banner_slides:
        data.mhOneSubscriptionPage.data.attributes.banner_slides.map(
          (slide) => ({
            id: slide.id,
            title: slide.title,
            subTitle: slide.subTitle,
            image: assetsUrl + slide.image.data.attributes.url,
          }),
        ),
      banner_support_text:
        data.mhOneSubscriptionPage.data.attributes.banner_support_text,
      marquee_cards:
        data.mhOneSubscriptionPage.data.attributes.marquee_cards.data.map(
          (card) => assetsUrl + card.attributes.url,
        ),
      testimonial_section_header:
        data.mhOneSubscriptionPage.data.attributes.testimonial_section_header,
      testimonials: data.mhOneSubscriptionPage.data.attributes.testimonials.map(
        (testimonial) => ({
          id: testimonial.id,
          user: {
            profile_name: testimonial.user.profile_name,
            profile_image:
              assetsUrl + testimonial.user.profile_image.data.attributes.url,
            pregnancy_duration_in_weeks:
              testimonial.user.pregnancy_duration_in_weeks,
            hospital_location: testimonial.user.hospital_location,
          },
          rating: testimonial.rating,
          review_text: testimonial.review_text,
        }),
      ),
      package_content_section_header:
        data.mhOneSubscriptionPage.data.attributes
          .package_content_section_header,
      package_contents:
        data.mhOneSubscriptionPage.data.attributes.package_contents.map(
          (content) => ({
            id: content.id,
            title: content.title,
            image: assetsUrl + content.image.data.attributes.url,
          }),
        ),
      videos_section_header:
        data.mhOneSubscriptionPage.data.attributes.videos_section_header,
      videos: data.mhOneSubscriptionPage.data.attributes.videos.map(
        (video) => ({
          id: video.id,
          title: video.title,
          video_url: video.video_url,
          thumbnail: assetsUrl + video.thumbnail.data.attributes.url,
        }),
      ),
      faq_header: data.mhOneSubscriptionPage.data.attributes.faq_header,
      faqs: data.mhOneSubscriptionPage.data.attributes.faqs.map((faq) => ({
        id: faq.id,
        title: faq.title,
        content: faq.content,
      })),
    };
    return parsed;
  }

  async fetch() {
    try {
      const data: ISubscriptionPageData =
        await this.graphqlClient.query(SUBSCRIPTION_PAGE);
      return this.parseData(data);
    } catch (error) {
      this.logger.error(
        'Error fetching subscription page data',
        error.stack || error,
      );
      throw error;
    }
  }
}
