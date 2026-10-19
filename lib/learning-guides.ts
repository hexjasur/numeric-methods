export interface GuideLiteratureSource {
  authors: string;
  title: string;
  publisher: string;
  year: number;
  chapterSection: string;
  pages: string;
  note?: string;
}

export interface PlatformConvention {
  topic: string;
  textbookStandard: string;
  platformImplementation: string;
  whyChosen: string;
}

export interface LearningGuide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  area: string;
  calculatorHref: string;
  summary: string;
  formula: string;
  formulaTex: string;
  convergenceCondition?: string;
  convergenceTex?: string;
  errorEstimateTex?: string;
  theory: string[];
  steps: string[];
  example: {
    problem: string;
    calculation: string;
    result: string;
  };
  whenToUse: string[];
  limitations: string[];
  questions: { question: string; answer: string }[];
  sources: GuideLiteratureSource[];
  platformConventions: PlatformConvention[];
}

export interface BibliographyItem {
  id: string;
  authors: string;
  title: string;
  publisher: string;
  year: number;
  pages: string;
  degree?: string;
  description: string;
  topics: string[];
}

export const academicBibliography: BibliographyItem[] = [
  {
    id: 'ismoilov-2025',
    authors: 'A. I. Ismoilov, Sh. A. Ro‘zaliyev',
    title: 'Sonli usullar (O‘quv qo‘llanma, I qism)',
    publisher: 'Farg‘ona davlat universiteti, FDU "Nusxa ko‘paytirish bo‘limi"',
    year: 2025,
    pages: '150 b.',
    degree: 'Farg‘ona davlat universiteti Amaliy matematika kafedrasi tavsiyasi',
    description:
      'Amaliy matematika yo‘nalishi talabalari uchun tayyorlangan zamonaviy darslik. Unda xatoliklar nazariyasi, algebraik va transendent tenglamalarni yechish, chiziqli va chiziqsiz sistemalar, xos sonlar va vektorlar (Krilov usuli), interpolyatsiyalash hamda sonli integrallash batafsil bayon etilgan.',
    topics: [
      'Xatoliklar nazariyasi',
      'Biseksiya usuli',
      'Nyuton usuli',
      'Oddiy iteratsiya',
      'Gauss va teskari matritsa',
      'Zeydel usuli',
      'Krilov usuli',
      'Lagranj va Nyuton interpolyatsiyasi',
      'Kubik splaynlar',
      'To‘g‘ri to‘rtburchak, Trapetsiya, Simpson',
    ],
  },
  {
    id: 'irisqulov-2013',
    authors: 'S. S. Irisqulov, K. D. Ismanova, M. Olimov, A. Imomov',
    title: 'Sonli usullar va algoritmlar (O‘quv qo‘llanma)',
    publisher: '“Namangan” nashriyoti',
    year: 2013,
    pages: '244 b.',
    degree: 'Oliy va o‘rta maxsus ta’lim vazirligi tomonidan tavsiya etilgan',
    description:
      'Informatika va hisoblash matematikasi yo‘nalishlari uchun fundamental qo‘llanma. Har bir hisoblash usuli uchun blok-sxemalar, algoritmik tahlillar, differensial tenglamalarni yechish (Eyler, Runge-Kutta, haydash usuli, Galyorkin) va Mathcad dasturiy vositalari tahlili berilgan.',
    topics: [
      'Biseksiya va vatarlar usuli',
      'Urinmalar va Vegsteyn usullari',
      'Gauss va uch diagonalli sistemalar',
      'Haydash (progonka) usuli',
      'Eyler va Runge-Kutta usullari',
      'Chekli ayirmalar usuli',
      'Galyorkin usuli',
      'Xususiy hosilali tenglamalar (to‘r usuli)',
      'Mathcad dasturlar bog‘lami',
    ],
  },
  {
    id: 'ismatullayev-2014',
    authors: 'G. P. Ismatullayev, M. S. Koshergenova',
    title: 'Hisoblash usullari (O‘quv qo‘llanma)',
    publisher: 'Toshkent: «Tafakkur Bo‘stoni»',
    year: 2014,
    pages: '240 b.',
    degree: 'Oliy va o‘rta maxsus ta’lim vazirligi tavsiyasi',
    description:
      'Matematika, mexanika va axborot xavfsizligi mutaxassisliklari uchun mo‘ljallangan mukammal qo‘llanma. Nazariy teoremalar, ortogonal ko‘phadlar (Chebishev, Lejandr), qoldiq had baholari, xos sonlar va vektorlar (Krilov, Danilevskiy), Koshi va chegaraviy masalalar chuqur tahlil qilingan.',
    topics: [
      'Absolyut va nisbiy xatolar',
      'Chebishev va Lejandr ko‘phadlari',
      'Gauss va Chebishev kvadratur formulalari',
      'Ildizlarni ajratish teoremalari (Dekart, Gyua, Lagranj, Nyuton)',
      'Kvadrat ildizlar metodi',
      'Danilevskiy metodi',
      'Adams ekstrapolyatsion va interpolyatsion metodlari',
      'Runge qoidasi',
      'Kollokatsiya va kichik kvadratlar metodlari',
    ],
  },
  {
    id: 'isroilov-2003',
    authors: 'M. I. Isroilov',
    title: 'Hisoblash metodlari (1- va 2-qism)',
    publisher: 'Toshkent: «O‘qituvchi» (1-qism, 2003) / «Iqtisod-Moliya» (2-qism, 2008)',
    year: 2008,
    pages: '400 b. + 320 b.',
    degree: 'Universitetlar va oliy texnika o‘quv yurtlari uchun darslik',
    description:
      'O‘zbekiston hisoblash matematikasi maktabining klassik poydevor darsligi. Funksional analiz asoslari, approksimatsiya nazariyasi, chiziqli algebra va differensial tenglamalarning sonli usullari eng qat’iy matematik shaklda yoritilgan.',
    topics: [
      'Funksional fazolar va approksimatsiya',
      'Chiziqli algebraning to‘g‘ri va iteratsion usullari',
      'Spektral masalalar va xos qiymatlar',
      'Kvadraturalar nazariyasi',
      'Koshi masalasining ko‘p qadamli usullari',
      'Chegaraviy masalalar',
    ],
  },
  {
    id: 'burden-faires-2011',
    authors: 'Richard L. Burden, J. Douglas Faires',
    title: 'Numerical Analysis (9th Edition)',
    publisher: 'Boston, USA: Brooks/Cole, Cengage Learning',
    year: 2011,
    pages: '888 p.',
    degree: 'Dunyo miqyosidagi standart akademik darslik',
    description:
      'Xalqaro darajadagi eng mashhur sonli usullar darsligi. Teoremalarning qat’iy isbotlari, zamonaviy dasturiy algoritmlar va konvergensiya tahlillari batafsil keltirilgan.',
    topics: [
      'Solutions of Equations in One Variable',
      'Interpolation and Polynomial Approximation',
      'Numerical Differentiation and Integration',
      'Initial-Value Problems for ODEs',
      'Direct and Iterative Methods for Linear Systems',
    ],
  },
];

export const learningGuides: LearningGuide[] = [
  {
    slug: 'biseksiya-usuli',
    title: 'Biseksiya (teng ikkiga bo‘lish) usuli',
    metaTitle: 'Biseksiya usuli: nazariya, formulalar va kalkulyator',
    description:
      'Biseksiya (dixotomiya) usulida algebraik va transendent tenglama ildizini topish. O‘zbekiston darsliklari asosida nazariya, formulalar, misol va platformadagi kiritish standarti.',
    keywords: [
      'biseksiya usuli',
      'oraliqni teng ikkiga bo‘lish usuli',
      'dixotomiya metodi',
      'tenglama ildizini topish',
      'sonli usullar biseksiya',
    ],
    area: 'Tenglama ildizlarini topish',
    calculatorHref: '/methods/bisection',
    summary:
      'Biseksiya usuli (dixotomiya) uzluksiz funksiyaning ildizini o‘z ichiga olgan oraliqni har bir qadamda teng ikkiga bo‘lib borish orqali topadi. Bolsano-Koshi teoremasiga ko‘ra, agar oraliq uchlarida funksiya qarama-qarshi ishoralarga ega bo‘lsa (f(a)·f(b) < 0), oraliqda kamida bitta haqiqiy ildiz mavjud bo‘ladi.',
    formula: 'c = (a + b) / 2;  f(a) · f(c) < 0 bo‘lsa yangi oraliq [a, c], aks holda [c, b]',
    formulaTex: 'c_k = \\frac{a_k + b_k}{2}, \\quad f(a_k) \\cdot f(c_k) < 0 \\implies [a_{k+1}, b_{k+1}] = [a_k, c_k]',
    convergenceCondition:
      'Funksiya [a, b] kesmada uzluksiz va f(a) · f(b) < 0 bo‘lishi zarur. Agar f′(x) oraliqda o‘z ishorasini o‘zgartirmasa, ildiz yagonadir.',
    convergenceTex: 'f(x) \\in C[a,b], \\quad f(a) \\cdot f(b) < 0, \\quad f\'(x) \\neq 0',
    errorEstimateTex: '|c_n - \\xi| \\le \\frac{b - a}{2^{n+1}} < \\varepsilon \\implies n \\ge \\frac{\\ln(b-a) - \\ln\\varepsilon}{\\ln 2} - 1',
    theory: [
      'Bolsano-Koshi teoremasi: Agar f(x) funksiya [a, b] kesmada aniqlangan va uzluksiz bo‘lib, kesma chetki nuqtalarida har xil ishorali qiymatlarni qabul qilsa, ya’ni f(a)·f(b) < 0 bo‘lsa, u holda (a, b) oraliqda f(ξ) = 0 tenglikni qanoatlantiruvchi kamida bitta ξ ildiz mavjud.',
      'Yagonalik teoremasi: Agar oraliqda birinchi tartibli hosila f′(x) mavjud bo‘lib, o‘z ishorasini saqlasa (funksiya qat’iy monoton bo‘lsa), ildiz yagona bo‘ladi.',
      'Oraliq uzunligining qisqarishi: Har bir iteratsiya qadamidan so‘ng ildiz saqlanuvchi kesma uzunligi roppa-rosa ikki baravarga qisqaradi: b_n - a_n = (b - a)/2^n.',
      'Yaqinlashish kafolati: Usul har doim yaqinlashuvchan bo‘lib, global konvergensiyaga ega. Biroq konvergensiya tezligi chiziqli bo‘lib, Nyuton usuliga qaraganda sekinroq kechadi.',
    ],
    steps: [
      'Uzluksiz f(x) funksiya uchun f(a) · f(b) < 0 shartni qanoatlantiruvchi boshlang‘ich [a, b] oraliqni ajrating.',
      'Oraliq o‘rtasini c = (a + b) / 2 formula bilan hisoblang.',
      'O‘rta nuqtadagi funksiya qiymati f(c) ni toping. Agar f(c) = 0 bo‘lsa, c aniq ildizdir.',
      'Ishora almashinuvchi yarim oraliqni tanlang: agar f(a) · f(c) < 0 bo‘lsa, yangi oraliq [a, c]; aks holda [c, b] qilinadi.',
      'Oraliq uzunligi (b - a) < ε yoki |f(c)| < ε aniqlikka yetgunga qadar takrorlang.',
    ],
    example: {
      problem: 'f(x) = x³ − 20x + 12 = 0 tenglamaning [0, 1] oraliqdagi ildizini topish.',
      calculation:
        'f(0) = 12 > 0, f(1) = −7 < 0. Birinchi qadam: c₀ = (0 + 1) / 2 = 0.5. f(0.5) = 0.5³ − 20(0.5) + 12 = 2.125 > 0. f(0.5) · f(1) < 0 bo‘lgani uchun yangi oraliq [0.5, 1]. Ikkinchi qadam: c₁ = (0.5 + 1) / 2 = 0.75. f(0.75) = −2.578 < 0. Yangi oraliq [0.5, 0.75].',
      result: 'Iteratsiyalar davom ettirilib, 0.001 aniqlikdagi ildiz x ≈ 0.612 ga yaqinlashadi.',
    },
    whenToUse: [
      'Funksiya uzluksiz bo‘lib, oraliq uchlarida ishora almashinuvi ma’lum bo‘lsa.',
      'Hosilani hisoblash murakkab yoki mumkin bo‘lmaganda eng ishonchli usul sifatida.',
      'Boshqa tezroq usullar (Nyuton, vatar) uchun dastlabki yaqinlashuvchi oraliqni qisqartirishda.',
    ],
    limitations: [
      'Yaqinlashish tezligi chiziqli va sekin: har bir o‘nlik belgi uchun taxminan 3.32 ta iteratsiya kerak.',
      'Oraliqda faqat bitta ildiz ajratilgan bo‘lishi lozim; juft sondagi ildizlar bo‘lsa oraliq uchlarida ishora o‘zgarmay qolishi mumkin.',
    ],
    questions: [
      {
        question: 'Biseksiya usuli qachon yechim kafolatlaydi?',
        answer:
          'Funksiya [a, b] da uzluksiz va f(a) bilan f(b) ishoralari qarama-qarshi (f(a)·f(b) < 0) bo‘lsa, Bolsano-Koshi teoremasiga ko‘ra ildiz topilishi mutlaq kafolatlanadi.',
      },
      {
        question: 'Berilgan ε aniqlikka erishish uchun nechta iteratsiya kerak bo‘ladi?',
        answer:
          'Qadamlar soni n ≥ (ln(b - a) - ln(ε)) / ln(2) formulasi bilan oldindan aniq hisoblanadi. Masalan, [0, 1] da 10⁻⁴ aniqlik uchun kamida 14 ta qadam kerak.',
      },
    ],
    sources: [
      {
        authors: 'A.I. Ismoilov, Sh.A. Ro‘zaliyev',
        title: 'Sonli usullar (O‘quv qo‘llanma, I qism)',
        publisher: 'Farg‘ona davlat universiteti',
        year: 2025,
        chapterSection: 'II bob, 2.4-§ ("Algebraik va transendent tenglamalarni yarim (teng ikkiga) bo‘lish usuli bilan yechish")',
        pages: '34–39-betlar',
        note: 'C# tilida to‘liq dastur matni va algoritm blok-sxemasi keltirilgan.',
      },
      {
        authors: 'S.S. Irisqulov, K.D. Ismanova, M. Olimov, A. Imomov',
        title: 'Sonli usullar va algoritmlar',
        publisher: '“Namangan” nashriyoti',
        year: 2013,
        chapterSection: '2-bob, 2-§ ("Oraliqni teng ikkiga bo‘lish (biseksiya) usuli")',
        pages: '27–30-betlar',
        note: 'Xatolik bahosi Δx_n = (b-a)/2^n va test misoli x + 2 + 0.7x = 0 tahlil qilingan.',
      },
      {
        authors: 'G.P. Ismatullayev, M.S. Koshergenova',
        title: 'Hisoblash usullari',
        publisher: 'Toshkent: «Tafakkur Bo‘stoni»',
        year: 2014,
        chapterSection: 'IV bob, 4.1-§ ("Ildizlarni ajratish")',
        pages: '76–80-betlar',
        note: 'Ildizlarni ajratishning Dekart, Gyua, Lagranj va Nyuton teoremalari bayoni.',
      },
    ],
    platformConventions: [
      {
        topic: 'To‘xtash mezoni (Stopping criteria)',
        textbookStandard:
          'Ba’zi darsliklarda (Ismoilov 2025) faqat |b_n - a_n| < ε, boshqalarida (Irisqulov 2013) faqat |f(c)| < ε sharti tekshiriladi.',
        platformImplementation:
          'Sonli-usullar interaktiv platformasida bir vaqtning o‘zida ham oraliq uzunligi (|b - a| ≤ ε), ham funksiya qiymatining nolga yaqinligi (|f(c)| ≤ tol) qat’iy tekshiriladi.',
        whyChosen:
          'Bu yondashuv ham argument bo‘yicha aniqlikni, ham qoldiq bo‘yicha xatolikni kafolatlaydi va soxta konvergensiyadan himoya qiladi.',
      },
      {
        topic: 'Oraliq chegaralari va funksiyani kiritish',
        textbookStandard:
          'Qo‘lda ishlaganda funksiya alohida tahlil qilinib, oraliq qat’iy a < b deb belgilanadi.',
        platformImplementation:
          'Platformada f(x) ifodasi qulay matematik ko‘rinishda (masalan, x^3 - 20*x + 12 yoki sin(x) - x/2) kiritiladi. Agar a > b kiritilsa, tizim ularni avtomatik to‘g‘ri tartibga soladi va f(a)·f(b) < 0 shartini real vaqtda tekshirib boradi.',
        whyChosen:
          'Foydalanuvchi oraliqni teskari kiritgan taqdirda ham algoritm buzilmaydi, foydalanuvchiga qulay interaktiv tajriba taqdim etiladi.',
      },
    ],
  },
  {
    slug: 'nyuton-usuli',
    title: 'Nyuton (urinmalar) usuli',
    metaTitle: 'Nyuton usuli: formula, Fur‘ye sharti va online kalkulyator',
    description:
      'Nyuton-Rafson (urinmalar) usulida algebraik va transendent tenglamalarni yechish. Fur‘ye sharti, kvadratik yaqinlashish, darsliklar manbalari va platforma standarti.',
    keywords: [
      'nyuton usuli',
      'urinmalar usuli',
      'nyuton rafson',
      'fur‘ye sharti',
      'tenglama ildizi nyuton',
    ],
    area: 'Tenglama ildizlarini topish',
    calculatorHref: '/methods/newton',
    summary:
      'Nyuton usuli funksiya grafigiga joriy nuqtada urinma o‘tkazib, uning absissa o‘qi bilan kesishgan nuqtasini navbatdagi yaqinlashuv sifatida qabul qiladi. Agar birinchi hosila noldan farqli va boshlang‘ich nuqta yaxshi tanlangan bo‘lsa, usul kvadratik tezlikda yaqinlashadi.',
    formula: 'xₙ₊₁ = xₙ − f(xₙ) / f′(xₙ)',
    formulaTex: 'x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}, \\quad n = 0, 1, 2, \\dots',
    convergenceCondition:
      'Funksiya [a, b] da ikki marta differensiallanuvchi, f(a)·f(b) < 0 va f′(x) ≠ 0 bo‘lsin. Boshlang‘ich nuqta Fur‘ye shartini qanoatlantirishi lozim: f(x₀) · f′′(x₀) > 0.',
    convergenceTex: 'f(a)f(b) < 0, \\quad f\'(x) \\neq 0, \\quad f(x_0) \\cdot f\'\'(x_0) > 0',
    errorEstimateTex: '|x_{n+1} - \\xi| \\le \\frac{M_2}{2 m_1} |x_n - \\xi|^2, \\quad m_1 = \\min_{[a,b]} |f\'(x)|, \\quad M_2 = \\max_{[a,b]} |f\'\'(x)|',
    theory: [
      'Teylor formulasiga asoslanishi: f(x) funksiyani x_n nuqta atrofida Teylor qatoriga yoyib, chiziqli hadlar bilan chegaralanamiz: 0 = f(ξ) ≈ f(x_n) + f′(x_n)(ξ − x_n). Bundan ξ ≈ x_n − f(x_n)/f′(x_n) formulasi kelib chiqadi.',
      'Geometrik ma’nosi: Egri chiziqning (x_n, f(x_n)) nuqtasiga o‘tkazilgan urinma tenglamasi y − f(x_n) = f′(x_n)(x − x_n) bo‘lib, uning y = 0 da x-o‘qi bilan kesishishi aynan x_{n+1} nuqtani beradi.',
      'Fur‘ye (qavariqlik) sharti: Monoton yaqinlashish kafolati uchun boshlang‘ich x₀ nuqta qilib egri chiziq qavariqligi tomonidagi chekka nuqta tanlanadi, ya’ni f(x₀)·f′′(x₀) > 0.',
      'Kvadratik konvergensiya: Ildizga yetarlicha yaqin sohada har bir qadamda aniq raqamlar soni ikki baravarga ko‘payadi.',
    ],
    steps: [
      'f(x) funksiyasini va uning birinchi tartibli hosilasi f′(x) ni aniqlang.',
      'Ildiz yotgan [a, b] oraliqda f(x₀)·f′′(x₀) > 0 shartini qanoatlantiruvchi x₀ boshlang‘ich nuqtani tanlang.',
      'Iteratsiya formulasi bo‘yicha x_{n+1} = x_n − f(x_n) / f′(x_n) hisoblang.',
      'Har bir qadamda |x_{n+1} − x_n| < ε yoki |f(x_{n+1})| < ε to‘xtash shartini tekshiring.',
      'Agar hosila f′(x_n) nolga yaqinlashib qolsa, qadamni qayta sozlang.',
    ],
    example: {
      problem: 'f(x) = x³ − 20x + 12 = 0 tenglamaning (4, 5) oraliqdagi ildizini topish.',
      calculation:
        'f′(x) = 3x² − 20, f′′(x) = 6x. x ∈ (4, 5) da f′′(x) > 0. f(5) = 125 − 100 + 12 = 37 > 0. Demak, f(5)·f′′(5) > 0 bo‘lgani uchun x₀ = 5 tanlanadi. 1-qadam: x₁ = 5 − (5³ − 20·5 + 12)/(3·5² − 20) = 5 − 37/55 ≈ 4.327. 2-qadam: x₂ = 4.327 − f(4.327)/f′(4.327) ≈ 4.162.',
      result: 'Atigi 4 ta iteratsiyada x ≈ 4.1501 aniq qiymatiga erishiladi.',
    },
    whenToUse: [
      'Funksiya differensiallanuvchi va hosilasini hisoblash oson bo‘lganda.',
      'Ildiz uchun yaxshi boshlang‘ich taxmin mavjud bo‘lib, juda yuqori aniqlik talab qilinganda.',
      'Chiziqsiz tenglamalar sistemalarini (Yakobi matritsasi orqali) yechishda.',
    ],
    limitations: [
      'f′(x) ≈ 0 bo‘lsa (ekstremum nuqtalari yaqinida), qadam cheksiz katta bo‘lib, usul oraliqdan chiqib ketishi mumkin.',
      'Noto‘g‘ri boshlang‘ich nuqta tanlansa, usul uzoqlashishi yoki siklik tebranishga tushib qolishi mumkin.',
    ],
    questions: [
      {
        question: 'Nyuton usulida hosila nima uchun kerak?',
        answer:
          'Hosila urinmaning qiyaligini beradi. Urinmaning x-o‘qi bilan kesishgan nuqtasi keyingi ildiz taxmini bo‘ladi.',
      },
      {
        question: 'Fur‘ye sharti bajarilmasa usul ishlamaydimi?',
        answer:
          'Ishlashi mumkin, ammo monoton yaqinlashish kafolati yo‘qoladi va usul tebranib uzoqlashishi xavfi tug‘iladi.',
      },
    ],
    sources: [
      {
        authors: 'G.P. Ismatullayev, M.S. Koshergenova',
        title: 'Hisoblash usullari',
        publisher: 'Toshkent: «Tafakkur Bo‘stoni»',
        year: 2014,
        chapterSection: 'IV bob, 4.4-§ ("Nyuton metodi")',
        pages: '84–86-betlar',
        note: 'Kvadratik konvergensiya teoremasi va xatolikning Teylor qoldig‘i orqali bahosi berilgan.',
      },
      {
        authors: 'A.I. Ismoilov, Sh.A. Ro‘zaliyev',
        title: 'Sonli usullar (I qism)',
        publisher: 'Farg‘ona davlat universiteti',
        year: 2025,
        chapterSection: 'II bob, 2.3-§ ("Algebraik va transendent tenglamalarni urinmalar (Nyuton) usuli bilan yechish")',
        pages: '29–34-betlar',
        note: 'C# dasturi va x³ − 20x + 12 = 0 tenglamasi tahlili.',
      },
      {
        authors: 'S.S. Irisqulov, K.D. Ismanova, M. Olimov, A. Imomov',
        title: 'Sonli usullar va algoritmlar',
        publisher: '“Namangan” nashriyoti',
        year: 2013,
        chapterSection: '2-bob, 3-§ ("Urinmalar (Nyuton) usuli")',
        pages: '31–35-betlar',
        note: 'Vatar bilan urinmaning birgalikdagi geometrik talqini va Paskal kodi.',
      },
    ],
    platformConventions: [
      {
        topic: 'Hosilani hisoblash (Avtomatik differensiallash)',
        textbookStandard:
          'Darsliklarda talaba f′(x) hosilani qog‘ozda hisoblab, dastur kodiga f1(x) funksiya sifatida qo‘lda yozishi talab etiladi.',
        platformImplementation:
          'Sonli-usullar interaktiv platformasida hosilani qo‘lda kiritish talab qilinmaydi! Platforma Math.js analitik dvigateli yordamida f(x) dan f′(x) hosilani avtomatik simvolik hisoblaydi va ekranda ko‘rsatadi.',
        whyChosen:
          'Bu foydalanuvchini differensiallashdagi insoniy xatoliklardan (belgilar, koeffitsiyentlar yanglishishi) to‘liq himoya qiladi va hisoblashni tezlashtiradi.',
      },
      {
        topic: 'Gorizontal urinma va nolga bo‘linish xavfi',
        textbookStandard:
          'Kitoblarda f′(x_n) = 0 bo‘lganda usul to‘xtashi quruq qoida sifatida aytiladi.',
        platformImplementation:
          'Platformada agar biror qadamda |f′(x_n)| < 1e-12 bo‘lsa, tizim bo‘linish xatosi bermaydi, balki "Hosila nolga yaqin, urinma gorizontal bo‘lib qoldi — boshqa x₀ tanlang" mazmunida aniq tushuntirish va diagnostika beradi.',
        whyChosen:
          'Foydalanuvchi hisoblash nima sababdan to‘xtaganini darhol anglab, parametrni osonlikcha to‘g‘rilay oladi.',
      },
    ],
  },
  {
    slug: 'haydash-usuli',
    title: 'Haydash (progonka, Thomas) usuli',
    metaTitle: 'Haydash usuli: uch diagonalli sistemalarni yechish nazariyasi',
    description:
      'Uch diagonalli chiziqli tenglamalar sistemasini haydash (progonka / Thomas) usuli bilan yechish. Turg‘unlik sharti, to‘g‘ri va teskari yurish, darsliklar va platforma standarti.',
    keywords: [
      'haydash usuli',
      'progonka usuli',
      'thomas algoritmi',
      'uch diagonalli sistema',
      'tridiagonal matrix algorithm',
    ],
    area: 'Chiziqli tenglamalar sistemalari',
    calculatorHref: '/methods/sweep',
    summary:
      'Haydash usuli (progonka, Thomas algoritmi) uch diagonalli matritsaga ega bo‘lgan katta o‘lchamli chiziqli algebraik tenglamalar sistemasini O(n) chiziqli amallar soni bilan yechadi. U to‘g‘ri yurish (haydash koeffitsiyentlarini aniqlash) va teskari yurish (noma’lumlarni ketma-ket topish) bosqichlaridan iborat.',
    formula: 'aᵢxᵢ₋₁ + bᵢxᵢ + cᵢxᵢ₊₁ = dᵢ;  xᵢ = αᵢ₊₁xᵢ₊₁ + βᵢ₊₁',
    formulaTex:
      'a_i x_{i-1} + b_i x_i + c_i x_{i+1} = d_i \\implies x_i = \\alpha_{i+1} x_{i+1} + \\beta_{i+1}, \\quad \\alpha_{i+1} = \\frac{-c_i}{b_i + a_i \\alpha_i}, \\quad \\beta_{i+1} = \\frac{d_i - a_i \\beta_i}{b_i + a_i \\alpha_i}',
    convergenceCondition:
      'Turg‘unlik uchun diagonal elementlarning qat’iy ustunligi zarur: |b_i| ≥ |a_i| + |c_i| (barcha i uchun) va kamida bitta qatorda qat’iy tengsizlik.',
    convergenceTex: '|b_i| \\ge |a_i| + |c_i| \\quad (i = 1, \\dots, n), \\quad |\\alpha_{i+1}| \\le 1',
    errorEstimateTex: '\\text{Murakkablik: } 8n - 7 \\text{ ta arifmetik amal } = O(n), \\quad \\text{xotira sarfi: } O(n)',
    theory: [
      'Uch diagonalli struktura: Amaliyotda (ayniqsa differensial tenglamalarni chekli ayirmalar usuli bilan diskretlashtirganda) har bir tenglamada faqat 3 ta qo‘shni noma’lum qatnashadi.',
      'To‘g‘ri yurish g‘oyasi: Noma’lumni x_i = α_{i+1}x_{i+1} + β_{i+1} ko‘rinishida izlab, tenglamaga qo‘yish orqali rekurrent formulalar keltirib chiqariladi: α_{i+1} va β_{i+1}.',
      'Teskari yurish: Oxirgi tenglamadan x_n topilgach, orqaga qarab x_{n-1}, x_{n-2}, ..., x_1 qiymatlari birin-ketin hisoblanadi.',
      'Turg‘unlik kafolati: Agar diagonal ustunlik sharti bajarilsa, haydash koeffitsiyentlari moduli bo‘yicha 1 dan oshmaydi (|α_{i+1}| ≤ 1), bu esa yaxlitlash xatolarining to‘planmasligini ta’minlaydi.',
    ],
    steps: [
      'Matritsaning uch diagonalli ekanligini va diagonal ustunlik shartini (|b_i| ≥ |a_i| + |c_i|) tekshiring.',
      'Boshlang‘ich koeffitsiyentlarni hisoblang: α₂ = −c₁ / b₁, β₂ = d₁ / b₁.',
      'To‘g‘ri yurish: i = 2 dan n−1 gacha α_{i+1} va β_{i+1} koeffitsiyentlarini rekurrent formula bilan toping.',
      'Oxirgi noma’lumni hisoblang: x_n = (d_n − a_n β_n) / (b_n + a_n α_n).',
      'Teskari yurish: i = n−1 dan 1 gacha x_i = α_{i+1} x_{i+1} + β_{i+1} orqali barcha noma’lumlarni aniqlang.',
    ],
    example: {
      problem:
        '5x₁ − 3x₂ = 8; 3x₁ + 5x₂ + x₃ = 0; x₂ + 4x₃ − 2x₄ = 3; x₃ − 3x₄ = −2 uch diagonalli sistemasini yechish.',
      calculation:
        'To‘g‘ri yurish: α₂ = 3/5 = 0.6, β₂ = 8/5 = 1.6. α₃ = −1/(5 + 3·0.6) = −1/6.8 = −0.147, β₃ = (0 − 3·1.6)/6.8 = −0.706. Oxirgi x₄ va qolgan noma’lumlar teskari yurish bilan topiladi.',
      result: 'Teskari yurish natijasida aniq yechim x = (1, −1, 1, 1) hosil qilinadi.',
    },
    whenToUse: [
      'Chegaraviy masalalarni chekli ayirmalar usuli bilan yechganda.',
      'Kubik splayn koeffitsiyentlarini aniqlashda.',
      'Katta o‘lchamli (n = 1000+) siyrak uch diagonalli sistemalarni tezkor yechishda.',
    ],
    limitations: [
      'Faqat uch diagonalli matritsalar uchun mo‘ljallangan; umumiy zich matritsalarda ishlamaydi.',
      'Maxraj b_i + a_i α_i nolga teng bo‘lib qolmasligi uchun diagonal ustunlik zarur.',
    ],
    questions: [
      {
        question: 'Haydash usulining Gauss usulidan ustunligi nimada?',
        answer:
          'Gauss usuli O(n³) amallar talab qilsa, haydash usuli faqat O(n) amal talab qiladi. Masalan, n = 1000 bo‘lganda Gauss 1 milliard amal bajarsa, haydash usuli bir necha ming amalda yechadi.',
      },
      {
        question: 'Agar matritsa uch diagonalli bo‘lmasa nima qilish kerak?',
        answer:
          'Bunday holda umumiy Gauss usuli, LU-ajratish yoki iteratsion usullar (Oddiy iteratsiya, Zeydel) qo‘llaniladi.',
      },
    ],
    sources: [
      {
        authors: 'G.P. Ismatullayev, M.S. Koshergenova',
        title: 'Hisoblash usullari',
        publisher: 'Toshkent: «Tafakkur Bo‘stoni»',
        year: 2014,
        chapterSection: 'V bob, 5.4-§ ("Haydash usuli") va VIII bob, 8.3-§',
        pages: '100–102, 184–187-betlar',
        note: 'Turg‘unlik teoremasi va to‘liq isboti bilan berilgan.',
      },
      {
        authors: 'S.S. Irisqulov, K.D. Ismanova, M. Olimov, A. Imomov',
        title: 'Sonli usullar va algoritmlar',
        publisher: '“Namangan” nashriyoti',
        year: 2013,
        chapterSection: '6-bob, 5-§ ("Chekli ayirmalar usuli va haydash")',
        pages: '141–145-betlar',
        note: 'Ikkinchi tartibli chegaraviy masalalar bilan uzviy bog‘liqlikda tahlil qilingan.',
      },
      {
        authors: 'A.A. Samarskiy, A.V. Gulin',
        title: 'Численные методы',
        publisher: 'Москва: «Наука»',
        year: 1989,
        chapterSection: 'Глава 2 ("Прямые методы для трехдиагональных систем")',
        pages: '76–84-betlar',
        note: 'Klassik monografik asos.',
      },
    ],
    platformConventions: [
      {
        topic: 'Belgilashlar va indeksatsiyadagi konvensiya',
        textbookStandard:
          'Turli kitoblarda har xil harflar: Ismatullayevda a_i, b_i, c_i; Irisqulovda A_i, B_i, C_i; Samarskiyda esa manfiy ishora bilan −A_i x_{i-1} + C_i x_i − B_i x_{i+1} = F_i ishlatiladi.',
        platformImplementation:
          'Sonli-usullar interaktiv platformasida eng tushunarli va qat’iy kanonik shakl qabul qilingan: har bir i-qator uchun a_i (pastki diagonal), b_i (asosiy diagonal), c_i (yuqori diagonal) va d_i (o‘ng tomon ozod hadi): a_i x_{i-1} + b_i x_i + c_i x_{i+1} = d_i.',
        whyChosen:
          'Ushbu standart xalqaro adabiyotlar (Thomas Algorithm) bilan to‘liq mos keladi va foydalanuvchida ishoralar bo‘yicha chalkashlikni yo‘qotadi.',
      },
      {
        topic: 'Turg‘unlik va chegaraviy nol koeffitsiyentlar',
        textbookStandard:
          'Birinchi qatorda a_1 = 0 va oxirgi qatorda c_n = 0 ekanligi ko‘pincha matnda yashirin qoldiriladi.',
        platformImplementation:
          'Platformada matritsa o‘lchami tanlanganda a₁ va c_n avtomatik 0 deb belgilanadi va kiritish maydonida ko‘rsatiladi. Tizim diagonal ustunlikni har bir satr uchun alohida tekshirib, foydalanuvchiga yashil/qizil nishon bilan darhol ko‘rsatadi.',
        whyChosen:
          'Foydalanuvchi noto‘g‘ri nol bo‘lmagan chekka element kiritib tizimni buzmasligini ta’minlaydi.',
      },
    ],
  },
  {
    slug: 'lagranj-interpolyatsiyasi',
    title: 'Lagranj interpolyatsiyasi',
    metaTitle: 'Lagranj interpolyatsiyasi: formula, bazislar va kalkulyator',
    description:
      'Lagranj interpolyatsion ko‘phadini qurish. Vandermond determinanti, fundamental bazislar, xatolik bahosi, darsliklar manbalari va platforma standarti.',
    keywords: [
      'lagranj interpolyatsiyasi',
      'lagrange polynomial',
      'interpolyatsion ko‘phad',
      'vandermond determinanti',
      'interpolyatsiya misollar',
    ],
    area: 'Interpolyatsiya',
    calculatorHref: '/methods/lagrange',
    summary:
      'Lagranj interpolyatsiyasi berilgan chekli sondagi turli (xᵢ, yᵢ) nuqtalar orqali o‘tuvchi yagona algebraik ko‘phadni quradi. Ko‘phad barcha tugunlarda berilgan qiymatlarni aniq qabul qiladi va oraliqdagi noma’lum qiymatlarni baholash imkonini beradi.',
    formula: 'P(x) = Σᵢ yᵢ Lᵢ(x),  Lᵢ(x) = Πⱼ≠ᵢ (x − xⱼ) / (xᵢ − xⱼ)',
    formulaTex: 'L_n(x) = \\sum_{i=0}^n y_i \\ell_i(x), \\quad \\ell_i(x) = \\prod_{j=0, j \\ne i}^n \\frac{x - x_j}{x_i - x_j}',
    convergenceCondition:
      'Barcha tugunlar turlicha bo‘lishi shart: x_i ≠ x_j (i ≠ j). Oraliq qadamlarining teng bo‘lishi talab qilinmaydi.',
    convergenceTex: 'x_i \\neq x_j \\quad (\\forall i \\neq j) \\implies \\det(V) = \\prod_{0 \\le j < i \\le n} (x_i - x_j) \\neq 0',
    errorEstimateTex: 'R_n(x) = f(x) - L_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!} \\prod_{i=0}^n (x - x_i), \\quad \\xi \\in [x_0, x_n]',
    theory: [
      'Interpolyatsiya masalasining qo‘yilishi: [a, b] kesmada berilgan n+1 ta turli x_k nuqtalarda f(x_k) qiymatlar ma’lum bo‘lsa, L_n(x_k) = f(x_k) shartni qanoatlantiruvchi darajasi n bo‘lgan ko‘phad qurish talab etiladi.',
      'Vandermond determinanti: Ko‘phad koeffitsiyentlariga nisbatan hosil bo‘ladigan sistemaning determinanti Vandermond determinantidir. Tugunlar turlicha bo‘lgani sababli u noldan farqli va ko‘phad mavjud hamda yagonadir.',
      'Fundamental bazis ko‘phadlar: Har bir ℓ_i(x) ko‘phadi o‘z x_i nuqtasida 1 ga, boshqa barcha x_j (j ≠ i) nuqtalarda esa 0 ga teng bo‘ladi: ℓ_i(x_j) = δ_{ij}.',
      'Qadam erkinligi: Nyutonning chekli ayirmalar formulasidan farqli ravishda, Lagranj formulasi tugunlar orasidagi masofalar teng bo‘lmagan (notekis) hollarda ham bir xil qulaylikda qo‘llaniladi.',
    ],
    steps: [
      'Berilgan (xᵢ, yᵢ) nuqtalar jadvalini tuzing va barcha xᵢ lar turlicha ekanligini tekshiring.',
      'Har bir i uchun ℓ_i(x) bazis ko‘phadini tuzing: maxrajda (x_i − x_j), suratda (x − x_j) ko‘paytmasi.',
      'Har bir bazis ko‘phadni mos y_i qiymatiga ko‘paytirib, barchasini qo‘shing: L_n(x) = Σ y_i ℓ_i(x).',
      'Hosil bo‘lgan ko‘phadga kerakli x nuqtani qo‘yib, funksiyaning taqribiy qiymatini hisoblang.',
    ],
    example: {
      problem: '(0, 2), (1, 3), (2, 12), (5, 147) nuqtalardan o‘tuvchi Lagranj ko‘phadini qurish.',
      calculation:
        'ℓ₀(x) = (x−1)(x−2)(x−5)/((0−1)(0−2)(0−5)) = −(x−1)(x−2)(x−5)/10. ℓ₁(x) = x(x−2)(x−5)/(1·(−1)·(−4)) = x(x−2)(x−5)/4. ℓ₂(x) = x(x−1)(x−5)/(2·1·(−3)) = −x(x−1)(x−5)/6. ℓ₃(x) = x(x−1)(x−2)/(5·4·3) = x(x−1)(x−2)/60. Koeffitsiyentlarni y_i larga ko‘paytirib qisqartirganda: P(x) = x³ + x² − x + 2 hosil bo‘ladi.',
      result: 'Hosil bo‘lgan ko‘phad: P(x) = x³ + x² − x + 2. Barcha 4 ta nuqtada aynan mos keladi.',
    },
    whenToUse: [
      'Tajriba yoki o‘lchov natijalari notekis (turli oraliqli) qadamlar bilan olinganda.',
      'Nuqtalar soni uncha ko‘p bo‘lmaganda (n ≤ 10) analitik ko‘phad ifodasini olish uchun.',
      'Oraliqdagi yangi nuqtada tezkor qiymat baholash talab etilganda.',
    ],
    limitations: [
      'Yangi nuqta qo‘shilganda butun formulani noldan qayta hisoblash kerak bo‘ladi (bu maqsadda Nyuton usuli afzal).',
      'Tugunlar soni ko‘payib ketsa (n > 15), chekka oraliqlarda Runge effekti (keskin tebranishlar) paydo bo‘lishi mumkin.',
    ],
    questions: [
      {
        question: 'Lagranj usulida tugunlar orasidagi qadamlar bir xil bo‘lishi shartmi?',
        answer:
          'Yo‘q! Lagranj usulining eng katta kuchi aynan notekis (har xil masofadagi) nuqtalarda ham hech qanday cheklovsiz ishlashidadir.',
      },
      {
        question: 'Runge effekti nima va uni qanday yengish mumkin?',
        answer:
          'Yuqori darajali ko‘phadlar oraliq chekkalarida kuchli tebranish beradi. Buning oldini olish uchun oraliqni bo‘laklab kubik splaynlar bilan interpolyatsiyalash yoki Chebishev tugunlaridan foydalanish tavsiya etiladi.',
      },
    ],
    sources: [
      {
        authors: 'A.I. Ismoilov, Sh.A. Ro‘zaliyev',
        title: 'Sonli usullar (O‘quv qo‘llanma, I qism)',
        publisher: 'Farg‘ona davlat universiteti',
        year: 2025,
        chapterSection: 'VI bob, 6.1-§ ("Lagranj interpolyatsion ko‘phadi")',
        pages: '95–100-betlar',
        note: 'Vandermond determinanti orqali yagonalik isboti va C# kodi keltirilgan.',
      },
      {
        authors: 'G.P. Ismatullayev, M.S. Koshergenova',
        title: 'Hisoblash usullari',
        publisher: 'Toshkent: «Tafakkur Bo‘stoni»',
        year: 2014,
        chapterSection: 'II bob, 2.1-§ va 2.2-§ ("Interpolyatsiyalash xatoligi")',
        pages: '15–18-betlar',
        note: 'Qoldiq hadning R_n(x) umumiy bahosi va Chebishev tugunlari tahlili.',
      },
      {
        authors: 'S.S. Irisqulov, K.D. Ismanova, M. Olimov, A. Imomov',
        title: 'Sonli usullar va algoritmlar',
        publisher: '“Namangan” nashriyoti',
        year: 2013,
        chapterSection: '4-bob, 3-§ ("Lagranj interpolyasion formulasi")',
        pages: '101–106-betlar',
        note: 'Blok-sxema va amaliy masalalar to‘plami.',
      },
    ],
    platformConventions: [
      {
        topic: 'Nuqtalarni kiritish tartibi va dublikatlar',
        textbookStandard:
          'Darsliklarda doimo x₀ < x₁ < ... < x_n qat’iy o‘sish tartibida beriladi.',
        platformImplementation:
          'Sonli-usullar interaktiv platformasida nuqtalar juftligini ixtiyoriy tartibda kiritishingiz mumkin. Platforma ularni avtomatik saralaydi va agar bir xil x koordinatali nuqta kiritilsa, darhol ogohlantiradi.',
        whyChosen:
          'Foydalanuvchi qulayligi uchun: tartibni qo‘lda tekshirishga hojat qolmaydi, nolga bo‘linish xatosi avtomatik oldi olinadi.',
      },
      {
        topic: 'Interpolyatsiya ko‘phadini namoyish qilish',
        textbookStandard:
          'Kitoblarda ko‘pincha faqat bitta belgilangan nuqtadagi sonli qiymat hisoblab ko‘rsatiladi.',
        platformImplementation:
          'Platforma nafaqat ixtiyoriy x nuqtadagi natijani, balki ko‘phadning to‘liq analitik formulasini hamda barcha tugunlardan o‘tuvchi interaktiv grafikni real vaqtda chizadi.',
        whyChosen:
          'Talaba ko‘phadning harakatini va Runge tebranishi bor-yo‘qligini ko‘z bilan yaqqol ko‘rib xulosa chiqara oladi.',
      },
    ],
  },
  {
    slug: 'togri-tortburchaklar-usuli',
    title: 'To‘g‘ri to‘rtburchaklar usuli',
    metaTitle: 'To‘g‘ri to‘rtburchaklar usuli: integral formulasi va misollar',
    description:
      'Aniq integralni chap, o‘ng va o‘rta to‘g‘ri to‘rtburchaklar usulida hisoblash. Nazariya, qadam formulasi, xatolik bahosi va online kalkulyator.',
    keywords: [
      'to‘g‘ri to‘rtburchaklar usuli',
      'o‘rta nuqtalar usuli',
      'midpoint rule',
      'sonli integrallash',
      'kvadratur formulalar',
    ],
    area: 'Sonli integrallash',
    calculatorHref: '/methods/rectangles',
    summary:
      'To‘g‘ri to‘rtburchaklar usuli integral ostidagi egri chiziq bilan chegaralangan soha yuzini to‘g‘ri to‘rtburchaklar yuzalari yig‘indisiga almashtiradi. Balandlik sifatida bo‘lakning chap chekkasi, o‘ng chekkasi yoki o‘rtasi olinadi. O‘rta to‘g‘ri to‘rtburchaklar usuli Teylor simmetriyasi evaziga O(h²) tartibli yuqori aniqlik beradi.',
    formula: '∫ₐᵇ f(x) dx ≈ h · Σᵢ f(ξᵢ),  h = (b − a) / n',
    formulaTex:
      'I_{\\text{o\'rta}} = h \\sum_{i=0}^{n-1} f\\left(x_i + \\frac{h}{2}\\right), \\quad I_{\\text{chap}} = h \\sum_{i=0}^{n-1} f(x_i), \\quad I_{\\text{o\'ng}} = h \\sum_{i=1}^n f(x_i)',
    convergenceCondition:
      'Funksiya [a, b] da uzluksiz bo‘lishi lozim. Qadam h → 0 da yig‘indi Riman integrali ta’rifiga ko‘ra aniq integralga intiladi.',
    convergenceTex: 'f(x) \\in C^2[a,b], \\quad h = \\frac{b-a}{n} \\to 0 \\implies I_h \\to \\int_a^b f(x)dx',
    errorEstimateTex:
      '|R_{\\text{chap/o\'ng}}| \\le \\frac{(b-a)^2}{2n} M_1, \\quad |R_{\\text{o\'rta}}| \\le \\frac{(b-a)^3}{24 n^2} M_2 = \\frac{h^2(b-a)}{24} M_2, \\quad M_2 = \\max_{[a,b]} |f\'\'(x)|',
    theory: [
      'Geometrik asosi: Integral Riman integrali ta’rifiga binoan integral yig‘indining limitidir: ∫ f(x)dx = lim Σ f(ξ_i)Δx_i.',
      'Chap va o‘ng to‘rtburchaklar: Oraliq funksiyaning boshlang‘ich yoki oxirgi nuqtasidagi qiymati bo‘yicha olinadi. Global xatolik O(h) bo‘lib, birinchi tartibga ega.',
      'O‘rta to‘rtburchaklar (Midpoint rule): Oraliq o‘rtasidagi ξ_i = x_i + h/2 nuqtada Teylor qatoriga yoyilganda toq darajali hadlar integrallanganda nolga aylanadi. Shuning uchun xato O(h²) tartibda bo‘ladi — u trapetsiyalar usulidan ham ikki barobar aniqroqdir!',
      'Umumlashgan kvadratur: Oraliq teng n ta bo‘lakka bo‘linganda kompozit formula orqali hisoblash kompyuterda juda tez va barqaror bajariladi.',
    ],
    steps: [
      'Integrallash oralig‘ini [a, b] va bo‘linishlar sonini n ni tanlang.',
      'Qadam uzunligini hisoblang: h = (b − a) / n.',
      'Tugun nuqtalarini aniqlang: x_i = a + i·h (i = 0, 1, ..., n).',
      'Har bir bo‘lakning o‘rtasini toping: x_{i+1/2} = a + (i + 0.5)h.',
      'Yig‘indini tuzing va h ga ko‘paytiring: I = h · Σ f(x_{i+1/2}).',
    ],
    example: {
      problem: '∫₀¹ x / (x + 1) dx integralini n = 10 bilan o‘rta to‘rtburchak usulida hisoblash.',
      calculation:
        'h = (1 − 0)/10 = 0.1. O‘rta nuqtalar: x₀.₅ = 0.05, x₁.₅ = 0.15, ..., x₉.₅ = 0.95. Funksiya qiymatlari: f(0.05) = 0.05/1.05 ≈ 0.0476; f(0.15) ≈ 0.1304; ...; f(0.95) ≈ 0.4872. Yig‘indi Σ f(x_{i+1/2}) ≈ 3.0691.',
      result: 'I ≈ 0.1 · 3.0691 = 0.3069. Aniq qiymat: 1 − ln(2) ≈ 0.30685 (xatolik atigi 0.00005).',
    },
    whenToUse: [
      'Integralni tez va sodda baholash kerak bo‘lganda.',
      'Funksiya chegaraviy nuqtalarda singulyarlikka ega bo‘lib, o‘rta nuqtalarda chekli bo‘lganda.',
      'Turli kvadratura usullarining (chap, o‘ng, o‘rta) farqini taqqoslab o‘rganishda.',
    ],
    limitations: [
      'Chap va o‘ng to‘rtburchaklar usuli sekin yaqinlashadi (O(h)).',
      'Keskin o‘zgaruvchi va kuchli tebranuvchi funksiyalarda katta n talab etiladi.',
    ],
    questions: [
      {
        question: 'O‘rta to‘rtburchaklar usuli nega trapetsiya usulidan aniqroq?',
        answer:
          'O‘rta nuqtalar qoidasida xatolik koeffitsiyenti 1/24 bo‘lsa, trapetsiya usulida 1/12 dir. Demak, o‘rta to‘rtburchak usulining nazariy xatosi trapetsiyadan 2 barobar kichikdir.',
      },
      {
        question: 'Chap va o‘ng to‘rtburchaklar orasidagi farq nimani bildiradi?',
        answer:
          'Monoton o‘suvchi funksiyada chap usul integralni quyi baholaydi (kamaytiradi), o‘ng usul esa yuqori baholaydi (orttiradi). Ularning farqi oraliq qadami h ga to‘g‘ridan-to‘g‘ri proporsionaldir.',
      },
    ],
    sources: [
      {
        authors: 'A.I. Ismoilov, Sh.A. Ro‘zaliyev',
        title: 'Sonli usullar (I qism)',
        publisher: 'Farg‘ona davlat universiteti',
        year: 2025,
        chapterSection: 'VII bob, 7.1-§ ("Aniq integralni to‘g‘ri to‘rtburchak usuli bilan taqribiy hisoblash")',
        pages: '121–127-betlar',
        note: 'C# dastur matni va 30 ta amaliy variant misollari.',
      },
      {
        authors: 'G.P. Ismatullayev, M.S. Koshergenova',
        title: 'Hisoblash usullari',
        publisher: 'Toshkent: «Tafakkur Bo‘stoni»',
        year: 2014,
        chapterSection: 'III bob, 3.1-§ ("Interpolyatsion kvadratur formulalar")',
        pages: '58–63-betlar',
        note: 'O‘rta to‘rtburchaklar qoldiq hadi R_0(f) = (b-a)³ f′′(ξ)/24 ning qat’iy isboti.',
      },
      {
        authors: 'S.S. Irisqulov, K.D. Ismanova, M. Olimov, A. Imomov',
        title: 'Sonli usullar va algoritmlar',
        publisher: '“Namangan” nashriyoti',
        year: 2013,
        chapterSection: '5-bob, 2-§ ("To‘g‘ri to‘rtburchaklar formulasi")',
        pages: '114–116-betlar',
        note: 'Algoritm blok-sxemasi va Paskal tili dasturi.',
      },
    ],
    platformConventions: [
      {
        topic: 'Chap, o‘ng va o‘rta to‘rtburchaklarni birlashtirish',
        textbookStandard:
          'Ko‘p darsliklarda har bir variant uchun alohida formula va dastur yoziladi yoki faqat bitta variant ko‘rsatiladi.',
        platformImplementation:
          'Sonli-usullar interaktiv platformasida bir vaqtning o‘zida uchala usul (chap, o‘rta, o‘ng) hisoblanadi. Interaktiv grafikda to‘rtburchaklar ustunchalari egri chiziq ostida chiroyli ko‘rsatiladi.',
        whyChosen:
          'Foydalanuvchi uchala usulning farqini bitta ekranda darhol solishtira oladi va o‘rta nuqtaning ustunligini ko‘z bilan ko‘radi.',
      },
      {
        topic: 'Integral ostidagi funksiya kiritish sintaksisi',
        textbookStandard:
          'Kitoblarda f(x) analitik tarzda yoziladi, lekin kompyuterga kiritish turlicha (Paskal, C#, Mathcad).',
        platformImplementation:
          'Platformada universal matematik ifodalar qo‘llab-quvvatlanadi: sqrt(x), exp(x), ln(x), x^2, sin(x). Integral analitik tarzda ham yechilib, taqribiy natija bilan xatoligi ko‘rsatiladi.',
        whyChosen:
          'Har qanday murakkablikdagi funksiyalarni qulay kiritish va ta’lim jarayonida vizual tekshirish imkonini beradi.',
      },
    ],
  },
  {
    slug: 'trapetsiyalar-usuli',
    title: 'Trapetsiyalar usuli',
    metaTitle: 'Trapetsiyalar usuli: integral formulasi, xato bahosi va misol',
    description:
      'Trapetsiyalar usulida aniq integralni sonli hisoblash. Kompozit formula, qoldiq had bahosi, darsliklar manbalari va platforma standarti.',
    keywords: [
      'trapetsiyalar usuli',
      'trapetsiya formulasi',
      'kompozit trapetsiya',
      'sonli integrallash',
      'integral taqribiy hisoblash',
    ],
    area: 'Sonli integrallash',
    calculatorHref: '/methods/trapezoid',
    summary:
      'Trapetsiyalar usulida integrallash oraliqlaridagi egri chiziq vatarlar (chiziqli kesmalar) bilan tutashtirilib, hosil bo‘lgan to‘g‘ri chiziqli trapetsiyalar yuzalari qo‘shiladi. Silliq funksiyalar uchun kompozit formula xatoligi O(h²) tartibda bo‘ladi.',
    formula: 'I ≈ h/2 · [f(x₀) + 2Σᵢ₌₁ⁿ⁻¹ f(xᵢ) + f(xₙ)],  h = (b − a) / n',
    formulaTex:
      'I_{\\text{trap}} \\approx \\frac{h}{2} \\left[ f(x_0) + 2\\sum_{i=1}^{n-1} f(x_i) + f(x_n) \\right], \\quad h = \\frac{b - a}{n}',
    convergenceCondition:
      'Funksiya [a, b] da uzluksiz va kamida ikki marta differensiallanuvchi bo‘lsin. n musbat butun son bo‘lishi kifoya.',
    convergenceTex: 'f(x) \\in C^2[a,b], \\quad n \\ge 1, \\quad h = \\frac{b-a}{n}',
    errorEstimateTex:
      '|R_n(f)| \\le \\frac{(b-a)^3}{12 n^2} \\max_{[a,b]} |f\'\'(x)| = \\frac{h^2 (b-a)}{12} M_2, \\quad M_2 = \\max_{[a,b]} |f\'\'(x)|',
    theory: [
      'Egri chiziqni vatarlar bilan almashtirish: Har bir [x_i, x_{i+1}] kesmada funksiya 1-darajali Lagranj interpolyatsion ko‘phadi bilan approksimatsiyalanadi: f(x) ≈ y_i + (y_{i+1} − y_i)(x − x_i)/h.',
      'Elementar trapetsiya yuzi: S_i = ∫_{x_i}^{x_{i+1}} f(x)dx ≈ h(y_i + y_{i+1})/2.',
      'Kompozit formula: Barcha n ta qismlar yig‘ilganda, har bir ichki tugun ikkita qo‘shni trapetsiyaga kiradi va koeffitsiyenti 2 ga teng bo‘ladi; chekka tugunlar (x₀ va x_n) esa faqat bitta trapetsiyaga tegishli bo‘lib, koeffitsiyenti 1 bo‘ladi.',
      'Xatolik xususiyati: Agar funksiya botiq bo‘lsa (f′′ < 0), trapetsiyalar yuzasi aniq integraldan kichik bo‘ladi; qavariq bo‘lsa (f′′ > 0), kattaroq chiqadi.',
    ],
    steps: [
      'Integrallash oralig‘i [a, b] va bo‘linishlar soni n ni belgilang.',
      'Qadam uzunligini hisoblang: h = (b − a) / n.',
      'Tugun nuqtalarini tuzing: x_i = a + i·h (i = 0, 1, ..., n).',
      'Chekka tugunlar qiymatini (f(a) + f(b))/2 va ichki tugunlar yig‘indisini Σ f(x_i) hisoblang.',
      'Yig‘indini h ga ko‘paytiring: I = h · [ (f(a)+f(b))/2 + Σ f(x_i) ].',
    ],
    example: {
      problem: '∫₀¹ (x + 1) dx integralini n = 10 bilan trapetsiya usulida hisoblash.',
      calculation:
        'h = 0.1. x₀ = 0, x₁ = 0.1, ..., x₁₀ = 1.0. f(0) = 1, f(1) = 2. Ichki tugunlar: f(0.1)=1.1, f(0.2)=1.2, ..., f(0.9)=1.9. Ichki yig‘indi: 1.1 + 1.2 + ... + 1.9 = 13.5. Chekkalar: (1 + 2)/2 = 1.5. Umumiy yig‘indi: 1.5 + 13.5 = 15.0. I = 0.1 · 15.0 = 1.5.',
      result: 'I = 1.5. Aniq yechim: [x²/2 + x]₀¹ = 0.5 + 1 = 1.5 (chiziqli funksiyada xato 0 ga teng!).',
    },
    whenToUse: [
      'Funksiya qiymatlari jadval ko‘rinishida berilgan bo‘lganda.',
      'Bo‘linishlar soni n juft bo‘lishi shart bo‘lmaganda.',
      'Hisoblash soddaligi va geometrik ko‘rgazmalilik muhim bo‘lganda.',
    ],
    limitations: [
      'Funksiya egriligi katta bo‘lsa, aniqlik Simpson usuliga qaraganda ancha past bo‘ladi.',
      'Yuqori aniqlik uchun ko‘p miqdorda bo‘linishlar talab qilinadi.',
    ],
    questions: [
      {
        question: 'Trapetsiyalar usulida n juft bo‘lishi shartmi?',
        answer: 'Yo‘q. Simpson usulidan farqli o‘laroq, trapetsiyalar usuli uchun n ixtiyoriy butun musbat son (toq ham, juft ham) bo‘lishi mumkin.',
      },
      {
        question: 'Qachon trapetsiya usuli mutlaq aniq natija beradi?',
        answer:
          'Agar f(x) chiziqli funksiya (f(x) = kx + b) bo‘lsa, f′′(x) = 0 bo‘ladi va qoldiq had aynan nolga aylanadi — natija mutlaq aniq chiqadi.',
      },
    ],
    sources: [
      {
        authors: 'A.I. Ismoilov, Sh.A. Ro‘zaliyev',
        title: 'Sonli usullar (I qism)',
        publisher: 'Farg‘ona davlat universiteti',
        year: 2025,
        chapterSection: 'VII bob, 7.2-§ ("Aniq integrallarni trapetsiyalar usuli bilan taqribiy hisoblash")',
        pages: '128–134-betlar',
        note: 'Qoldiq had bahosi R_n(f) = -(b-a)³ f′′(ξ)/(12n²) va C# dasturi keltirilgan.',
      },
      {
        authors: 'G.P. Ismatullayev, M.S. Koshergenova',
        title: 'Hisoblash usullari',
        publisher: 'Toshkent: «Tafakkur Bo‘stoni»',
        year: 2014,
        chapterSection: 'III bob, 3.1-§ ("Umumlashgan trapetsiyalar formulasi")',
        pages: '61–63, 70–71-betlar',
        note: 'Koshi teoremasiga asoslangan qoldiq had bahosi.',
      },
      {
        authors: 'S.S. Irisqulov, K.D. Ismanova, M. Olimov, A. Imomov',
        title: 'Sonli usullar va algoritmlar',
        publisher: '“Namangan” nashriyoti',
        year: 2013,
        chapterSection: '5-bob, 3-§ ("Trapetsiya usuli")',
        pages: '117–118-betlar',
        note: 'Algoritm blok-sxemasi va Paskal dastur matni.',
      },
    ],
    platformConventions: [
      {
        topic: 'Formula ko‘rinishi va qismlar yig‘indisi',
        textbookStandard:
          'Kitoblarda ba’zan I ≈ h[(y₀ + y_n)/2 + y₁ + ... + y_{n-1}] ko‘rinishida, ba’zan esa I ≈ (h/2)[y₀ + 2y₁ + ... + 2y_{n-1} + y_n] shaklida beriladi.',
        platformImplementation:
          'Sonli-usullar platformasida ikkala ifoda ham bir xil matematik qiymatga ega ekanligi ko‘rsatiladi. Dastur ichida umumiy omil h/2 qilib chiqarilib, chekkalar 1, ichkilar 2 ga ko‘paytiriladi.',
        whyChosen:
          'Bu usul hisoblash mashinasida arifmetik amallarni qisqartiradi va yaxlitlash xatosini kamaytiradi.',
      },
      {
        topic: 'Interaktiv grafik va trapetsiyalar vizualizatsiyasi',
        textbookStandard:
          'Darsliklarda faqat bitta statik chizma (16-rasm) beriladi.',
        platformImplementation:
          'Platformada n sonini slayder orqali o‘zgartirganda har bir trapetsiya real vaqtda qayta chiziladi. Foydalanuvchi n ortgani sari trapetsiyalar egri chiziqqa qanday yopishib borishini interaktiv ko‘radi.',
        whyChosen:
          'Geometrik ma’noni mustahkamlash va n ning aniqlikka ta’sirini jonli his qilish uchun.',
      },
    ],
  },
  {
    slug: 'simpson-usuli',
    title: 'Simpson 1/3 (parabolalar) usuli',
    metaTitle: 'Simpson usuli: formula, juft qadam sharti va kalkulyator',
    description:
      'Simpson 1/3 (parabolalar) usulida aniq integralni hisoblash. 4-tartibli aniqlik, juft n sharti, darsliklardagi 2n va n chalkashligi tahlili hamda platforma standarti.',
    keywords: [
      'simpson usuli',
      'simpson 1/3 formulasi',
      'parabolalar usuli',
      'sonli integrallash simpson',
      'simpson qoidasi',
    ],
    area: 'Sonli integrallash',
    calculatorHref: '/methods/simpson',
    summary:
      'Simpson 1/3 usuli har ikki qo‘shni oraliqdagi funksiyani kvadratik parabola bilan yaqinlashtiradi. Bo‘linishlar soni n juft bo‘lishi shart. Toq indeksli tugunlar 4, juft indeksli tugunlar 2 koeffitsiyenti bilan olinadi. Usul O(h⁴) yuqori tartibli aniqlikka ega bo‘lib, 3-darajagacha bo‘lgan barcha ko‘phadlarni mutlaqo aniq integrallaydi.',
    formula: 'I ≈ h/3 · [f(x₀) + 4Σ f(x_toq) + 2Σ f(x_juft) + f(xₙ)]',
    formulaTex:
      'I_{\\text{simp}} \\approx \\frac{h}{3} \\left[ f(x_0) + 4\\sum_{k=1}^{n/2} f(x_{2k-1}) + 2\\sum_{k=1}^{n/2 - 1} f(x_{2k}) + f(x_n) \\right], \\quad h = \\frac{b - a}{n}',
    convergenceCondition:
      'Funksiya [a, b] da 4 marta uzluksiz differensiallanuvchi (f ∈ C⁴[a, b]) va bo‘linishlar soni n juft musbat son (n = 2m) bo‘lishi shart.',
    convergenceTex: 'f(x) \\in C^4[a,b], \\quad n \\in 2\\mathbb{N}^+ \\implies h = \\frac{b-a}{n}',
    errorEstimateTex:
      '|R_n(f)| \\le \\frac{(b-a)^5}{180 n^4} \\max_{[a,b]} |f^{(4)}(x)| = \\frac{h^4 (b-a)}{180} M_4',
    theory: [
      'Parabolik approksimatsiya: Har bir juft oraliqda [x_{2k-2}, x_{2k}] uchta nuqta (x_{2k-2}, y_{2k-2}), (x_{2k-1}, y_{2k-1}), (x_{2k}, y_{2k}) orqali o‘tuvchi ikkinchi tartibli parabola P₂(x) = Ax² + Bx + C quriladi.',
      'Klassik Simpson formulasi: ∫_{x_0}^{x_2} P₂(x)dx = (h/3)(y₀ + 4y₁ + y₂).',
      'Darajaviy xususiyat: Garchi parabola darajasi 2 bo‘lsa-da, simmetrik oraliqda kubik hadning integrali nol bo‘lganligi uchun Simpson formulasi har qanday 3-darajali ko‘phad (ax³ + bx² + cx + d) uchun ham qoldiqsiz, mutlaq aniq natija beradi!',
      'To‘rtinchi tartibli xatolik: Xatolik qadamning 4-darajasiga proporsional: O(h⁴). Qadamni ikki barobar kichraytirish xatolikni 16 barobar kamaytiradi.',
    ],
    steps: [
      'Bo‘linishlar soni n ni juft son (n = 2, 4, 6, ...) qilib tanlang.',
      'Qadam uzunligini hisoblang: h = (b − a) / n.',
      'Tugunlarni toping: x_i = a + i·h (i = 0, 1, ..., n).',
      'Tugunlardagi funksiya qiymatlarini hisoblang: y_i = f(x_i).',
      'Toq indeksli qiymatlar yig‘indisini 4 ga, juft indeksli qiymatlar yig‘indisini 2 ga ko‘paytiring.',
      'Chekka qiymatlarni qo‘shib, h/3 ga ko‘paytiring: I = (h/3)[y₀ + 4Σ y_{toq} + 2Σ y_{juft} + y_n].',
    ],
    example: {
      problem: '∫₀¹ 2x / (1 + x²) dx integralini n = 10 (juft) bilan Simpson usulida hisoblash.',
      calculation:
        'h = (1 − 0)/10 = 0.1. x₀ = 0, x₁ = 0.1, ..., x₁₀ = 1.0. Toq tugunlar: f(0.1), f(0.3), f(0.5), f(0.7), f(0.9); yig‘indi S₁ ≈ 1.8398. Juft tugunlar: f(0.2), f(0.4), f(0.6), f(0.8); yig‘indi S₂ ≈ 1.3414. Chekkalar: f(0) = 0, f(1) = 1.0. I = (0.1 / 3) · [0 + 4(1.8398) + 2(1.3414) + 1.0] ≈ 0.693148.',
      result: 'I ≈ 0.693148. Aniq analitik qiymat: ln(1 + 1²) = ln(2) ≈ 0.69314718 (xatolik atigi 10⁻⁶).',
    },
    whenToUse: [
      'Funksiya yetarlicha silliq va oraliqni teng juft qadamlarga bo‘lish mumkin bo‘lganda.',
      'Trapetsiyalar usuliga qaraganda ancha yuqori aniqlik talab qilinganda.',
      'Kvadratik yoki kubik ko‘phadlarni aniq integrallash zarur bo‘lganda.',
    ],
    limitations: [
      'Bo‘linishlar soni n albatta juft bo‘lishi shart.',
      'Funksiyaning 4-tartibli hosilasi uzilishli yoki juda katta bo‘lsa, usulning yuqori aniqlik afzalligi pasayishi mumkin.',
    ],
    questions: [
      {
        question: 'Simpson usulida n nega albatta juft bo‘lishi kerak?',
        answer:
          'Chunki har bir parabola uchta ketma-ket nuqta (ya’ni 2 ta qismiy oraliq) ustida quriladi. Barcha oraliqlarni juftlab guruhlash uchun umumiy qismlar soni n juft bo‘lishi shart.',
      },
      {
        question: 'Simpson 1/3 va Simpson 3/8 orasidagi farq nima?',
        answer:
          'Simpson 1/3 ikkita oraliq va parabola (2-darajali) ishlatadi; Simpson 3/8 esa uchta oraliq va 3-darajali ko‘phad ishlatadi (n 3 ga karrali bo‘lishi talab qilinadi).',
      },
    ],
    sources: [
      {
        authors: 'A.I. Ismoilov, Sh.A. Ro‘zaliyev',
        title: 'Sonli usullar (I qism)',
        publisher: 'Farg‘ona davlat universiteti',
        year: 2025,
        chapterSection: 'VII bob, 7.3-§ ("Aniq integralni parabolalar (Simpson) usuli bilan taqribiy hisoblash")',
        pages: '135–143-betlar',
        note: 'Qoldiq had bahosi R_n(f) = -(b-a) f^{(IV)}(ξ) h⁴ / 180 va C# kodi keltirilgan.',
      },
      {
        authors: 'G.P. Ismatullayev, M.S. Koshergenova',
        title: 'Hisoblash usullari',
        publisher: 'Toshkent: «Tafakkur Bo‘stoni»',
        year: 2014,
        chapterSection: 'III bob, 3.1-§ ("Simpson kvadratur formulasi")',
        pages: '62–64, 71–74-betlar',
        note: 'Simpson formulasi qoldiq hadining batafsil isboti va Chebishev/Gauss kvadraturasi bilan taqqoslanishi.',
      },
      {
        authors: 'S.S. Irisqulov, K.D. Ismanova, M. Olimov, A. Imomov',
        title: 'Sonli usullar va algoritmlar',
        publisher: '“Namangan” nashriyoti',
        year: 2013,
        chapterSection: '5-bob, 4-§ ("Simpson (parabolalar) formulasi")',
        pages: '119–123-betlar',
        note: 'Misol ∫₀¹ (x³ + 2x² − x + 5)dx ning uchala usulda taqqoslama hisobi.',
      },
    ],
    platformConventions: [
      {
        topic: '2n va n oraliqlar soni chalkashligi (Asosiy darslik ziddiyati)',
        textbookStandard:
          'Ismoilov (2025) va Irisqulov (2013) kitoblarida interval "2n ta bo‘lakka bo‘linadi" deb olinadi, shunda qadam h = (b-a)/(2n) va koeffitsiyent (b-a)/(6n) bo‘ladi. Ismatullayev (2014) va xalqaro darsliklarda (Burden) esa oraliq "n ta bo‘lakka bo‘linadi va n juft son" deb belgilanadi (h = (b-a)/n va h/3).',
        platformImplementation:
          'Sonli-usullar interaktiv platformasida xalqaro standart qabul qilingan: kiritiladigan n soni bevosita umumiy oraliqlar sonini (subintervals) bildiradi va u juft bo‘lishi talab qilinadi (n = 2, 4, 6, ...). Qadam h = (b − a)/n, formula esa h/3 [y₀ + 4Σ y_{toq} + 2Σ y_{juft} + y_n].',
        whyChosen:
          'Ushbu standart foydalanuvchiga oraliqlar sonini to‘g‘ridan-to‘g‘ri boshqarish imkonini beradi. Agar toq son kiritilsa, tizim darhol buni ko‘rsatib, eng yaqin juft songa avtomatik tuzatishni taklif qiladi.',
      },
      {
        topic: 'Toq va juft indekslar koeffitsiyentlari (4 va 2)',
        textbookStandard:
          'Adabiyotlarda qaysi indekslar 4 va qaysilari 2 bo‘lishi indekslash 0 dan yoki 1 dan boshlanishiga qarab chalkashishi mumkin.',
        platformImplementation:
          'Platformada 0-indekslangan massiv qabul qilingan: x₀ (chekka), x₁ (toq → 4), x₂ (juft → 2), x₃ (toq → 4), ..., x_{n-1} (toq → 4), x_n (chekka). Natijalar jadvalida har bir x_i yonida uning vazn koeffitsiyenti (1, 4 yoki 2) alohida ustunda ko‘rsatiladi.',
        whyChosen:
          'Talaba hisob-kitobni qo‘lda tekshirayotganda qaysi had qanday vazn olganini bir zumda ko‘ra oladi.',
      },
    ],
  },
  {
    slug: 'eyler-usuli',
    title: 'Eyler usuli (oddiy differensial tenglama)',
    metaTitle: 'Eyler usuli: Koshi masalasi formulasi, qadam va kalkulyator',
    description:
      'Eyler usulida birinchi tartibli oddiy differensial tenglamani (Koshi masalasi) sonli yechish. Siniq chiziqlar geometriyasi, takomillashgan Eyler, darsliklar va platforma standarti.',
    keywords: [
      'eyler usuli',
      'koshi masalasi',
      'differensial tenglamalar sonli yechish',
      'euler method',
      'takomillashgan eyler',
    ],
    area: 'Oddiy differensial tenglamalar',
    calculatorHref: '/methods/euler',
    summary:
      'Eyler usuli — oddiy differensial tenglamalar uchun Koshi masalasini yechishning eng sodda va fundamental sonli usuli. U har bir qadamda yechim egri chizig‘ini uning joriy qiyaligi bo‘yicha to‘g‘ri chiziq (urinma) bilan almashtiradi. Lokal xatosi O(h²), global xatosi esa O(h) tartibga ega.',
    formula: 'yᵢ₊₁ = yᵢ + h · f(xᵢ, yᵢ),  y(x₀) = y₀',
    formulaTex: 'y_{i+1} = y_i + h f(x_i, y_i), \\quad x_{i+1} = x_i + h, \\quad y(x_0) = y_0',
    convergenceCondition:
      'f(x, y) funksiyasi qaralayotgan sohada uzluksiz va y bo‘yicha Lipshits shartini qanoatlantirishi lozim: |f(x, y₁) − f(x, y₂)| ≤ L|y₁ − y₂|.',
    convergenceTex: '|f(x, y_1) - f(x, y_2)| \\le L |y_1 - y_2|, \\quad h \\to 0 \\implies y_n \\to y(x_n)',
    errorEstimateTex:
      '\\text{Lokal xatolik: } R_{i+1} = \\frac{h^2}{2} y\'\'(\\xi) = O(h^2), \\quad \\text{Global to‘liq xatolik: } |y(x_n) - y_n| \\le O(h)',
    theory: [
      'Koshi masalasi: y′ = f(x, y), y(x₀) = y₀ boshlang‘ich shartli differensial tenglama yechimini [x₀, X] oraliqda topish.',
      'Teylor yoyilmasidan hosil bo‘lishi: y(x_{i+1}) = y(x_i) + h y′(x_i) + (h²/2) y′′(ξ). Boshlang‘ich ikkita had bilan chegaralanib, y′(x_i) = f(x_i, y_i) qo‘yilsa, Eyler formulasi y_{i+1} = y_i + h f(x_i, y_i) kelib chiqadi.',
      'Geometrik ma’nosi: Siniq chiziqlar metodi — har bir qadamda yechim urinma bo‘yicha davom ettiriladi. Lekin qadam oshgani sari yechim haqiqiy integral egri chiziqlar oilasidan uzoqlashadi.',
      'Takomillashgan Eyler (Heun metodi): Qadam o‘rtasidagi yoki bashorat qilingan qiyalikni hisobga oluvchi prediktor-korrektor sxemasi: y_{i+1} = y_i + (h/2)[f(x_i, y_i) + f(x_{i+1}, y_i + h f(x_i, y_i))]. Global xatolik O(h²) gacha pasayadi.',
    ],
    steps: [
      'Differensial tenglamani y′ = f(x, y) ko‘rinishida va boshlang‘ich shartni (x₀, y₀) yozing.',
      'Integrallash oralig‘i [x₀, X] va qadam h ni belgilang (yoki n ta bo‘lakka bo‘ling: h = (X − x₀)/n).',
      'Joriy nuqtadagi hosila qiymatini hisoblang: f(xᵢ, yᵢ).',
      'Keyingi qiymatni toping: y_{i+1} = y_i + h · f(xᵢ, yᵢ) va x_{i+1} = x_i + h.',
      'x_{i+1} oraliq oxiri X ga yetguncha takrorlang va natijalar jadvalini tuzing.',
    ],
    example: {
      problem: 'y′ = x + y, y(0) = 1 Koshi masalasini h = 0.1 qadam bilan [0, 0.4] da yechish (aniq yechim: y = 2eˣ − x − 1).',
      calculation:
        '1-qadam (x₀=0, y₀=1): f(0, 1) = 0 + 1 = 1; y₁ = 1 + 0.1·1 = 1.1 (aniq: 1.1103, xato: 0.0103). 2-qadam (x₁=0.1, y₁=1.1): f(0.1, 1.1) = 1.2; y₂ = 1.1 + 0.1·1.2 = 1.22 (aniq: 1.2428, xato: 0.0228). 3-qadam: y₃ = 1.22 + 0.1(0.2+1.22) = 1.362. 4-qadam: y₄ = 1.362 + 0.1(0.3+1.362) = 1.5282.',
      result: 'x = 0.4 da Eyler yechimi y ≈ 1.5282; analitik aniq yechim y(0.4) ≈ 1.5836.',
    },
    whenToUse: [
      'Differensial tenglamalar sonli yechilishining qadam-baqadam mexanizmini o‘rganishda.',
      'Hisoblash resurslari juda cheklangan va yuqori aniqlik talab qilinmagan sodda modellashtirishlarda.',
      'Ko‘p qadamli metodlar (Adams) uchun boshlang‘ich nuqtalarni tayyorlashda.',
    ],
    limitations: [
      'Global xatolik birinchi tartibli O(h); yuqori aniqlik uchun juda kichik h talab etiladi.',
      'Qattiq (stiff) differensial tenglamalarda oddiy oshkor Eyler usuli beqaror bo‘lib, cheksiz tebranishga olib keladi.',
    ],
    questions: [
      {
        question: 'Eyler usulining aniqligini qanday yaxshilash mumkin?',
        answer:
          'Qadam h ni kichraytirish mumkin, ammo amallar soni va yaxlitlash xatosi ortadi. Yaxshiroq yo‘l — Takomillashgan Eyler yoki 4-tartibli Runge-Kutta usuliga o‘tishdir.',
      },
      {
        question: 'Lokal va global xatolik farqi nimada?',
        answer:
          'Lokal xatolik bitta qadamda yo‘l qo‘yilgan xato (O(h²)), global xatolik esa barcha qadamlar bo‘ylab to‘plangan umumiy xatodir (n · O(h²) = O(h)).',
      },
    ],
    sources: [
      {
        authors: 'S.S. Irisqulov, K.D. Ismanova, M. Olimov, A. Imomov',
        title: 'Sonli usullar va algoritmlar',
        publisher: '“Namangan” nashriyoti',
        year: 2013,
        chapterSection: '6-bob, 2-§ ("Koshi masalasini yechishning Eyler usuli")',
        pages: '127–130-betlar',
        note: 'Siniq chiziqlar geometrik talqini, Paskal dasturi va y′ = cos(x) test misoli.',
      },
      {
        authors: 'G.P. Ismatullayev, M.S. Koshergenova',
        title: 'Hisoblash usullari',
        publisher: 'Toshkent: «Tafakkur Bo‘stoni»',
        year: 2014,
        chapterSection: 'VII bob, 7.3.3-§ ("Eyler va Eyler-Koshi usullari")',
        pages: '167–168, 176–177-betlar',
        note: 'y′ = x + y misoli tahlili va jadval taqqoslashlari.',
      },
      {
        authors: 'Richard L. Burden, J. Douglas Faires',
        title: 'Numerical Analysis',
        publisher: 'Brooks/Cole',
        year: 2011,
        chapterSection: 'Chapter 5 ("Initial-Value Problems for ODEs: Euler\'s Method")',
        pages: '266–275-betlar',
        note: 'Lipshits sharti va xatolik chegarasi teoremalari.',
      },
    ],
    platformConventions: [
      {
        topic: 'O‘zgaruvchilar va tenglamani kiritish formati',
        textbookStandard:
          'Ayrim darsliklarda vaqt t va funksiya x(t) yoki u(t) deb belgilanadi (masalan, du/dt = f(t, u)).',
        platformImplementation:
          'Sonli-usullar platformasida klassik matematik standart qabul qilingan: erksiz o‘zgaruvchi y, erkli o‘zgaruvchi x: y′ = f(x, y). Masalan, x + y yoki -2*x*y yoki (y^2 - x)/(2*y).',
        whyChosen:
          'Bu standart talabalar uchun oliy matematika kursidagi odatiy yozuv bilan bir xil bo‘lib, chalkashliklarni bartaraf etadi.',
      },
      {
        topic: 'Klassik va Takomillashgan Eyler (Heun) rejimi',
        textbookStandard:
          'Ko‘p qo‘llanmalarda oddiy Eyler va Eyler-Koshi (yoki Heun) ikki alohida mavzuda bayon qilinadi.',
        platformImplementation:
          'Platformamizda bitta kalkulyator ichida rejimni tanlash imkoniyati mavjud: foydalanuvchi "Klassik Eyler" yoki "Takomillashgan Eyler (Heun)" rejimini yoqib, bir vaqtning o‘zida ikkala traektoriyani grafikda kuzatishi mumkin.',
        whyChosen:
          'Usulning modifikatsiyasi qanday qilib birinchi tartibli xatoni ikkinchi tartibga ko‘tarishini amalda solishtirish uchun.',
      },
    ],
  },
  {
    slug: 'runge-kutta-4-usuli',
    title: 'Runge–Kutta 4-tartibli usuli (RK4)',
    metaTitle: 'Runge–Kutta 4 usuli: RK4 formulasi, Runge qoidasi va kalkulyator',
    description:
      'Runge-Kutta 4-tartibli (RK4) usulida Koshi masalasini yuqori aniqlikda yechish. To‘rtta qiyalik, Runge qoidasi bo‘yicha xatolik bahosi, darsliklar va platforma standarti.',
    keywords: [
      'runge-kutta usuli',
      'rk4 usuli',
      '4-tartibli runge kutta',
      'koshi masalasi rk4',
      'runge qoidasi',
    ],
    area: 'Oddiy differensial tenglamalar',
    calculatorHref: '/methods/runge-kutta',
    summary:
      'Runge–Kutta 4-tartibli (RK4) usuli har bir qadamda to‘rtta qiyalikni (boshlang‘ich, ikkita o‘rta va oxirgi) hisoblab, ularni Simpson qoidasiga o‘xshash vaznli o‘rtacha bilan birlashtiradi. Global xatoligi O(h⁴) bo‘lib, ilmiy va muhandislik amaliyotida eng keng qo‘llaniladigan standart usuldir.',
    formula: 'k₁ = h f(xᵢ,yᵢ); k₂ = h f(xᵢ+h/2,yᵢ+k₁/2); k₃ = h f(xᵢ+h/2,yᵢ+k₂/2); k₄ = h f(xᵢ+h,yᵢ+k₃); yᵢ₊₁ = yᵢ + (k₁+2k₂+2k₃+k₄)/6',
    formulaTex:
      'y_{i+1} = y_i + \\frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4), \\quad k_1 = h f(x_i, y_i), \\; k_2 = h f\\left(x_i + \\frac{h}{2}, y_i + \\frac{k_1}{2}\\right), \\; k_3 = h f\\left(x_i + \\frac{h}{2}, y_i + \\frac{k_2}{2}\\right), \\; k_4 = h f(x_i + h, y_i + k_3)',
    convergenceCondition:
      'f(x, y) funksiyasi o‘zgaruvchilar bo‘yicha kamida 4-tartibli uzluksiz xususiy hosilalarga ega bo‘lishi zarur.',
    convergenceTex: 'f(x, y) \\in C^4(D), \\quad y_{i+1} - y(x_{i+1}) = O(h^5) \\implies \\text{Global xato: } O(h^4)',
    errorEstimateTex:
      '\\text{Runge qoidasi: } R_h \\approx \\frac{y_h - y_{2h}}{2^4 - 1} = \\frac{y_h - y_{2h}}{15}, \\quad y_{\\text{aniq}} \\approx y_h + \\frac{y_h - y_{2h}}{15}',
    theory: [
      'Ko‘p bosqichli bir qadamli g‘oya: Eyler usulidan farqli o‘laroq, RK4 usulida faqat x_i nuqtadagi qiyalik bilan cheklanmay, [x_i, x_{i+1}] oralig‘idagi o‘rta va yakuniy nuqtalarda ham funksiya qiyaliklari baholanadi.',
      'Teylor yoyilmasi mosligi: To‘rtta koeffitsiyent (k₁, k₂, k₃, k₄) parametrlari shunday tanlanganki, ularning chiziqli kombinatsiyasi yechimning Teylor qatoridagi h⁵ gacha bo‘lgan barcha hadlari bilan aynan ustma-ust tushadi.',
      'Simpson integratsiyasi bilan bog‘liqlik: Yangilanish formulasidagi (1/6)(k₁ + 2k₂ + 2k₃ + k₄) koeffitsiyentlari Simpson kvadratura formulasidagi 1/3 [y₀ + 4y_{1/2} + y₁] vaznlariga to‘liq analogdir.',
      'Runge qoidasi bo‘yicha xatolik: Amalda yuqori tartibli hosilalarni hisoblash nihoyatda qiyin bo‘lgani uchun, hisoblash h va 2h qadamlarda o‘tkaziladi va xatolik R ≈ (y_h − y_{2h}) / 15 formulasi bilan baholanadi.',
    ],
    steps: [
      'Boshlang‘ich (xᵢ, yᵢ) nuqtasi va h qadamni oling.',
      'Boshlang‘ich qiyalikni hisoblang: k₁ = h · f(xᵢ, yᵢ).',
      'Birinchi o‘rta qiyalikni hisoblang: k₂ = h · f(xᵢ + h/2, yᵢ + k₁/2).',
      'Ikkinchi o‘rta qiyalikni hisoblang: k₃ = h · f(xᵢ + h/2, yᵢ + k₂/2).',
      'Oxirgi qiyalikni hisoblang: k₄ = h · f(xᵢ + h, yᵢ + k₃).',
      'Vaznli o‘rtachani qo‘shing: y_{i+1} = y_i + (k₁ + 2k₂ + 2k₃ + k₄) / 6 va x_{i+1} = x_i + h.',
    ],
    example: {
      problem: 'y′ = x + y, y(0) = 1 Koshi masalasining 1-qadami; h = 0.1 (aniq qiymat: y(0.1) ≈ 1.110342).',
      calculation:
        'k₁ = 0.1 · f(0, 1) = 0.1 · (0 + 1) = 0.1. k₂ = 0.1 · f(0 + 0.05, 1 + 0.05) = 0.1 · (0.05 + 1.05) = 0.11. k₃ = 0.1 · f(0 + 0.05, 1 + 0.055) = 0.1 · (0.05 + 1.055) = 0.1105. k₄ = 0.1 · f(0 + 0.1, 1 + 0.1105) = 0.1 · (0.1 + 1.1105) = 0.12105. Δy = (0.1 + 2·0.11 + 2·0.1105 + 0.12105) / 6 = 0.66205 / 6 ≈ 0.110342.',
      result: 'y₁ = 1 + 0.110342 = 1.110342. Aniq qiymat bilan mutlaq mos keladi (xato < 10⁻⁷)!',
    },
    whenToUse: [
      'Birinchi tartibli Koshi masalasida yuqori aniqlik va hisoblash barqarorligi talab qilinganda.',
      'Tenglamalar sistemalarini va yuqori tartibli ODE larni Koshi shakliga keltirib yechishda.',
      'Ilmiy-amaliy modellashtirish va muhandislik hisoblarida standart asosiy vosita sifatida.',
    ],
    limitations: [
      'Har bir qadamda f(x, y) funksiyasi 4 marta hisoblanadi (Eylerdan 4 barobar ko‘proq hisoblash xarajati).',
      'Juda qattiq (stiff) tizimlarda qadam hajmini cheklab qo‘yishi mumkin (bunday hollarda oshkormas usullar kerak).',
    ],
    questions: [
      {
        question: 'RK4 dagi 4 raqami nimani bildiradi?',
        answer:
          'U usulning global xatolik tartibi to‘rtinchi daraja (O(h⁴)) ekanini bildiradi. Qadam 10 barobarga qisqarsa, xatolik 10 000 barobar kamayadi.',
      },
      {
        question: 'Runge qoidasi nima uchun 15 ga bo‘linadi?',
        answer:
          'Chunki p = 4 tartibli usulda qadam ikki barobar oshirilganda (2h) xatolik 2⁴ = 16 barobar ortadi. 2⁴ − 1 = 15 bo‘lganligi uchun maxrajda 15 soni hosil bo‘ladi.',
      },
    ],
    sources: [
      {
        authors: 'G.P. Ismatullayev, M.S. Koshergenova',
        title: 'Hisoblash usullari',
        publisher: 'Toshkent: «Tafakkur Bo‘stoni»',
        year: 2014,
        chapterSection: 'VII bob, 7.3.4-§ ("Runge-Kutta metodi") va 7.3.5-§ ("Runge qoidasi")',
        pages: '168–175, 178–179-betlar',
        note: 'k₁, k₂, k₃, k₄ parametrlarini chiqarishning to‘liq nazariy bayoni.',
      },
      {
        authors: 'S.S. Irisqulov, K.D. Ismanova, M. Olimov, A. Imomov',
        title: 'Sonli usullar va algoritmlar',
        publisher: '“Namangan” nashriyoti',
        year: 2013,
        chapterSection: '6-bob, 3-§ ("Koshi masalasini yechishning Runge-Kutta usuli")',
        pages: '131–134-betlar',
        note: 'Blok-sxema, Paskal dasturi va y′ = cos(x) bo‘yicha Eyler bilan taqqoslama jadval.',
      },
      {
        authors: 'M.I. Isroilov',
        title: 'Hisoblash metodlari (2-qism)',
        publisher: 'Toshkent: «Iqtisod-Moliya»',
        year: 2008,
        chapterSection: 'Bob 5 ("Koshi masalasini sonli yechish")',
        pages: '140–155-betlar',
        note: 'Ko‘p qadamli va bir qadamli metodlarning konvergensiya tahlili.',
      },
    ],
    platformConventions: [
      {
        topic: 'Qiyalik koeffitsiyentlariga h ni kiritish konvensiyasi',
        textbookStandard:
          'Ba’zi adabiyotlarda K_i = f(...) (h siz) yozilib, oxirgi yangilanishda h/6 ko‘paytiriladi. Boshqa kitoblarda (Ismatullayev, Irisqulov) k_i = h · f(...) deb h ichiga kiritiladi.',
        platformImplementation:
          'Sonli-usullar interaktiv platformasida k_i = h · f(...) standarti qabul qilingan. Yangilanish y_{i+1} = y_i + (k₁ + 2k₂ + 2k₃ + k₄)/6 ko‘rinishida amalga oshiriladi. Jadvalda har bir qadamdagi k₁, k₂, k₃, k₄ qiymatlari alohida ustunda ko‘rsatiladi.',
        whyChosen:
          'Dasturlashda va hisoblash mashinalarida k_i larni oraliq qadam siljishlari bilan bevosita yig‘ish ancha barqaror va xotirada tushunarli saqlanadi.',
      },
      {
        topic: 'Analitik yechim bilan avtomatik taqqoslash',
        textbookStandard:
          'Darsliklardagi test misollarda analitik aniq yechim qo‘lda hisoblanib, alohida jadval qilinadi.',
        platformImplementation:
          'Platformada "Aniq yechim funksiyasi (ixtiyoriy)" maydoniga analitik formula (masalan 2*exp(x) - x - 1) kiritilsa, tizim har bir qadamda mutlaq xatolikni (|y_taqribiy - y_aniq|) avtomatik hisoblab, taqqoslash grafigini chizadi.',
        whyChosen:
          'Talabalar va tadqiqotchilar o‘z topshiriqlarini darhol tekshirib, xatolik darajasi O(h⁴) ekanligiga amalda ishonch hosil qilishlari uchun.',
      },
    ],
  },
];

export function getLearningGuide(slug: string): LearningGuide | undefined {
  return learningGuides.find((guide) => guide.slug === slug);
}
