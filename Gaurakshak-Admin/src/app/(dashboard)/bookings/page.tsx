'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchBookings, updateBookingStatus, deleteBooking } from '@/redux/slices/bookingSlice';
import { toast } from 'react-hot-toast';
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

export default function BookingsAdminPage() {
  const dispatch = useAppDispatch();
  const { bookings, loading } = useAppSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleUpdateStatus = (id: string, status: 'confirmed' | 'rejected') => {
    dispatch(updateBookingStatus({ id, status })).then(() => {
      toast.success(`Booking request marked as ${status}`);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this booking inquiry?')) {
      dispatch(deleteBooking(id)).then(() => {
        toast.success('Booking inquiry deleted');
      });
    }
  };

  return (
    <div className="admin-card p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h3 className="text-lg font-bold text-stone-900">Manage Booking Inquiries</h3>
      </div>

      {loading ? (
        <div className="text-center py-6 text-stone-500 font-bold">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 text-stone-400 font-semibold">No booking inquiries registered.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Devotee Details</th>
                <th className="py-4 px-4">Katha Type</th>
                <th className="py-4 px-4">Proposed Date</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-stone-100 hover:bg-stone-50 text-sm font-semibold text-stone-800">
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-stone-900">{booking.name}</span>
                      <span className="text-stone-400 text-xs">{booking.phone} {booking.email && `| ${booking.email}`}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 capitalize">{booking.kathaType.replace('-', ' ')}</td>
                  <td className="py-4 px-4">{new Date(booking.eventDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                  <td className="py-4 px-4">{booking.location}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      booking.status === 'pending'
                        ? 'bg-orange-50 text-orange-600 border border-orange-100'
                        : booking.status === 'confirmed'
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all"
                            title="Confirm Booking"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                            title="Reject Booking"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="p-2 bg-stone-50 hover:bg-stone-200 text-stone-600 rounded-xl transition-all"
                        title="Delete Inquiry"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
