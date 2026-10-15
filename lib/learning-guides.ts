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
  steps: string[];
  example: {
    problem: string;
    calculation: string;
    result: string;
  };
  whenToUse: string[];
  limitations: string[];
  questions: { question: string; answer: string }[];
}

export const learningGuides: LearningGuide[] = [
  {
    slug: 'biseksiya-usuli',
    title: 'Biseksiya (teng ikkiga bo‘lish) usuli',
    metaTitle: 'Biseksiya usuli: formula, misol va online kalkulyator',
    description:
      'Biseksiya usulida tenglama ildizini topishni o‘rganing: oraliqni tanlash, ishora almashinuvi sharti, qadamlar va x² − 2 = 0 misoli.',
    keywords: ['biseksiya usuli misol', 'teng ikkiga bo‘lish usuli', 'tenglama ildizini topish'],
    area: 'Tenglama ildizlarini topish',
    calculatorHref: '/methods/bisection',
    summary:
      'Biseksiya usuli uzluksiz funksiyaning ildizini ildiz joylashgan oraliqni ketma-ket teng ikkiga bo‘lish orqali topadi. Agar oraliq uchlarida funksiya ishorasi qarama-qarshi bo‘lsa, oraliqda kamida bitta ildiz mavjud bo‘ladi.',
    formula: 'c = (a + b) / 2;  f(a) · f(c) < 0 bo‘lsa yangi oraliq [a, c], aks holda [c, b]',
    steps: [
      'Uzluksiz f(x) funksiya uchun [a, b] oraliq tanlang va f(a) · f(b) < 0 ekanini tekshiring.',
      'Oraliq o‘rtasini c = (a + b) / 2 formula bilan hisoblang.',
      'Ildiz saqlanadigan yarim oraliqni ishora almashinuvi bo‘yicha tanlang.',
      'Oraliq uzunligi yoki |f(c)| kerakli aniqlikka yetguncha takrorlang.',
    ],
    example: {
      problem: 'f(x) = x² − 2 funksiyasining [1, 2] oraliqdagi ildizi.',
      calculation: 'c = (1 + 2) / 2 = 1.5;  f(1) = −1, f(1.5) = 0.25.',
      result: 'Ishoralar [1, 1.5] da almashadi; keyingi qadamda ildiz shu oraliqda izlanadi.',
    },
    whenToUse: [
      'Funksiya uzluksiz bo‘lib, ildizni o‘rab turgan ishorasi almashinuvchi oraliq ma’lum bo‘lsa.',
      'Ishonchli va sodda algoritm kerak bo‘lib, hosilani hisoblash imkoni bo‘lmasa.',
    ],
    limitations: [
      'Boshlang‘ich oraliq ildizni o‘rab turishi kerak; bir oraliqda bir nechta ildiz bo‘lishi ham mumkin.',
      'Yaqinlashish ishonchli, lekin Nyuton usuliga qaraganda sekinroq.',
    ],
    questions: [
      {
        question: 'Biseksiya usuli qachon ishlaydi?',
        answer:
          'Funksiya [a, b] da uzluksiz va f(a) bilan f(b) ishoralari qarama-qarshi bo‘lganda oraliqda kamida bitta ildiz bor.',
      },
      {
        question: 'Biseksiya usulining aniqligini qanday oshirish mumkin?',
        answer:
          'Har iteratsiyada oraliq ikki baravar qisqaradi. Iteratsiyalar sonini ko‘paytirish yoki to‘xtash aniqligini kichraytirish mumkin.',
      },
    ],
  },
  {
    slug: 'nyuton-usuli',
    title: 'Nyuton (urinmalar) usuli',
    metaTitle: 'Nyuton usuli: formula, ildiz topish misoli va kalkulyator',
    description:
      'Nyuton-Rafson usuli bilan tenglama ildizini toping. Urinma formulasi, boshlang‘ich yaqinlashuv va x² − 2 = 0 misoli o‘zbek tilida.',
    keywords: ['Nyuton usuli misol', 'urinmalar usuli', 'Nyuton-Rafson online'],
    area: 'Tenglama ildizlarini topish',
    calculatorHref: '/methods/newton',
    summary:
      'Nyuton usuli egri chiziqqa joriy nuqtada urinma o‘tkazib, uning x-o‘qi bilan kesishgan nuqtani keyingi yaqinlashuv deb oladi. Hosila mavjud va boshlang‘ich taxmin ildizga yetarlicha yaqin bo‘lsa, usul odatda tez yaqinlashadi.',
    formula: 'xₙ₊₁ = xₙ − f(xₙ) / f′(xₙ)',
    steps: [
      'f(x) va uning hosilasi f′(x) ni aniqlang.',
      'Ildizga yaqin boshlang‘ich x₀ taxminini tanlang.',
      'Formulaga xₙ ni qo‘yib, xₙ₊₁ ni hisoblang.',
      '|xₙ₊₁ − xₙ| yoki |f(xₙ₊₁)| talab qilingan aniqlikka yetguncha davom eting.',
    ],
    example: {
      problem: 'f(x) = x² − 2, f′(x) = 2x; x₀ = 1.5.',
      calculation: 'x₁ = 1.5 − (1.5² − 2) / (2 · 1.5) = 1.4166667.',
      result: 'Bir qadamdayoq √2 ≈ 1.4142136 qiymatiga yaqinlashadi.',
    },
    whenToUse: [
      'Hosilani hisoblash mumkin va ildiz uchun yaxshi boshlang‘ich taxmin mavjud bo‘lsa.',
      'Kam iteratsiyada yuqori aniqlik talab qilinganda.',
    ],
    limitations: [
      'f′(xₙ) nolga yaqin bo‘lsa, qadam juda katta yoki beqaror chiqishi mumkin.',
      'Yomon tanlangan boshlang‘ich taxmin usulni ildizdan uzoqlashtirishi yoki yaqinlashishni to‘xtatishi mumkin.',
    ],
    questions: [
      {
        question: 'Nyuton usulida hosila nima uchun kerak?',
        answer:
          'Hosila urinmaning qiyaligini beradi. Urinmaning x-o‘qi bilan kesishgan nuqtasi keyingi ildiz taxmini bo‘ladi.',
      },
      {
        question: 'Nyuton usuli har doim yaqinlashadimi?',
        answer:
          'Yo‘q. Yaqinlashish boshlang‘ich nuqta, funksiya shakli va hosilaning qiymatiga bog‘liq.',
      },
    ],
  },
  {
    slug: 'haydash-usuli',
    title: 'Haydash (progonka, Thomas) usuli',
    metaTitle: 'Haydash usuli: uch diagonalli sistemani yechish',
    description:
      'Haydash yoki Thomas usuli bilan uch diagonalli chiziqli tenglamalar sistemasini yechishni o‘rganing: formulalar, bosqichlar va qo‘llanish sohasi.',
    keywords: ['haydash usuli', 'progonka usuli', 'Thomas algoritmi', 'uch diagonalli sistema'],
    area: 'Chiziqli tenglamalar sistemalari',
    calculatorHref: '/methods/sweep',
    summary:
      'Haydash usuli uch diagonalli matritsaga ega chiziqli tenglamalar sistemasini oldinga va orqaga yurish bilan yechadi. Matritsa tuzilmasidan foydalanishi sababli dense matritsa usullariga qaraganda kam xotira va O(n) amallar talab qiladi.',
    formula: 'aᵢxᵢ₋₁ + bᵢxᵢ + cᵢxᵢ₊₁ = dᵢ;  xᵢ = αᵢ₊₁xᵢ₊₁ + βᵢ₊₁',
    steps: [
      'Koeffitsiyentlar faqat asosiy va unga qo‘shni ikki diagonaldan iborat ekanini tekshiring.',
      'Birinchi tenglamadan α va β koeffitsiyentlarining boshlang‘ich qiymatlarini toping.',
      'Oldinga yurishda har bir keyingi tenglama uchun α va β ni hisoblang.',
      'Oxirgi noma’lumni topib, orqaga yurish orqali qolgan xᵢ qiymatlarini aniqlang.',
    ],
    example: {
      problem: 'Har bir satrda faqat xᵢ₋₁, xᵢ va xᵢ₊₁ qatnashgan sistema berilgan.',
      calculation: 'Oldinga yurish sistemani xᵢ = αᵢ₊₁xᵢ₊₁ + βᵢ₊₁ ko‘rinishiga keltiradi.',
      result: 'Oxirgi noma’lumdan boshlab orqaga yurib, barcha noma’lumlar topiladi.',
    },
    whenToUse: [
      'Matritsa uch diagonalli bo‘lsa, masalan, ayrim chegaraviy masalalarni diskretlashtirganda.',
      'Katta o‘lchamli, ammo siyrak va aniq shu tuzilishga ega sistemani tez yechish kerak bo‘lsa.',
    ],
    limitations: [
      'Umumiy zich matritsalar uchun mo‘ljallanmagan.',
      'Oraliq maxrajlar nolga yaqin bo‘lmasligi uchun sistema va pivotlash shartlarini tekshirish zarur.',
    ],
    questions: [
      {
        question: 'Haydash usuli va Thomas algoritmi bir xilmi?',
        answer:
          'Ha. Thomas algoritmi uch diagonalli sistemani oldinga-orqaga yurish orqali yechadigan haydash usulining keng tarqalgan nomidir.',
      },
      {
        question: 'Haydash usulining hisoblash murakkabligi qanday?',
        answer:
          'Uch diagonalli sistema uchun vaqt va xotira sarfi noma’lumlar soniga chiziqli, ya’ni O(n).',
      },
    ],
  },
  {
    slug: 'lagranj-interpolyatsiyasi',
    title: 'Lagranj interpolyatsiyasi',
    metaTitle: 'Lagranj interpolyatsiyasi: formula va ishlangan misol',
    description:
      'Lagranj ko‘phadi orqali berilgan nuqtalardan o‘tuvchi funksiyani tuzing. Formula, interpolatsion bazislar, misol va interaktiv kalkulyator.',
    keywords: ['Lagranj interpolyatsiyasi misol', 'interpolyatsion ko‘phad', 'Lagrange polynomial'],
    area: 'Interpolyatsiya',
    calculatorHref: '/methods/lagrange',
    summary:
      'Lagranj interpolyatsiyasi berilgan turli xᵢ nuqtalaridagi yᵢ qiymatlardan yagona ko‘phad tuzadi. Ko‘phad barcha kirish nuqtalaridan aniq o‘tadi va oraliqdagi noma’lum qiymatni baholashga yordam beradi.',
    formula: 'P(x) = Σᵢ yᵢ Lᵢ(x),  Lᵢ(x) = Πⱼ≠ᵢ (x − xⱼ) / (xᵢ − xⱼ)',
    steps: [
      'Koordinatalar jadvalidagi xᵢ qiymatlari takrorlanmasligini tekshiring.',
      'Har bir nuqta uchun qolgan nuqtalarda nol, o‘z nuqtasida bir bo‘ladigan Lᵢ(x) bazis ko‘phadini tuzing.',
      'Bazis ko‘phadlarni mos yᵢ qiymatlarga ko‘paytirib, yig‘ing.',
      'Hosil bo‘lgan P(x) ni kerakli x qiymatida hisoblang.',
    ],
    example: {
      problem: '(0, 1), (1, 3), (2, 2) nuqtalardan o‘tuvchi ko‘phadni x = 1.5 da hisoblash.',
      calculation: 'L₀(1.5) = −0.125, L₁(1.5) = 0.75, L₂(1.5) = 0.375.',
      result: 'P(1.5) = 1·(−0.125) + 3·0.75 + 2·0.375 = 2.875.',
    },
    whenToUse: [
      'Cheklangan sondagi tajriba yoki jadval nuqtalaridan silliq qiymat baholash kerak bo‘lsa.',
      'Nuqtalar soni kichik va ko‘phadni tushunarli ko‘rinishda qurish muhim bo‘lsa.',
    ],
    limitations: [
      'Ko‘p nuqtada yuqori darajali ko‘phad chekka tebranishlarga moyil bo‘lishi mumkin.',
      'Yangi nuqta qo‘shilganda ko‘phadni qayta hisoblash talab qilinadi; katta ma’lumotlar uchun bo‘lakli interpolatsiya ma’qul bo‘lishi mumkin.',
    ],
    questions: [
      {
        question: 'Interpolatsiya va ekstrapolyatsiya farqi nimada?',
        answer:
          'Interpolatsiya berilgan nuqtalar oralig‘idagi qiymatni baholaydi. Ekstrapolyatsiya esa shu oraliqdan tashqariga taxmin qiladi va odatda ishonchliligi pastroq.',
      },
      {
        question: 'Lagranj usulida x qiymatlari takrorlanishi mumkinmi?',
        answer:
          'Yo‘q. Bazis ko‘phad maxrajlarida xᵢ − xⱼ borligi sababli barcha tugun x qiymatlari turlicha bo‘lishi kerak.',
      },
    ],
  },
  {
    slug: 'togri-tortburchaklar-usuli',
    title: 'To‘g‘ri to‘rtburchaklar usuli',
    metaTitle: 'To‘g‘ri to‘rtburchaklar usuli: integral va misol',
    description:
      'Aniq integralni chap, o‘ng yoki o‘rta to‘g‘ri to‘rtburchaklar bilan taqribiy hisoblang. Qadam formulasi, x² misoli va kalkulyator.',
    keywords: ['to‘g‘ri to‘rtburchaklar usuli', 'integralni sonli hisoblash', 'o‘rta nuqtalar usuli'],
    area: 'Sonli integrallash',
    calculatorHref: '/methods/rectangles',
    summary:
      'To‘g‘ri to‘rtburchaklar usuli integral ostidagi egri chiziq osti yuzasini bir nechta to‘g‘ri to‘rtburchak yuzalari yig‘indisi bilan yaqinlashtiradi. Balandlik chap uch, o‘ng uch yoki oraliq o‘rtasidagi funksiya qiymatidan olinadi.',
    formula: '∫ₐᵇ f(x) dx ≈ h · Σᵢ f(ξᵢ),  h = (b − a) / n',
    steps: [
      'Integrallash chegaralari a va b hamda bo‘linishlar soni n ni tanlang.',
      'Qadam uzunligini h = (b − a) / n orqali hisoblang.',
      'Har bir bo‘lakda chap, o‘ng yoki o‘rta nuqta balandligini tanlang.',
      'Tanlangan nuqtalardagi f qiymatlarini qo‘shib, h ga ko‘paytiring.',
    ],
    example: {
      problem: '∫₀¹ x² dx integralini n = 4 bilan o‘rta nuqtalar usulida baholash.',
      calculation: 'h = 0.25; o‘rta nuqtalar 0.125, 0.375, 0.625, 0.875.',
      result: 'I ≈ 0.25 · Σ f(ξᵢ) = 0.328125; aniq qiymat 1/3 ≈ 0.333333.',
    },
    whenToUse: [
      'Integralni tez va sodda baholash yoki chap, o‘ng va o‘rta nuqtalar natijasini taqqoslash kerak bo‘lsa.',
      'Funksiya qiymatlarini bo‘laklar bo‘yicha jadvaldan olish qulay bo‘lsa.',
    ],
    limitations: [
      'Aniqlik bo‘laklar soni va tanlangan nuqtalarga bog‘liq; chap/o‘ng usullarda xato odatda kattaroq bo‘ladi.',
      'Keskin o‘zgaruvchi funksiya uchun ko‘proq bo‘linish yoki yuqori tartibli kvadratura kerak bo‘lishi mumkin.',
    ],
    questions: [
      {
        question: 'Qaysi to‘g‘ri to‘rtburchaklar usuli aniqroq?',
        answer:
          'Silliq funksiya uchun o‘rta nuqtalar usuli odatda chap va o‘ng variantlardan aniqroq bo‘ladi, ammo natija funksiya va bo‘linishga bog‘liq.',
      },
      {
        question: 'n ortsa natija doim aniq bo‘ladimi?',
        answer:
          'Bo‘linishni ko‘paytirish odatda yaqinlashishni yaxshilaydi, lekin yaxlitlash va funksiya xususiyatlarini ham hisobga olish kerak.',
      },
    ],
  },
  {
    slug: 'trapetsiyalar-usuli',
    title: 'Trapetsiyalar usuli',
    metaTitle: 'Trapetsiyalar usuli: integral formulasi va misol',
    description:
      'Trapetsiyalar usuli bilan aniq integralni taqribiy hisoblashni o‘rganing. Formula, bo‘linish qadami, x² misoli va online hisoblagich.',
    keywords: ['trapetsiyalar usuli misol', 'trapetsiya formulasi integral', 'sonli integrallash'],
    area: 'Sonli integrallash',
    calculatorHref: '/methods/trapezoid',
    summary:
      'Trapetsiyalar usuli qo‘shni tugunlardagi funksiya qiymatlarini to‘g‘ri chiziq bilan tutashtirib, hosil bo‘lgan trapetsiyalar yuzalarini qo‘shadi. Silliq funksiya uchun kompozit formula xatoni qadam kichraygani sari kamaytiradi.',
    formula: 'I ≈ h/2 · [f(x₀) + 2Σᵢ₌₁ⁿ⁻¹ f(xᵢ) + f(xₙ)],  h = (b − a) / n',
    steps: [
      'Integrallash oralig‘ini [a, b] va bo‘linishlar sonini n ni belgilang.',
      'Tugunlarni xᵢ = a + ih, h = (b − a) / n formula bilan tuzing.',
      'Chekka tugunlarni bir marta, ichki tugunlarni ikki marta yig‘indiga kiriting.',
      'Yig‘indini h/2 ga ko‘paytirib integral bahosini oling.',
    ],
    example: {
      problem: '∫₀¹ x² dx integralini n = 2 bilan trapetsiyalar usulida hisoblash.',
      calculation: 'h = 0.5; f(0) = 0, f(0.5) = 0.25, f(1) = 1.',
      result: 'I ≈ 0.5/2 · [0 + 2·0.25 + 1] = 0.375; aniq qiymat 1/3.',
    },
    whenToUse: [
      'Funksiya qiymatlari tugunlarda mavjud bo‘lib, integral uchun oddiy va barqaror baho kerak bo‘lsa.',
      'Tajriba ma’lumotlaridan yuzani taxminiy hisoblash kerak bo‘lsa.',
    ],
    limitations: [
      'Egri chiziq bo‘lak ichida to‘g‘ri chiziq bilan almashtiriladi; egrilik katta bo‘lsa xato ortadi.',
      'Silliq funksiya uchun xatoning tartibi O(h²); Simpson usuli yanada yuqori tartib bera oladi.',
    ],
    questions: [
      {
        question: 'Trapetsiyalar usulida n juft bo‘lishi kerakmi?',
        answer: 'Yo‘q. Trapetsiyalar usuli uchun n musbat butun bo‘lishi kifoya.',
      },
      {
        question: 'Trapetsiyalar usulining xatosi qachon kamayadi?',
        answer:
          'Funksiya yetarlicha silliq bo‘lsa, qadam h ni kichraytirish orqali xato odatda kamayadi.',
      },
    ],
  },
  {
    slug: 'simpson-usuli',
    title: 'Simpson 1/3 usuli',
    metaTitle: 'Simpson usuli: integral formulasi, shartlar va misol',
    description:
      'Simpson 1/3 usulida integralni parabolalar bilan hisoblang. Juft bo‘linish sharti, formula va ∫₀¹ x² dx ishlangan misoli.',
    keywords: ['Simpson usuli misol', 'Simpson 1/3 formulasi', 'integralni online hisoblash'],
    area: 'Sonli integrallash',
    calculatorHref: '/methods/simpson',
    summary:
      'Simpson 1/3 usuli har ikki qo‘shni bo‘lakdagi funksiyani parabola bilan yaqinlashtiradi. Yetarlicha silliq funksiya va teng qadamlar sharoitida u trapetsiyalar usuliga qaraganda yuqori aniqlik beradi.',
    formula: 'I ≈ h/3 · [f(x₀) + 4Σ f(x_toq) + 2Σ f(x_juft) + f(xₙ)]',
    steps: [
      'Bo‘linishlar soni n ni musbat juft son qilib tanlang.',
      'h = (b − a) / n qadam bilan x₀ dan xₙ gacha tugunlarni toping.',
      'Funksiya qiymatlarini hisoblab, ichki toq indekslarga 4, juft indekslarga 2 koeffitsiyent bering.',
      'Yig‘indini h/3 ga ko‘paytiring.',
    ],
    example: {
      problem: '∫₀¹ x² dx integralini Simpson 1/3 usulida n = 2 bilan hisoblash.',
      calculation: 'h = 0.5; f(0) = 0, f(0.5) = 0.25, f(1) = 1.',
      result: 'I ≈ 0.5/3 · [0 + 4·0.25 + 1] = 1/3; kvadratik funksiya uchun bu aniq natija.',
    },
    whenToUse: [
      'Funksiya silliq va intervalni teng qadamlarga bo‘lish mumkin bo‘lsa.',
      'Trapetsiyalar usulidan ko‘ra aniqroq integral bahosi kerak bo‘lsa.',
    ],
    limitations: [
      'Bo‘linishlar soni juft bo‘lishi shart.',
      'Funksiya keskin sakrasa yoki singulyarlikka ega bo‘lsa, oddiy Simpson bahosi ishonchsiz bo‘lishi mumkin.',
    ],
    questions: [
      {
        question: 'Simpson usulida n nega juft bo‘lishi kerak?',
        answer:
          'Har bir parabola uchta ketma-ket tugun, ya’ni ikkita bo‘lakdan foydalanadi. Shuning uchun barcha bo‘laklarni juft-juft guruhlash kerak.',
      },
      {
        question: 'Simpson usuli qaysi funksiyalar uchun aniq?',
        answer:
          'Bir intervaldagi Simpson 1/3 formulasi darajasi 3 gacha bo‘lgan ko‘phadlarni aniq integrallaydi; yuqori darajali silliq funksiyalarda taqribiy natija beradi.',
      },
    ],
  },
  {
    slug: 'eyler-usuli',
    title: 'Eyler usuli (oddiy differensial tenglama)',
    metaTitle: 'Eyler usuli: ODE yechish formulasi va misol',
    description:
      'Boshlang‘ich shartli y′ = f(x,y) differensial tenglamani Eyler usulida qadam-baqadam yeching. Formula, xato va oddiy misol.',
    keywords: ['Eyler usuli misol', 'differensial tenglama yechish', 'ODE online kalkulyator'],
    area: 'Oddiy differensial tenglamalar',
    calculatorHref: '/methods/euler',
    summary:
      'Eyler usuli boshlang‘ich qiymat masalasida yechim egri chizig‘ini har bir qadamda uning joriy qiyaligi bo‘yicha to‘g‘ri chiziq bilan yaqinlashtiradi. Sodda bo‘lishiga qaramay, qadam kattaligi xatoga sezilarli ta’sir qiladi.',
    formula: 'yᵢ₊₁ = yᵢ + h · f(xᵢ, yᵢ),  y(x₀) = y₀',
    steps: [
      'Tenglamani y′ = f(x, y) ko‘rinishida va boshlang‘ich (x₀, y₀) ni yozing.',
      'Qadam h ni tanlab, xᵢ₊₁ = xᵢ + h ni hisoblang.',
      'Joriy nuqtadagi qiyalik f(xᵢ, yᵢ) ni toping.',
      'yᵢ₊₁ = yᵢ + h f(xᵢ, yᵢ) bilan yangi qiymatni topib takrorlang.',
    ],
    example: {
      problem: 'y′ = y, y(0) = 1 masalasining birinchi qadami; h = 0.1.',
      calculation: 'f(0, 1) = 1; y₁ = 1 + 0.1 · 1 = 1.1.',
      result: 'Eyler bahosi y(0.1) ≈ 1.1; aniq qiymat e⁰·¹ ≈ 1.10517.',
    },
    whenToUse: [
      'Differensial tenglama yechimini qanday qadamlar qurishini o‘rganishda.',
      'Hisoblashni soddalashtirish va yuqoriroq tartibli usullar bilan taqqoslashda.',
    ],
    limitations: [
      'Global xatoning tartibi odatda O(h); aniqlikni oshirish uchun h ni kichraytirish kerak.',
      'Juda qattiq o‘zgaruvchi sistemalarda oddiy Eyler usuli katta xato yoki beqarorlik berishi mumkin.',
    ],
    questions: [
      {
        question: 'Eyler usulida h nimani bildiradi?',
        answer:
          'h — mustaqil o‘zgaruvchi x bo‘yicha ikki ketma-ket hisoblash nuqtasi orasidagi qadam uzunligi.',
      },
      {
        question: 'Eyler usuli aniqligini qanday yaxshilash mumkin?',
        answer:
          'Qadamni kichraytirish mumkin, ammo hisoblashlar soni oshadi. Amaliy masalalarda Heun yoki Runge–Kutta kabi yuqori tartibli usullar ham tanlanadi.',
      },
    ],
  },
  {
    slug: 'runge-kutta-4-usuli',
    title: 'Runge–Kutta 4-tartibli usuli (RK4)',
    metaTitle: 'Runge–Kutta 4 (RK4): formula, misol va ODE kalkulyator',
    description:
      'RK4 usulida boshlang‘ich qiymatli differensial tenglamani yeching. To‘rtta qiyalik, yangilash formulasi va y′ = y misoli.',
    keywords: ['Runge-Kutta usuli misol', 'RK4 formulasi', '4-tartibli Runge Kutta'],
    area: 'Oddiy differensial tenglamalar',
    calculatorHref: '/methods/runge-kutta',
    summary:
      'To‘rtinchi tartibli Runge–Kutta usuli bir qadamda boshlang‘ich, ikki o‘rta va oxirgi nuqtadagi qiyaliklarni birlashtiradi. U ko‘p oddiy differensial tenglamalarda aniqlik va hisoblash xarajati o‘rtasida yaxshi muvozanat beradi.',
    formula: 'k₁ = h f(xᵢ,yᵢ); k₂ = h f(xᵢ+h/2,yᵢ+k₁/2); k₃ = h f(xᵢ+h/2,yᵢ+k₂/2); k₄ = h f(xᵢ+h,yᵢ+k₃); yᵢ₊₁ = yᵢ + (k₁+2k₂+2k₃+k₄)/6',
    steps: [
      'Boshlang‘ich (xᵢ, yᵢ) nuqtasi va h qadamni belgilang.',
      'Qadam boshidagi qiyalik k₁ ni hisoblang.',
      'Ikki yarim qadamdagi qiyaliklar k₂ va k₃ ni hisoblang.',
      'Qadam oxiridagi k₄ ni topib, to‘rtta bahoni vaznli o‘rtacha bilan birlashtiring.',
    ],
    example: {
      problem: 'y′ = y, y(0) = 1 tenglamasi uchun h = 0.1.',
      calculation: 'k₁ = 0.1; k₂ = 0.105; k₃ = 0.10525; k₄ = 0.110525.',
      result: 'y₁ = 1 + (k₁ + 2k₂ + 2k₃ + k₄)/6 ≈ 1.1051708; aniq qiymat e⁰·¹ ≈ 1.1051702.',
    },
    whenToUse: [
      'Birinci tartibli boshlang‘ich qiymatli ODE uchun Eylerdan aniqroq standart usul kerak bo‘lsa.',
      'Har bir qadamda to‘rtta funksiya bahosi maqbul hisoblash xarajati bo‘lsa.',
    ],
    limitations: [
      'Oddiy RK4 xato bahosini o‘zi avtomatik bermaydi; qadamni tanlash foydalanuvchiga qoladi.',
      'Qatti stiff yoki uzilishli masalalarda maxsus usul va adaptiv qadam kerak bo‘lishi mumkin.',
    ],
    questions: [
      {
        question: 'RK4 dagi 4 raqami nimani anglatadi?',
        answer:
          'Silliq yechim uchun usulning global xato tartibi to‘rtinchi daraja, ya’ni O(h⁴) ekanini bildiradi.',
      },
      {
        question: 'RK4 Eylerdan nimasi bilan farq qiladi?',
        answer:
          'Eyler bir qiyalikdan foydalanadi; RK4 esa bir qadam ichidagi to‘rtta qiyalikni vaznli birlashtirib, odatda aniqroq natija beradi.',
      },
    ],
  },
];

export function getLearningGuide(slug: string): LearningGuide | undefined {
  return learningGuides.find((guide) => guide.slug === slug);
}
