import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  MessageCircle, 
  Phone, 
  Calendar, 
  X, 
  Send, 
  Building2
} from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { Enquiry, EnquiryStatus } from '../../types';

export const AdminLeadsPage = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [activeLead, setActiveLead] = useState<Enquiry | null>(null);

  // Modal interaction state
  const [newStatus, setNewStatus] = useState<EnquiryStatus>('new');
  const [assignedTo, setAssignedTo] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates (Firebase Firestore or reactive local cache)
    const unsubscribe = enquiryService.subscribeToEnquiries(
      {
        search,
        status: statusFilter,
        service_type: serviceFilter
      },
      (data) => {
        setEnquiries(data);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [search, statusFilter, serviceFilter]);

  const openLeadModal = (lead: Enquiry) => {
    setActiveLead(lead);
    setNewStatus(lead.status);
    setAssignedTo(lead.assigned_to || '');
    setFollowUpDate(lead.follow_up_date || '');
    setNoteContent('');
  };

  const refreshLeads = async () => {
    const data = await enquiryService.getEnquiries({
      search,
      status: statusFilter,
      service_type: serviceFilter
    });
    setEnquiries(data);
  };

  const handleUpdateLeadStatus = async () => {
    if (!activeLead) return;
    setStatusSaving(true);
    try {
      await enquiryService.updateStatus(activeLead.id, newStatus, assignedTo, followUpDate);
      await refreshLeads();
      // Update modal state
      const updated = await enquiryService.getEnquiryById(activeLead.id);
      if (updated) setActiveLead(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setStatusSaving(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead || !noteContent.trim()) return;

    try {
      await enquiryService.addNote(activeLead.id, 'Counselor / Admin', noteContent.trim());
      setNoteContent('');
      await refreshLeads();
      const updated = await enquiryService.getEnquiryById(activeLead.id);
      if (updated) setActiveLead(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    contacted: 'bg-amber-100 text-amber-800 border-amber-200',
    qualified: 'bg-purple-100 text-purple-800 border-purple-200',
    follow_up: 'bg-orange-100 text-orange-800 border-orange-200',
    converted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    closed: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="font-heading font-extrabold text-2xl text-brand-navy">
              Lead & Enquiry Management
            </h1>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Real-Time Stream</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            View, track follow-ups, and update CRM statuses with real-time Firebase synchronization.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => enquiryService.exportToCSV(enquiries)}
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-soft-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-2 text-brand-blue" />
            <span>Export Authorized CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, phone, email, organization, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:border-brand-blue"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="follow_up">Follow-up Required</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>

        {/* Service Filter */}
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:border-brand-blue"
        >
          <option value="all">All Services</option>
          <option value="admission">Admission Enquiry</option>
          <option value="career_guidance">Career Guidance</option>
          <option value="flexible_learning">Flexible Learning</option>
          <option value="sslc_puc">SSLC & PUC</option>
          <option value="recruitment">Recruitment</option>
          <option value="general">General Contact</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-heading text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4">Ref ID / Date</th>
                <th className="p-4">Candidate / Org</th>
                <th className="p-4">Service & Requirement</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned / Follow-up</th>
                <th className="p-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading CRM leads...
                  </td>
                </tr>
              )}

              {!loading && enquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No leads found matching current filters.
                  </td>
                </tr>
              )}

              {!loading && enquiries.map((lead) => {
                if (!lead) return null;
                const leadPhone = lead.phone || '';
                const cleanPhone = leadPhone.replace(/[^0-9]/g, '');
                const leadName = lead.full_name || 'Candidate';
                const leadService = lead.service_type || 'general';
                const leadStatus = lead.status || 'new';
                const waChatUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${leadName}, this is Talent Path Solutions regarding your enquiry for ${lead.interested_program || leadService}.`)}`;

                const createdAtDate = lead.created_at ? new Date(lead.created_at) : new Date();
                const displayDate = !isNaN(createdAtDate.getTime())
                  ? `${createdAtDate.toLocaleDateString()} ${createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Recent';

                return (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID & Date */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-brand-navy block">
                        {lead.id}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {displayDate}
                      </span>
                    </td>

                    {/* Candidate */}
                    <td className="p-4">
                      <span className="font-bold text-brand-navy block text-sm">
                        {leadName}
                      </span>
                      {lead.organization_name && (
                        <span className="text-[11px] text-slate-500 flex items-center mt-0.5 font-medium">
                          <Building2 className="w-3 h-3 mr-1 text-slate-400" />
                          {lead.organization_name}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {lead.email || 'No email'} • {lead.city_district || 'City not stated'}
                      </span>
                    </td>

                    {/* Service & Requirement */}
                    <td className="p-4 max-w-xs">
                      <span className="font-semibold text-brand-blue block capitalize">
                        {leadService.replace('_', ' ')}
                      </span>
                      <p className="text-[11px] text-slate-600 truncate mt-0.5">
                        {lead.interested_program || lead.recruitment_requirement || lead.area_of_interest || lead.message || 'Consultation'}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusColors[leadStatus] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                        {leadStatus.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Assigned */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-700 block">
                        {lead.assigned_to || 'Unassigned'}
                      </span>
                      {lead.follow_up_date && (
                        <span className="text-[10px] text-amber-600 flex items-center mt-0.5">
                          <Calendar className="w-3 h-3 mr-1" />
                          {lead.follow_up_date}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        {/* WhatsApp quick trigger */}
                        <a
                          href={waChatUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        {/* Phone call trigger */}
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-brand-blue transition-colors"
                          title="Call Candidate"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        {/* Open Lead Details Modal */}
                        <button
                          onClick={() => openLeadModal(lead)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-navy hover:text-white text-slate-700 font-semibold text-[11px] transition-colors"
                        >
                          Details & Notes
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details & CRM Drawer Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left space-y-6 relative max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-slate-400">
                  {activeLead.id}
                </span>
                <h3 className="font-heading font-extrabold text-xl text-brand-navy mt-1">
                  {activeLead.full_name}
                </h3>
                <p className="text-xs text-slate-500">
                  Source: {activeLead.source_page || '/'} • Submitted: {new Date(activeLead.created_at).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setActiveLead(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lead Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Contact Info</p>
                <p className="font-semibold text-brand-navy">Phone: {activeLead.phone || 'Not provided'}</p>
                <p className="text-slate-600">Email: {activeLead.email || 'Not provided'}</p>
                <p className="text-slate-600">City / District: {activeLead.city_district || 'Not provided'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Service Category</p>
                <p className="font-semibold text-brand-blue capitalize">{(activeLead.service_type || 'general').replace('_', ' ')}</p>
                {activeLead.interested_program && <p className="text-slate-700">Program: {activeLead.interested_program}</p>}
                {activeLead.education_level && <p className="text-slate-700">Qualification: {activeLead.education_level}</p>}
                {activeLead.learning_mode && <p className="text-slate-700">Mode: {activeLead.learning_mode}</p>}
                {activeLead.organization_name && <p className="text-slate-700">Company: {activeLead.organization_name}</p>}
                {activeLead.number_of_positions && <p className="text-slate-700">Positions: {activeLead.number_of_positions}</p>}
              </div>
            </div>

            {/* Message Body */}
            {activeLead.message && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">Message from Lead:</p>
                <p className="text-slate-700 leading-relaxed italic">"{activeLead.message}"</p>
              </div>
            )}

            {/* Status & Assignment Update Controls */}
            <div className="p-5 rounded-2xl bg-brand-bgLight border border-brand-borderLight space-y-4">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-navy">
                Update CRM Lead Status & Ownership
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as EnquiryStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-brand-blue"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="follow_up">Follow-up Required</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Assigned Owner</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Counselor"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={handleUpdateLeadStatus}
                  disabled={statusSaving}
                  className="px-5 py-2 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {statusSaving ? 'Saving...' : 'Save Lead Updates'}
                </button>
              </div>
            </div>

            {/* Internal Notes Thread */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-brand-navy">
                Internal Counselor Notes ({activeLead.notes?.length || 0})
              </h4>

              {activeLead.notes && activeLead.notes.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeLead.notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-600">{note.author}</span>
                        <span>{new Date(note.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No notes added yet for this candidate.</p>
              )}

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add internal counselor note or call summary..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold transition-colors flex items-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Add Note</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
