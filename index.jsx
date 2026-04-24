import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  Activity, 
  Printer,
  Microscope,
  Fingerprint,
  Users,
  Heart,
  AlertCircle,
  Sparkles,
  Terminal,
  ChevronRight,
  Info,
  Beaker,
  FlaskConical,
  Search,
  Scale,
  FileText,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const apiKey = ""; // API Key disediakan oleh lingkungan eksekusi

const App = () => {
  const [activeTab, setActiveTab] = useState('forensic'); // 'forensic' atau 'kinship'
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState("");

  // State untuk Input Lab
  const [labInput, setLabInput] = useState({
    patientName: '',
    sampleType: 'Darah', 
    compareName: '', 
    compareType: 'Rambut',
    manualPercentage: '' 
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const sampleOptions = ["Darah", "Rambut", "Kuku", "Kulit", "Saliva", "Sperma", "Jaringan Otot", "Cairan Tubuh"];

  const callGemini = async (prompt, systemInstruction = "") => {
    let delay = 1000;
    for (let i = 0; i < 5; i++) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
          })
        });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (error) {
        if (i === 4) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  };

  const getAiForensicExpertOpine = async () => {
    if (!analysisResult) return;
    setIsAiLoading(true);
    setAiInsight("");
    
    const modeText = activeTab === 'forensic' ? "Analisis Identitas Forensik (Criminal Case)" : "Uji Hubungan Biologis / Kekerabatan";
    const prompt = `Analisis hasil laboratorium ${modeText} berikut:
    ${activeTab === 'forensic' ? `Subjek/Tersangka: ${labInput.patientName} (${labInput.sampleType})\nSampel Bukti (TKP): ${labInput.compareName} (${labInput.compareType})` : `Subjek 1: ${labInput.patientName} (${labInput.sampleType})\nSubjek 2: ${labInput.compareName} (${labInput.compareType})`}
    Hasil Kecocokan: ${analysisResult.percentage}%
    Status: ${analysisResult.relationship}
    Vonis: ${analysisResult.verdict}
    
    Tugas Anda:
    1. Buat laporan narasi ISO/IEC 17025 yang sangat profesional.
    2. Berikan opini ahli mengenai validitas sampel.
    3. Hubungan Keluarga: Jika > 60%, jelaskan secara genetik kedekatan mereka. Jika < 60%, jelaskan mengapa ini tidak memenuhi kriteria inklusi keluarga.
    4. Forensik: Jelaskan kemungkinan degradasi jika tidak 100%.
    
    Gunakan Bahasa Indonesia formal.`;

    const systemPrompt = "Anda adalah Direktur Laboratorium Genetika Senior. Gunakan gaya bahasa teknis, dingin, namun sangat akurat secara medis.";

    try {
      const result = await callGemini(prompt, systemPrompt);
      setAiInsight(result);
    } catch (err) {
      setAiInsight("Sistem Error: Gagal mengenkripsi data laporan.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const runLabAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAiInsight("");

    setTimeout(() => {
      let percentage = labInput.manualPercentage !== '' ? parseFloat(labInput.manualPercentage) : (Math.random() * 100);
      percentage = Math.min(100, Math.max(0, percentage));

      const markers = ["CSF1PO", "FGA", "TH01", "TPOX", "VWA", "D3S1358", "D5S818", "D7S820", "D8S1179", "D13S317", "D16S539", "D18S51", "D21S11", "D1S1656", "D2S441", "D10S1248"];
      const matchCount = Math.round((percentage / 100) * markers.length);
      
      const markerDetails = markers.map((name, index) => {
        const isMatch = index < matchCount;
        return { name, valA: Math.floor(Math.random() * 15) + 12, valB: isMatch ? Math.floor(Math.random() * 15) + 12 : Math.floor(Math.random() * 15) + 12, match: isMatch };
      });

      let status = "";
      let color = "";
      let verdict = "";

      if (activeTab === 'forensic') {
        if (percentage >= 99.9) { 
          status = "MATCH (IDENTIK)"; 
          color = "text-green-500"; 
          verdict = "Profil DNA identik secara absolut. Inklusi 100% terhadap subjek.";
        } else if (percentage >= 95) {
          status = "STRONG MATCH (PROBABEL)";
          color = "text-emerald-400";
          verdict = "Kecocokan signifikan. Variasi minimal terdeteksi akibat faktor lingkungan/kontaminasi eksternal.";
        } else if (percentage >= 80) {
          status = "PARTIAL MATCH";
          color = "text-yellow-500";
          verdict = "Kecocokan parsial terdeteksi. Sampel menunjukkan tanda degradasi polimerase.";
        } else { 
          status = "EKSKLUSI / NON-MATCH"; 
          color = "text-red-500"; 
          verdict = "Profil DNA tidak menunjukkan kesamaan bermakna. Subjek dieksklusi.";
        }
      } else {
        // Logika Variatif Hubungan Keluarga (Threshold Utama 60%)
        if (percentage >= 99.99) {
          status = "ORANG TUA - ANAK (INTI)";
          color = "text-green-500";
          verdict = "Probabilitas paternitas/maternitas > 99.99%. Hubungan biologis langsung terkonfirmasi.";
        } else if (percentage >= 90) {
          status = "SAUDARA KANDUNG (FULL-SIB)";
          color = "text-emerald-400";
          verdict = "Kecocokan alel sangat tinggi. Menunjukkan garis keturunan dari kedua orang tua yang sama.";
        } else if (percentage >= 75) {
          status = "HUBUNGAN LINEAR DEKAT";
          color = "text-blue-400";
          verdict = "Konsisten dengan profil genetik Kakek/Nenek-Cucu atau Saudara Tiri seayah/seibu.";
        } else if (percentage >= 60) {
          status = "KERABAT BIOLOGIS TERKONFIRMASI";
          color = "text-cyan-400";
          verdict = "Memenuhi ambang batas minimum inklusi keluarga (60%). Terdeteksi adanya transmisi genetik yang sah.";
        } else if (percentage >= 40) {
          status = "INCONCLUSIVE / KERABAT JAUH";
          color = "text-yellow-500";
          verdict = "Berada di bawah ambang batas 60%. Kemungkinan Sepupu atau kerabat jauh, namun tidak dapat divalidasi sebagai keluarga dekat.";
        } else if (percentage >= 20) {
          status = "KEMUNGKINAN NON-BIOLOGIS";
          color = "text-orange-500";
          verdict = "Kecocokan sangat rendah. Tidak ditemukan pola pewarisan alel yang konsisten untuk hubungan keluarga.";
        } else {
          status = "TOTAL EKSKLUSI BIOLOGIS";
          color = "text-red-500";
          verdict = "Tidak ditemukan keterkaitan DNA. Subjek bukan merupakan bagian dari silsilah biologis yang diuji.";
        }
      }

      setAnalysisResult({ 
        percentage: percentage.toFixed(2), 
        relationship: status, 
        verdict,
        color, 
        markerDetails,
        labId: `RXW-${activeTab === 'forensic' ? 'FOR' : 'KIN'}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        timestamp: new Date().toLocaleString('id-ID')
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 md:p-8 print:bg-white print:text-black">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-center gap-6 print:border-black">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-3 rounded-2xl shadow-xl shadow-red-900/20">
            <FlaskConical size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white print:text-black">ROXWOOD <span className="text-red-500">GENETIC LAB</span></h1>
            <p className="text-slate-500 text-[10px] font-mono tracking-[0.2em] uppercase print:text-black">Advanced Forensic & Bio-Medical Diagnostics</p>
          </div>
        </div>

        <nav className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 print:hidden">
          <button 
            onClick={() => { setActiveTab('forensic'); setAnalysisResult(null); setAiInsight(""); }}
            className={`px-6 py-2 rounded-lg text-[10px] font-black transition flex items-center gap-2 ${activeTab === 'forensic' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Search size={14} /> ANALISIS FORENSIK
          </button>
          <button 
            onClick={() => { setActiveTab('kinship'); setAnalysisResult(null); setAiInsight(""); }}
            className={`px-6 py-2 rounded-lg text-[10px] font-black transition flex items-center gap-2 ${activeTab === 'kinship' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Users size={14} /> HUBUNGAN KELUARGA
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Input */}
        <section className="lg:col-span-1 space-y-6 print:hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <h2 className="font-black text-xs uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-4 flex items-center gap-2">
               <Terminal size={14} className="text-red-500" /> Sequencing Config
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Subjek 1</label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-red-500 outline-none transition"
                  placeholder="Nama Lengkap..."
                  value={labInput.patientName}
                  onChange={(e) => setLabInput({...labInput, patientName: e.target.value})}
                />
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm outline-none"
                  value={labInput.sampleType}
                  onChange={(e) => setLabInput({...labInput, sampleType: e.target.value})}
                >
                  {sampleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  {activeTab === 'forensic' ? 'Sampel Bukti (Evidence)' : 'Subjek 2 (Kerabat)'}
                </label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-red-500 outline-none transition"
                  placeholder={activeTab === 'forensic' ? "ID Bukti TKP..." : "Nama Kerabat..."}
                  value={labInput.compareName}
                  onChange={(e) => setLabInput({...labInput, compareName: e.target.value})}
                />
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm outline-none"
                  value={labInput.compareType}
                  onChange={(e) => setLabInput({...labInput, compareType: e.target.value})}
                >
                  {sampleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
              <label className="text-[10px] font-black text-red-400 uppercase block mb-2 tracking-tighter">Simulasi Kecocokan (%)</label>
              <input 
                type="number"
                className="w-full bg-slate-950 border border-red-500/30 rounded-lg p-2 text-center font-mono text-red-500 font-bold"
                placeholder="Auto"
                value={labInput.manualPercentage}
                onChange={(e) => setLabInput({...labInput, manualPercentage: e.target.value})}
              />
              <p className="text-[8px] text-slate-500 mt-2 italic text-center">
                *Min. 60% untuk Klasifikasi Keluarga (Kinship)
              </p>
            </div>

            <button 
              disabled={isAnalyzing}
              onClick={runLabAnalysis}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-[0.97] transition-all disabled:opacity-50"
            >
              {isAnalyzing ? "Processing..." : "Run Laboratory Analysis"}
            </button>
          </div>
        </section>

        {/* Results Area */}
        <section className="lg:col-span-2">
          {!analysisResult && !isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-center p-20 border-2 border-dashed border-slate-800 rounded-3xl opacity-40">
               <Microscope size={64} className="text-slate-700 mb-6" />
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-500">Diagnostic Unit Ready</h3>
               <p className="text-xs text-slate-600 mt-2">Menunggu pemrosesan sekuens genetik.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
               <div className="w-16 h-16 border-4 border-slate-800 border-t-red-600 rounded-full animate-spin"></div>
               <p className="font-mono text-[10px] text-red-500 font-bold animate-pulse uppercase tracking-[0.2em] text-center">
                  Decoding Genomic Data...<br/>
                  Calculating Multi-Level Diagnostic Verdict...
               </p>
            </div>
          )}

          {analysisResult && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl print:border-none print:shadow-none print:bg-white">
               
               {/* Summary Header */}
               <div className="p-8 border-b border-slate-800 bg-black/40 print:bg-white print:border-black">
                  <div className="flex justify-between items-start mb-10">
                     <div>
                        <div className="flex items-center gap-2 mb-3">
                           <FileText size={16} className="text-red-500" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Laboratory Record</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter print:text-black">
                           REF: <span className="text-red-500 font-mono">{analysisResult.labId}</span>
                        </h2>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Analysis Date</p>
                        <p className="text-xs font-mono font-bold text-white print:text-black">{analysisResult.timestamp}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="flex items-center gap-5 p-5 bg-slate-950 border border-slate-800 rounded-2xl print:border-black">
                        <div className={`p-4 rounded-full ${analysisResult.color.replace('text', 'bg').replace('500', '500/20')} ${analysisResult.color}`}>
                           {parseFloat(analysisResult.percentage) >= (activeTab === 'kinship' ? 60 : 80) ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                        </div>
                        <div className="flex-1">
                           <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Diagnostic Classification</p>
                           <p className={`text-xl font-black uppercase tracking-tight leading-tight ${analysisResult.color}`}>{analysisResult.relationship}</p>
                           <p className="text-[11px] text-slate-400 mt-2 leading-relaxed italic border-t border-slate-800 pt-2 print:text-black">"{analysisResult.verdict}"</p>
                        </div>
                     </div>

                     <div className="flex flex-col items-center justify-center p-6 bg-slate-800/20 rounded-3xl border border-slate-800 print:border-black relative overflow-hidden">
                        <span className="text-[10px] font-black text-slate-500 uppercase mb-2">Match Probability</span>
                        <span className={`text-6xl font-black tracking-tighter z-10 ${analysisResult.color}`}>{analysisResult.percentage}%</span>
                        <div className="w-full bg-slate-900 h-1.5 mt-4 rounded-full overflow-hidden z-10">
                           <div 
                             className={`h-full transition-all duration-1000 ${analysisResult.color.replace('text', 'bg')}`}
                             style={{ width: `${analysisResult.percentage}%` }}
                           ></div>
                        </div>
                        {activeTab === 'kinship' && (
                          <div className="absolute left-0 right-0 top-[60%] border-t border-dashed border-red-500/50 flex justify-end pr-2">
                             <span className="text-[7px] text-red-500 font-black uppercase">Kinship Inclusion: 60%</span>
                          </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Grid Results */}
               <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">Analysis Entities</h4>
                        <div className="space-y-4">
                           <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                                 <Fingerprint size={20} className="text-slate-400" />
                              </div>
                              <div>
                                 <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Subjek 1</p>
                                 <p className="font-bold text-white text-lg leading-none print:text-black">{labInput.patientName || "UNTITLED_SUBJ"}</p>
                                 <span className="text-[10px] font-mono text-red-500 uppercase">{labInput.sampleType}</span>
                              </div>
                           </div>
                           <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                                 {activeTab === 'forensic' ? <Beaker size={20} className="text-slate-400" /> : <Users size={20} className="text-slate-400" />}
                              </div>
                              <div>
                                 <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">{activeTab === 'forensic' ? 'Evidence Sample' : 'Subjek 2 (Kerabat)'}</p>
                                 <p className="font-bold text-white text-lg leading-none print:text-black">{labInput.compareName || "UNTITLED_COMP"}</p>
                                 <span className="text-[10px] font-mono text-red-500 uppercase">{labInput.compareType}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">Genetic Markers (STR)</h4>
                        <div className="grid grid-cols-4 gap-2">
                           {analysisResult.markerDetails.map((m, i) => (
                              <div key={i} className={`h-9 rounded-lg flex flex-col items-center justify-center border transition-colors ${m.match ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'bg-red-500/5 border-red-500/20 text-red-700 opacity-60'}`}>
                                 <span className="text-[8px] font-bold uppercase">{m.name.substring(0, 4)}</span>
                                 <span className="text-[10px] font-mono font-black">{m.match ? "MATCH" : "DIFF"}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* AI Conclusion Section */}
                  <div className="mt-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden print:border-black">
                     <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-white/5 print:bg-slate-100">
                        <div className="flex items-center gap-3">
                           <Sparkles size={18} className="text-indigo-400" />
                           <div>
                              <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Chief Medical Officer Opinion</h3>
                              <p className="text-[9px] text-slate-500 font-mono italic">Based on Genomic Sequencing Analysis</p>
                           </div>
                        </div>
                        <button 
                          onClick={getAiForensicExpertOpine}
                          disabled={isAiLoading}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black transition-all active:scale-95 disabled:opacity-50 print:hidden shadow-lg shadow-indigo-900/20"
                        >
                          {isAiLoading ? "PROCESSING NARRATIVE..." : "GENERATE CLINICAL REPORT"}
                        </button>
                     </div>
                     
                     <div className="p-6 bg-[#010411] print:bg-white min-h-[140px]">
                        {aiInsight ? (
                           <div className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-300 print:text-black selection:bg-indigo-500/30">
                              {aiInsight}
                           </div>
                        ) : (
                           <div className="flex flex-col items-center justify-center py-10 opacity-20 text-center">
                              <Activity size={32} className="mb-3 text-slate-700 animate-pulse" />
                              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Awaiting Specialist Validation...</p>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="pt-4 print:hidden">
                     <button onClick={() => window.print()} className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-[0.99]">
                        <Printer size={20} /> Print Certified Forensic Document
                     </button>
                  </div>
               </div>
            </div>
          )}
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 py-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 print:hidden">
        <div className="flex items-center gap-3">
          <Activity size={20} className="text-red-600" />
          <span className="font-black text-sm uppercase tracking-tighter">Roxwood Medical Group &copy; 2026</span>
        </div>
        <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-right text-slate-500 leading-relaxed">
           Genetic Integrity Protocol ISO/IEC 17025<br/>
           Valid Kinship Inclusion Threshold: 60.00%
        </div>
      </footer>
    </div>
  );
};

export default App;