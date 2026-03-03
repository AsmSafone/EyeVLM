export interface Quote {
    text: string;
    author: string;
}

export const quotes: Quote[] = [
    { text: "The eye is the jewel of the body.", author: "Henry David Thoreau" },
    { text: "Vision is the art of seeing what is invisible to others.", author: "Jonathan Swift" },
    { text: "Your eyes show the strength of your soul.", author: "Paulo Coelho" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Health is the greatest gift, contentment the greatest wealth.", author: "Buddha" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "An ounce of prevention is worth a pound of cure.", author: "Benjamin Franklin" },
    { text: "The greatest wealth is health.", author: "Virgil" },
    { text: "To keep the body in good health is a duty.", author: "Buddha" },
    { text: "Your future self will thank you for taking care today.", author: "Anonymous" },
    { text: "Invest in your health today or pay for illness tomorrow.", author: "Anonymous" },
    { text: "Small daily habits lead to lifelong wellness.", author: "Anonymous" },
    { text: "See the world through healthy eyes, and it becomes a brighter place.", author: "Anonymous" },
    { text: "Every blink is a moment of renewal for your eyes.", author: "Anonymous" },
    { text: "Caring for your eyes is caring for your window to the world.", author: "Anonymous" },
    { text: "Prevention is the daughter of intelligence.", author: "Walter Raleigh" },
    { text: "Your eyes are precious. Rest them at least one hour a day.", author: "Leonardo da Vinci" },
    { text: "Look deep into nature, and then you will understand everything better.", author: "Albert Einstein" },
    { text: "The light in your eyes is a reflection of the care you give them.", author: "Anonymous" },
    { text: "Wellness is a daily commitment, not a one-time achievement.", author: "Anonymous" },
    { text: "Take a look at the natural world — it's the best screen break.", author: "Anonymous" },
    { text: "Eat for your eyes: colorful foods protect precious vision.", author: "Anonymous" },
    { text: "Regular eye check-ups are an act of self-love.", author: "Anonymous" },
    { text: "Healthy habits today, clear vision tomorrow.", author: "Anonymous" },
    { text: "The eye sees only what the mind is prepared to comprehend.", author: "Henri Bergson" },
    { text: "Rest is not idleness — for your eyes, it is medicine.", author: "Anonymous" },
    { text: "You don't need eyes to see; you need vision.", author: "Faithless" },
    { text: "Good health is not something we can buy. However, it can be an extremely valuable savings account.", author: "Anne Wilson Schaef" },
    { text: "Screen less, live more, see better.", author: "Anonymous" },
    { text: "Your eyes deserve the same care you give your heart.", author: "Anonymous" },
    { text: "Look at the world with wonder — and protect the eyes that let you do it.", author: "Anonymous" },
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
