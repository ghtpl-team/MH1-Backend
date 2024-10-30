import { getImageUrl } from '../utils/helper.utils';

export function pregnancyCoachOverview() {
  return {
    divider: [
      {
        color: '#B7CCF0',
        label: 'Water',
      },
      {
        color: '#CBC8F4',
        label: 'Fitness',
      },
      {
        color: '#9CC688',
        label: 'Nutrition',
      },
      {
        color: '#F6BDDE',
        label: 'Mind',
      },
      {
        color: '#F4DD95',
        label: 'Soul',
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
      headingLocked: 'Answer simple questions and get a personalised diet plan',
      headingWait: 'Your diet conditions are under review by the doctor',
      subHeading: 'Your diet plan will be available in the next 1 hour',
      image: getImageUrl('/uploads/Group_31225_82a898d162.png'),
      imageLocked: getImageUrl('/uploads/Group_31225_98e4209bca.png'),
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
