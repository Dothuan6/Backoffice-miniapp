import React, { useState, useMemo } from 'react';
import { Search, Eye, Edit2, ChevronDown, Check, X, ShieldAlert, FileDown, ArrowDown } from 'lucide-react';
import { User } from '../types';

interface UsersViewProps {
  users: User[];
  onViewProfile: (username: string) => void;
  onEditUserClick: (user: User) => void;
  onExportCsv: () => void;
  showExportToast: boolean;
  setShowExportToast: (show: boolean) => void;
}

export default function UsersView({
  users,
  onViewProfile,
  onEditUserClick,
  onExportCsv,
  showExportToast,
  setShowExportToast
}: UsersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter users by search input (Telegram ID or Username)
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.telegramId.includes(searchQuery) ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [users, searchQuery]);

  // Sort by Telegram ID
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const numA = parseInt(a.telegramId) || 0;
      const numB = parseInt(b.telegramId) || 0;
      return sortDirection === 'desc' ? numB - numA : numA - numB;
    });
  }, [filteredUsers, sortDirection]);

  // Handle Pagination variables
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedUsers, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage) || 1;

  // Render Balance Badge with proper colors matching screens
  const renderBalanceBadge = (balance: number) => {
    let colorClasses = '';
    if (balance > 5000) {
      colorClasses = 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30';
    } else if (balance >= 1000) {
      colorClasses = 'bg-amber-950/40 text-amber-400 border border-amber-500/25';
    } else {
      colorClasses = 'bg-rose-950/40 text-rose-400 border border-rose-500/25';
    }

    return (
      <span className={`px-2.5 py-1 rounded font-mono text-xs font-semibold select-none ${colorClasses}`}>
        {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CU
      </span>
    );
  };

  return (
    <div className="space-y-6" id="users-view-panel">
      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="users-view-hdr">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">User Management</h2>
          <span className="bg-[#1e2638] text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
            {users.length} total
          </span>
        </div>

        {/* Filter Selection Controls */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Dropdown Selector */}
          <div className="relative inline-block text-left">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-[#121824] hover:bg-[#1a2336] text-slate-350 border border-[#1e2638] rounded-lg pl-3 pr-8 py-2 text-xs font-mono appearance-none cursor-pointer focus:outline-none transition-colors"
            >
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>All Time</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Export action */}
          <button
            id="export-csv-btn"
            onClick={onExportCsv}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-colors shadow-md cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Primary Table & Grid Container */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden shadow-xl" id="users-table-container">
        {/* Toolbar inside card */}
        <div className="p-4 border-b border-[#1e2638] bg-[#0c101a] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search telegram_id/username..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset page on search
              }}
              className="w-full bg-[#121824] border border-[#1e2638] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-505 focus:outline-none focus:border-blue-500 font-mono"
            />
            {searchQuery && (
              <X
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-200"
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
        </div>

        {/* The User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="user-management-table">
            <thead>
              <tr className="bg-[#121824] border-b border-[#1e2638] text-[11px] font-mono tracking-wider text-slate-400 select-none">
                <th className="py-3.5 px-4 md:px-6 font-semibold whitespace-nowrap">USER (USERNAME/NAME)</th>
                <th
                  onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                  className="py-3.5 px-4 md:px-6 font-semibold cursor-pointer hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>TELEGRAM ID</span>
                    <ArrowDown className={`w-3.5 h-3.5 text-blue-500 transition-transform ${sortDirection === 'asc' ? 'rotate-185' : ''}`} />
                  </div>
                </th>
                <th className="py-3.5 px-4 md:px-6 font-semibold whitespace-nowrap">CU BALANCE</th>
                <th className="py-3.5 px-4 md:px-6 font-semibold whitespace-nowrap">JOINED</th>
                <th className="py-3.5 px-4 md:px-6 text-right font-semibold whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638]">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((u) => (
                  <tr
                    key={u.username}
                    id={`user-row-${u.username.replace('@', '')}`}
                    className="hover:bg-[#161d2d]/45 group transition-colors duration-150"
                  >
                    {/* User profile with avatar and details */}
                    <td className="py-4 px-4 md:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 group-hover:border-blue-500/50 transition-colors"
                            referrerPolicy="no-referrer"
                          />
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#121824] ${
                            u.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-500'
                          }`}></span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors cursor-pointer" onClick={() => onViewProfile(u.username)}>
                            {u.name}
                          </div>
                          <span className="text-xs text-slate-400 font-mono block mt-0.5">{u.username}</span>
                        </div>
                      </div>
                    </td>

                    {/* Telegram ID */}
                    <td className="py-4 px-4 md:px-6 text-sm font-mono text-slate-300 whitespace-nowrap">
                      {u.telegramId}
                    </td>

                    {/* CU Balance Badge */}
                    <td className="py-4 px-4 md:px-6 whitespace-nowrap">
                      {renderBalanceBadge(u.cuBalance)}
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-4 md:px-6 text-sm text-slate-350 whitespace-nowrap">
                      {u.joinedDate}
                    </td>

                    {/* Actions Panel */}
                    <td className="py-4 px-4 md:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          id={`view-btn-${u.username.replace('@', '')}`}
                          onClick={() => onViewProfile(u.username)}
                          title="View user details"
                          className="w-8 h-8 min-h-0 rounded bg-slate-800/60 border border-[#1e2638] flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`edit-btn-${u.username.replace('@', '')}`}
                          onClick={() => onEditUserClick(u)}
                          title="Adjust user balance"
                          className="w-8 h-8 min-h-0 rounded bg-slate-800/60 border border-[#1e2638] flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    <div className="text-sm font-mono">No users found matching your search.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination controls */}
        <div className="p-4 border-t border-[#1e2638] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-400 font-mono" id="users-table-footer">
          {/* Item count summary */}
          <div>
            Showing {filteredUsers.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
            {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </div>

          <div className="flex items-center gap-6 self-end sm:self-auto">
            {/* Rows Per Page Choice */}
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-transparent border border-[#1e2638] rounded px-2 pr-6 py-1 appearance-none cursor-pointer text-slate-300 focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <ChevronDown className="absolute right-1 w-3 h-3 text-slate-500 pointer-events-none top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5" id="pagination-buttons">
              <button
                id="pagination-prev"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 rounded border border-[#1e2638] hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, id) => {
                const pageNum = id + 1;
                // Only show current, first, last, and buffer to prevent massive lists
                if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                  return (
                    <button
                      key={pageNum}
                      id={`pagination-page-${pageNum}`}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white font-bold'
                          : 'border border-[#1e2638] text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return <span key={pageNum} className="px-1 text-slate-600">...</span>;
                }
                return null;
              })}
              <button
                id="pagination-next"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 rounded border border-[#1e2638] hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification for CSV Export */}
      {showExportToast && (
        <div
          id="export-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#162723] hover:bg-[#1a2f2a] text-slate-100 px-4 py-3.5 rounded-lg border border-emerald-500/25 shadow-xl flex items-start gap-3 max-w-sm animate-fade-in transition-all"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-505/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-bold font-sans text-slate-100">Export Prepared</h4>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide leading-relaxed">
              User list CSV is ready for download.
            </p>
          </div>
          <button
            id="dismiss-export-toast"
            onClick={() => setShowExportToast(false)}
            className="text-slate-500 hover:text-slate-300 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
