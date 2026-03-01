export type Question = {
  id: number;
  text: string;
  indicator: string;
  options: string[];
};

export const questions: Record<'en' | 'bn', Question[]> = {
  en: [
    // Group A: Vision & Sight
    { id: 1, text: "Gradual blurring or clouding of vision over time", indicator: "Cataract indicator", options: ['Yes', 'No'] },
    { id: 2, text: "Seeing halos or starbursts around lights at night", indicator: "Cataract/Glaucoma", options: ['Yes', 'No'] },
    { id: 3, text: "Part of vision blocked by drooping eyelid", indicator: "Ptosis indicator", options: ['Yes', 'No'] },
    { id: 4, text: "Sudden, severe vision loss in one eye", indicator: "Emergency/Uveitis", options: ['Yes', 'No'] },
    { id: 5, text: "Colors look faded, washed out, or yellowish", indicator: "Cataract indicator", options: ['Yes', 'No'] },

    // Group B: Pain & Sensation
    { id: 6, text: "Gritty, scratchy sensation (like sand in the eye)", indicator: "Conjunctivitis/Pterygium", options: ['Yes', 'No'] },
    { id: 7, text: "Deep, aching pain inside or behind the eye", indicator: "Uveitis indicator", options: ['Yes', 'No'] },
    { id: 8, text: "Bright light hurts eyes significantly (Photophobia)", indicator: "Uveitis/Keratitis", options: ['Yes', 'No'] },
    { id: 9, text: "Severe surface pain making it hard to keep eye open", indicator: "Keratitis indicator", options: ['Yes', 'No'] },

    // Group C: Physical Signs
    { id: 10, text: "One or both eyes are visibly red/bloodshot", indicator: "Infection/Inflammation", options: ['Yes', 'No'] },
    { id: 11, text: "Fleshy growth on the white part of the eye", indicator: "Pterygium indicator", options: ['Yes', 'No'] },
    { id: 12, text: "Discharge (pus, water, or mucus) leaking from eye", indicator: "Conjunctivitis", options: ['Yes', 'No'] },
    { id: 13, text: "White or grey spot on the colored part (cornea)", indicator: "Keratitis indicator", options: ['Yes', 'No'] },

    // Group D: History & Risk Factors
    { id: 14, text: "Regular contact lens wearer", indicator: "Risk factor for Keratitis", options: ['Yes', 'No'] },
    { id: 15, text: "Have autoimmune disease (Arthritis, Lupus, etc.)", indicator: "Risk factor for Uveitis", options: ['Yes', 'No'] },
    { id: 16, text: "Difficulty seeing in low light or at night", indicator: "Night Blindness", options: ['Yes', 'No'] },
    { id: 17, text: "Eyes feel excessively dry, stinging or burning", indicator: "Dry Eyes", options: ['Yes', 'No'] },
  ],
  bn: [
    // Group A: Vision & Sight
    { id: 1, text: "সময়ের সাথে সাথে দৃষ্টি ধীরে ধীরে ঝাপসা বা মেঘলা হয়ে যাওয়া", indicator: "ছানি নির্দেশক", options: ['হ্যাঁ', 'না'] },
    { id: 2, text: "রাতে আলোর চারপাশে হ্যালো বা স্টারবার্স্ট দেখা", indicator: "ছানি/গ্লুকোমা", options: ['হ্যাঁ', 'না'] },
    { id: 3, text: "ঝুলে থাকা চোখের পাতা দ্বারা দৃষ্টির অংশ অবরুদ্ধ", indicator: "ptosis নির্দেশক", options: ['হ্যাঁ', 'না'] },
    { id: 4, text: "এক চোখে হঠাৎ, গুরুতর দৃষ্টিশক্তি হ্রাস", indicator: "জরুরী/ইউভেইটিস", options: ['হ্যাঁ', 'না'] },
    { id: 5, text: "রঙগুলি বিবর্ণ, ধোয়া বা হলুদ দেখায়", indicator: "ছানি নির্দেশক", options: ['হ্যাঁ', 'না'] },

    // Group B: Pain & Sensation
    { id: 6, text: "খসখসে, আঁচড়ানোর অনুভূতি (চোখে বালির মতো)", indicator: "কনজাংটিভাইটিস/টেরিজিয়াম", options: ['হ্যাঁ', 'না'] },
    { id: 7, text: "চোখের ভিতরে বা পিছনে গভীর, তীব্র ব্যথা", indicator: "ইউভেইটিস নির্দেশক", options: ['হ্যাঁ', 'না'] },
    { id: 8, text: "উজ্জ্বল আলো চোখে উল্লেখযোগ্যভাবে আঘাত করে (ফোটোফোবিয়া)", indicator: "ইউভেইটিস/কেরাটিনাইটিস", options: ['হ্যাঁ', 'না'] },
    { id: 9, text: "তীব্র পৃষ্ঠের ব্যথা যা চোখ খোলা রাখা কঠিন করে তোলে", indicator: "কেরাটিনাইটিস নির্দেশক", options: ['হ্যাঁ', 'না'] },

    // Group C: Physical Signs
    { id: 10, text: "এক বা উভয় চোখ দৃশ্যত লাল/রক্তবর্ণ", indicator: "সংক্রমণ/প্রদাহ", options: ['হ্যাঁ', 'না'] },
    { id: 11, text: "চোখের সাদা অংশে মাংসল বৃদ্ধি", indicator: "টেরিজিয়াম নির্দেশক", options: ['হ্যাঁ', 'না'] },
    { id: 12, text: "চোখ থেকে স্রাব (পুঁজ, জল বা শ্লেষ্মা) বের হওয়া", indicator: "কনজাংটিভাইটিস", options: ['হ্যাঁ', 'না'] },
    { id: 13, text: "রঙিন অংশে (কর্নিয়া) সাদা বা ধূসর দাগ", indicator: "কেরাটিনাইটিস নির্দেশক", options: ['হ্যাঁ', 'না'] },

    // Group D: History & Risk Factors
    { id: 14, text: "নিয়মিত কন্টাক্ট লেন্স ব্যবহারকারী", indicator: "কেরাটিনাইটিসের ঝুঁকির কারণ", options: ['হ্যাঁ', 'না'] },
    { id: 15, text: "অটোইমিউন রোগ আছে (আর্থ্রাইটিস, লুপাস, ইত্যাদি)", indicator: "ইউভেইটিসের ঝুঁকির কারণ", options: ['হ্যাঁ', 'না'] },
    { id: 16, text: "কম আলোতে বা রাতে দেখতে অসুবিধা", indicator: "রাতকানা", options: ['হ্যাঁ', 'না'] },
    { id: 17, text: "চোখ অতিরিক্ত শুষ্ক মনে হয়, হুল ফোটানো বা জ্বলুনি", indicator: "শুষ্ক চোখ", options: ['হ্যাঁ', 'না'] },
  ]
};
