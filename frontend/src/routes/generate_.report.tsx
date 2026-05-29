import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Plus, X, Upload, Check, AlignLeft, AlignCenter, AlignJustify,
  Download, FileText, FileType, Sparkles, Loader2, Info, Edit3,
  FlaskConical, Cog, Microscope, GraduationCap, Image as ImageIcon, GripVertical,
} from "lucide-react";
import { WizardShell, StepNav, type Step } from "@/components/rc/WizardShell";
import { CarryForwardBanner } from "@/components/rc/CarryForwardBanner";
import { Archive } from "lucide-react";
import { generateReport, downloadFile, convertToPDF, downloadBundle } from "@/api/apiClient";

export const Route = createFileRoute("/generate_/report")({
  head: () => ({
    meta: [
      { title: "Generate Project Report — ReportCraft" },
      { name: "description", content: "Generate a 35–55 page project report in MS Word format." },
    ],
  }),
  component: ReportWizard,
});

type ProjectType = "stem" | "mini1" | "mini2" | "final";
const PROJECTS: { id: ProjectType; icon: any; label: string; year: string }[] = [
  { id: "stem", icon: FlaskConical, label: "STEM Project", year: "1st Year" },
  { id: "mini1", icon: Cog, label: "Mini Project 1", year: "2nd Year" },
  { id: "mini2", icon: Microscope, label: "Mini Project 2", year: "3rd Year" },
  { id: "final", icon: GraduationCap, label: "Final Year Project", year: "4th Year" },
];
const COURSE_NAMES: Record<ProjectType, string> = {
  stem: "STEM Engineering Project",
  mini1: "Mini Project — Phase I",
  mini2: "Mini Project — Phase II",
  final: "Final Year Project",
};

function ReportWizard() {
  const [step, setStep] = useState(1);

  // Step 1
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [students, setStudents] = useState([{ name: "", reg: "" }]);
  const [guideName, setGuideName] = useState("");
  const [guideDesignation, setGuideDesignation] = useState("");
  const [department, setDepartment] = useState("");
  useEffect(() => { if (projectType && !courseName) setCourseName(COURSE_NAMES[projectType]); }, [projectType]); // eslint-disable-line

  // Step 2 — front matter
  const [ack, setAck] = useState("");
  const [bonafide, setBonafide] = useState("");

  // Step 3 — abstract
  const [abstract, setAbstract] = useState("");

  // Step 4 — literature
  const [lit, setLit] = useState<{ title: string; author: string; year: string; summary: string }[]>([]);

  // Step 5 — chapters
  const [chapters, setChapters] = useState<Record<string, string>>({
    introduction: "", existing: "", proposed: "", architecture: "", implementation: "", results: "", conclusion: "",
  });
  const [additionalChapters, setAdditionalChapters] = useState<{ id: string; title: string; content: string }[]>([]);

  // Step 6 — images include original File object for upload
  const [images, setImages] = useState<{ id: string; name: string; url: string; caption: string; file?: File }[]>([]);

  // Step 7 — style
  const [styleFont, setStyleFont] = useState("Times New Roman");
  const [titleSize, setTitleSize] = useState(16);
  const [bodySize, setBodySize] = useState(12);
  const [bold, setBold] = useState(true);
  const [lineSpacing, setLineSpacing] = useState("1.5");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "justify">("justify");
  const [margins, setMargins] = useState<"normal" | "wide" | "narrow">("normal");
  const [headingStyle, setHeadingStyle] = useState<"bold_underlined" | "bold_only" | "bold_larger">("bold_only");

  // Step 8
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const storageKey = projectType ? `rc_report_${projectType}` : null;
  useEffect(() => {
    if (generated && storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          courseCode, courseName, projectName, students,
          guideName, guideDesignation, department,
          ack, bonafide, abstract, lit, chapters, additionalChapters,
        }));
      } catch {}
    }
  }, [generated]); // eslint-disable-line

  const applyCarry = (d: any) => {
    if (d.courseCode != null) setCourseCode(d.courseCode);
    if (d.courseName) setCourseName(d.courseName);
    if (d.projectName) setProjectName(d.projectName);
    if (Array.isArray(d.students) && d.students.length) setStudents(d.students);
    if (d.guideName) setGuideName(d.guideName);
    if (d.guideDesignation) setGuideDesignation(d.guideDesignation);
    if (d.department) setDepartment(d.department);
    if (d.ack) setAck(d.ack);
    if (d.bonafide) setBonafide(d.bonafide);
    if (d.abstract) setAbstract(d.abstract);
    if (Array.isArray(d.lit)) setLit(d.lit);
    if (d.chapters) setChapters({ ...chapters, ...d.chapters });
    if (Array.isArray(d.additionalChapters)) setAdditionalChapters(d.additionalChapters);
  };

  const steps: Step[] = [
    { id: 1, name: "Project Setup" },
    { id: 2, name: "Front Matter" },
    { id: 3, name: "Abstract" },
    { id: 4, name: "Literature Survey" },
    { id: 5, name: "Chapter Content" },
    { id: 6, name: "Images" },
    { id: 7, name: "Style Settings" },
    { id: 8, name: "Preview & Download" },
  ];

  const s1Valid =
    projectType && courseCode && courseName && projectName &&
    guideName && guideDesignation && department &&
    students.every((s) => s.name && s.reg);

  return (
    <WizardShell title="Report Generator" steps={steps} current={step} goTo={setStep}>
      <div key={step} className="animate-fade-up">
        {step === 1 && <Setup
          storageKey={storageKey}
          onCarry={applyCarry}
          projectType={projectType} setProjectType={setProjectType}
          courseCode={courseCode} setCourseCode={setCourseCode}
          courseName={courseName} setCourseName={setCourseName}
          projectName={projectName} setProjectName={setProjectName}
          students={students} setStudents={setStudents}
          guideName={guideName} setGuideName={setGuideName}
          guideDesignation={guideDesignation} setGuideDesignation={setGuideDesignation}
          department={department} setDepartment={setDepartment}
        />}
        {step === 2 && <FrontMatter ack={ack} setAck={setAck} bonafide={bonafide} setBonafide={setBonafide} />}
        {step === 3 && <Abstract value={abstract} setValue={setAbstract} />}
        {step === 4 && <Literature lit={lit} setLit={setLit} />}
        {step === 5 && <Chapters chapters={chapters} setChapters={setChapters} additionalChapters={additionalChapters} setAdditionalChapters={setAdditionalChapters} />}
        {step === 6 && <Images images={images} setImages={setImages} />}
        {step === 7 && <Styling
          font={styleFont} setFont={setStyleFont}
          titleSize={titleSize} setTitleSize={setTitleSize}
          bodySize={bodySize} setBodySize={setBodySize}
          bold={bold} setBold={setBold}
          lineSpacing={lineSpacing} setLineSpacing={setLineSpacing}
          textAlign={textAlign} setTextAlign={setTextAlign}
          margins={margins} setMargins={setMargins}
          headingStyle={headingStyle} setHeadingStyle={setHeadingStyle}
        />}
        {step === 8 && <Preview
          generated={generated} generating={generating}
          fileId={fileId} genError={genError} projectName={projectName}
          onGenerate={async () => {
            setGenerating(true);
            setGenError(null);
            try {
              const PROJECT_TYPE_MAP: Record<string, string> = {
                stem: "stem", mini1: "mini_project_1", mini2: "mini_project_2", final: "final_year",
              };
              const requestData = {
                project_type: PROJECT_TYPE_MAP[projectType!] || projectType,
                title_slide: {
                  course_code: courseCode,
                  course_name: courseName,
                  project_name: projectName,
                  students: students.map((s) => ({ name: s.name, reg_no: s.reg })),
                  guide_name: guideName,
                  guide_designation: guideDesignation,
                  department: department,
                },
                acknowledgement: ack,
                abstract: abstract,
                introduction: chapters.introduction || "",
                literature_survey: lit,
                existing_system: chapters.existing || "",
                proposed_system: chapters.proposed || "",
                additional_chapters: additionalChapters.map((c) => ({ title: c.title, content: c.content })),
                instructions: {
                  font_name: styleFont,
                  title_font_size: titleSize,
                  body_font_size: bodySize,
                  bold_headings: bold,
                  line_spacing: parseFloat(lineSpacing),
                  text_alignment: textAlign,
                },
              };
              const imageFiles = images.filter((img) => img.file).map((img) => img.file as File);
              const result = await generateReport(requestData, imageFiles);
              setFileId(result.file_id);
              setGenerating(false);
              setGenerated(true);
            } catch (err: any) {
              setGenerating(false);
              const msg = err?.response?.data?.detail || err?.message || "Generation failed. Make sure the backend is running.";
              setGenError(msg);
              console.error("Report generation error:", err);
            }
          }}
          abstract={abstract} chapters={chapters} additionalChapters={additionalChapters} lit={lit} images={images}
          onEdit={setStep}
        />}
      </div>
      <StepNav
        onBack={step > 1 ? () => setStep(step - 1) : undefined}
        onNext={step < 8 ? () => setStep(step + 1) : undefined}
        nextDisabled={(step === 1 && !s1Valid) || (step === 4 && lit.length < 5)}
        nextTooltip={step === 1 ? "Fill all required fields" : step === 4 ? "Add at least 5 entries" : undefined}
        finalStep={step === 8}
      />
    </WizardShell>
  );
}

function Setup(p: any) {
  return (
    <div className="space-y-8">
      {p.storageKey && p.projectType && (
        <CarryForwardBanner
          storageKey={p.storageKey}
          contextLabel="previous report"
          onApply={p.onCarry}
        />
      )}
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Project Setup</h1>
        <p className="mt-2 text-white/60">Identify your project and team.</p>
      </header>
      <section>
        <div className="label-caps mb-3">Project Type</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {PROJECTS.map(({ id, icon: Icon, label, year }) => {
            const active = p.projectType === id;
            return (
              <button key={id} onClick={() => p.setProjectType(id)}
                className={`glass p-5 text-left transition ${active ? "glass-cyan" : "glass-hover"}`}
                style={active ? { borderColor: "rgba(6,182,212,0.6)", boxShadow: "0 0 0 4px rgba(6,182,212,0.15)" } : {}}>
                <Icon className="h-6 w-6 mb-3 text-cyan-300" />
                <div className="font-semibold">{label}</div>
                <div className="text-xs text-white/50 mt-1">{year}</div>
              </button>
            );
          })}
        </div>
      </section>
      {p.projectType && (
        <section className="glass p-6 animate-fade-up space-y-5">
          <div className="label-caps">Title Page Details</div>
          <div className="grid gap-4 md:grid-cols-2">
            <L label="Course Code"><input className="input-field" value={p.courseCode} onChange={(e) => p.setCourseCode(e.target.value)} /></L>
            <L label="Course Name"><input className="input-field" value={p.courseName} onChange={(e) => p.setCourseName(e.target.value)} /></L>
            <L label="Project Name" full><input className="input-field" value={p.projectName} onChange={(e) => p.setProjectName(e.target.value)} /></L>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="label-caps">Students</div>
              <button onClick={() => p.setStudents([...p.students, { name: "", reg: "" }])} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 transition"><Plus className="h-3.5 w-3.5" /> Add Student</button>
            </div>
            <div className="space-y-2">
              {p.students.map((s: any, i: number) => (
                <div key={i} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_180px_auto] animate-fade-up">
                  <input className="input-field" placeholder="Student name" value={s.name} onChange={(e) => { const arr = [...p.students]; arr[i].name = e.target.value; p.setStudents(arr); }} />
                  <input className="input-field" placeholder="Register number" value={s.reg} onChange={(e) => { const arr = [...p.students]; arr[i].reg = e.target.value; p.setStudents(arr); }} />
                  {p.students.length > 1 && (
                    <button onClick={() => p.setStudents(p.students.filter((_: any, j: number) => j !== i))} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-rose-300 transition self-center"><X className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <L label="Guide Name"><input className="input-field" value={p.guideName} onChange={(e) => p.setGuideName(e.target.value)} /></L>
            <L label="Guide Designation"><input className="input-field" value={p.guideDesignation} onChange={(e) => p.setGuideDesignation(e.target.value)} /></L>
            <L label="Department"><input className="input-field" value={p.department} onChange={(e) => p.setDepartment(e.target.value)} /></L>
          </div>
        </section>
      )}
    </div>
  );
}

function L({ label, full, children }: any) {
  return <label className={`block ${full ? "md:col-span-2" : ""}`}><div className="label-caps mb-1.5">{label}</div>{children}</label>;
}

function FrontMatter({ ack, setAck, bonafide, setBonafide }: any) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Front Matter</h1>
        <p className="mt-2 text-white/60">Most of the front matter is auto-generated. Add your acknowledgement.</p>
      </header>
      <div className="glass p-5 animate-fade-up">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Acknowledgement</h3>
          <span className="text-xs text-white/45">100–250 words recommended</span>
        </div>
        <textarea className="input-field min-h-[180px]" placeholder="Thank your guide, institution, and anyone who helped." value={ack} onChange={(e) => setAck(e.target.value)} />
      </div>
      <div className="glass p-5 animate-fade-up" style={{ animationDelay: "0.08s" }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Bonafide Certificate Note <span className="text-xs text-white/45 ml-2">optional</span></h3>
        </div>
        <textarea className="input-field min-h-[120px]" placeholder="Most content is auto-generated from the title page. Add any extra note if required." value={bonafide} onChange={(e) => setBonafide(e.target.value)} />
      </div>
    </div>
  );
}

function Abstract({ value, setValue }: any) {
  const words = value.trim().split(/\s+/).filter(Boolean).length;
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Abstract</h1>
        <p className="mt-2 text-white/60">A concise summary of your entire project. 150–300 words.</p>
      </header>
      <div className="glass p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Project Abstract</h3>
          <span className={`text-xs ${words >= 150 && words <= 300 ? "text-emerald-300" : "text-white/45"}`}>{words} words</span>
        </div>
        <textarea className="input-field min-h-[260px]" placeholder="Briefly describe the problem, your approach, and the outcome." value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    </div>
  );
}

function Literature({ lit, setLit }: any) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Literature Survey</h1>
        <p className="mt-2 text-white/60">Reports always require at least 5 literature entries.</p>
      </header>
      <div className={`glass p-4 inline-flex items-center gap-3 ${lit.length >= 5 ? "glass-emerald" : "glass-amber"}`}>
        <div className="text-2xl font-bold gradient-text">{lit.length} / 5</div>
        <div className="text-sm">{lit.length >= 5 ? "Minimum reached" : `Add ${5 - lit.length} more`}</div>
      </div>
      {lit.length === 0 ? (
        <div className="glass p-12 text-center"><FileText className="mx-auto h-10 w-10 text-white/30 mb-3" /><p className="text-white/60">No entries yet. Add your first literature reference.</p></div>
      ) : (
        <div className="space-y-3">
          {lit.map((e: any, i: number) => (
            <div key={i} className="glass p-5 animate-spring relative">
              <button onClick={() => setLit(lit.filter((_: any, j: number) => j !== i))} className="absolute right-3 top-3 text-white/40 hover:text-rose-300"><X className="h-4 w-4" /></button>
              <div className="label-caps mb-3">Entry #{i + 1}</div>
              <div className="grid gap-3 md:grid-cols-[2fr_1fr_120px]">
                <input className="input-field" placeholder="Paper / Journal title" value={e.title} onChange={(ev) => { const arr = [...lit]; arr[i].title = ev.target.value; setLit(arr); }} />
                <input className="input-field" placeholder="Author(s)" value={e.author} onChange={(ev) => { const arr = [...lit]; arr[i].author = ev.target.value; setLit(arr); }} />
                <input className="input-field" placeholder="Year" value={e.year} onChange={(ev) => { const arr = [...lit]; arr[i].year = ev.target.value; setLit(arr); }} />
              </div>
              <textarea className="input-field mt-3 min-h-[80px]" placeholder="Summary (2–3 lines)" value={e.summary} onChange={(ev) => { const arr = [...lit]; arr[i].summary = ev.target.value; setLit(arr); }} />
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setLit([...lit, { title: "", author: "", year: "", summary: "" }])} className="btn-primary"><Plus className="h-4 w-4" /> Add Literature Entry</button>
    </div>
  );
}

const CHAPTER_DEFS = [
  { key: "introduction", label: "1. Introduction", hint: "Introduce your project, scope and motivation.", words: "400–800 words" },
  { key: "existing", label: "2. Existing System", hint: "Current solutions and their limitations.", words: "300–600 words" },
  { key: "proposed", label: "3. Proposed System", hint: "Your solution and why it's better.", words: "500–800 words" },
  { key: "architecture", label: "4. System Architecture", hint: "Describe modules, data flow, and design.", words: "400–700 words" },
  { key: "implementation", label: "5. Implementation", hint: "Tech stack, modules built, and key code paths.", words: "600–1200 words" },
  { key: "results", label: "6. Results & Discussion", hint: "Outputs, screenshots, metrics.", words: "300–600 words" },
  { key: "conclusion", label: "7. Conclusion & Future Work", hint: "Wrap up and suggest enhancements.", words: "200–400 words" },
];
const TONES = ["#8b5cf6", "#06b6d4", "#f43f5e", "#f59e0b", "#10b981", "#fa709a", "#a18cd1"];

function Chapters({ chapters, setChapters, additionalChapters, setAdditionalChapters }: any) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Chapter Content</h1>
        <p className="mt-2 text-white/60">Fill each chapter. Write naturally — we format it.</p>
      </header>
      <div className="glass p-3 text-sm text-white/70 flex items-center gap-2">
        <span className="label-caps">Note</span>
        <span>Your Literature Survey (Step 4) is automatically inserted as Chapter 2.</span>
      </div>
      <div className="space-y-4">
        {CHAPTER_DEFS.map((c, i) => {
          const val = chapters[c.key] || "";
          const words = val.trim().split(/\s+/).filter(Boolean).length;
          return (
            <div key={c.key} className="glass p-5 animate-fade-up" style={{ animationDelay: `${i * 0.06}s`, borderLeft: `3px solid ${TONES[i]}` }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{c.label}</h3>
                <span className="text-xs text-white/45">{words} words · {c.words}</span>
              </div>
              <textarea className="input-field min-h-[140px]" placeholder={c.hint} value={val} onChange={(e) => setChapters({ ...chapters, [c.key]: e.target.value })} />
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="label-caps">Additional Chapters</div>
            <p className="text-xs text-white/50 mt-1">Add custom chapters requested by your guide (max 5).</p>
          </div>
          <button
            onClick={() => additionalChapters.length < 5 && setAdditionalChapters([...additionalChapters, { id: crypto.randomUUID(), title: "", content: "" }])}
            disabled={additionalChapters.length >= 5}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 transition disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" /> Add Chapter
          </button>
        </div>
        {additionalChapters.map((c: any, i: number) => (
          <div key={c.id} className="glass p-5 animate-spring relative" style={{ borderLeft: `3px solid ${TONES[(CHAPTER_DEFS.length + i) % TONES.length]}` }}>
            <button onClick={() => setAdditionalChapters(additionalChapters.filter((_: any, j: number) => j !== i))} className="absolute right-3 top-3 text-white/40 hover:text-rose-300"><X className="h-4 w-4" /></button>
            <div className="label-caps mb-2">Chapter {CHAPTER_DEFS.length + 1 + i}</div>
            <input className="input-field mb-3" placeholder="Chapter title (e.g. Testing & Validation)" value={c.title} onChange={(e) => { const a = [...additionalChapters]; a[i].title = e.target.value; setAdditionalChapters(a); }} />
            <textarea className="input-field min-h-[120px]" placeholder="Chapter content..." value={c.content} onChange={(e) => { const a = [...additionalChapters]; a[i].content = e.target.value; setAdditionalChapters(a); }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Images({ images, setImages }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/")).map((f) => ({
      id: crypto.randomUUID(), name: f.name, url: URL.createObjectURL(f), caption: "", file: f,
    }));
    setImages([...images, ...arr]);
  };
  const reorder = (from: number, to: number) => { const a = [...images]; const [m] = a.splice(from, 1); a.splice(to, 0, m); setImages(a); };
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Report Images</h1>
        <p className="mt-2 text-white/60">Diagrams, screenshots, and figures. They embed in order.</p>
      </header>
      <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl p-12 text-center transition ${drag ? "scale-[1.01]" : ""}`}
        style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.2)" }}>
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-50 dashed-border-anim mix-blend-overlay" />
        <Upload className="mx-auto h-10 w-10 text-cyan-300 mb-3" />
        <div className="font-semibold">Drag and drop images, or click to browse</div>
        <p className="mt-1 text-xs text-white/50">JPG, PNG, GIF accepted</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </div>
      {images.length === 0 ? (
        <div className="glass p-10 text-center text-white/50"><ImageIcon className="mx-auto h-10 w-10 mb-2 text-white/30" />No images yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img: any, i: number) => (
            <div key={img.id} draggable onDragStart={() => setDragIdx(i)} onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragIdx !== null && dragIdx !== i) reorder(dragIdx, i); setDragIdx(null); }}
              className="glass glass-hover p-3 animate-spring relative">
              <div className="absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: "var(--grad-teal)" }}>{i + 1}</div>
              <button onClick={() => setImages(images.filter((_: any, j: number) => j !== i))} className="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white/70 hover:bg-rose-500 hover:text-white transition"><X className="h-3 w-3" /></button>
              <div className="aspect-video overflow-hidden rounded-lg bg-white/5"><img src={img.url} alt={img.name} className="h-full w-full object-cover" /></div>
              <input className="mt-2 w-full bg-transparent text-xs text-white/70 focus:outline-none focus:text-white" value={img.name} onChange={(e) => { const arr = [...images]; arr[i].name = e.target.value; setImages(arr); }} />
              <input
                className="mt-1 w-full rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-white/80 placeholder:text-white/35 focus:outline-none focus:border-cyan-400/50"
                placeholder="Figure 1: System Architecture"
                value={img.caption || ""}
                onChange={(e) => { const arr = [...images]; arr[i].caption = e.target.value; setImages(arr); }}
              />
              <div className="mt-1 flex items-center gap-1 text-[10px] text-white/40"><GripVertical className="h-3 w-3" /> drag to reorder</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Styling(p: any) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Style Settings</h1>
        <p className="mt-2 text-white/60">Defaults match the standard college report format.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass p-6 space-y-5">
          <div className="label-caps">Font Settings</div>
          <div>
            <div className="label-caps mb-2">Font Family</div>
            <div className="flex flex-wrap gap-2">
              {["Times New Roman", "Calibri", "Arial"].map((f) => (
                <button key={f} onClick={() => p.setFont(f)} className={`rounded-full px-4 py-1.5 text-sm transition border ${p.font === f ? "text-white border-transparent" : "text-white/70 border-white/15 bg-white/5"}`} style={p.font === f ? { background: "var(--grad-teal)" } : {}}>{f}</button>
              ))}
            </div>
          </div>
          <Stepper label="Heading Size" value={p.titleSize} onChange={p.setTitleSize} min={10} max={36} unit="pt" />
          <Stepper label="Body Font Size" value={p.bodySize} onChange={p.setBodySize} min={8} max={24} unit="pt" />
          <div className="flex items-center justify-between">
            <div><div className="font-medium">Bold Headings</div><div className="text-xs text-white/50">Chapter titles in bold</div></div>
            <Toggle value={p.bold} onChange={p.setBold} />
          </div>
        </div>
        <div className="glass p-6 space-y-5">
          <div className="label-caps">Layout</div>
          <div>
            <div className="label-caps mb-2">Line Spacing</div>
            <div className="flex gap-2">{["1.0", "1.5", "2.0"].map((s) => (
              <button key={s} onClick={() => p.setLineSpacing(s)} className={`flex-1 rounded-full py-2 text-sm transition border ${p.lineSpacing === s ? "text-white border-transparent" : "text-white/70 border-white/15 bg-white/5"}`} style={p.lineSpacing === s ? { background: "var(--grad-teal)" } : {}}>{s}</button>
            ))}</div>
          </div>
          <div>
            <div className="label-caps mb-2">Text Alignment</div>
            <div className="flex gap-2">{[{ v: "left", I: AlignLeft }, { v: "center", I: AlignCenter }, { v: "justify", I: AlignJustify }].map(({ v, I }) => (
              <button key={v} onClick={() => p.setTextAlign(v)} className={`flex-1 grid place-items-center py-2.5 rounded-xl border transition ${p.textAlign === v ? "text-white border-transparent" : "text-white/70 border-white/15 bg-white/5"}`} style={p.textAlign === v ? { background: "var(--grad-teal)" } : {}}><I className="h-4 w-4" /></button>
            ))}</div>
          </div>
        </div>
      </div>
      <div className="glass p-6">
        <div className="label-caps mb-3">Live Preview</div>
        <div className="rounded-xl bg-white p-8 text-slate-900" style={{ fontFamily: p.font, lineHeight: p.lineSpacing, textAlign: p.textAlign }}>
          <div style={{ fontSize: p.titleSize, fontWeight: p.bold ? 700 : 500 }}>Chapter 1 — Introduction</div>
          <div style={{ fontSize: p.bodySize, marginTop: 12 }}>This is how your report body text will appear once generated. ReportCraft preserves these settings across every chapter.</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass p-6 space-y-3">
          <div className="label-caps">Page Margins</div>
          <div className="flex flex-wrap gap-2">
            {([
              { v: "normal", l: "Normal (1\")" },
              { v: "wide",   l: "Wide (1.5\")" },
              { v: "narrow", l: "Narrow (0.75\")" },
            ] as const).map(({ v, l }) => (
              <button key={v} onClick={() => p.setMargins(v)}
                className={`rounded-full px-4 py-1.5 text-sm transition border ${p.margins === v ? "text-white border-transparent" : "text-white/70 border-white/15 bg-white/5"}`}
                style={p.margins === v ? { background: "var(--grad-teal)" } : {}}>{l}</button>
            ))}
          </div>
        </div>
        <div className="glass p-6 space-y-3">
          <div className="label-caps">Heading Style</div>
          <div className="flex flex-wrap gap-2">
            {([
              { v: "bold_underlined", l: "Bold + Underlined" },
              { v: "bold_only",       l: "Bold Only" },
              { v: "bold_larger",     l: "Bold + Larger" },
            ] as const).map(({ v, l }) => (
              <button key={v} onClick={() => p.setHeadingStyle(v)}
                className={`rounded-full px-4 py-1.5 text-sm transition border ${p.headingStyle === v ? "text-white border-transparent" : "text-white/70 border-white/15 bg-white/5"}`}
                style={p.headingStyle === v ? { background: "var(--grad-teal)" } : {}}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepper({ label, value, onChange, min, max, unit }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="label-caps">{label}</div>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">−</button>
        <div className="w-16 text-center font-mono">{value}{unit}</div>
        <button onClick={() => onChange(Math.min(max, value + 1))} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">+</button>
      </div>
    </div>
  );
}
function Toggle({ value, onChange }: any) {
  return (
    <button onClick={() => onChange(!value)} className={`relative h-7 w-12 rounded-full transition ${value ? "" : "bg-white/15"}`} style={value ? { background: "var(--grad-teal)" } : {}}>
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function Preview({ generated, generating, onGenerate, projectName, abstract, chapters, additionalChapters = [], lit, images, onEdit, fileId, genError }: any) {
  const [confetti, setConfetti] = useState(false);
  const sections: { label: string; pages: number; step: number }[] = [
    { label: "Title Page",            pages: 1, step: 1 },
    { label: "Bonafide Certificate",  pages: 1, step: 2 },
    { label: "Acknowledgement",       pages: 1, step: 2 },
    { label: "Abstract",              pages: 1, step: 3 },
    { label: "List of Figures",       pages: 1, step: 6 },
    { label: "Table of Contents",     pages: 2, step: 1 },
    ...CHAPTER_DEFS.map((c, i) => ({
      label: c.label,
      pages: Math.max(2, Math.ceil(((chapters[c.key] || "").trim().split(/\s+/).filter(Boolean).length) / 280) || 3),
      step: i === 0 ? 5 : 5,
    })),
    ...additionalChapters.map((c: any, i: number) => ({
      label: `${CHAPTER_DEFS.length + 1 + i}. ${c.title || "Additional Chapter"}`,
      pages: Math.max(2, Math.ceil(((c.content || "").trim().split(/\s+/).filter(Boolean).length) / 280) || 3),
      step: 5,
    })),
    { label: "References",            pages: Math.max(1, Math.ceil(lit.length / 5)), step: 4 },
  ];
  let pageCursor = 1;
  const totalPages = sections.reduce((sum, s) => sum + s.pages, 0);
  const [dlError, setDlError] = useState<string | null>(null);
  const trigger = async (type: string) => {
    if (!fileId) return;
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2200);
    setDlError(null);
    try {
      if (type === "DOCX") {
        await downloadFile(fileId, `${projectName || "report"}.docx`);
      } else if (type === "PDF") {
        const pdfResult = await convertToPDF(fileId, "docx");
        await downloadFile(pdfResult.pdf_file_id, `${projectName || "report"}.pdf`);
      } else if (type === "ZIP Bundle") {
        await downloadBundle(fileId);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Download failed";
      setDlError(msg);
    }
  };

  if (!generated) {
    return (
      <div className="grid place-items-center py-20">
        <div className="text-center max-w-md animate-fade-up">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl" style={{ background: "var(--grad-teal)" }}><Sparkles className="h-10 w-10 text-white" /></div>
          <h1 className="text-3xl font-bold">Ready to generate your report?</h1>
          <p className="mt-3 text-white/60">We'll assemble all chapters into a Word document, ready for submission.</p>
          <button onClick={onGenerate} disabled={generating} className="btn-primary mt-8 pulse-glow">
            {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating your report...</> : <>Generate Now →</>}
          </button>
          {genError && (
            <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-300 text-left">
              <strong>Error:</strong> {genError}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {confetti && <Confetti />}
      <header className="text-center animate-spring">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl" style={{ background: "var(--grad-mint)" }}><Check className="h-7 w-7 text-emerald-900" /></div>
        <h1 className="text-3xl md:text-4xl font-bold">Your report is ready! 🎉</h1>
        <p className="mt-2 text-white/60">Review before you download.</p>
      </header>

      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="label-caps">Sections · estimated pages</div>
          <div className="text-xs text-white/60">Estimated total: <b className="text-white">~{totalPages} pages</b></div>
        </div>
        <ol className="grid gap-2 md:grid-cols-2">
          {sections.map((s, i) => {
            const start = pageCursor; pageCursor += s.pages;
            return (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <span className="grid h-9 w-12 shrink-0 place-items-center rounded-lg text-xs font-bold" style={{ background: "var(--grad-teal)" }}>p.{start}</span>
                <span className="font-medium text-sm flex-1 truncate">{s.label}</span>
                <span className="text-[10px] text-white/45">{s.pages}p</span>
                <button onClick={() => onEdit(s.step)} className="ml-1 text-xs text-cyan-300 hover:underline inline-flex items-center gap-1"><Edit3 className="h-3 w-3" /> Edit</button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DownloadCard tone="glass-cyan" Icon={FileType} title="Download Word" sub="Editable .docx — perfect formatting" cta="Download .docx" onClick={() => trigger("DOCX")} />
        <DownloadCard tone="glass-rose" Icon={FileText} title="Export as PDF" sub="Best quality via LibreOffice" cta="Convert to PDF" onClick={() => trigger("PDF")} />
        <DownloadCard tone="glass-emerald" Icon={Archive} title="Download All Files" sub="DOCX + PDF bundled as a ZIP" cta="Download ZIP Bundle" onClick={() => trigger("ZIP Bundle")} />
      </div>
      {dlError && (
        <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          <strong>Download error:</strong> {dlError}
        </div>
      )}

      <div className="text-center">
        <Link to="/generate" className="text-sm text-white/60 hover:text-white">↻ Start a new generation</Link>
      </div>

      <div className="glass p-6 mt-6">
        <div className="label-caps mb-3">Project Snapshot</div>
        <div className="text-sm space-y-2 text-white/75">
          <div><b className="text-white">Title:</b> {projectName || "(none)"}</div>
          <div><b className="text-white">Abstract:</b> {abstract ? abstract.slice(0, 200) + "..." : "(empty)"}</div>
          <div><b className="text-white">Chapters filled:</b> {Object.values(chapters).filter((v) => (v as string).trim()).length} / 7</div>
          <div><b className="text-white">Literature entries:</b> {lit.length}</div>
          <div><b className="text-white">Images:</b> {images.length}</div>
        </div>
      </div>
    </div>
  );
}

function DownloadCard({ tone, Icon, title, sub, cta, onClick }: any) {
  return (
    <div className={`glass ${tone} glass-hover p-6`}>
      <Icon className="h-8 w-8 mb-4" />
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-white/60 mt-1 mb-5">{sub}</p>
      <button onClick={onClick} className="btn-primary w-full"><Download className="h-4 w-4" /> {cta}</button>
    </div>
  );
}

function Confetti() {
  const colors = ["#8b5cf6", "#06b6d4", "#f43f5e", "#f59e0b", "#10b981"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <span key={i} className="absolute block h-2 w-2 rounded-sm"
          style={{ left: `${Math.random() * 100}%`, top: "-10px", background: colors[i % colors.length],
            animation: `confetti-fall ${1.4 + Math.random()}s cubic-bezier(0.23,1,0.32,1) ${Math.random() * 0.5}s forwards`,
            transform: `rotate(${Math.random() * 360}deg)` }} />
      ))}
      <style>{`@keyframes confetti-fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}
