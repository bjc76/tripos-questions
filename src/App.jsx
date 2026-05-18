import React, { useState, useMemo } from 'react';
import { topics } from './data/topics';
import { questionsByTopic, getPdfUrl, getSolutionUrl } from './data/questions';
import { useProgress } from './hooks/useProgress';
import { 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Lock, 
  Unlock, 
  FileText, 
  ChevronRight,
  BarChart3,
  BookOpen,
  Trophy,
  Search,
  LayoutGrid,
  History
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const { completed, scores, toggleComplete, setScore } = useProgress();

  const selectedTopic = topics.find(t => t.id === selectedTopicId);
  const questions = questionsByTopic[selectedTopicId] || [];

  const yearRange = useMemo(() => {
    if (questions.length === 0) return null;
    const years = questions.map(q => q.year);
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  }, [questions]);

  const filteredTopics = topics.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group questions by year
  const questionsByYear = useMemo(() => {
    const grouped = {};
    questions.forEach(q => {
      if (!grouped[q.year]) grouped[q.year] = [];
      grouped[q.year].push(q);
    });
    return Object.entries(grouped).sort((a, b) => b[0] - a[0]);
  }, [questions]);

  const calculateProgress = (topicId) => {
    const qList = questionsByTopic[topicId] || [];
    if (qList.length === 0) return 0;
    const done = qList.filter(q => completed[`${topicId}-${q.year}-p${q.paper}-q${q.question}`]).length;
    return Math.round((done / qList.length) * 100);
  };

  const overallProgress = Math.round(topics.reduce((acc, t) => acc + calculateProgress(t.id), 0) / topics.length);

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-cambridge-light">
      {/* Premium Sidebar */}
      <aside className="w-85 bg-[#F8F9F8] border-r border-gray-200/60 flex flex-col z-20">
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-cambridge-dark p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight text-gray-900">Tripos Tracker</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-0.5">Ben Crook</p>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cambridge-dark transition-colors" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cambridge/20 focus:border-cambridge transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-1">
          <div className="px-4 mb-2">
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Part IA Topics</h2>
          </div>
          {filteredTopics.map(topic => {
            const progress = calculateProgress(topic.id);
            const isActive = selectedTopicId === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={cn(
                  "w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 group flex flex-col gap-2 border",
                  isActive 
                    ? "bg-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border-gray-100 text-cambridge-dark" 
                    : "hover:bg-gray-100/50 text-gray-500 border-transparent"
                )}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={cn("text-[13px] font-semibold transition-colors", isActive ? "text-gray-900" : "group-hover:text-gray-700")}>
                    {topic.name}
                  </span>
                  <span className={cn("text-[10px] font-bold", isActive ? "text-cambridge" : "text-gray-300")}>
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200/50 h-[3px] rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-700 ease-out", isActive ? "bg-cambridge" : "bg-gray-300")} 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-6 m-4 mt-0 bg-cambridge-dark rounded-2xl text-white shadow-lg shadow-cambridge-dark/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-cambridge" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-cambridge-light/60">Overall IA Goal</span>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-serif font-bold leading-none">{overallProgress}%</span>
              <span className="text-[10px] font-medium text-cambridge-light/60 mb-0.5 pb-0.5 uppercase">Mastery</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-cambridge h-full transition-all duration-1000 ease-out" 
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#FDFDFD]">
        <header className="sticky top-0 z-10 bg-[#FDFDFD]/90 backdrop-blur-xl border-b border-gray-100 px-12 py-10">
          <div className="max-w-5xl mx-auto flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-cambridge uppercase tracking-[0.2em] mb-3">
                <LayoutGrid className="w-3 h-3" />
                Course Module
              </div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 leading-tight">{selectedTopic?.name}</h2>
              <div className="flex items-center gap-4 mt-4">
                {yearRange && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <History className="w-3.5 h-3.5" />
                    Historical coverage: {yearRange.min} – {yearRange.max}
                  </div>
                )}
                {yearRange && <div className="w-1 h-1 rounded-full bg-gray-200" />}
                <div className="text-xs text-gray-400">
                  {questions.length} total questions
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex flex-col items-end">
                <span className="text-5xl font-serif font-bold text-cambridge tracking-tighter tabular-nums leading-none">
                  {calculateProgress(selectedTopicId)}
                  <span className="text-2xl ml-0.5 opacity-60">%</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  Topic Completion
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="px-12 py-12 max-w-5xl mx-auto">
          {questionsByYear.length > 0 ? (
            <div className="space-y-16">
              {questionsByYear.map(([year, yearQuestions]) => (
                <section key={year} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="flex items-baseline gap-4 mb-6 group">
                    <h3 className="text-2xl font-serif font-bold text-gray-800">{year}</h3>
                    <div className="flex-1 h-px bg-gray-100 group-hover:bg-gray-200 transition-colors" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Tripos Paper</span>
                  </div>
                  
                  <div className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/40">
                          <th className="table-header w-20 text-center">Done</th>
                          <th className="table-header">Question & Identity</th>
                          <th className="table-header">Academic Resources</th>
                          <th className="table-header w-32 text-center">Grade / 20</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {yearQuestions.map(q => {
                          const qId = `${selectedTopicId}-${q.year}-p${q.paper}-q${q.question}`;
                          const isDone = completed[qId];
                          const score = scores[qId] || '';
                          
                          return (
                            <tr key={qId} className={cn(
                              "transition-all group",
                              isDone ? "bg-cambridge-light/20" : "hover:bg-gray-50/30"
                            )}>
                              <td className="px-6 py-6 text-center">
                                <button 
                                  onClick={() => toggleComplete(selectedTopicId, q.year, q.paper, q.question)}
                                  className="focus:outline-none transition-transform active:scale-90"
                                >
                                  {isDone ? (
                                    <div className="w-7 h-7 bg-cambridge-dark rounded-full flex items-center justify-center shadow-sm shadow-cambridge-dark/30">
                                      <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-7 h-7 border-2 border-gray-200 rounded-full flex items-center justify-center group-hover:border-cambridge transition-colors">
                                      <div className="w-2 h-2 rounded-full bg-cambridge opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-6">
                                <div className="font-serif font-bold text-gray-900 text-lg">Paper {q.paper}, Question {q.question}</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">Ref: y{q.year}p{q.paper}q{q.question}</div>
                              </td>
                              <td className="px-6 py-6">
                                <div className="flex items-center gap-6">
                                  <a 
                                    href={getPdfUrl(q.year, q.paper, q.question, selectedTopicId)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-cambridge-dark transition-colors group/link"
                                  >
                                    <div className="p-1.5 bg-gray-50 rounded group-hover/link:bg-cambridge-light transition-colors">
                                      <FileText className="w-3.5 h-3.5" />
                                    </div>
                                    {selectedTopicId === 'nst-maths' ? `Paper ${q.paper}` : 'Question PDF'}
                                  </a>
                                  
                                  {q.hasSolution ? (
                                    <a 
                                      href={getSolutionUrl(q.year, q.paper, q.question, selectedTopicId)} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={cn(
                                        "flex items-center gap-2 text-sm font-semibold transition-colors group/link",
                                        q.isLocked ? "text-amber-600 hover:text-amber-700" : "text-blue-600 hover:text-blue-700"
                                      )}
                                    >
                                      <div className={cn(
                                        "p-1.5 rounded transition-colors",
                                        q.isLocked ? "bg-amber-50 group-hover/link:bg-amber-100" : "bg-blue-50 group-hover/link:bg-blue-100"
                                      )}>
                                        {q.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                      </div>
                                      {q.isReport ? "Examiner's Report" : `Solution ${q.isLocked ? '(Raven)' : ''}`}
                                    </a>
                                  ) : (
                                    <div className="flex items-center gap-2 text-[10px] text-gray-300 italic font-medium px-2 py-1 rounded-md border border-gray-50">
                                      No Archive Solution
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-6">
                                <div className="flex items-center justify-center">
                                  <input 
                                    type="text"
                                    placeholder="—"
                                    value={score}
                                    onChange={(e) => setScore(selectedTopicId, q.year, q.paper, q.question, e.target.value)}
                                    className="w-16 bg-gray-50/50 border border-transparent rounded-lg py-2 text-center text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-cambridge/20 focus:bg-white focus:border-cambridge transition-all placeholder:text-gray-300"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-100">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search className="w-8 h-8 text-gray-200" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">No archival questions found</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">We couldn't find any questions matching this topic in our historical database.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
