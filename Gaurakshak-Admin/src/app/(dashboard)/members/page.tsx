'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchMembers, updateMemberStatus } from '@/redux/slices/memberSlice';
import { toast } from 'react-hot-toast';
import { FiCheck, FiX, FiUser } from 'react-icons/fi';

const PLAN_COLORS: Record<string, string> = {
  basic: 'bg-stone-50 text-stone-600 border-stone-200',
  silver: 'bg-slate-50 text-slate-600 border-slate-200',
  gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  platinum: 'bg-purple-50 text-purple-600 border-purple-200',
};

export default function MembersAdminPage() {
  const dispatch = useAppDispatch();
  const { members, loading } = useAppSelector((state) => state.members);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleUpdateStatus = (id: string, status: 'approved' | 'rejected') => {
    dispatch(updateMemberStatus({ id, status })).then(() => {
      toast.success(`Membership ${status} successfully`);
    });
  };

  return (
    <div className="admin-card p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h3 className="text-lg font-bold text-stone-900">Membership Requests</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-stone-400">
          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Pending: {members.filter(m => m.status === 'pending').length}
          <span className="ml-2 w-2 h-2 rounded-full bg-green-400 inline-block" /> Approved: {members.filter(m => m.status === 'approved').length}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-6 text-stone-500 font-bold">Loading members...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 text-stone-400 font-semibold flex flex-col items-center gap-3">
          <FiUser className="w-10 h-10" />
          <p>No membership requests received yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Member Details</th>
                <th className="py-4 px-4">City</th>
                <th className="py-4 px-4">Plan</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Applied On</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} className="border-b border-stone-100 hover:bg-stone-50 text-sm font-semibold text-stone-800">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-saffron-50 rounded-full flex items-center justify-center text-saffron-600 font-bold text-sm border border-saffron-100">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-stone-900">{member.name}</span>
                        <span className="text-stone-400 text-xs">{member.phone} {member.email && `• ${member.email}`}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{member.city || '-'}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${PLAN_COLORS[member.membershipType] || PLAN_COLORS.basic}`}>
                      {member.membershipType}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      member.status === 'pending'
                        ? 'bg-orange-50 text-orange-600 border border-orange-100'
                        : member.status === 'approved'
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-stone-500 text-xs">
                    {new Date(member.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {member.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdateStatus(member._id, 'approved')}
                          className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all"
                          title="Approve Member"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(member._id, 'rejected')}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                          title="Reject Member"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {member.status !== 'pending' && (
                      <span className="text-stone-400 text-xs font-bold">—</span>
                    )}
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
