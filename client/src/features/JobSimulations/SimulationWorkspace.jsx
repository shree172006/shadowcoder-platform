import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, CheckCircle, AlertCircle, Loader2, FileArchive, Briefcase } from 'lucide-react';
import DesktopOnly from '../../layouts/DesktopOnly';

export default function SimulationWorkspace() {
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [scorecard, setScorecard] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsEvaluating(true);
    setScorecard(null);
    setTimeout(() => {
      setScorecard({
        status: 'PASSED',
        score: 100,
        feedback: [
          "Architecture: The deterministic calculation efficiently bypassed the race condition.",
          "Code Quality: Clean, well-documented, and modular."
        ]
      });
      setIsEvaluating(false);
    }, 2500);
  };

  return (
    <DesktopOnly backLink="/simulations" backText="Back to Job Simulations">
      {/* 💥 ADDED: dark:bg-[#0d1117] and dark:text-white */}
      <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-[#0d1117] w-full h-screen overflow-y-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in">
          
          <Link to="/simulations" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold mb-8 transition-colors">
            <ArrowLeft size={18} /> Back to Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                  <Briefcase size={24} />
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-black text-xs tracking-widest uppercase">Software Engineer</span>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Task: {id}</h1>
                </div>
              </div>
              
              <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                <p className="text-slate-600 dark:text-slate-300 lead">
                  A race condition is causing cart totals to desync during checkout. Your task is to write a deterministic calculation function to fix the pipeline.
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Instructions</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-2 font-medium">
                  <li>Clone the provided starter repository locally.</li>
                  <li>Locate the <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1 rounded">payment.js</code> file in the core directory.</li>
                  <li>Implement the <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1 rounded">calculateDesync(a, b)</code> function without altering the surrounding API wrappers.</li>
                  <li>Run your local tests. Once passing, compress your entire project directory into a <strong>.zip</strong> file.</li>
                  <li>Upload the .zip file here for automated Senior Engineer (AI) review.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              
              <div className="bg-white dark:bg-[#161b22] p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center transition-colors">
                <div className="flex justify-center mb-6">
                  {selectedFile ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-4 border-blue-100 dark:border-blue-800/30 p-6 rounded-full text-blue-600 dark:text-blue-400">
                      <FileArchive size={48} />
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800/50 border-4 border-slate-100 dark:border-slate-700 p-6 rounded-full text-slate-400 dark:text-slate-500">
                      <UploadCloud size={48} />
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {selectedFile ? selectedFile.name : 'Upload Workspace'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB ready for evaluation.` : 'Upload your completed project as a .zip file.'}
                </p>
                
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
                  <label className="cursor-pointer w-full bg-white dark:bg-[#0d1117] border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <span>Browse Local Files</span>
                    <input type="file" accept=".zip" onChange={handleFileChange} className="hidden" />
                  </label>

                  <button 
                    type="submit"
                    disabled={!selectedFile || isEvaluating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isEvaluating ? <><Loader2 className="animate-spin" size={20} /> Analyzing Architecture...</> : 'Submit for AI Review'}
                  </button>
                </form>
              </div>

              {scorecard && (
                <div className={`p-8 rounded-3xl border-2 animate-in slide-in-from-bottom-4 fade-in ${scorecard.status === 'PASSED' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                  <div className="flex items-center gap-4 mb-6 border-b pb-6 border-black/10 dark:border-white/10">
                    {scorecard.status === 'PASSED' ? (
                      <CheckCircle className="text-emerald-600 dark:text-emerald-400 shrink-0" size={40} />
                    ) : (
                      <AlertCircle className="text-red-600 dark:text-red-400 shrink-0" size={40} />
                    )}
                    <div>
                      <h2 className={`text-3xl font-black tracking-tight ${scorecard.status === 'PASSED' ? 'text-emerald-900 dark:text-emerald-300' : 'text-red-900 dark:text-red-300'}`}>
                        {scorecard.status}
                      </h2>
                      <p className={`font-bold text-lg mt-1 ${scorecard.status === 'PASSED' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                        Final Score: {scorecard.score} / 100
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-3">AI Senior Engineer Feedback:</h4>
                    <ul className="space-y-3">
                      {scorecard.feedback.map((msg, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                          <span className="mt-2 w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full shrink-0"></span>
                          {msg}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </DesktopOnly>
  );
}