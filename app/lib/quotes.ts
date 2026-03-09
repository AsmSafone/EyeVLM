export interface TranslatableText {
    en: string;
    bn: string;
}

export interface Quote {
    text: TranslatableText;
    author: TranslatableText;
}

export const quotes: Quote[] = [
    { text: { en: "The eye is the jewel of the body.", bn: "চোখ হলো শরীরের রত্ন।" }, author: { en: "Henry David Thoreau", bn: "হেনরি ডেভিড থোরো" } },
    { text: { en: "Vision is the art of seeing what is invisible to others.", bn: "দৃষ্টি হলো অন্যদের কাছে যা অদৃশ্য তা দেখার শিল্প।" }, author: { en: "Jonathan Swift", bn: "জোনাথন সুইফট" } },
    { text: { en: "Your eyes show the strength of your soul.", bn: "আপনার চোখ আপনার আত্মার শক্তি প্রদর্শন করে।" }, author: { en: "Paulo Coelho", bn: "পাওলো কোয়েলহো" } },
    { text: { en: "The eyes are the mirror of the soul.", bn: "চোখ হলো আত্মার আয়না।" }, author: { en: "Proverb", bn: "প্রবাদ" } },
    { text: { en: "Keep your face to the sunshine and you cannot see a shadow.", bn: "সূর্যের দিকে মুখ রাখুন, আপনি কোনো ছায়া দেখতে পাবেন না।" }, author: { en: "Helen Keller", bn: "হেলেন কেলার" } },
    { text: { en: "For beautiful eyes, look for the good in others.", bn: "সুন্দর চোখের জন্য অন্যদের মাঝে ভালো কিছু খুঁজুন।" }, author: { en: "Audrey Hepburn", bn: "অড্রি হেপবার্ন" } },
    { text: { en: "The eye sees only what the mind is prepared to comprehend.", bn: "মন যা বুঝতে প্রস্তুত, চোখ কেবল তা-ই দেখতে পায়।" }, author: { en: "Henri Bergson", bn: "হেনরি বার্গসন" } },
    { text: { en: "Every closed eye is not sleeping, and every open eye is not seeing.", bn: "সব বন্ধ চোখ ঘুমায় না, আর সব খোলা চোখ দেখে না।" }, author: { en: "Bill Cosby", bn: "বিল কসবি" } },
    { text: { en: "To keep your eyes wide open is a sign of youth and health.", bn: "চোখ খোলা রাখা যৌবন এবং স্বাস্থ্যের লক্ষণ।" }, author: { en: "Anonymous", bn: "অজ্ঞাত" } },
    { text: { en: "Look deep into nature, and then you will understand everything better.", bn: "প্রকৃতির গভীরে তাকালে সবকিছু ভালোভাবে বোঝা যায়।" }, author: { en: "Albert Einstein", bn: "অ্যালবার্ট আইনস্টাইন" } },
    { text: { en: "Your eyes are precious. Rest them at least one hour a day.", bn: "আপনার চোখ মূল্যবান। দিনে অন্তত এক ঘণ্টা বিশ্রাম দিন।" }, author: { en: "Leonardo da Vinci", bn: "লিওনার্দো দা ভিঞ্চি" } },
    { text: { en: "Eat for your eyes: colorful foods protect precious vision.", bn: "চোখের জন্য খান: রঙিন খাবার মূল্যবান দৃষ্টি সুরক্ষিত করে।" }, author: { en: "Anonymous", bn: "অজ্ঞাত" } },
    { text: { en: "See the world through healthy eyes, and it becomes a brighter place.", bn: "সুস্থ চোখের মাধ্যমে দুনিয়াটাকে উজ্জ্বলতম স্থান হিসেবে দেখুন।" }, author: { en: "Anonymous", bn: "অজ্ঞাত" } },
    { text: { en: "Every blink is a moment of renewal for your eyes.", bn: "প্রতিটি পলক আপনার চোখের জীবনের নতুন রূপ।" }, author: { en: "Anonymous", bn: "অজ্ঞাত" } },
    { text: { en: "Screen less, live more, see better.", bn: "স্ক্রিন কমান, বেশি বাঁচুন, আরও ভালো দেখুন।" }, author: { en: "Anonymous", bn: "অজ্ঞাত" } },
    { text: { en: "The light in your eyes is a reflection of the care you give them.", bn: "আপনার চোখের আলো আপনার নেওয়া যত্নের প্রতিফলন।" }, author: { en: "Anonymous", bn: "অজ্ঞাত" } },
    { text: { en: "Healthy habits today, clear vision tomorrow.", bn: "আজকের সুস্থ অভ্যাস, আগামীর পরিষ্কার দৃষ্টি।" }, author: { en: "Anonymous", bn: "অজ্ঞাত" } },
    { text: { en: "Rest is not idleness — for your eyes, it is medicine.", bn: "বিশ্রাম অলসতা নয় — চোখের জন্য এটি একটি ঔষধ।" }, author: { en: "Anonymous", bn: "অজ্ঞাত" } },
    { text: { en: "Take a look at the natural world — it's the best screen break.", bn: "প্রাকৃতিক দিকে নজর দিন, এটি শ্রেষ্ঠ স্ক্রিন ব্রেক।" }, author: { en: "Anonymous", bn: "অজ্ঞাত" } },
    { text: { en: "You don't need eyes to see; you need vision.", bn: "দেখার জন্য চোখের নয়, আপনার দৃষ্টিভঙ্গির প্রয়োজন।" }, author: { en: "Faithless", bn: "ফেইথলেস" } }
];

/**
 * Returns a deterministic quote for the current day.
 * The same quote is shown all day; it changes at midnight.
 */
export function getDailyQuote(): Quote {
    const today = new Date();
    const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return quotes[dayOfYear % quotes.length];
}
