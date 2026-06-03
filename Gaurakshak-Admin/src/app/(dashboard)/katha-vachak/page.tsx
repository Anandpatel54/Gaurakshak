'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  addKathaVachak,
  deleteKathaVachak,
  fetchKathaVachaks,
  updateKathaVachak,
} from '@/redux/slices/kathaVachakSlice';
import { KathaVachak } from '@/types';
import { toast } from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const emptyForm: Partial<KathaVachak> = {
  name: '',
  photo: '',
  specialization: [],
  experience: '',
  bio: '',
  phone: '',
  email: '',
  location: '',
  isActive: true,
};

export default function KathaVachakAdminPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.kathaVachaks);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<KathaVachak>>(emptyForm);
  const [specializationInput, setSpecializationInput] = useState('');

  useEffect(() => {
    dispatch(fetchKathaVachaks());
  }, [dispatch]);

  const resetForm = () => {
    setFormData(emptyForm);
    setSpecializationInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter the Katha Vachak name');
      return;
    }

    const specialization = specializationInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await dispatch(addKathaVachak({ ...formData, specialization })).unwrap();
      toast.success('Katha Vachak added successfully');
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to add Katha Vachak');
    }
  };

  const handleToggleActive = async (vachak: KathaVachak) => {
    try {
      await dispatch(updateKathaVachak({ id: vachak._id, vachakData: { isActive: !vachak.isActive } })).unwrap();
      toast.success('Katha Vachak status updated');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Katha Vachak?')) return;

    try {
      await dispatch(deleteKathaVachak(id)).unwrap();
      toast.success('Katha Vachak deleted');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to delete Katha Vachak');
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-card p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Manage Katha Vachaks</h3>
            <p className="text-xs font-semibold text-stone-500 mt-1">Add speakers who appear on the customer Katha Vachak page.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex w-full items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all sm:w-auto"
          >
            <FiPlus className="w-4 h-4" /> Add Katha Vachak
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-stone-100 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-stone-400 font-semibold">No Katha Vachaks added yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((vachak) => (
              <article key={vachak._id} className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48 bg-stone-100">
                  <img
                    src={vachak.photo || 'https://images.unsplash.com/photo-1608976478512-ca619a9e33ec?auto=format&fit=crop&q=80&w=800'}
                    alt={vachak.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-extrabold text-stone-900">{vachak.name}</h4>
                      <p className="text-xs font-semibold text-stone-500 mt-1">{vachak.experience || 'Experience not specified'}</p>
                    </div>
                    <button
                      onClick={() => handleToggleActive(vachak)}
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
                        vachak.isActive ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {vachak.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {vachak.specialization.map((item) => (
                      <span key={item} className="bg-saffron-50 text-saffron-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                        {item}
                      </span>
                    ))}
                  </div>

                  {vachak.bio && <p className="mt-4 text-xs font-semibold leading-5 text-stone-600 line-clamp-3">{vachak.bio}</p>}

                  <div className="mt-5 space-y-2 text-xs font-semibold text-stone-500">
                    {vachak.location && (
                      <p className="flex items-center gap-2">
                        <FiMapPin className="text-saffron-500" /> {vachak.location}
                      </p>
                    )}
                    {vachak.phone && (
                      <p className="flex items-center gap-2">
                        <FiPhone className="text-saffron-500" /> {vachak.phone}
                      </p>
                    )}
                    {vachak.email && (
                      <p className="flex items-center gap-2">
                        <FiMail className="text-saffron-500" /> {vachak.email}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(vachak._id)}
                    className="mt-5 flex w-full items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl py-2.5 text-xs font-bold transition-all"
                  >
                    <FiTrash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-stone-900 mb-6">Add Katha Vachak</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase">Photo URL</label>
                <input
                  type="text"
                  placeholder="Paste profile photo URL"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase">Specialization</label>
                <input
                  type="text"
                  placeholder="Bhagavad Katha, Shiv Mahapuran"
                  value={specializationInput}
                  onChange={(e) => setSpecializationInput(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                />
                <span className="text-[10px] font-semibold text-stone-400">Separate multiple values with commas.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase">Bio</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-saffron-500 focus:ring-saffron-400 border-stone-300 rounded"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-stone-700 select-none cursor-pointer">
                  Show on customer website
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
                  Save Vachak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
