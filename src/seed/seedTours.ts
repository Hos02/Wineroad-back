import { TourModel } from "../models/Tour";

const SAMPLE_TOURS = [
  {
    locales: {
      en: {
        title: "Napa Valley Estate Trail",
        description:
          "Visit three family-run estates with guided tastings, cave tours, and a seasonal lunch pairing.",
        duration: "Full day (8 hours)",
      },
      ru: {
        title: "Тропа поместий Напа-Вэлли",
        description:
          "Три семейных шато с гидом: дегустации, экскурсии по погребам и сезонный обед с подбором вин.",
        duration: "Целый день (8 часов)",
      },
      am: {
        title: "Նապա Վալիի դղյակների ճանապարհ",
        description:
          "Երեք ընտանեկան կալվածներ՝ հսկված տեսակներ, քարանձավային շրջագայություններ և սեզոնային ճաշի զուգակցում։",
        duration: "Ամբողջ օր (8 ժամ)",
      },
    },
    pricePerPerson: 189,
    date: "2026-06-14",
    bookableDates: ["2026-06-14", "2026-06-21"],
    mainImage:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1200&q=80",
    ],
  },
  {
    locales: {
      en: {
        title: "Sonoma Coast Pinot Intensive",
        description:
          "Focused walk through cool-climate Pinot Noir vineyards with a winemaker-led blending workshop.",
        duration: "6 hours",
      },
      ru: {
        title: "Интенсив по Пино Нуару: побережье Сономы",
        description:
          "Прогулка по прохладным виноградникам Пино Нуар и мастер-класс по купажу с виноделом.",
        duration: "6 часов",
      },
      am: {
        title: "Սոնոմայի ափի Պինո Նուար ինտենսիվ",
        description:
          "Պինո Նուարի զով կլիմայական այգիներով քայլարշավ և գինեգործի վարպետաց դաս՝ բլենդինգի մասին։",
        duration: "6 ժամ",
      },
    },
    pricePerPerson: 225,
    date: "2026-07-05",
    bookableDates: ["2026-07-05"],
    mainImage:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1470158499416-75be9aa0c4db?w=1200&q=80",
    ],
  },
  {
    locales: {
      en: {
        title: "Healdsburg Food & Wine Loop",
        description:
          "Small-group tour combining urban tasting rooms, farm stops, and artisan cheese pairings.",
        duration: "5 hours",
      },
      ru: {
        title: "Хилдсбург: еда и вино",
        description:
          "Небольшая группа: городские дегустационные залы, фермы и сыры ручной работы с подбором вин.",
        duration: "5 часов",
      },
      am: {
        title: "Հիլդսբուրգ՝ սնունդ և գինի",
        description:
          "Փոքր խումբ՝ քաղաքային տեսակներ, ֆերմերային կանգառներ և արհեստական պանիրների զուգակցում։",
        duration: "5 ժամ",
      },
    },
    pricePerPerson: 165,
    date: "2026-08-02",
    bookableDates: ["2026-08-02"],
    mainImage:
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=1200&q=80",
    galleryImages: [],
  },
  {
    locales: {
      en: {
        title: "Sunset Vineyard Picnic",
        description:
          "Late afternoon tastings, short vineyard hike, and chef-prepared picnic as the sun sets.",
        duration: "4 hours",
      },
      ru: {
        title: "Пикник на закате среди виноградников",
        description:
          "Дегустации после полудня, короткая прогулка по виноградникам и пикник от шефа на закате.",
        duration: "4 часа",
      },
      am: {
        title: "Արևադարձային պիկնիկ այգիներում",
        description:
          "Կեսօրից հետո տեսակներ, կարճ քայլարշավ այգիներով և շեֆի պատրաստած պիկնիկ արևամուտի ժամանակ։",
        duration: "4 ժամ",
      },
    },
    pricePerPerson: 142,
    date: "2026-09-20",
    bookableDates: ["2026-09-20"],
    mainImage:
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80",
    galleryImages: [],
  },
] as const;

export async function seedToursIfEmpty(): Promise<void> {
  const count = await TourModel.countDocuments();
  if (count > 0) return;
  await TourModel.insertMany([...SAMPLE_TOURS]);
  console.log(`[seed] Inserted ${SAMPLE_TOURS.length} sample tours`);
}
