import React, { useState } from 'react';
import CertificateModal from '../components/CertificateModal';
import { COURSES } from '../data/mockData';
import { Award, ShieldCheck, Search, CheckCircle2, Printer, Sparkles, ExternalLink } from 'lucide-react';

export default function CertificatesPage() {
  const [verifyCodeInput, setVerifyCodeInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [selectedCertCourse, setSelectedCertCourse] = useState(null);

  const sampleCertificates = [
    {
      id: 'cert-1',
      course: COURSES[3], // Past Paper Masterclass
      issuedDate: '2026-08-01',
      code: 'SWT-2026-THISULA-9841',
      studentName: 'Nipuni Fernando'
    },
    {
      id: 'cert-2',
      course: COURSES[0], // Biology Cell System
      issuedDate: '2026-07-25',
      code: 'SWT-2026-THISULA-4102',
      studentName: 'Nipuni Fernando'
    }
  ];

  const handleVerifyLookup = (e) => {
    e.preventDefault();
    if (!verifyCodeInput.trim()) return;

    const matched = sampleCertificates.find(c => c.code.toLowerCase() === verifyCodeInput.trim().toLowerCase());
    if (matched) {
      setVerificationResult({
        valid: true,
        data: matched
      });
    } else {
      setVerificationResult({
        valid: false,
        code: verifyCodeInput
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Authentic Science Diplomas
          </div>
          <h1 className="text-3xl font-bold font-heading">
            Student Certificates & Public Verification
          </h1>
          <p className="text-xs text-slate-300">
            Verify official G.C.E. O/L Science achievement credentials issued by Lecturer Thisula.
          </p>
        </div>
      </div>

      {/* Public Verification Lookup Tool */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="max-w-xl space-y-2">
          <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Public Certificate Authenticity Verification</span>
          </h2>
          <p className="text-xs text-slate-500">
            Enter any 16-character certificate verification code to verify student transcript authenticity.
          </p>
        </div>

        <form onSubmit={handleVerifyLookup} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={verifyCodeInput}
              onChange={e => setVerifyCodeInput(e.target.value)}
              placeholder="e.g., SWT-2026-THISULA-9841"
              className="w-full pl-10 pr-4 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow"
          >
            Verify Certificate
          </button>
        </form>

        {/* Verification Result Banner */}
        {verificationResult && (
          <div className={`p-4 rounded-2xl border text-xs max-w-xl ${
            verificationResult.valid
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200'
          }`}>
            {verificationResult.valid ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Verified Authentic Certificate</span>
                </div>
                <p>Issued to: <strong>{verificationResult.data.studentName}</strong></p>
                <p>Course: <strong>{verificationResult.data.course.title}</strong></p>
                <p>Code: <code className="font-mono bg-emerald-200 dark:bg-emerald-900 px-1 py-0.5 rounded">{verificationResult.data.code}</code></p>
                <button
                  onClick={() => setSelectedCertCourse(verificationResult.data.course)}
                  className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 underline inline-flex items-center gap-1"
                >
                  <span>View Printable Diploma</span> <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div>
                <strong>Invalid Certificate Code</strong>
                <p className="mt-1">No certificate matching "{verificationResult.code}" was found in the ScienceWithThisula register.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Earned Certificates Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
          My Earned Science Certificates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleCertificates.map(cert => (
            <div key={cert.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Passed & Certified</span>
                  <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white line-clamp-1">
                    {cert.course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-mono">Issued Code: {cert.code}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 text-xs">
                <span className="text-slate-400 font-mono">Issued: {cert.issuedDate}</span>
                <button
                  onClick={() => setSelectedCertCourse(cert.course)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> View Diploma
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCertCourse && (
        <CertificateModal
          course={selectedCertCourse}
          onClose={() => setSelectedCertCourse(null)}
        />
      )}

    </div>
  );
}
