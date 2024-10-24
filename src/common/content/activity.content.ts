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
        color: '#F4DD95',
        label: 'Soul',
      },
      {
        color: '#F6BDDE',
        label: 'Mind',
      },
      {
        color: '#CBC8F4',
        label: 'Fitness',
      },
    ],
    waterActivityCard: {
      type: 'water',
      label: {
        text: 'Earn 10 points',
        bgColor: '#B7CCF0',
      },
      heading: 'Drink 8 glasses of water today',
      image: getImageUrl('/uploads/Group_31225_87714dc614.png'),
    },
    nutritionCard: {
      type: 'nutrition',
      label: {
        text: 'Earn 10 points',
        bgColor: '#9CC688',
      },
      heading: 'Follow the diet plan for today',
      image: getImageUrl('/uploads/Group_31225_82a898d162.png'),
    },
    mindCard: {
      type: 'mind',
      label: {
        text: 'Earn 10 points',
        bgColor: '#F6BDDE',
      },
      heading: 'Begin your mind activities for today',
      image: getImageUrl('/uploads/Group_31225_2e93638bf4.png'),
    },
    fitnessCard: {
      type: 'fitness',
      label: {
        text: 'Earn 10 points',
        bgColor: '#CBC8F4',
      },
      heading: 'Complete your fitness regime for the day',
      image: getImageUrl('/uploads/Group_31232_b907f94b21.png'),
    },
  };
}
