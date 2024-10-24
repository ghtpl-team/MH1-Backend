export const DoctorDetails = {
  name: 'Dr. Swathi Reddy',
  imageUrl:
    process.env.MEDIA_SERVER_BASE_URL + '/images/doctors/upload/999999.png',
  specialty: 'Physiotherapy',
  experienceYears: 10,
};

const SERVER_URL = 'https://mh-dev.oicharts.in/images/videos/mind-activities';

export const MindActivityVideos = {
  1: `${SERVER_URL}/body-scan.mp4`,
  2: `${SERVER_URL}/protective-light-guided-meditation`,
  3: `${SERVER_URL}/progressive-music-relaxation.mp4`,
  5: `${SERVER_URL}/affirmations-for-birth.mp4`,
  6: `${SERVER_URL}/holistic-pregnancy-affirmation.mp4`,
  7: `${SERVER_URL}/parents-affirmations.mp4`,
};
