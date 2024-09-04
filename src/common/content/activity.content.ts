import { getImageUrl } from '../utils/helper.utils';

export function pregnancyCoachOverview() {
  return {
    divider: [
      {
        color: '#B7CCF0',
        label: 'Water',
      },
      {
        color: '#9CC688',
        label: 'Nutrition',
      },
      {
        color: '#6750A4',
        label: 'Soul',
      },
      {
        color: '#6750A4',
        label: 'Mind',
      },
      {
        color: '#6750A4',
        label: 'Fitness',
      },
    ],
    waterActivityCard: {
      label: {
        text: 'Earn 1 water point',
        bgColor: '#B7CCF0',
      },
      heading: 'Drink 8 glasses of water today',
      image: getImageUrl('/uploads/image_82_1_6953936df8.png'),
    },
    nutritionCard: {
      label: {
        text: 'Earn 1 nutrition point',
        bgColor: '#B7CCF0',
      },
      heading: 'Follow the diet plan for today',
      image: getImageUrl('/uploads/image_82_1_6953936df8.png'),
    },
    mindCard: {
      label: {
        text: 'Earn 1 mind point',
        bgColor: '#B7CCF0',
      },
      heading: 'Begin your mind activities for today',
      image: getImageUrl('/uploads/image_82_1_6953936df8.png'),
    },
    fitnessCard: {
      label: {
        text: 'Earn 1 fitness point',
        bgColor: '#CBC8F4',
      },
      heading: 'Complete your fitness regime for the day',
      image: getImageUrl('/uploads/image_82_1_6953936df8.png'),
    },
  };
}
