export interface Scene {
  id: number;
  title: string;
  time: string;
  duration: string;
  concept: string;
  searchTerms: string[];
  editNotes: string;
  typography: { time: string; text: string }[];
  sound: string;
  colorGrade: string;
  transition: string;
  sources: string[];
}

export const scenes: Scene[] = [
  {
    id: 1,
    title: "مسیر سنگلاخی و طلوع",
    time: "00:00–00:07",
    duration: "7s",
    concept: "مسیر سنگلاخی در کوهستان، طلوع خورشید و آغاز دشوار سفر.",
    searchTerms: [
      "cinematic sunrise rocky mountain path wide shot slow motion",
      "drone shot mountain trail sunrise"
    ],
    editNotes: "7 ثانیه از یک شات واید با حرکت آرام رو به جلو. Fade In یک‌ثانیه‌ای از سیاهی. سرعت تا 80% در صورت نیاز.",
    typography: [
      { time: "00:02", text: "اوج پیروزی" },
      { time: "00:04", text: "از مسیر سختی‌ها می‌گذرد" }
    ],
    sound: "آغاز بسیار آرام، بدون ضرب شدید",
    colorGrade: "خاکی/تیره — سایه‌ها خاکی، هایلایت‌ها گرم",
    transition: "Fade In از سیاهی — خروج Dissolve 0.4s",
    sources: ["Pexels — مسیر پیچان کوهستانی 4K", "Pexels — طلوع بر فراز کوه‌ها 1080p"]
  },
  {
    id: 2,
    title: "انسان در حال صعود",
    time: "00:07–00:14",
    duration: "7s",
    concept: "انسان از پشت در مسیر سنگلاخی بالا می‌رود.",
    searchTerms: [
      "hiker climbing mountain from behind cinematic slow motion",
      "person walking up rocky trail sunrise"
    ],
    editNotes: "7 ثانیه — فرد از پشت دیده شود. جهت حرکت هماهنگ با Scene 01.",
    typography: [
      { time: "00:08", text: "رشد" },
      { time: "00:10", text: "نیازمند پذیرش سختی است" }
    ],
    sound: "باد بسیار ظریف زیر نریشن",
    colorGrade: "تُن گرم و طبیعی، کنتراست متوسط",
    transition: "Cross Dissolve یا Match Cut 0.3–0.4s",
    sources: ["Pexels — کوهنورد با کوله 4K"]
  },
  {
    id: 3,
    title: "پرنده روی صخره و پرواز",
    time: "00:14–00:21",
    duration: "7s",
    concept: "پرنده روی صخره مکث می‌کند، بال می‌گشاید و پرواز را آغاز می‌کند.",
    searchTerms: [
      "majestic bird taking off from cliff slow motion cinematic",
      "eagle flying mountain sunrise"
    ],
    editNotes: "2 ثانیه مکث + 5 ثانیه باز شدن بال‌ها و اوج گرفتن. برش روی باز شدن بال.",
    typography: [
      { time: "00:15", text: "جرأت پرواز" },
      { time: "00:18", text: "از آسودگی عبور می‌کند" }
    ],
    sound: "Whoosh بسیار نرم هنگام باز شدن بال",
    colorGrade: "تُن سرد ابرها",
    transition: "برش روی حرکت — Whoosh نرم",
    sources: ["Pexels — پرنده از سرو بلند 1080p"]
  },
  {
    id: 4,
    title: "پرواز در میان ابرها و باد",
    time: "00:21–00:27",
    duration: "6s",
    concept: "پرواز پرنده در آسمان و میان ابرها؛ باد شدید اما پرنده ارتفاع می‌گیرد.",
    searchTerms: [
      "bird flying through clouds cinematic slow motion",
      "eagle soaring above mountains dramatic sky"
    ],
    editNotes: "6 ثانیه — جهت پرواز ادامه Scene 03. Speed Ramp ملایم در صورت نیاز.",
    typography: [
      { time: "00:22", text: "در آشفتگی" },
      { time: "00:25", text: "بال می‌گیریم" }
    ],
    sound: "باد کمی قوی‌تر، اما ظریف",
    colorGrade: "آبی روشن — هماهنگ با Scene 03",
    transition: "Action Cut یا Dissolve کوتاه",
    sources: ["Pexels — عقاب میان ابرها 1080p"]
  },
  {
    id: 5,
    title: "رسیدن به قله و نور طلایی",
    time: "00:27–00:34",
    duration: "7s",
    concept: "انسان به قله می‌رسد و منظره‌ای وسیع در نور طلایی نمایان می‌شود.",
    searchTerms: [
      "hiker reaching mountain summit sunrise clouds parting cinematic"
    ],
    editNotes: "7 ثانیه — شات واید. Tilt Up یا Pull Back آرام. 50fps → تنظیم سرعت.",
    typography: [
      { time: "00:28", text: "اگر اوج می‌خواهی" },
      { time: "00:31", text: "از سختی عبور کن" }
    ],
    sound: "باد آرام",
    colorGrade: "طلایی‌تر — روشن‌تر از صحنه پرواز",
    transition: "Dissolve نرم از آسمان",
    sources: ["Pexels — سیلوئت بر فراز قله 1080p 50fps"]
  },
  {
    id: 6,
    title: "درخت پاییزی و ریزش برگ",
    time: "00:34–00:42",
    duration: "8s",
    concept: "درختی در پاییز؛ برگ‌های زرد و نارنجی در باد آرام می‌ریزند.",
    searchTerms: [
      "solitary tree autumn leaves falling slow motion cinematic",
      "golden hour autumn tree wind"
    ],
    editNotes: "8 ثانیه — درخت در مرکز/یک‌سوم. حرکت آرام یا اسلوموشن. کادر با Scene 07 تطبیق.",
    typography: [
      { time: "00:36", text: "هر فصل" },
      { time: "00:39", text: "درسی دارد" }
    ],
    sound: "صدای برگ‌های پاییزی — 15–20%",
    colorGrade: "زرد/نارنجی ملایم — بافت تنه طبیعی",
    transition: "Dissolve 0.4–0.5s از قله",
    sources: ["Pexels — برگ‌های طلایی در ریزش 1080p"]
  },
  {
    id: 7,
    title: "درخت زمستانی و برف",
    time: "00:42–00:49",
    duration: "7s",
    concept: "درختی در زمستان؛ شاخه‌های خالی، برف و ایستادگی در برابر سرما.",
    searchTerms: [
      "solitary tree winter snow falling cinematic slow motion",
      "bare tree in snow storm"
    ],
    editNotes: "7 ثانیه — Match Cut از Scene 06. Crop/Position برای تطبیق کادر.",
    typography: [
      { time: "00:44", text: "تحمل کن" },
      { time: "00:47", text: "مقاومت کن" }
    ],
    sound: "باد و برف بسیار کم",
    colorGrade: "آبی/خاکستری سرد — سفیدی برف حفظ شود",
    transition: "Match Cut با تطابق جایگاه درخت",
    sources: ["Pexels — شاخه‌های برفی 4K", "Pixabay — منظره زمستانی 1080p"]
  },
  {
    id: 8,
    title: "حرکت از تاریکی به سوی نور",
    time: "00:49–00:55",
    duration: "6s",
    concept: "شخصی در محیط تاریک به سوی منبع نور گرم حرکت می‌کند.",
    searchTerms: [
      "person walking towards light in dark stormy forest cinematic",
      "silhouette walking to light beam"
    ],
    editNotes: "6 ثانیه — سیلوئت از پشت/نیم‌رخ. کنتراست بالا اما سایه‌ها قابل دیدن.",
    typography: [
      { time: "00:51", text: "در برابر بدی" },
      { time: "00:53", text: "نور را انتخاب کن" }
    ],
    sound: "Whoosh یا باد نرم",
    colorGrade: "سایه تیره + نور گرم مقصد",
    transition: "Dissolve از زمستان — 4.5s راه‌رفتن + 2.25s نور",
    sources: ["Pexels 6318570 — مرد در جنگل 4K", "Pexels 5365208 — نور طلایی"]
  },
  {
    id: 9,
    title: "باران بهاری و جوانه",
    time: "00:55–01:02",
    duration: "7s",
    concept: "باران بهاری، قطره آب روی برگ تازه و نمای درخت در باران.",
    searchTerms: [
      "macro raindrop on green leaf spring slow motion",
      "spring tree rain cinematic"
    ],
    editNotes: "3s ماکرو قطره + 4s نمای باران در جنگل. Soft Cut در 00:58.",
    typography: [
      { time: "00:57", text: "پس از خزان" },
      { time: "01:00", text: "بهار می‌رسد" }
    ],
    sound: "باران ملایم زیر نریشن",
    colorGrade: "سبز تازه طبیعی — کنتراست هماهنگ",
    transition: "Soft Cut از ماکرو به نمای مدیوم",
    sources: ["Pexels — ماکرو قطره روی برگ 1080p", "Pexels — باران جنگل سبز 4K 60fps"]
  },
  {
    id: 10,
    title: "درخت سبز و نور طلایی",
    time: "01:02–01:07",
    duration: "5s",
    concept: "درختی سرسبز در نور طلایی؛ پرنده روی شاخه اختیاری.",
    searchTerms: [
      "beautiful green tree spring golden hour cinematic",
      "bird landing on tree branch spring"
    ],
    editNotes: "5 ثانیه — نور گرم طلایی. Pull Back آرام. پرنده اختیاری.",
    typography: [
      { time: "01:03", text: "پاکیزگی" },
      { time: "01:05", text: "راهِ سعادت است" }
    ],
    sound: "صدای طبیعت بسیار آرام",
    colorGrade: "طلایی + سبز بهاری — اشباع محدود",
    transition: "Dissolve نرم از باران",
    sources: ["Pexels — درخت تنها در چمنزار 4K"]
  },
  {
    id: 11,
    title: "پایان مفهومی و آرامش",
    time: "01:07–01:09",
    duration: "2s",
    concept: "نمای واید آرام از منظره بهاری؛ Fade Out به سیاهی.",
    searchTerms: [
      "peaceful spring landscape tree golden sunlight wide shot"
    ],
    editNotes: "2 ثانیه ثابت/آرام. Fade Out از 01:08.3 تا 01:09.",
    typography: [
      { time: "01:07", text: "از هر فصل، درسی بیاموز" }
    ],
    sound: "کاهش تدریجی — سکوت در 01:09",
    colorGrade: "طلایی ملایم — ادامه Scene 10",
    transition: "Fade Out به سیاهی",
    sources: ["همان کلیپ Scene 10 — 2 ثانیه پایانی", "Pexels — صبح بهاری 1080p"]
  }
];

export const typographySchedule = [
  { time: "00:02", text: "اوج پیروزی", bold: true },
  { time: "00:04", text: "از مسیر سختی‌ها می‌گذرد", bold: false },
  { time: "00:08", text: "رشد", bold: true },
  { time: "00:10", text: "نیازمند پذیرش سختی است", bold: false },
  { time: "00:15", text: "جرأت پرواز", bold: true },
  { time: "00:18", text: "از آسودگی عبور می‌کند", bold: false },
  { time: "00:22", text: "در آشفتگی", bold: false },
  { time: "00:25", text: "بال می‌گیریم", bold: true },
  { time: "00:28", text: "اگر اوج می‌خواهی", bold: false },
  { time: "00:31", text: "از سختی عبور کن", bold: false },
  { time: "00:36", text: "هر فصل", bold: false },
  { time: "00:39", text: "درسی دارد", bold: false },
  { time: "00:44", text: "تحمل کن", bold: true },
  { time: "00:47", text: "مقاومت کن", bold: true },
  { time: "00:51", text: "در برابر بدی", bold: false },
  { time: "00:53", text: "نور را انتخاب کن", bold: false },
  { time: "00:57", text: "پس از خزان", bold: false },
  { time: "01:00", text: "بهار می‌رسد", bold: false },
  { time: "01:03", text: "پاکیزگی", bold: true },
  { time: "01:05", text: "راهِ سعادت است", bold: false },
  { time: "01:07", text: "از هر فصل، درسی بیاموز", bold: false },
];

export const colorJourney = [
  { label: "سختی", color: "#3d2b1f", textColor: "#f5f5f5" },
  { label: "طوفان", color: "#2d3748", textColor: "#f5f5f5" },
  { label: "خزان", color: "#d97706", textColor: "#1a1a2e" },
  { label: "زمستان", color: "#60a5fa", textColor: "#1a1a2e" },
  { label: "نور", color: "#fbbf24", textColor: "#1a1a2e" },
  { label: "بهار", color: "#22c55e", textColor: "#1a1a2e" },
  { label: "طلایی", color: "#d4a853", textColor: "#1a1a2e" },
  { label: "پیروزی", color: "#4ade80", textColor: "#1a1a2e" },
];

export const checklist = [
  "تمام شات‌ها 16:9 و حداقل 1080p",
  "زمان‌بندی نهایی حدود 69 ثانیه",
  "مجوز و منبع تمام کلیپ‌ها ثبت شده",
  "بدون لوگو، واترمارک یا نوشته ناخواسته",
  "Color Grade هماهنگ در تمام صحنه‌ها",
  "تطبیق کادر درخت‌ها در فصل‌های مختلف",
  "جهت حرکت انسان و پرنده ثابت",
  "Typography فارسی خوانا با فونت Vazirmatn",
  "متن‌های کوتاه و حرفه‌ای در Safe Area",
  "انیمیشن متن نرم (400ms ورود، 350ms خروج)",
  "Transitionهای ساده و سینمایی",
  "مسیر رنگ: سختی → امید",
  "فایل صوتی اضافه نشده",
  "Timeline آماده برای نریشن",
  "پایان آرام با Fade Out کامل",
];

export const narrativeText = `رسیدن به اوج پیروزی از مسیر سنگلاخِ سختی‌ها می‌گذرد؛ یعنی اگر بخواهید رشد کنید، ترقّی و تعالی داشته باشید، باید پذیرای سختی‌ها باشید. بیدل دهلوی می‌گوید:

جرأت پرواز، برقِ خرمنِ آسودگی است / یک جهان آشفتگی در بال و پر داریم ما.

اگر واقعاً می‌خواهید اوج بگیرید و در بلندای پیروزی و سعادت قرار گیرید، باید سختی‌ها را پشت سر بگذارید. همان‌طور که درختان پیش از رسیدن بهار، خزان را تجربه می‌کنند، برگ‌های زرد خود را رها می‌سازند و خویش را برای استقبال از بهار آماده می‌کنند، انسان نیز باید چنین کند. او باید سختی‌ها و پریشانی‌ها را تحمل نماید، در برابر بدی‌ها و زشتی‌ها مقاومت کند، از گناه پرهیز ورزد و زندگی را با پاکیزگی سپری سازد. آنگاه خواهد توانست به پیروزی و سعادت نائل گردد و از هر فصل سال، درس لازم را بیاموزد.`;
