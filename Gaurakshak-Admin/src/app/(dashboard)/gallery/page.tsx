'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchGallery, addGalleryItem, deleteGalleryItem } from '@/redux/slices/gallerySlice';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiPlus, FiX, FiImage } from 'react-icons/fi';
import { GalleryItem } from '@/types';

type GalleryItemType = GalleryItem['type'];

export default function GalleryAdminPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.gallery);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: '',
    type: 'photo',
    url: '',
    category: '',
    isHighlight: false,
  });

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      toast.error('Please enter title and image/video URL');
      return;
    }
    dispatch(addGalleryItem(formData)).then(() => {
      toast.success('Gallery item added successfully');
      setShowModal(false);
      setFormData({ title: '', type: 'photo', url: '', category: '', isHighlight: false });
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      dispatch(deleteGalleryItem(id)).then(() => {
        toast.success('Gallery item deleted');
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-card p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
          <h3 className="text-lg font-bold text-stone-900">Gallery Management</h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex w-full items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all sm:w-auto"
          >
            <FiPlus className="w-4 h-4" /> Upload New Item
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-stone-100 rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-stone-400 font-semibold flex flex-col items-center gap-3">
            <FiImage className="w-10 h-10" />
            <p>No gallery items uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="relative group rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-saffron-400 text-[10px] font-extrabold uppercase tracking-wider">
                    {item.category || 'General'}
                  </span>
                  <span className="text-white text-sm font-bold truncate">{item.title}</span>
                </div>

                {/* Delete overlay button */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>

                {/* Type & Highlight badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="text-[9px] bg-white/80 backdrop-blur-sm text-stone-800 font-extrabold px-2 py-1 rounded-lg uppercase tracking-wider">
                    {item.type}
                  </span>
                  {item.isHighlight && (
                    <span className="text-[9px] bg-yellow-400/90 backdrop-blur-sm text-stone-900 font-extrabold px-2 py-1 rounded-lg uppercase tracking-wider">
                      Highlight
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Gallery Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-stone-900 mb-6">Upload to Gallery</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Divine Krishna Aarti"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as GalleryItemType })}
                    className="w-full px-4 py-2.5 border rounded-xl bg-white focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarti, Satsang"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase">Image / Video URL *</label>
                <input
                  type="text"
                  required
                  placeholder="Paste the media URL here"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isHighlight"
                  checked={formData.isHighlight}
                  onChange={(e) => setFormData({ ...formData, isHighlight: e.target.checked })}
                  className="w-4 h-4 text-saffron-500 focus:ring-saffron-400 border-stone-300 rounded"
                />
                <label htmlFor="isHighlight" className="text-xs font-bold text-stone-700 select-none cursor-pointer">
                  Mark as highlight on public gallery
                </label>
              </div>

              <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-xl font-bold text-sm transition-all sm:w-1/2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-saffron-500 hover:bg-saffron-600 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all sm:w-1/2"
                >
                  Upload Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
