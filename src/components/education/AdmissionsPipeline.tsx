import React, { useState, useEffect } from 'react';
import { AdmissionApplication, InstitutionProfile } from '../../types/education';
import { educationService } from '../../services/educationService';
import {
  GraduationCap,
  Building2,
  FileCheck,
  CheckCircle2,
  Clock,
  Send,
  Upload,
  Sparkles,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface AdmissionsPipelineProps {
  preselectedInstitution?: InstitutionProfile | null;
  onPayAcceptanceFee?: (application: AdmissionApplication) => void;
}

export const AdmissionsPipeline: React.FC<AdmissionsPipelineProps> = ({
  preselectedInstitution,
  onPayAcceptanceFee
}) => {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  // Form State for new application
  const [institutionId, setInstitutionId] = useState(preselectedInstitution?.id || 'inst-ng-buk-001');
  const [institutionName, setInstitutionName] = useState(preselectedInstitution?.name || 'Bayero University Kano (BUK)');
  const [programmeName, setProgrammeName] = useState('B.Eng Computer Engineering');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2003-06-15');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const list = await educationService.getAdmissions();
      setApplications(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setStatusMessage('Please complete all mandatory candidate fields.');
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const newApp = await educationService.submitAdmission({
        institutionId,
        institutionName,
        programmeId: 'prog-custom',
        programmeName,
        educationTier: 'tertiary',
        applicantFullName: fullName,
        applicantEmail: email,
        applicantPhone: phone,
        dateOfBirth,
        applicationFeeFiat: 20,
        applicationFeePaid: true,
        applicationFeePi: 0.000063,
        documents: [
          {
            id: `doc-${Date.now()}-1`,
            type: 'previous_transcript',
            fileName: 'Official_Academic_Credentials.pdf',
            fileSizeKb: 650,
            uploadedAt: new Date().toISOString(),
            verificationStatus: 'verified'
          }
        ]
      });

      setStatusMessage(`Application ${newApp.applicationNumber} submitted successfully!`);
      setIsApplying(false);
      setFullName('');
      setEmail('');
      setPhone('');
      await loadApplications();
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to submit admission application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptOffer = async (appId: string) => {
    try {
      const updated = await educationService.acceptOffer(appId);
      await loadApplications();
    } catch (e: any) {
      alert(e.message || 'Failed to accept offer');
    }
  };

  const statusProgress: Record<string, { label: string; color: string }> = {
    DRAFT: { label: 'Draft', color: 'text-slate-400 bg-slate-800' },
    SUBMITTED: { label: 'Submitted', color: 'text-blue-400 bg-blue-950 border-blue-800' },
    UNDER_REVIEW: { label: 'Under Review', color: 'text-amber-400 bg-amber-950 border-amber-800' },
    ADDITIONAL_INFO_REQUIRED: { label: 'Info Required', color: 'text-orange-400 bg-orange-950 border-orange-800' },
    ACCEPTED: { label: 'Accepted', color: 'text-emerald-400 bg-emerald-950 border-emerald-800' },
    OFFER_ISSUED: { label: 'Offer Issued', color: 'text-emerald-300 bg-emerald-900 border-emerald-500 font-bold animate-pulse' },
    OFFER_ACCEPTED: { label: 'Offer Accepted & Confirmed', color: 'text-emerald-400 bg-emerald-950 border-emerald-600' },
    REGISTRATION_COMPLETED: { label: 'Enrolled', color: 'text-teal-400 bg-teal-950 border-teal-800' },
    REJECTED: { label: 'Not Successful', color: 'text-rose-400 bg-rose-950 border-rose-800' }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
              Global Admissions & Enrolment Pipeline
            </span>
            <span className="text-xs text-slate-400">Verifiable Credentials</span>
          </div>
          <h3 className="text-xl font-black text-white mt-1.5">Institution Admissions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover programmes, apply to verified institutions, submit credentials, and track your admission offer.
          </p>
        </div>

        <button
          onClick={() => setIsApplying(!isApplying)}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <GraduationCap className="w-4 h-4" />
          <span>{isApplying ? 'View My Applications' : '+ Submit New Application'}</span>
        </button>
      </div>

      {/* New Application Form */}
      {isApplying ? (
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <span>Submit Admission Application</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Apply directly to an accredited institution with automated credential verification and Pi application fee payment.
            </p>
          </div>

          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Target Institution */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Institution</label>
                <select
                  value={institutionId}
                  onChange={(e) => {
                    setInstitutionId(e.target.value);
                    if (e.target.value === 'inst-ng-buk-001') setInstitutionName('Bayero University Kano (BUK)');
                    else if (e.target.value === 'inst-ng-unilag-002') setInstitutionName('University of Lagos (UNILAG)');
                    else if (e.target.value === 'inst-ng-decagon-006') setInstitutionName('Decagon Software & AI Institute');
                    else setInstitutionName("King's College Lagos");
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="inst-ng-buk-001">Bayero University Kano (BUK) — Federal University</option>
                  <option value="inst-ng-unilag-002">University of Lagos (UNILAG) — Federal University</option>
                  <option value="inst-ng-decagon-006">Decagon Software & AI Institute — Tech Academy</option>
                  <option value="inst-ng-kings-college-004">King's College Lagos — Secondary</option>
                </select>
              </div>

              {/* Programme */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Desired Programme</label>
                <input
                  type="text"
                  value={programmeName}
                  onChange={(e) => setProgrammeName(e.target.value)}
                  placeholder="e.g., B.Eng Computer Engineering"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Candidate Full Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Applicant Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Aliyu Mohammed Bello"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Applicant Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., aliyu.bello@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +234 803 123 4567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Document Upload Notice */}
            <div className="bg-slate-950 p-4 rounded-xl border border-dashed border-slate-700 text-xs text-center space-y-2">
              <Upload className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-slate-300 font-semibold">Supporting Academic Documents Attached</p>
              <p className="text-[11px] text-slate-500">
                Verified O-Level results / Undergrad Transcript / Identification documents will be securely submitted with cryptographic verification hash.
              </p>
            </div>

            {/* Application Fee Notice */}
            <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl flex justify-between items-center text-xs">
              <span className="text-slate-300">Standard Institution Processing Fee:</span>
              <span className="text-amber-400 font-bold font-mono">$20.00 USD (0.000063 π)</span>
            </div>

            {statusMessage && (
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-300">
                {statusMessage}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsApplying(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting Application...' : 'Submit & Pay Fee with Pi'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Applications List */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Active Admissions Applications ({applications.length})</span>
        </h4>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-32 animate-pulse" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No active applications found. Click "+ Submit New Application" above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const statusCfg = statusProgress[app.status] || {
                label: app.status,
                color: 'text-slate-300 bg-slate-800'
              };
              const hasOffer = app.status === 'OFFER_ISSUED';
              const isAccepted = app.status === 'OFFER_ACCEPTED';

              return (
                <div
                  key={app.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4 transition"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-400 font-semibold">{app.applicationNumber}</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">{app.programmeName}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        <span>{app.institutionName}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right text-xs">
                      <span className="text-slate-400 block">Candidate</span>
                      <span className="font-semibold text-white">{app.applicantFullName}</span>
                      <span className="text-[11px] text-slate-400 block">{app.applicantEmail}</span>
                    </div>
                  </div>

                  {/* Documents & Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Submitted On</span>
                      <span className="text-slate-300 font-medium">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Application Fee</span>
                      <span className="text-emerald-400 font-semibold font-mono">
                        ${app.applicationFeeFiat} USD (Paid via Pi)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Documents</span>
                      <span className="text-slate-300 font-medium">{app.documents.length} Files Attached</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Decision Timeline</span>
                      <span className="text-slate-300 font-medium">
                        {hasOffer ? 'Offer Available' : isAccepted ? 'Enrolment Final' : 'Estimated 5-7 Days'}
                      </span>
                    </div>
                  </div>

                  {/* Offer Details if Issued */}
                  {hasOffer && app.offerDetails && (
                    <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                            <Sparkles className="w-4 h-4" />
                            <span>Provisional Admission Offer Issued</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">
                            Congratulations! {app.institutionName} has offered you admission into {app.programmeName}.
                          </p>
                        </div>

                        <div className="text-right text-xs">
                          <span className="text-slate-400 block">Acceptance Fee</span>
                          <span className="font-bold text-amber-400 font-mono">
                            ${app.offerDetails.acceptanceFeeFiat} USD
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1 border-t border-emerald-900/60">
                        <button
                          onClick={() => handleAcceptOffer(app.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Offer & Settle Acceptance Fee</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {isAccepted && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-emerald-600/30 flex items-center justify-between text-xs text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Admission Confirmed & Matriculation Registration Initiated</span>
                      </span>
                      <span className="font-mono text-slate-400">STATUS: VERIFIED</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
