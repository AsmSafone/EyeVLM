import { translations } from './translations';

export type TipCategory = keyof typeof translations.en;
export type TipTitle = keyof typeof translations.en;
export type TipDesc = keyof typeof translations.en;

export interface Tip {
    id: string;
    category: TipCategory;
    categoryColor: {
        text: string;
        bg: string;
        border: string;
    };
    title: TipTitle;
    description: TipDesc;
    image: string;
}

export const eyeHealthTips: Tip[] = [
    {
        id: 'tip-1',
        category: 'prevention',
        categoryColor: {
            text: 'text-cyan-300',
            bg: 'bg-cyan-950/50',
            border: 'border-cyan-500/30'
        },
        title: 'rule202020',
        description: 'ruleDesc',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy99mDmpD1WHFjnrpz7uWKg62ilakjBWvyXGT2VSbyOLM4xHmWr3s9eksJElBN9zaDdZ-VON0Iyc0Ovthh3XUmsiVpBSWFFV03qAe0rGE5XlEcLTc9tkY42p8VMkqNr5Z6mfCAxb9yj28gxefymsYYERvvnPIK80T2mBQK5sc8QVnuqLb_YnFSm9aQqHgF984v2yAx6kIKd3Ia_NBdp8FCPBl4IO79oTP04d9MRWr85xboEmrnQ34YDqdyxNFIe1A58diw5u3ipRk'
    },
    {
        id: 'tip-2',
        category: 'nutrition',
        categoryColor: {
            text: 'text-green-300',
            bg: 'bg-green-950/50',
            border: 'border-green-500/30'
        },
        title: 'eatForEyes',
        description: 'eatDesc',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCLFbpFczbEOMdXgnLjQsF3wrvYn6E0vdPzGtA-Nhw22XnjQ2NXTeWKZv6Nz9wpnzwqYol802_bOxjUx7NSGgEk9cfZPXH7oZdWlCrT0cSiM9ZvHpWkYSZSGaqqtGZZjXuUoM08sA983j4fsQfiG1J1mkGVOijCLZiiN0WQFL9dbvUxCLU124tDno0A3ZAVMFtt4ezQyJMD941UExVivme9aRuuwi4zqq8nPByNTOYOylpyKBFb6bxjxdrd6ht79lrH1MeWQyoVFw'
    },
    {
        id: 'tip-3',
        category: 'prevention',
        categoryColor: {
            text: 'text-amber-300',
            bg: 'bg-amber-950/50',
            border: 'border-amber-500/30'
        },
        title: 'uvProtection',
        description: 'uvDesc',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'tip-4',
        category: 'prevention',
        categoryColor: {
            text: 'text-indigo-300',
            bg: 'bg-indigo-950/50',
            border: 'border-indigo-500/30'
        },
        title: 'screenBrightness',
        description: 'screenDesc',
        image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'tip-5',
        category: 'nutrition',
        categoryColor: {
            text: 'text-blue-300',
            bg: 'bg-blue-950/50',
            border: 'border-blue-500/30'
        },
        title: 'hydration',
        description: 'hydrationDesc',
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'tip-6',
        category: 'prevention',
        categoryColor: {
            text: 'text-rose-300',
            bg: 'bg-rose-950/50',
            border: 'border-rose-500/30'
        },
        title: 'regularExams',
        description: 'regularExamsDesc',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'tip-7',
        category: 'prevention',
        categoryColor: {
            text: 'text-slate-300',
            bg: 'bg-slate-900/50',
            border: 'border-slate-500/30'
        },
        title: 'stopSmoking',
        description: 'stopSmokingDesc',
        image: 'https://images.unsplash.com/photo-1641536471312-0fb88f392403?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'tip-8',
        category: 'prevention',
        categoryColor: {
            text: 'text-purple-300',
            bg: 'bg-purple-950/50',
            border: 'border-purple-500/30'
        },
        title: 'eyeMakeup',
        description: 'eyeMakeupDesc',
        image: 'https://images.unsplash.com/photo-1523654881152-1f1f16389dc8?auto=format&fit=crop&w=600&q=80'
    }
];
