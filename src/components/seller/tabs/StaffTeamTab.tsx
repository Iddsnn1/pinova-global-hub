import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { StaffMember, StaffRole, PiUser as User } from '../../../types';
import { vendorAuthenticatedFetch } from '../../../lib/vendorAuthBridge';

interface StaffTeamTabProps {
  user: User;
  serverStatus: {
    status: string;
    verified: boolean;
  };
}

export const StaffTeamTab: React.FC<StaffTeamTabProps> = ({
  user,
  serverStatus
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<StaffRole>('manager');
  const [inviteNotice, setInviteNotice] = useState<string | null>(null);

  // Authenticated store owner is always primary
  const ownerStaff: StaffMember = {
    id: `staff-owner-${user.uid || 'owner'}`,
    name: user.username ? `@${user.username}` : 'Store Owner',
    email: (user as any)?.email || `${user.username || 'merchant'}@pinova.hub`,
    role: 'owner',
    permissions: ['all_permissions', 'manage_store', 'manage_products', 'manage_orders', 'view_finances', 'manage_staff'],
    joinedAt: new Date().toISOString(),
    status: 'active'
  };

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await vendorAuthenticatedFetch('/api/vendor/team');
        const data = await res.json().catch(() => null);
        if (!cancelled && res.ok && Array.isArray(data?.staff)) setStaffList(data.staff);
        if (!cancelled && !res.ok) setInviteNotice(data?.message || 'Unable to load the team roster.');
      } catch {
        if (!cancelled) setInviteNotice('Unable to load the team roster from the server.');
      } finally {
        if (!cancelled) setStaffLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    try {
      const res = await vendorAuthenticatedFetch('/api/vendor/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inviteName.trim(),
          email: inviteEmail.trim(),
          role: inviteRole
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.member) {
        setInviteNotice(data?.message || 'Unable to record the team invitation.');
        return;
      }

      setStaffList(prev => [...prev, data.member]);
      setInviteNotice(`Invitation recorded securely for ${inviteEmail.trim()} as ${inviteRole.toUpperCase()}.`);
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteName('');
        setInviteEmail('');
        setInviteNotice(null);
      }, 1800);
    } catch {
      setInviteNotice('Unable to reach the merchant team service.');
    }
  };

  return (
    <div className="space-y-6" id="staff-team-tab">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                Access Control & Governance
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                RBAC Security
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Staff & Team (RBAC)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Role-based access control for team members, catalog operators, warehouse staff, and finance managers.
            </p>
          </div>

          <button
            id="invite-staff-member-btn"
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0 min-h-[44px]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* Staff Roster */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-purple-600" />
          Authorized Team Roster
        </h3>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {/* Primary Owner (Always Authoritative) */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">
                {user.username?.charAt(0).toUpperCase() || 'M'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {ownerStaff.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300">
                    Store Owner
                  </span>
                </div>
                <span className="text-xs text-neutral-500 block">
                  {ownerStaff.email}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:self-center">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Root Authority
              </span>
            </div>
          </div>

          {/* Invited Staff Members */}
          {staffLoading ? (
            <div className="py-8 text-center text-xs text-neutral-500">Loading server-authoritative team roster…</div>
          ) : staffList.map((member) => (
            <div key={member.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold flex items-center justify-center shrink-0">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {member.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase">
                      {member.role}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500 block">
                    {member.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Invitation Pending
                </span>
              </div>
            </div>
          ))}
        </div>

        {staffList.length === 0 && (
          /* Truthful Empty State */
          <div className="text-center py-8 px-4 border-t border-neutral-100 dark:border-neutral-800 mt-4">
            <Users className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-700 mb-2" />
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100">
              No staff members added yet.
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1">
              Add team members to delegate store operations safely. Invitations are stored server-side and do not grant access until an activation flow is completed.
            </p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-600" />
              Invite Team Member
            </h3>

            {inviteNotice && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-700 dark:text-purple-300">
                {inviteNotice}
              </div>
            )}

            <form onSubmit={handleInviteStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name / Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alice Chen"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alice@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Role Assignment *
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as StaffRole)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="manager">Manager (Catalog, Orders, Operations)</option>
                  <option value="admin">Administrator (Full Access except Ownership)</option>
                  <option value="sales">Sales & CRM Operator</option>
                  <option value="support">Customer Support Agent</option>
                  <option value="warehouse">Warehouse & Stock Fulfillment</option>
                  <option value="finance">Finance & Accounting Auditor</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold min-h-[44px]"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
