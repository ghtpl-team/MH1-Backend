import { Injectable } from '@nestjs/common';
import { gql } from 'apollo-server-express';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { ISubscriptionPageData } from './subscription-page.interface';

function parseData(data: ISubscriptionPageData) {
  const assetsUrl = process.env.STRAPI_BASE_URL;

  const parsed = {
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
    banner_slides: data.mhOneSubscriptionPage.data.attributes.banner_slides.map(
      (slide) => ({
        id: slide.id,
        title: slide.title,
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
      data.mhOneSubscriptionPage.data.attributes.package_content_section_header,
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
    videos: data.mhOneSubscriptionPage.data.attributes.videos.map((video) => ({
      id: video.id,
      title: video.title,
      video_url: video.video_url,
      thumbnail: assetsUrl + video.thumbnail.data.attributes.url,
    })),
    faq_header: data.mhOneSubscriptionPage.data.attributes.faq_header,
    faqs: data.mhOneSubscriptionPage.data.attributes.faqs.map((faq) => ({
      id: faq.id,
      title: faq.title,
      content: faq.content,
    })),
  };
  return parsed;
}

@Injectable()
export class SubscriptionPageService {
  constructor(private readonly graphqlClient: GraphQLClientService) {}

  async fetch() {
    try {
      const query = gql`
        query MHOnePage {
          mhOneSubscriptionPage {
            data {
              id
              attributes {
                banner_heading {
                  id
                  color_type
                  text
                }
                banner_subheading
                banner_slides {
                  id
                  title
                  image {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
                banner_support_text
                marquee_cards {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                testimonial_section_header
                testimonials {
                  id
                  user {
                    profile_name
                    profile_image {
                      data {
                        attributes {
                          url
                        }
                      }
                    }
                    pregnancy_duration_in_weeks
                    hospital_location
                  }
                  rating
                  review_text
                }
                package_content_section_header
                package_contents {
                  id
                  title
                  image {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
                videos_section_header
                videos {
                  id
                  title
                  thumbnail {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                  video_url
                }
                faq_header
                faqs {
                  id
                  title
                  content
                }
              }
            }
          }
        }
      `;
      const data: ISubscriptionPageData = await this.graphqlClient.query(query);
      return parseData(data);
    } catch (error) {
      throw error;
    }
  }
}
