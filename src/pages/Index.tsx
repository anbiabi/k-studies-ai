import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, BookOpen, Check, Clipboard, Plus, Sparkles, Trash2 } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const promptGroups = [
  {
    label: "Application track",
    questions: [
      "Embassy vs university track",
      "Can I apply through both tracks?",
      "How many universities can I choose?",
      "What is the Regional University Track?",
      "Which track is best for my application?",
    ],
  },
  {
    label: "Eligibility",
    questions: [
      "GPA & age requirements",
      "What degree do I need for GKS Graduate?",
      "What are the citizenship requirements?",
      "Can final-year students apply?",
      "Does my study gap affect eligibility?",
    ],
  },
  {
    label: "Documents",
    questions: [
      "Required documents",
      "How do I prepare recommendation letters?",
      "Which documents need apostille or notarization?",
      "Are TOPIK or IELTS scores required?",
      "How should I submit my transcripts?",
    ],
  },
];

const getAnswer = (query: string) => {
  const q = query.toLowerCase();
  if (q.includes("embassy") || q.includes("university track") || q.includes("track")) {
    return "Embassy Track means applying through the Korean Embassy in your home country, usually with up to three university choices. University Track means applying directly to one designated university. You should choose one route only because applying through both can invalidate your application. Always confirm the current quota and university list in the latest recruitment notice.";
  }
  if (q.includes("gpa") || q.includes("age") || q.includes("requirement")) {
    return "For GKS Graduate applicants, the usual baseline is being under 40 years old on September 1 of the inviting year, holding the relevant previous degree, and having a CGPA equivalent to at least 80% or ranking in the top 20% of your class. Requirements can vary by year and program, so use the current official notice as the final source.";
  }
  if (q.includes("document") || q.includes("paper")) {
    return "Common documents include the application form, personal statement, study plan, recommendation letters, graduation certificates, official transcripts, and proof of citizenship for you and your parents. TOPIK, English test scores, publications, and awards may be optional supporting materials. Check whether your track requests one or two notarized or apostilled sets.";
  }
  return "That is a thoughtful question for your GKS preparation. Start with the current recruitment notice on Study in Korea and the international office guidance for your target university. If you share more context—your degree level, field, and preferred track—I can help you turn it into a more specific application plan.";
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [promptIndices, setPromptIndices] = useState([0, 0, 0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const submitQuestion = (event: FormEvent) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || isThinking) return;

    const userMessage: Message = { id: Date.now(), role: "user", text: question };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsThinking(true);

    window.setTimeout(() => {
      setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", text: getAnswer(question) }]);
      setIsThinking(false);
    }, 650);
  };

  const copyAnswer = async (message: Message) => {
    await navigator.clipboard.writeText(message.text);
    setCopiedId(message.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <main className="min-h-screen bg-[#10131a] text-[#f5f7fb] selection:bg-[#5b8cff]/30">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-5 sm:px-8 lg:px-12">
        <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#5b8cff] text-[#0e1525] shadow-[0_8px_24px_rgba(91,140,255,0.24)]">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-semibold tracking-[-0.01em]">K-Studies AI</h1>
                <span className="rounded-full border border-[#5b8cff]/30 bg-[#5b8cff]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#9db9ff]">Beta</span>
              </div>
              <p className="mt-0.5 text-xs text-[#8c96a8]">Your GKS application guide</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#8c96a8] transition hover:bg-white/[0.05] hover:text-white" aria-label="Clear conversation">
              <Trash2 size={14} className="transition group-hover:text-[#9db9ff]" />
              <span className="hidden sm:inline">Clear chat</span>
            </button>
          )}
        </header>

        <section className="flex flex-1 flex-col py-8 sm:py-12">
          {messages.length === 0 ? (
            <div className="m-auto w-full max-w-3xl pb-8">
              <div className="mb-9 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/[0.09] bg-[#191e29] text-[#77a0ff] shadow-[0_14px_40px_rgba(0,0,0,0.2)]">
                  <Sparkles size={28} strokeWidth={1.6} />
                </div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d8eaf]">Study with clarity</p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[42px]">What can I help you with?</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#8c96a8]">Ask about GKS eligibility, documents, university selection, or your application strategy.</p>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {promptGroups.map((group, groupIndex) => {
                  const questionIndex = promptIndices[groupIndex];
                  const question = group.questions[questionIndex];
                  return (
                    <button
                      key={group.label}
                      onClick={() => {
                        setInput(question);
                        setPromptIndices((current) => current.map((index, indexAt) => indexAt === groupIndex ? (index + 1) % group.questions.length : index));
                      }}
                      className="rounded-xl border border-white/[0.08] bg-[#171b24] px-4 py-3 text-left text-xs font-medium text-[#b8c0d0] transition hover:-translate-y-0.5 hover:border-[#5b8cff]/50 hover:bg-[#1b2230] hover:text-white"
                    >
                      <span className="mb-2 block text-[#64708a]">Ask about · {group.label}</span>
                      {question}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-7 pb-8">
              {messages.map((message) => (
                <article key={message.id} className={message.role === "user" ? "ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[#5b8cff] px-5 py-3.5 text-sm leading-6 text-[#081329] shadow-[0_8px_24px_rgba(91,140,255,0.12)]" : "group max-w-[92%] rounded-2xl rounded-bl-md border border-white/[0.08] bg-[#171b24] px-5 py-4 text-sm leading-7 text-[#dce2ee]"}>
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">
                    {message.role === "assistant" ? <><Sparkles size={12} /> K-Studies AI</> : "You"}
                  </div>
                  <p>{message.text}</p>
                  {message.role === "assistant" && (
                    <button onClick={() => copyAnswer(message)} className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#7f8ba2] transition hover:text-[#a9c1ff]" aria-label="Copy answer">
                      {copiedId === message.id ? <Check size={13} /> : <Clipboard size={13} />}
                      {copiedId === message.id ? "Copied" : "Copy answer"}
                    </button>
                  )}
                </article>
              ))}
              {isThinking && <div className="flex items-center gap-2 px-2 text-xs text-[#8995ac]"><span className="flex gap-1"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5b8cff]" /><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5b8cff] [animation-delay:150ms]" /><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5b8cff] [animation-delay:300ms]" /></span> Thinking through that...</div>}
              <div ref={messagesEndRef} />
            </div>
          )}

          <form onSubmit={submitQuestion} className="mx-auto w-full max-w-3xl">
            <div className="flex items-end gap-3 rounded-2xl border border-white/[0.1] bg-[#171b24] p-2.5 shadow-[0_16px_45px_rgba(0,0,0,0.18)] transition focus-within:border-[#5b8cff]/60 focus-within:shadow-[0_0_0_3px_rgba(91,140,255,0.08)]">
              <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submitQuestion(event); } }} placeholder="Ask anything about your GKS application..." rows={1} className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-[#657086]" aria-label="Your GKS question" />
              <button type="submit" disabled={!input.trim() || isThinking} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5b8cff] text-[#081329] transition hover:bg-[#76a0ff] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Send question"><ArrowUp size={19} strokeWidth={2.5} /></button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#667187]"><Plus size={12} /> Press Enter to send <span className="px-1">·</span> Shift + Enter for a new line</div>
          </form>
        </section>
        <footer className="pb-5 text-center text-[10px] tracking-[0.06em] text-[#4f596d]">Use official GKS notices for final application decisions.</footer>
      </div>
    </main>
  );
};

export default Index;
