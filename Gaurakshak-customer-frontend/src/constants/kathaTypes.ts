import { KathaType } from '@/types';

export interface KathaServiceInfo {
  id: KathaType;
  title: string;
  titleHindi: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
}

export const KATHA_TYPES: KathaServiceInfo[] = [
  {
    id: 'bhagavad-katha',
    title: 'Bhagavad Katha',
    titleHindi: 'Sacred Bhagavat Discourse',
    description: 'A divine narration from the Shrimad Bhagavat Purana that shares the incarnations of Lord Vishnu and the devotion of his followers. This seven-day discourse guides devotees toward spiritual wisdom.',
    duration: '7 Days',
    icon: '📖',
    color: '#FF6B00',
  },
  {
    id: 'ramji-janmotsav',
    title: 'Ramji Janmotsav',
    titleHindi: 'Lord Ram Birth Celebration',
    description: 'A devotional celebration of Lord Shri Ram birth and life. The program beautifully presents Lord Ram character and ideals through the Ramcharitmanas.',
    duration: '9 Days',
    icon: '🏹',
    color: '#F5C518',
  },
  {
    id: 'shiv-mahapuran',
    title: 'Shiv Mahapuran',
    titleHindi: 'Sacred Shiva Purana',
    description: 'A spiritual narration of Lord Shiva glory, forms, and divine stories. Shiv Mahapuran guides devotees on the path of devotion to Mahadev.',
    duration: '7 Days',
    icon: '🔱',
    color: '#800020',
  },
  {
    id: 'sundarkand-path',
    title: 'Sundarkand Path',
    titleHindi: 'Sundarkand Recitation',
    description: 'A devotional recitation from the Ramcharitmanas describing Hanuman journey to Lanka and the search for Mata Sita. It is performed for strength, peace, and divine blessings.',
    duration: '1 Day',
    icon: '🙏',
    color: '#FF8C00',
  },
  {
    id: 'bhajan-sandhya',
    title: 'Bhajan Sandhya',
    titleHindi: 'Devotional Music Evening',
    description: 'An evening of devotional bhajans and kirtan led by experienced singers, followed by aarti and prasad distribution.',
    duration: '1 Evening',
    icon: '🎵',
    color: '#6B0F1A',
  },
];
