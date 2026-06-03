export interface Event {
  _id: string;
  title: string;
  kathaType: KathaType;
  description: string;
  date: string;
  endDate?: string;
  time?: string;
  location: string;
  address?: string;
  vachak?: KathaVachak;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KathaVachak {
  _id: string;
  name: string;
  photo: string;
  specialization: string[];
  experience: string;
  bio: string;
  phone: string;
  email: string;
  location: string;
  isActive: boolean;
  createdAt: string;
}

export interface Booking {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  kathaType: KathaType;
  eventDate: string;
  location: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

export interface GalleryItem {
  _id: string;
  title: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  event?: Event;
  category: string;
  isHighlight: boolean;
  createdAt: string;
}

export interface Member {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  membershipType: 'basic' | 'silver' | 'gold' | 'platinum';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export type KathaType = 'bhagavad-katha' | 'ramji-janmotsav' | 'shiv-mahapuran' | 'sundarkand-path' | 'bhajan-sandhya' | 'other';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email?: string;
  kathaType: KathaType;
  eventDate: string;
  location: string;
  notes?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface MemberFormData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  membershipType: 'basic' | 'silver' | 'gold' | 'platinum';
}
