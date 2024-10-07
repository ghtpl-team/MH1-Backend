import { gql } from 'apollo-server-express';

export const SUBSCRIPTION_PAGE = gql`
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
