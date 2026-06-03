'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchEvents, addEvent, deleteEvent, updateEvent } from '@/redux/slices/eventSlice';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { Event } from '@/types';

type EventStatus = Event['status'];

export default function EventsAdminPage() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    kathaType: 'bhagavad-katha',
    description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    status: 'upcoming',
    isFeatured: false,
  });

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      toast.error('Please enter title, description, date, and location');
      return;
    }
    try {
      await dispatch(addEvent(formData)).unwrap();
      toast.success('Event created successfully');
      setShowModal(false);
      setFormData({
        title: '',
        kathaType: 'bhagavad-katha',
        description: '',
        date: '',
        time: '',
        location: '',
        image: '',
        status: 'upcoming',
        isFeatured: false,
      });
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to create event');
    }
  };

  const handleToggleFeatured = async (id: string, currentVal: boolean) => {
    try {
      await dispatch(updateEvent({ id, eventData: { isFeatured: !currentVal } })).unwrap();
      toast.success(`Event featured status updated`);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to update event');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await dispatch(deleteEvent(id)).unwrap();
        toast.success('Event deleted successfully');
      } catch (error) {
        toast.error(typeof error === 'string' ? error : 'Failed to delete event');
      }
    }
  };

  return (
    <div className="admin-card p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h3 className="text-lg font-bold text-stone-900">Manage Spiritual Events</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex w-full items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all sm:w-auto"
        >
          <FiPlus className="w-4 h-4" /> Add New Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-6 text-stone-500 font-bold">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-stone-400 font-semibold">No events registered yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Event Info</th>
                <th className="py-4 px-4">Katha Type</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Featured</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b border-stone-100 hover:bg-stone-50 text-sm font-semibold text-stone-800">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={event.image} alt={event.title} className="w-10 h-10 rounded-lg object-cover border" />
                      <span className="font-bold text-stone-900">{event.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 capitalize">{event.kathaType.replace('-', ' ')}</td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                      {event.time && <span className="text-stone-400 text-xs">{event.time}</span>}
                    </div>
                  </td>
                  <td className="py-4 px-4">{event.location}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleFeatured(event._id, event.isFeatured)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border transition-all ${
                        event.isFeatured
                          ? 'bg-yellow-50 text-yellow-600 border-yellow-100'
                          : 'bg-stone-50 text-stone-400 border-stone-100'
                      }`}
                    >
                      {event.isFeatured ? 'Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="py-4 px-4 capitalize">
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      event.status === 'upcoming'
                        ? 'bg-saffron-50 text-saffron-600 border-saffron-100'
                        : event.status === 'ongoing'
                        ? 'bg-orange-50 text-orange-600 border border-orange-100'
                        : 'bg-stone-100 text-stone-500 border border-stone-200'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                      title="Delete Event"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-stone-900 mb-6">Create New Event</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shrimad Bhagavad Katha Saptah"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Katha Type</label>
                  <select
                    value={formData.kathaType}
                    onChange={(e) => setFormData({ ...formData, kathaType: e.target.value as Event['kathaType'] })}
                    className="w-full px-4 py-2.5 border rounded-xl bg-white focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  >
                    <option value="bhagavad-katha">Bhagavad Katha</option>
                    <option value="ramji-janmotsav">Ramji Janmotsav</option>
                    <option value="shiv-mahapuran">Shiv Mahapuran</option>
                    <option value="sundarkand-path">Sundarkand Path</option>
                    <option value="bhajan-sandhya">Bhajan Sandhya</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Event Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                    className="w-full px-4 py-2.5 border rounded-xl bg-white focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 03:00 PM - 07:00 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vrindavan Dham, UP"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase">Image URL</label>
                <input
                  type="text"
                  placeholder="Paste banner image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe details about the event..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-saffron-500 focus:ring-saffron-400 border-stone-300 rounded"
                />
                <label htmlFor="isFeatured" className="text-xs font-bold text-stone-700 select-none cursor-pointer">
                  Feature this event on home slider banner
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
