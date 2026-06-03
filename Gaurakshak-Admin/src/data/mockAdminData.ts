import { Event, Booking, GalleryItem, Member, ContactMessage, KathaVachak } from '@/types';

export const initialMockVachaks: KathaVachak[] = [
  {
    _id: 'vachak-1',
    name: 'Shrimad Devkinandan Thakur Ji',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    specialization: ['Shrimad Bhagavad Gita Katha', 'Ram Katha'],
    experience: '25+ Years',
    bio: 'Pujya Devkinandan Thakur Ji is a melodious Katha Vachak who has dedicated his life to spreading the divine message of Lord Krishna.',
    phone: '+91 98765 43210',
    email: 'devkinandan@gaurakshak.com',
    location: 'Vrindavan, UP',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'vachak-2',
    name: 'Pujya Bhaishree Rameshbhai Oza',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    specialization: ['Shrimad Bhagavad Katha', 'Ram Charit Manas Path'],
    experience: '35+ Years',
    bio: 'Pujya Bhaishree has inspired millions globally through his simple yet profound interpretations of sacred texts.',
    phone: '+91 98765 43211',
    email: 'bhaishree@gaurakshak.com',
    location: 'Porbandar, Gujarat',
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

export const initialMockEvents: Event[] = [
  {
    _id: 'event-1',
    title: 'Shrimad Bhagavad Katha Saptah',
    kathaType: 'bhagavad-katha',
    description: 'A 7-day divine journey into the pastimes of Lord Krishna, focusing on self-realization, duty, and pure devotion.',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '03:00 PM - 07:00 PM',
    location: 'Gaurakshak Samiti ground, Vrindavan Dham',
    vachak: initialMockVachaks[0],
    image: 'https://images.unsplash.com/photo-1608976478512-ca619a9e33ec?auto=format&fit=crop&q=80&w=1200',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'event-2',
    title: 'Grand Shri Ramji Janmotsav & Ram Katha',
    kathaType: 'ramji-janmotsav',
    description: '9-day celebration of the birth of Lord Rama with devotional discourses and Ramayana path.',
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '04:00 PM - 08:00 PM',
    location: 'Ram Leela Maidan, Janakpuri',
    vachak: initialMockVachaks[1],
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=1200',
    status: 'upcoming',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const initialMockBookings: Booking[] = [
  {
    _id: 'booking-1',
    name: 'Anand Patel',
    phone: '+91 99887 76655',
    email: 'anand@example.com',
    kathaType: 'bhagavad-katha',
    eventDate: '2026-06-15',
    location: 'Mumbai, Maharashtra',
    notes: 'Please arrange Devkinandan Thakur Ji if possible.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'booking-2',
    name: 'Ramesh Shah',
    phone: '+91 98765 43210',
    email: 'ramesh@example.com',
    kathaType: 'shiv-mahapuran',
    eventDate: '2026-07-20',
    location: 'Pune, Maharashtra',
    notes: 'Required grand setup with lights and pandal.',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
];

export const initialMockGallery: GalleryItem[] = [
  {
    _id: 'gallery-1',
    title: 'Divine Krishna Aarti',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1608976478512-ca619a9e33ec?auto=format&fit=crop&q=80&w=800',
    category: 'Aarti',
    isHighlight: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'gallery-2',
    title: 'Holy Cow Protection & Seva',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800',
    category: 'Gau Sewa',
    isHighlight: true,
    createdAt: new Date().toISOString(),
  }
];

export const initialMockMembers: Member[] = [
  {
    _id: 'member-1',
    name: 'Vijay Kumar',
    phone: '+91 99880 11223',
    email: 'vijay@example.com',
    address: 'Andheri West',
    city: 'Mumbai',
    membershipType: 'gold',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'member-2',
    name: 'Suresh Kumar',
    phone: '+91 98980 98980',
    email: 'suresh@example.com',
    address: 'Mansarovar',
    city: 'Jaipur',
    membershipType: 'platinum',
    status: 'approved',
    createdAt: new Date().toISOString(),
  }
];

export const initialMockMessages: ContactMessage[] = [
  {
    _id: 'message-1',
    name: 'Ketan Patel',
    email: 'ketan@example.com',
    phone: '+91 90000 11111',
    subject: 'Donation process query',
    message: 'Can I transfer online via UPI? Please share details.',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'message-2',
    name: 'Divya Sharma',
    email: 'divya@example.com',
    phone: '+91 92222 33333',
    subject: 'Volunteering registration',
    message: 'I want to volunteer for the upcoming Bhagavad Katha.',
    isRead: true,
    createdAt: new Date().toISOString(),
  }
];
