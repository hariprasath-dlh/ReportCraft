import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus, X, Upload, GripVertical, Image as ImageIcon, Check,
  AlignLeft, AlignCenter, AlignJustify, Download, FileText,
  FileType, Sparkles, Loader2, Lightbulb, Info, Edit3, FlaskConical, Cog, Microscope, GraduationCap,
} from "lucide-react";
import { WizardShell, StepNav, type Step } from "@/components/rc/WizardShell";
import { CarryForwardBanner } from "@/components/rc/CarryForwardBanner";
import { SectionCard } from "@/components/rc/SectionCard";
import { AddCustomSectionButton } from "@/components/rc/AddCustomSectionButton";
import { Archive } from "lucide-react";
import { generatePPT, downloadFile, convertToPDF, downloadBundle } from "@/api/apiClient";

export const Route = createFileRoute("/generate_/ppt")({
  head: () => ({
    meta: [
      { title: "Generate Presentation — ReportCraft" },
      { name: "description", content: "Step-by-step wizard to generate your college review PPT." },
    ],
  }),
  component: PptWizard,
});

// ---------- types & data ----------
type ProjectType = "stem" | "mini1" | "mini2" | "final";
type ReviewType = "r0" | "r1" | "r2" | "r3" | "r4" | "final" | "report";

export type SectionImage = {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
  order: number;
};

export type PPTSection = {
  key: string;
  title: string;
  content: string;
  isPredefined: boolean;
  isEnabled: boolean;
  images: SectionImage[];
  hint?: string;
  words?: string;
  formatAsBullets: boolean;
};

const PROJECTS: { id: ProjectType; icon: any; label: string; year: string }[] = [
  { id: "stem", icon: FlaskConical, label: "STEM Project", year: "1st Year" },
  { id: "mini1", icon: Cog, label: "Mini Project 1", year: "2nd Year" },
  { id: "mini2", icon: Microscope, label: "Mini Project 2", year: "3rd Year" },
  { id: "final", icon: GraduationCap, label: "Final Year Project", year: "4th Year" },
];

const REVIEWS: { id: ReviewType; label: string }[] = [
  { id: "r0", label: "Review 0" }, { id: "r1", label: "Review 1" },
  { id: "r2", label: "Review 2" }, { id: "r3", label: "Review 3" },
  { id: "r4", label: "Review 4" }, { id: "final", label: "Final Review" },
];

function reviewContents(r: ReviewType): string[] {
  const base = ["Title slide", "Abstract", "Problem statement"];
  if (r === "r0") return [...base, "Existing system", "Proposed system"];
  if (r === "r1") return [...base, "Literature survey (min 5)", "Existing system", "Proposed system", "Architecture (optional)"];
  const tail = ["Existing system", "Proposed system", "Architecture", "Implementation"];
  if (r === "r2") return [...base, "Literature survey", ...tail, "25% progress images"];
  if (r === "r3") return [...base, "Literature survey", ...tail, "50% progress images"];
  if (r === "r4") return [...base, "Literature survey", ...tail, "75% progress images"];
  if (r === "final") return [...base, "Literature survey", ...tail, "Results & screenshots", "Conclusion"];
  return ["All report sections"];
}

const COURSE_NAMES: Record<ProjectType, string> = {
  stem: "STEM Engineering Project",
  mini1: "Mini Project — Phase I",
  mini2: "Mini Project — Phase II",
  final: "Final Year Project",
};

const sectionsForReview = (r: ReviewType): { key: string; label: string; hint: string; words: string }[] => {
  const common = [
    { key: "abstract", label: "Abstract", hint: "Briefly describe what your project does and its goals.", words: "150–300 words recommended" },
    { key: "problem", label: "Problem Statement", hint: "What problem does this project solve?", words: "80–150 words recommended" },
    { key: "existing", label: "Existing System", hint: "Describe how things are currently done and the limitations.", words: "120–200 words recommended" },
    { key: "proposed", label: "Proposed System", hint: "Explain your solution and its advantages.", words: "150–250 words recommended" },
  ];
  if (r === "r0" || r === "r1") return common;
  return [
    ...common,
    { key: "architecture", label: "System Architecture", hint: "Describe the architecture in 2–3 paragraphs.", words: "150–250 words recommended" },
    { key: "implementation", label: "Implementation", hint: "Tech stack, modules built, and key implementation details.", words: "200–400 words recommended" },
  ];
};

const needsLitSurvey = (r: ReviewType) => r !== "r0";
const needsImages = (r: ReviewType) => ["r2", "r3", "r4", "final"].includes(r);

const imageContextTitle = (r: ReviewType | null) => {
  if (r === "r2") return "Upload 25% Project Progress Screenshots";
  if (r === "r3") return "Upload 50% Project Progress Screenshots";
  if (r === "r4") return "Upload 75% Project Progress Screenshots";
  if (r === "final") return "Upload Final Project Output Screenshots";
  return "Upload your project images";
};

// ---------- main ----------
function PptWizard() {
  const [step, setStep] = useState(1);

  // Step 1 state
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [reviewType, setReviewType] = useState<ReviewType | null>(null);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [students, setStudents] = useState([{ name: "", reg: "" }]);
  const [guideName, setGuideName] = useState("");
  const [guideDesignation, setGuideDesignation] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (projectType && !courseName) setCourseName(COURSE_NAMES[projectType]);
  }, [projectType]); // eslint-disable-line

  // Step 2 — sections (new customizable model)
  const [sections, setSections] = useState<PPTSection[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});

  // Initialize sections when reviewType changes
  useEffect(() => {
    if (!reviewType) return;
    const defs = sectionsForReview(reviewType);
    setSections((prev) => {
      // Preserve existing content if sections already populated for same review
      if (prev.length > 0 && prev.some((s) => s.isPredefined)) {
        return prev;
      }
      return defs.map((d, i) => ({
        key: d.key,
        title: d.label,
        content: content[d.key] || "",
        isPredefined: true,
        isEnabled: true,
        images: [],
        hint: d.hint,
        words: d.words,
        formatAsBullets: false,
      }));
    });
  }, [reviewType]); // eslint-disable-line

  // ── Section handlers (8 actions) ──────────────────────────────────────
  const updateSectionTitle = (key: string, newTitle: string) =>
    setSections((prev) => prev.map((s) => (s.key === key ? { ...s, title: newTitle } : s)));

  const toggleSectionEnabled = (key: string) =>
    setSections((prev) => prev.map((s) => (s.key === key ? { ...s, isEnabled: !s.isEnabled } : s)));

  const addCustomSection = () => {
    const newSection: PPTSection = {
      key: crypto.randomUUID(),
      title: "",
      content: "",
      isPredefined: false,
      isEnabled: true,
      images: [],
      formatAsBullets: false,
    };
    setSections((prev) => [...prev, newSection]);
  };

  const removeCustomSection = (key: string) =>
    setSections((prev) => prev.filter((s) => !(s.key === key && !s.isPredefined)));

  const updateSectionContent = (key: string, newContent: string) =>
    setSections((prev) => prev.map((s) => (s.key === key ? { ...s, content: newContent } : s)));

  const addImageToSection = (sectionKey: string, file: File) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key !== sectionKey || s.images.length >= 3) return s;
        const newImage: SectionImage = {
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          caption: "",
          order: s.images.length,
        };
        return { ...s, images: [...s.images, newImage] };
      })
    );
  };

  const removeImageFromSection = (sectionKey: string, imageId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key !== sectionKey) return s;
        const filtered = s.images.filter((img) => img.id !== imageId);
        return { ...s, images: filtered.map((img, i) => ({ ...img, order: i })) };
      })
    );
  };

  const updateImageCaption = (sectionKey: string, imageId: string, caption: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key !== sectionKey) return s;
        return { ...s, images: s.images.map((img) => (img.id === imageId ? { ...img, caption } : img)) };
      })
    );
  };

  const reorderSectionImages = (sectionKey: string, newOrder: SectionImage[]) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key !== sectionKey) return s;
        return { ...s, images: newOrder.map((img, i) => ({ ...img, order: i })) };
      })
    );
  };

  const handleFormatChange = (key: string, formatAsBullets: boolean) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, formatAsBullets } : s))
    );
  };

  // Step 3
  const [lit, setLit] = useState<{ title: string; author: string; year: string; summary: string }[]>([]);

  // Step 4 — images include original File object for upload
  const [images, setImages] = useState<{ id: string; name: string; url: string; caption: string; file?: File }[]>([]);

  // Step 5
  const [styleFont, setStyleFont] = useState("Calibri");
  const [titleSize, setTitleSize] = useState(28);
  const [bodySize, setBodySize] = useState(18);
  const [bold, setBold] = useState(true);
  const [lineSpacing, setLineSpacing] = useState("1.5");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "justify">("justify");
  const [imageSize, setImageSize] = useState(50);

  // Step 6
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  // Persistence: save on successful generation
  const storageKey = projectType && reviewType ? `rc_ppt_${projectType}_${reviewType}` : null;
  useEffect(() => {
    if (generated && storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          courseCode, courseName, projectName, students,
          guideName, guideDesignation, department,
          content, lit,
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
    if (d.content) setContent(d.content);
    if (Array.isArray(d.lit)) setLit(d.lit);
  };

  const skipLit = !needsLitSurvey(reviewType ?? "r0");
  const skipImg = !needsImages(reviewType ?? "r0");

  const steps: Step[] = [
    { id: 1, name: "Project Setup" },
    { id: 2, name: "Content Entry" },
    { id: 3, name: "Literature Survey", skipped: skipLit },
    { id: 4, name: "Images", skipped: skipImg },
    { id: 5, name: "Style Settings" },
    { id: 6, name: "Preview & Download" },
  ];

  const goNext = () => {
    let n = step + 1;
    while (n <= 6 && steps.find((s) => s.id === n)?.skipped) n++;
    setStep(Math.min(6, n));
  };
  const goBack = () => {
    let n = step - 1;
    while (n >= 1 && steps.find((s) => s.id === n)?.skipped) n--;
    setStep(Math.max(1, n));
  };

  const s1Valid =
    projectType && reviewType && courseCode && courseName && projectName &&
    guideName && guideDesignation && department &&
    students.every((s) => s.name && s.reg);

  return (
    <WizardShell title="PPT Generator" steps={steps} current={step} goTo={setStep}>
      <div key={step} className="animate-fade-up">
        {step === 1 && (
          <Step1
            storageKey={storageKey}
            onCarry={applyCarry}
            projectType={projectType} setProjectType={setProjectType}
            reviewType={reviewType} setReviewType={setReviewType}
            courseCode={courseCode} setCourseCode={setCourseCode}
            courseName={courseName} setCourseName={setCourseName}
            projectName={projectName} setProjectName={setProjectName}
            students={students} setStudents={setStudents}
            guideName={guideName} setGuideName={setGuideName}
            guideDesignation={guideDesignation} setGuideDesignation={setGuideDesignation}
            department={department} setDepartment={setDepartment}
          />
        )}
        {step === 2 && reviewType && (
          <Step2ContentNew
            reviewType={reviewType}
            sections={sections}
            onTitleChange={updateSectionTitle}
            onContentChange={updateSectionContent}
            onToggleEnabled={toggleSectionEnabled}
            onRemove={removeCustomSection}
            onAddImage={addImageToSection}
            onRemoveImage={removeImageFromSection}
            onUpdateCaption={updateImageCaption}
            onReorderImages={reorderSectionImages}
            onAddCustomSection={addCustomSection}
            onFormatChange={handleFormatChange}
          />
        )}
        {step === 3 && <Step3Lit lit={lit} setLit={setLit} />}
        {step === 4 && <Step4Images images={images} setImages={setImages} reviewType={reviewType} />}
        {step === 5 && (
          <Step5Style
            font={styleFont} setFont={setStyleFont}
            titleSize={titleSize} setTitleSize={setTitleSize}
            bodySize={bodySize} setBodySize={setBodySize}
            bold={bold} setBold={setBold}
            lineSpacing={lineSpacing} setLineSpacing={setLineSpacing}
            textAlign={textAlign} setTextAlign={setTextAlign}
            imageSize={imageSize} setImageSize={setImageSize}
          />
        )}
        {step === 6 && (
          <Step6Preview
            generated={generated} generating={generating}
            fileId={fileId} genError={genError}
            projectName={projectName}
            onGenerate={async () => {
              setGenerating(true);
              setGenError(null);
              try {
                const PROJECT_TYPE_MAP: Record<string, string> = {
                  stem: "stem", mini1: "mini_project_1", mini2: "mini_project_2", final: "final_year",
                };
                const REVIEW_TYPE_MAP: Record<string, string> = {
                  r0: "review_0", r1: "review_1", r2: "review_2",
                  r3: "review_3", r4: "review_4", final: "final",
                };
                // Build sections for new format
                const predefinedSections = sections
                  .filter((s) => s.isPredefined)
                  .map((s, i) => ({
                    key: s.key,
                    title: s.title,
                    content: s.content,
                    is_enabled: s.isEnabled,
                    order: i,
                    section_images: s.images.map((img, j) => ({
                      caption: img.caption,
                      order: j,
                    })),
                    format_as_bullets: s.formatAsBullets,
                  }));
                const customSections = sections
                  .filter((s) => !s.isPredefined)
                  .map((s, i) => ({
                    key: s.key,
                    title: s.title,
                    content: s.content,
                    is_enabled: s.isEnabled,
                    order: predefinedSections.length + i,
                    section_images: s.images.map((img, j) => ({
                      caption: img.caption,
                      order: j,
                    })),
                    format_as_bullets: s.formatAsBullets,
                  }));

                // Build backward-compatible content fields from sections
                const sectionContentMap: Record<string, string> = {};
                sections.forEach((s) => { sectionContentMap[s.key] = s.content; });

                const requestData = {
                  project_type: PROJECT_TYPE_MAP[projectType!] || projectType,
                  review_type: REVIEW_TYPE_MAP[reviewType!] || reviewType,
                  title_slide: {
                    course_code: courseCode,
                    course_name: courseName,
                    project_name: projectName,
                    students: students.map((s) => ({ name: s.name, reg_no: s.reg })),
                    guide_name: guideName,
                    guide_designation: guideDesignation,
                    department: department,
                  },
                  abstract: sectionContentMap.abstract || "",
                  problem_statement: sectionContentMap.problem || "",
                  literature_survey: lit,
                  existing_system: sectionContentMap.existing || "",
                  proposed_system: sectionContentMap.proposed || "",
                  image_captions: images.map((img) => img.caption || img.name),
                  instructions: {
                    font_name: styleFont === "Times New Roman" ? "Times New Roman" : styleFont,
                    title_font_size: titleSize,
                    body_font_size: bodySize,
                    bold_headings: bold,
                    line_spacing: parseFloat(lineSpacing),
                    text_alignment: textAlign,
                  },
                  sections: predefinedSections,
                  custom_sections: customSections,
                };

                // Collect section images for FormData
                const sectionImageFiles: { key: string; order: number; file: File }[] = [];
                sections.forEach((s) => {
                  s.images.forEach((img, idx) => {
                    sectionImageFiles.push({ key: s.key, order: idx, file: img.file });
                  });
                });

                const imageFiles = images.filter((img) => img.file).map((img) => img.file as File);
                const result = await generatePPT(requestData, imageFiles, sectionImageFiles);
                setFileId(result.file_id);
                setGenerating(false);
                setGenerated(true);
              } catch (err: any) {
                setGenerating(false);
                const msg = err?.response?.data?.detail || err?.message || "Generation failed. Make sure the backend is running.";
                setGenError(msg);
                console.error("PPT generation error:", err);
              }
            }}
            reviewType={reviewType} content={content} lit={lit} images={images}
            onEditStep={setStep}
          />
        )}
      </div>
      <StepNav
        onBack={step > 1 ? goBack : undefined}
        onNext={step < 6 ? goNext : undefined}
        nextDisabled={step === 1 ? !s1Valid : step === 2 ? sections.some((s: PPTSection) => !s.isPredefined && !s.title.trim()) : step === 3 && lit.length < 5}
        nextTooltip={step === 1 ? "Fill all required fields" : step === 2 ? (sections.some((s: PPTSection) => !s.isPredefined && !s.title.trim()) ? "Title all custom sections" : undefined) : step === 3 ? "Add at least 5 literature entries" : undefined}
        finalStep={step === 6}
      />
    </WizardShell>
  );
}

// ---------- STEP 1 ----------
function Step1(p: any) {
  return (
    <div className="space-y-8">
      {p.storageKey && p.projectType && p.reviewType && (
        <CarryForwardBanner
          storageKey={p.storageKey}
          contextLabel={`${REVIEWS.find((r) => r.id === p.reviewType)?.label ?? "previous review"}`}
          onApply={p.onCarry}
        />
      )}
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Let's start with the basics</h1>
        <p className="mt-2 text-white/60">Tell us about your project and review type.</p>
      </header>

      <section>
        <div className="label-caps mb-3">Project Type</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {PROJECTS.map(({ id, icon: Icon, label, year }) => {
            const active = p.projectType === id;
            return (
              <button
                key={id}
                onClick={() => p.setProjectType(id)}
                className={`glass p-5 text-left transition ${active ? "glass-violet" : "glass-hover"}`}
                style={active ? { borderColor: "rgba(139,92,246,0.6)", boxShadow: "0 0 0 4px rgba(139,92,246,0.15)" } : {}}
              >
                <Icon className="h-6 w-6 mb-3 text-violet-300" />
                <div className="font-semibold">{label}</div>
                <div className="text-xs text-white/50 mt-1">{year}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="label-caps mb-3">Review Type</div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {REVIEWS.map((r) => (
            <button
              key={r.id}
              onClick={() => p.setReviewType(r.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition border ${
                p.reviewType === r.id ? "text-white border-transparent" : "text-white/70 border-white/15 bg-white/5 hover:bg-white/10"
              }`}
              style={p.reviewType === r.id ? { background: "var(--grad-vc)" } : {}}
            >
              {r.label}
            </button>
          ))}
        </div>
      </section>

      {p.reviewType && (
        <div className="glass glass-violet p-5 animate-spring">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-violet-300 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold mb-1.5">{REVIEWS.find((r) => r.id === p.reviewType)?.label} contains:</div>
              <div className="text-sm text-white/70">{reviewContents(p.reviewType).join(" · ")}</div>
            </div>
          </div>
        </div>
      )}

      {p.projectType && p.reviewType && (
        <section className="glass p-6 animate-fade-up space-y-5">
          <div className="label-caps">Title Slide Details</div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Course Code"><input className="input-field" value={p.courseCode} onChange={(e) => p.setCourseCode(e.target.value)} placeholder="e.g. CS8811" /></Field>
            <Field label="Course Name"><input className="input-field" value={p.courseName} onChange={(e) => p.setCourseName(e.target.value)} /></Field>
            <Field label="Project Name" full><input className="input-field" value={p.projectName} onChange={(e) => p.setProjectName(e.target.value)} placeholder="e.g. AI-Powered Smart Attendance System" /></Field>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="label-caps">Students</div>
              <button
                onClick={() => p.setStudents([...p.students, { name: "", reg: "" }])}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 transition"
              ><Plus className="h-3.5 w-3.5" /> Add Student</button>
            </div>
            <div className="space-y-2">
              {p.students.map((s: any, i: number) => (
                <div key={i} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_180px_auto] animate-fade-up">
                  <input className="input-field" placeholder="Student name" value={s.name} onChange={(e) => { const arr = [...p.students]; arr[i].name = e.target.value; p.setStudents(arr); }} />
                  <input className="input-field" placeholder="Register number" value={s.reg} onChange={(e) => { const arr = [...p.students]; arr[i].reg = e.target.value; p.setStudents(arr); }} />
                  {p.students.length > 1 && (
                    <button onClick={() => p.setStudents(p.students.filter((_: any, j: number) => j !== i))} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-rose-300 hover:border-rose-400/30 transition self-center">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Guide Name"><input className="input-field" value={p.guideName} onChange={(e) => p.setGuideName(e.target.value)} /></Field>
            <Field label="Guide Designation"><input className="input-field" value={p.guideDesignation} onChange={(e) => p.setGuideDesignation(e.target.value)} placeholder="e.g. Assistant Professor" /></Field>
            <Field label="Department"><input className="input-field" value={p.department} onChange={(e) => p.setDepartment(e.target.value)} placeholder="e.g. CSE" /></Field>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({ label, full, children }: any) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <div className="label-caps mb-1.5">{label}</div>
      {children}
    </label>
  );
}

// ---------- STEP 2 ----------
function Step2Content({ reviewType, content, setContent }: any) {
  const sections = sectionsForReview(reviewType);
  const tones = ["#8b5cf6", "#06b6d4", "#f43f5e", "#f59e0b", "#10b981", "#fa709a"];
  const [tipOpen, setTipOpen] = useState(true);
  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Add your project content</h1>
          <p className="mt-2 text-white/60">Fill each section. Don't worry about formatting — we handle that.</p>
        </div>
        {tipOpen && (
          <div className="glass glass-amber hidden md:block max-w-xs p-4 text-sm animate-spring relative">
            <button onClick={() => setTipOpen(false)} className="absolute right-2 top-2 text-white/40 hover:text-white"><X className="h-3.5 w-3.5" /></button>
            <div className="flex items-start gap-2"><Lightbulb className="h-4 w-4 text-amber-300 mt-0.5 shrink-0" />
              <div><b>Tip:</b> Write naturally. ReportCraft handles fonts, spacing and alignment.</div></div>
          </div>
        )}
      </header>

      <div className="space-y-4">
        {sections.map((s, i) => {
          const val = content[s.key] || "";
          const words = val.trim().split(/\s+/).filter(Boolean).length;
          return (
            <div key={s.key} className="glass p-5 animate-fade-up" style={{ animationDelay: `${i * 0.08}s`, borderLeft: `3px solid ${tones[i % tones.length]}` }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{s.label}</h3>
                <div className="text-xs text-white/45">{words} words · {s.words}</div>
              </div>
              <textarea
                className="input-field min-h-[120px] resize-y"
                placeholder={s.hint}
                value={val}
                onChange={(e) => setContent({ ...content, [s.key]: e.target.value })}
              />
              <p className="mt-2 text-xs text-white/50">{s.hint}</p>
            </div>
          );
        })}
      </div>

      {reviewType !== "r0" && (
        <div className="glass glass-cyan p-4 text-sm text-white/75 flex items-center gap-2">
          <Info className="h-4 w-4 text-cyan-300" /> Literature survey is collected in the next step.
        </div>
      )}
    </div>
  );
}

// ---------- STEP 2 (NEW — uses SectionCard components) ----------
function Step2ContentNew({ reviewType, sections, onTitleChange, onContentChange, onToggleEnabled, onRemove, onAddImage, onRemoveImage, onUpdateCaption, onReorderImages, onAddCustomSection, onFormatChange }: any) {
  const [tipOpen, setTipOpen] = useState(true);
  const hasUntitledCustom = sections.some((s: PPTSection) => !s.isPredefined && !s.title.trim());

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Add your project content</h1>
          <p className="mt-2 text-white/60">Fill each section. You can rename, toggle, or add custom sections.</p>
        </div>
        {tipOpen && (
          <div className="glass glass-amber hidden md:block max-w-xs p-4 text-sm animate-spring relative">
            <button onClick={() => setTipOpen(false)} className="absolute right-2 top-2 text-white/40 hover:text-white"><X className="h-3.5 w-3.5" /></button>
            <div className="flex items-start gap-2"><Lightbulb className="h-4 w-4 text-amber-300 mt-0.5 shrink-0" />
              <div><b>Tip:</b> Click the pencil icon on any section title to rename it. Toggle sections on/off as needed.</div></div>
          </div>
        )}
      </header>

      <div className="space-y-4">
        {sections.map((section: PPTSection, i: number) => (
          <SectionCard
            key={section.key}
            section={section}
            index={i}
            reviewType={reviewType}
            onTitleChange={onTitleChange}
            onContentChange={onContentChange}
            onToggleEnabled={onToggleEnabled}
            onRemove={onRemove}
            onAddImage={onAddImage}
            onRemoveImage={onRemoveImage}
            onUpdateCaption={onUpdateCaption}
            onReorderImages={onReorderImages}
            onFormatChange={onFormatChange}
          />
        ))}

        <AddCustomSectionButton onClick={onAddCustomSection} />
      </div>

      {hasUntitledCustom && (
        <div className="glass glass-rose p-3 text-sm flex items-center gap-2 text-rose-300">
          <Info className="h-4 w-4 text-rose-400 shrink-0" />
          Please enter a title for all custom sections before proceeding.
        </div>
      )}

      {reviewType !== "r0" && (
        <div className="glass glass-cyan p-4 text-sm text-white/75 flex items-center gap-2">
          <Info className="h-4 w-4 text-cyan-300" /> Literature survey is collected in the next step.
        </div>
      )}
    </div>
  );
}

// ---------- STEP 3 ----------
function Step3Lit({ lit, setLit }: any) {
  const need = Math.max(0, 5 - lit.length);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Literature Survey</h1>
        <p className="mt-2 text-white/60">Add at least 5 literature entries. Your guide will check this.</p>
      </header>

      <div className={`glass p-4 inline-flex items-center gap-3 ${lit.length >= 5 ? "glass-emerald" : "glass-amber"}`}>
        <div className="text-2xl font-bold gradient-text">{lit.length} / 5</div>
        <div className="text-sm">{lit.length >= 5 ? "Great — minimum reached" : `Add ${need} more to continue`}</div>
      </div>

      {lit.length === 0 ? (
        <div className="glass p-12 text-center animate-fade-up">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-2xl bg-white/5">
            <FileText className="h-10 w-10 text-white/40" />
          </div>
          <p className="text-white/60">No entries yet. Add your first literature reference.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lit.map((e: any, i: number) => (
            <div key={i} className="glass p-5 animate-spring relative">
              <button onClick={() => setLit(lit.filter((_: any, j: number) => j !== i))} className="absolute right-3 top-3 text-white/40 hover:text-rose-300 transition">
                <X className="h-4 w-4" />
              </button>
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

      <button
        onClick={() => setLit([...lit, { title: "", author: "", year: "", summary: "" }])}
        className="btn-primary"
      ><Plus className="h-4 w-4" /> Add Literature Entry</button>
    </div>
  );
}

// ---------- STEP 4 ----------
function Step4Images({ images, setImages, reviewType }: any) {
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
  const reorder = (from: number, to: number) => {
    const arr = [...images]; const [m] = arr.splice(from, 1); arr.splice(to, 0, m); setImages(arr);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">{imageContextTitle(reviewType)}</h1>
        <p className="mt-2 text-white/60">Images appear in order on your slides. Name them 01_, 02_ etc. for correct ordering.</p>
      </header>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl p-12 text-center transition ${drag ? "scale-[1.01]" : ""}`}
        style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.2)" }}
      >
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-50 dashed-border-anim mix-blend-overlay" />
        <Upload className="mx-auto h-10 w-10 text-violet-300 mb-3" />
        <div className="font-semibold">Drag and drop images here, or click to browse</div>
        <p className="mt-1 text-xs text-white/50">JPG, PNG, GIF accepted</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </div>

      <div className="glass glass-amber p-4 text-sm flex items-center gap-2">
        <Info className="h-4 w-4 text-amber-300 shrink-0" />
        Images appear in slides in the order shown below. Drag to reorder. Name files <code className="px-1 rounded bg-white/10">01_name.png</code> for auto-ordering.
      </div>

      {images.length === 0 ? (
        <div className="glass p-10 text-center text-white/50 animate-fade-up">
          <ImageIcon className="mx-auto h-10 w-10 mb-2 text-white/30" />
          No images yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img: any, i: number) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragIdx !== null && dragIdx !== i) reorder(dragIdx, i); setDragIdx(null); }}
              className="glass glass-hover p-3 animate-spring relative group"
            >
              <div className="absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: "var(--grad-vc)" }}>{i + 1}</div>
              <button onClick={() => setImages(images.filter((_: any, j: number) => j !== i))} className="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white/70 hover:bg-rose-500 hover:text-white transition">
                <X className="h-3 w-3" />
              </button>
              <div className="aspect-video overflow-hidden rounded-lg bg-white/5">
                <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
              </div>
              <input
                className="mt-2 w-full bg-transparent text-xs text-white/70 focus:outline-none focus:text-white"
                value={img.name}
                onChange={(e) => { const arr = [...images]; arr[i].name = e.target.value; setImages(arr); }}
              />
              <input
                className="mt-1 w-full rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-white/80 placeholder:text-white/35 focus:outline-none focus:border-violet-400/50"
                placeholder="Figure caption (e.g. System Architecture)"
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

// ---------- STEP 5 ----------
function Step5Style(p: any) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Customize the look</h1>
        <p className="mt-2 text-white/60">Set formatting preferences. Your college defaults are pre-filled.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass p-6 space-y-5">
          <div className="label-caps">Font Settings</div>
          <div>
            <div className="label-caps mb-2">Font Family</div>
            <div className="flex flex-wrap gap-2">
              {["Times New Roman", "Calibri", "Arial"].map((f) => (
                <button key={f} onClick={() => p.setFont(f)} className={`rounded-full px-4 py-1.5 text-sm transition border ${p.font === f ? "text-white border-transparent" : "text-white/70 border-white/15 bg-white/5"}`} style={p.font === f ? { background: "var(--grad-vc)" } : {}}>{f}</button>
              ))}
            </div>
          </div>
          <Stepper label="Title Font Size" value={p.titleSize} onChange={p.setTitleSize} min={16} max={60} unit="pt" />
          <Stepper label="Body Font Size" value={p.bodySize} onChange={p.setBodySize} min={8} max={36} unit="pt" />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Bold Headings</div>
              <div className="text-xs text-white/50">Make all section titles bold</div>
            </div>
            <Toggle value={p.bold} onChange={p.setBold} />
          </div>
        </div>

        <div className="glass p-6 space-y-5">
          <div className="label-caps">Layout Settings</div>
          <div>
            <div className="label-caps mb-2">Line Spacing</div>
            <div className="flex gap-2">
              {["1.0", "1.5", "2.0"].map((s) => (
                <button key={s} onClick={() => p.setLineSpacing(s)} className={`flex-1 rounded-full py-2 text-sm transition border ${p.lineSpacing === s ? "text-white border-transparent" : "text-white/70 border-white/15 bg-white/5"}`} style={p.lineSpacing === s ? { background: "var(--grad-vc)" } : {}}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="label-caps mb-2">Text Alignment</div>
            <div className="flex gap-2">
              {[{ v: "left", I: AlignLeft }, { v: "center", I: AlignCenter }, { v: "justify", I: AlignJustify }].map(({ v, I }) => (
                <button key={v} onClick={() => p.setTextAlign(v)} className={`flex-1 grid place-items-center py-2.5 rounded-xl border transition ${p.textAlign === v ? "text-white border-transparent" : "text-white/70 border-white/15 bg-white/5"}`} style={p.textAlign === v ? { background: "var(--grad-vc)" } : {}}>
                  <I className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="label-caps">Image Size</span><span className="text-white/60">{p.imageSize < 35 ? "Small" : p.imageSize < 70 ? "Medium" : "Large"}</span></div>
            <input type="range" min={10} max={100} value={p.imageSize} onChange={(e) => p.setImageSize(+e.target.value)} className="w-full accent-violet-500" />
          </div>
        </div>
      </div>

      <div className="glass p-6">
        <div className="label-caps mb-3">Live Preview</div>
        <div className="rounded-xl bg-white p-8 text-slate-900" style={{ fontFamily: p.font, lineHeight: p.lineSpacing, textAlign: p.textAlign }}>
          <div style={{ fontSize: p.titleSize, fontWeight: p.bold ? 700 : 500 }}>Project Title Slide</div>
          <div style={{ fontSize: p.bodySize, marginTop: 12 }}>
            This is how your body text will appear. ReportCraft applies your chosen font, size and alignment consistently across every slide.
          </div>
          <div style={{ fontSize: p.titleSize * 0.7, fontWeight: p.bold ? 700 : 500, marginTop: 16 }}>Section Heading</div>
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
        <button onClick={() => onChange(Math.max(min, value - 1))} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">−</button>
        <div className="w-16 text-center font-mono">{value}{unit}</div>
        <button onClick={() => onChange(Math.min(max, value + 1))} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">+</button>
      </div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className={`relative h-7 w-12 rounded-full transition ${value ? "" : "bg-white/15"}`} style={value ? { background: "var(--grad-vc)" } : {}}>
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

// ---------- STEP 6 ----------
function Step6Preview({ generated, generating, onGenerate, reviewType, projectName, content, lit, images, onEditStep, fileId, genError }: any) {
  const [tab, setTab] = useState<"slides" | "summary">("slides");
  const [confetti, setConfetti] = useState(false);

  const slideList = useMemo(() => {
    const arr = ["Title", "Abstract", "Problem Statement"];
    if (reviewType !== "r0") arr.push("Literature Survey");
    arr.push("Existing System", "Proposed System");
    if (["r2", "r3", "r4", "final"].includes(reviewType)) arr.push("Architecture", "Implementation", "Progress Screenshots");
    if (reviewType === "final") arr.push("Results", "Conclusion");
    return arr;
  }, [reviewType]);

  const [dlError, setDlError] = useState<string | null>(null);
  const triggerDownload = async (type: string) => {
    if (!fileId) return;
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2200);
    setDlError(null);
    try {
      if (type === "PPTX") {
        await downloadFile(fileId, `${projectName || "presentation"}.pptx`);
      } else if (type === "PDF") {
        const pdfResult = await convertToPDF(fileId, "pptx");
        await downloadFile(pdfResult.pdf_file_id, `${projectName || "presentation"}.pdf`);
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
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl" style={{ background: "var(--grad-vc)" }}>
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Ready to generate your PPT?</h1>
          <p className="mt-3 text-white/60">We'll assemble {slideList.length} slides using your content and chosen template.</p>
          <button onClick={onGenerate} disabled={generating} className="btn-primary mt-8 pulse-glow">
            {generating ? (<><Loader2 className="h-4 w-4 animate-spin" /> Generating your PPT...</>) : (<>Generate Now →</>)}
          </button>
          {genError && (
            <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-300 text-left max-w-lg mx-auto">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="shrink-0 mt-0.5 text-rose-400">⚠</span>
                  <div className="min-w-0">
                    <strong>Generation Failed</strong>
                    <p className="mt-1 text-rose-200/80 break-words whitespace-pre-wrap font-mono text-xs leading-relaxed">{genError}</p>
                  </div>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(genError); }}
                  className="shrink-0 rounded-lg border border-rose-400/20 bg-rose-500/10 px-2 py-1 text-[10px] text-rose-300 hover:bg-rose-500/20 transition"
                  title="Copy error to clipboard"
                >Copy</button>
              </div>
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
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl" style={{ background: "var(--grad-mint)" }}>
          <Check className="h-7 w-7 text-emerald-900" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Your file is ready! 🎉</h1>
        <p className="mt-2 text-white/60">Review before you download.</p>
      </header>

      <div className="glass p-2 inline-flex gap-1">
        {[{ k: "slides", l: "Slide Preview" }, { k: "summary", l: "Content Summary" }].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k as any)} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === t.k ? "text-white" : "text-white/60 hover:text-white"}`} style={tab === t.k ? { background: "var(--grad-vc)" } : {}}>{t.l}</button>
        ))}
      </div>

      <div className="glass p-6">
        {tab === "slides" ? (
          <ol className="grid gap-3 md:grid-cols-2">
            {slideList.map((s, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold" style={{ background: "var(--grad-vc)" }}>{i + 1}</span>
                <span className="font-medium">{s}</span>
                <button onClick={() => onEditStep(2)} className="ml-auto text-xs text-violet-300 hover:underline inline-flex items-center gap-1"><Edit3 className="h-3 w-3" /> Edit</button>
              </li>
            ))}
          </ol>
        ) : (
          <div className="space-y-5">
            <SummarySection title="Project" onEdit={() => onEditStep(1)}>{projectName || "(no title)"}</SummarySection>
            {Object.entries(content).map(([k, v]) => (
              <SummarySection key={k} title={k.charAt(0).toUpperCase() + k.slice(1)} onEdit={() => onEditStep(2)}>{(v as string) || "(empty)"}</SummarySection>
            ))}
            {lit.length > 0 && (
              <SummarySection title={`Literature Survey (${lit.length})`} onEdit={() => onEditStep(3)}>
                <ul className="space-y-1">{lit.map((l: any, i: number) => <li key={i}>• {l.title || "(untitled)"} — {l.author}, {l.year}</li>)}</ul>
              </SummarySection>
            )}
            {images.length > 0 && <SummarySection title={`Images (${images.length})`} onEdit={() => onEditStep(4)}>{images.map((i: any) => i.name).join(", ")}</SummarySection>}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DownloadCard tone="glass-violet" Icon={Presentation} title="Download Presentation" sub="Ready for PowerPoint / LibreOffice" cta="Download .pptx" onClick={() => triggerDownload("PPTX")} />
        <DownloadCard tone="glass-rose" Icon={FileType} title="Export as PDF" sub="Best quality via LibreOffice" cta="Convert to PDF" onClick={() => triggerDownload("PDF")} />
        <DownloadCard tone="glass-emerald" Icon={Archive} title="Download All Files" sub="PPTX + PDF bundled as a ZIP" cta="Download ZIP Bundle" onClick={() => triggerDownload("ZIP Bundle")} />
      </div>
      {dlError && (
        <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          <strong>Download error:</strong> {dlError}
        </div>
      )}

      <div className="text-center">
        <Link to="/generate" className="text-sm text-white/60 hover:text-white transition">↻ Start a new generation</Link>
      </div>
    </div>
  );
}

function SummarySection({ title, children, onEdit }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="label-caps">{title}</div>
        <button onClick={onEdit} className="text-xs text-violet-300 hover:underline inline-flex items-center gap-1"><Edit3 className="h-3 w-3" /> Edit</button>
      </div>
      <div className="text-sm text-white/75 whitespace-pre-wrap rounded-lg bg-white/[0.03] p-3 border border-white/8">{children}</div>
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

function Presentation(props: any) {
  return <FileText {...props} />;
}

function Confetti() {
  const colors = ["#8b5cf6", "#06b6d4", "#f43f5e", "#f59e0b", "#10b981"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <span
          key={i}
          className="absolute block h-2 w-2 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            background: colors[i % colors.length],
            animation: `confetti-fall ${1.4 + Math.random() * 1}s cubic-bezier(0.23,1,0.32,1) ${Math.random() * 0.5}s forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`@keyframes confetti-fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}
