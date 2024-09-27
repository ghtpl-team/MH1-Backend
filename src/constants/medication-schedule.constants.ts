import 'dotenv';
import { getImageUrl } from '../common/utils/helper.utils';

export const MedicationTabIcons = {
  'Before Breakfast': getImageUrl('/uploads/morning_e743e4605e.png'),
  'After Breakfast': getImageUrl('/uploads/midmorsnack_bb27cd13d1.png'),
  'Before Lunch': getImageUrl('/uploads/lunch_66e85cc9c5.png'),
  'After Lunch': getImageUrl('/uploads/afternoonsnack_59f7e449eb.png'),
  'Before Dinner': getImageUrl('/uploads/dinner_bdd7466657.png'),
  'After Dinner': getImageUrl('/uploads/night_snack_afda013d44.png'),
};
