export type Question = {
  id: number;
  text: string;
  indicator: string;
  options: string[];
};

export const questions: Record<'en' | 'bn', Question[]> = {
  en: [
    // Group A: Vision & Sight
    { id: 1, text: "Have you noticed your vision gradually getting blurry or cloudy?", indicator: "Cataract indicator", options: ['Yes', 'No'] },
    { id: 2, text: "Do you see halos or starbursts around lights at night?", indicator: "Cataract/Glaucoma", options: ['Yes', 'No'] },
    { id: 3, text: "Is your vision partially blocked by a drooping eyelid?", indicator: "Ptosis indicator", options: ['Yes', 'No'] },
    { id: 4, text: "Have you experienced sudden, severe vision loss in one eye?", indicator: "Emergency/Uveitis", options: ['Yes', 'No'] },
    { id: 5, text: "Do colors seem faded, washed out, or yellowish to you?", indicator: "Cataract indicator", options: ['Yes', 'No'] },

    // Group B: Pain & Sensation
    { id: 6, text: "Does your eye feel gritty or scratchy, like there's sand in it?", indicator: "Conjunctivitis/Pterygium", options: ['Yes', 'No'] },
    { id: 7, text: "Are you feeling a deep, aching pain inside or behind your eye?", indicator: "Uveitis indicator", options: ['Yes', 'No'] },
    { id: 8, text: "Does bright light hurt your eyes significantly?", indicator: "Uveitis/Keratitis", options: ['Yes', 'No'] },
    { id: 9, text: "Do you have severe pain on the surface of your eye making it hard to keep open?", indicator: "Keratitis indicator", options: ['Yes', 'No'] },

    // Group C: Physical Signs
    { id: 10, text: "Are one or both of your eyes visibly red or bloodshot?", indicator: "Infection/Inflammation", options: ['Yes', 'No'] },
    { id: 11, text: "Do you notice a fleshy growth on the white part of your eye?", indicator: "Pterygium indicator", options: ['Yes', 'No'] },
    { id: 12, text: "Is there any discharge (pus, water, or mucus) leaking from your eye?", indicator: "Conjunctivitis", options: ['Yes', 'No'] },
    { id: 13, text: "Do you see a white or grey spot on the colored part (cornea) of your eye?", indicator: "Keratitis indicator", options: ['Yes', 'No'] },

    // Group D: History & Risk Factors
    { id: 14, text: "Do you regularly wear contact lenses?", indicator: "Risk factor for Keratitis", options: ['Yes', 'No'] },
    { id: 15, text: "Do you have an autoimmune disease (like Arthritis or Lupus)?", indicator: "Risk factor for Uveitis", options: ['Yes', 'No'] },
    { id: 16, text: "Do you have difficulty seeing in low light or at night?", indicator: "Night Blindness", options: ['Yes', 'No'] },
    { id: 17, text: "Do your eyes feel excessively dry, stinging, or burning?", indicator: "Dry Eyes", options: ['Yes', 'No'] },
  ],
  bn: [
    // Group A: Vision & Sight
    { id: 1, text: "আপনি কি লক্ষ্য করেছেন যে আপনার দৃষ্টি ধীরে ধীরে ঝাপসা বা মেঘলা হয়ে যাচ্ছে?", indicator: "ছানি নির্দেশক", options: ['হ্যাঁ', 'না'] },
    { id: 2, text: "আপনি কি রাতে আলোর চারপাশে হ্যালো বা উজ্জ্বল স্তর দেখতে পান?", indicator: "ছানি/গ্লুকোমা", options: ['হ্যাঁ', 'না'] },
    { id: 3, text: "আপনার দৃষ্টির কোনো অংশ কি ঝুলে থাকা চোখের পাতার কারণে বাধাপ্রাপ্ত হচ্ছে?", indicator: "ptosis নির্দেশক", options: ['হ্যাঁ', 'না'] },
    { id: 4, text: "আপনি কি হঠাৎ এক চোখে মারাত্মক দৃষ্টিশক্তি হারানোর অভিজ্ঞতা লাভ করেছেন?", indicator: "জরুরী/ইউভেইটিস", options: ['হ্যাঁ', 'না'] },
    { id: 5, text: "রঙগুলি কি আপনার কাছে বিবর্ণ, বা হলুদ মনে হচ্ছে?", indicator: "ছানি নির্দেশক", options: ['হ্যাঁ', 'না'] },

    // Group B: Pain & Sensation
    { id: 6, text: "আপনার চোখ কি খসখসে মনে হচ্ছে, যেন এর মধ্যে বালি রয়েছে?", indicator: "কনজাংটিভাইটিস/টেরিজিয়াম", options: ['হ্যাঁ', 'না'] },
    { id: 7, text: "আপনি কি চোখের ভিতরে বা পেছনে কোনো গভীর, তীব্র ব্যথা অনুভব করছেন?", indicator: "ইউভেইটিস নির্দেশক", options: ['হ্যাঁ', 'না'] },
    { id: 8, text: "উজ্জ্বল আলো কি আপনার চোখে খুব লাগছে (ফোটোফোবিয়া)?", indicator: "ইউভেইটিস/কেরাটিনাইটিস", options: ['হ্যাঁ', 'না'] },
    { id: 9, text: "আপনার কি চোখের উপরিভাগে তীব্র ব্যথা হচ্ছে যা চোখ খোলা রাখা কঠিন করে তুলছে?", indicator: "কেরাটিনাইটিস নির্দেশক", options: ['হ্যাঁ', 'না'] },

    // Group C: Physical Signs
    { id: 10, text: "আপনার এক বা উভয় চোখ কি দৃশ্যত লাল বা রক্তবর্ণ দেখাচ্ছে?", indicator: "সংক্রমণ/প্রদাহ", options: ['হ্যাঁ', 'না'] },
    { id: 11, text: "আপনি কি আপনার চোখের সাদা অংশে কোনো মাংসল বৃদ্ধি লক্ষ্য করেছেন?", indicator: "টেরিজিয়াম নির্দেশক", options: ['হ্যাঁ', 'না'] },
    { id: 12, text: "আপনার চোখ থেকে কি কোনো তরল, পুঁজ বা শ্লেষ্মা বের হচ্ছে?", indicator: "কনজাংটিভাইটিস", options: ['হ্যাঁ', 'না'] },
    { id: 13, text: "আপনি কি আপনার চোখের রঙিন অংশে কোনো সাদা বা ধূসর দাগ দেখতে পাচ্ছেন?", indicator: "কেরাটিনাইটিস নির্দেশক", options: ['হ্যাঁ', 'না'] },

    // Group D: History & Risk Factors
    { id: 14, text: "আপনি কি নিয়মিত কন্টাক্ট লেন্স ব্যবহার করেন?", indicator: "কেরাটিনাইটিসের ঝুঁকির কারণ", options: ['হ্যাঁ', 'না'] },
    { id: 15, text: "আপনার কি কোনো অটোইমিউন রোগ আছে (যেমন আর্থ্রাইটিস বা লুপাস)?", indicator: "ইউভেইটিসের ঝুঁকির কারণ", options: ['হ্যাঁ', 'না'] },
    { id: 16, text: "আপনার কি কম আলোতে বা রাতে দেখতে অসুবিধা হয়?", indicator: "রাতকানা", options: ['হ্যাঁ', 'না'] },
    { id: 17, text: "আপনার চোখ কি অতিরিক্ত শুষ্ক মনে হচ্ছে, জ্বলুনি বা দংশনের মতো অনুভূতি হচ্ছে?", indicator: "শুষ্ক চোখ", options: ['হ্যাঁ', 'না'] },
  ]
};
