export interface GetUnsubscribedHome {
  unsubscribedHome: {
    data: {
      attributes: {
        pregnancyCoachPromo: PregnancyCoachPromo[];
        pregnancyCoachAd: PregnancyCoachAd;
        dietPlanPromo: DietPlanPromo[];
        dietPlanAd: DietPlanAd;
      };
    };
  };
}

interface ImageData {
  data: {
    attributes: {
      url: string;
    };
  };
}

interface PregnancyCoachPromo {
  image: ImageData;
  title: string;
  content: string;
}

interface PregnancyCoachAd {
  image: ImageData;
  title: string;
  bgColor: string;
  btnText: string;
  btnBgColor: string;
}

interface DietPlanPromo {
  image: ImageData;
  title: string;
  content: string;
  getMhSubBtn: {
    btnText: string;
    bgColor: string;
  };
  dietPromoBtn: {
    btnText: string;
    bgColor: string;
  };
}

interface DietPlanAd {
  text: string;
  bgImage: ImageData;
  animationText: string;
}
