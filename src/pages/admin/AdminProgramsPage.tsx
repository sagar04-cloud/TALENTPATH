import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  X
} from 'lucide-react';
import { programService } from '../../services/programService';
import { Program, ProgramCategory } from '../../types';

export const AdminProgramsPage = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<ProgramCategory>('undergraduate');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [learningMode, setLearningMode] = useState('Distance & Flexible');
  const [duration, setDuration] = useState('3 Years');
  const [fees, setFees] = useState('Contact Counselor for verified fee schedule');
  const [isPublished, setIsPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  const loadPrograms = async () => {
    try {
      const data = await programService.getPrograms();
      setPrograms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const openCreateModal = () => {
    setEditingProgram(null);
    setTitle('');
    setSlug('');
    setCategory('undergraduate');
    setShortDesc('');
    setFullDesc('');
    setEligibility('');
    setLearningMode('Distance & Flexible');
    setDuration('3 Years');
    setFees('Contact Counselor for verified fee schedule');
    setIsPublished(true);
    setFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (prog: Program) => {
    setEditingProgram(prog);
    setTitle(prog.title);
    setSlug(prog.slug);
    setCategory(prog.category);
    setShortDesc(prog.short_description);
    setFullDesc(prog.full_description);
    setEligibility(prog.eligibility);
    setLearningMode(prog.learning_mode);
    setDuration(prog.duration);
    setFees(prog.fees);
    setIsPublished(prog.is_published);
    setFeatured(prog.featured);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await programService.saveProgram({
      ...(editingProgram ? { id: editingProgram.id } : {}),
      title: title.trim(),
      slug: finalSlug,
      category,
      short_description: shortDesc.trim(),
      full_description: fullDesc.trim(),
      eligibility: eligibility.trim(),
      learning_mode: learningMode.trim(),
      duration: duration.trim(),
      fees: fees.trim(),
      is_published: isPublished,
      featured,
    });

    setIsModalOpen(false);
    await loadPrograms();
  };

  const handleTogglePublish = async (id: string) => {
    await programService.togglePublish(id);
    await loadPrograms();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      await programService.deleteProgram(id);
      await loadPrograms();
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-brand-navy">
            Academic Programs Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit descriptions, adjust eligibility rules, and manage publication states.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Program</span>
        </button>
      </div>

      {/* Program List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-heading text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4">Program Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Duration & Mode</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">Loading programs...</td>
                </tr>
              )}

              {!loading && programs.map((prog) => (
                <tr key={prog.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-brand-navy text-sm block">{prog.title}</span>
                    <span className="text-[11px] text-slate-400 font-mono">/{prog.slug}</span>
                  </td>
                  <td className="p-4 capitalize">{prog.category.replace('_', ' ')}</td>
                  <td className="p-4">
                    <span>{prog.duration}</span>
                    <span className="text-[11px] text-slate-400 block">{prog.learning_mode}</span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(prog.id)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        prog.is_published
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {prog.is_published ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                          Published
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1 text-slate-400" />
                          Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(prog)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-brand-blue hover:bg-slate-100"
                        title="Edit program"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prog.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Program Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-extrabold text-xl text-brand-navy">
                {editingProgram ? 'Edit Academic Program' : 'Create Academic Program'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Program Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Bachelor of Commerce (B.Com)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProgramCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-blue"
                  >
                    <option value="undergraduate">Undergraduate</option>
                    <option value="postgraduate">Postgraduate</option>
                    <option value="diploma">Diploma</option>
                    <option value="sslc_puc">SSLC & PUC</option>
                    <option value="certification">Certification</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description (for cards) *</label>
                <textarea
                  rows={2}
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Curriculum Description *</label>
                <textarea
                  rows={4}
                  required
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                  <input
                    type="text"
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    placeholder="e.g. 10+2 / PUC Passed"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Years"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Learning Mode</label>
                  <input
                    type="text"
                    value={learningMode}
                    onChange={(e) => setLearningMode(e.target.value)}
                    placeholder="e.g. Distance & Blended"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-brand-blue"
                  />
                  <span className="font-bold text-slate-700">Published on Website</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-brand-blue"
                  />
                  <span className="font-bold text-slate-700">Featured on Home Page</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white font-bold"
                >
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
