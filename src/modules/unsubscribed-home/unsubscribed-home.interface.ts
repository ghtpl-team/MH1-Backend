export interface GetUnsubscribedHome {
  unsubscribedHome: {
    data: {
      attributes: {
        unsubNotes: UnsubscribedPregnancyNotes;
        pregnancyCoachPromo: PregnancyCoachPromo[];
        pregnancyCoachAd: PregnancyCoachAd;
        dietPlanPromo: DietPlanPromo[];
        dietPlanAd: DietPlanAd;
        unsubSymptom: UnsubscribedSymptoms;
      };
    };
  };
}

interface UnsubscribedSymptoms {
  id: string;
  heading: string;
  symptomCard: Array<{
    id: string;
    image: ImageData;
    title: string;
  }>;
  description: string;
  image: ImageData;
  getSubBtn: {
    id: string;
    btnText: string;
    textColor: string;
    bfColor: string;
  };
}

interface UnsubscribedPregnancyNotes {
  heading: string;
  id: string;
  noteGifs: {
    data: Array<{
      attributes: {
        url: string;
      };
    }>;
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
  header: string;
  btnText: string;
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

export interface IntroCardResRaw {
  introCard: {
    data: {
      attributes: {
        cards: IntroCard[];
      };
    };
  };
}

interface IntroCard {
  id: string;
  header?: string;
  subHeader: string;
  image: ImageData;
}

export interface ParsedIntroCard {
  id: string;
  header?: string;
  subHeader: string;
  image: string;
}
