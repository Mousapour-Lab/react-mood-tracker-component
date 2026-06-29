import { useState, useEffect, useRef } from 'react';
import {
  Download, Plus, Brain, X, Clock,
  Sun, Moon, ToggleLeft, ToggleRight, Loader2, Check,
  BookOpen, MessageSquare, LayoutGrid, FileText,
  Trash2, Edit2, Printer, Scale, Archive, Lock, Unlock,
  Lightbulb, ChevronDown, ChevronUp, AlertTriangle, Globe
} from 'lucide-react';

// ─────────────────────────── TRANSLATIONS ───────────────────────────

type Lang = 'fa' | 'en' | 'ar';

const T: Record<string, Record<string, string>> = {
  fa: {
    appName: 'NAT Tracker',
    appSubtitle: 'فضای شخصی‌سازی شده شما',
    loading: 'در حال آماده‌سازی...',
    dashboard: 'داشبورد',
    myLogs: 'ثبت‌های من',
    beliefAnalysis: 'تحلیل باور',
    quarantine: 'قرنطینه',
    logCount: 'ثبت‌ها',
    quarantineCount: 'قرنطینه',
    noLogsYet: 'هیچ فکری ثبت نشده',
    addLog: 'ثبت فکر جدید',
    editLog: 'ویرایش فکر',
    saveLog: 'ثبت لاگ ✓',
    updateLog: 'بروزرسانی لاگ ✓',
    cancel: 'لغو',
    close: 'بستن ✕',
    step1Date: '۱. تاریخ و ساعت',
    step2Situation: '۲. موقعیت',
    step3Emotions: '۳. هیجان‌ها',
    step4Thoughts: '۴. افکار',
    step5Shame: '۵. میزان شرم',
    situationPlaceholder: 'چه اتفاقی افتاد؟ کجا بودید؟',
    thoughtPlaceholder: 'چه فکری از سرت گذشت؟',
    beliefLevel: 'میزان باور',
    shame: 'شرم',
    shameLevel: 'میزان شرم',
    addAnotherThought: '+ افزودن فکر دیگر',
    noShame: 'بدون شرم',
    shameRecorded: 'ثبت می‌شود',
    shameNotRecorded: 'احساس شرم ثبت نمی‌شود',
    shameQuestion: 'چقدر احساس شرم یا بی‌ارزشی دارید؟',
    nowButton: 'همین الان',
    otherEmo: '+ دیگر',
    otherEmoInput: 'هیجان دیگر...',
    thoughts: 'افکار',
    intensity: 'شدت',
    belief: 'باور',
    edit: 'ویرایش',
    delete: 'حذف',
    deleteConfirm: 'آیا این لاگ حذف شود؟',
    deleteYes: 'بله، حذف',
    sessionNotes: 'تکلیف / یادداشت',
    newNote: '+ جدید',
    therapistQuestion: 'سوال یا تکلیف تراپیست',
    therapistQuestionPlaceholder: 'تراپیست از شما چه خواست؟',
    myAnswer: 'جواب شما',
    myAnswerPlaceholder: 'جواب خودتان را اینجا بنویسید...',
    labelColor: 'رنگ برچسب',
    saveNote: 'ذخیره ✓',
    updateNote: 'بروزرسانی ✓',
    noNotes: 'یادداشتی ندارید',
    noNotesHint: 'از دکمه «+ جدید» استفاده کنید',
    therapistLabel: 'سوال تراپیست:',
    cognitiveErrors: 'خطاهای شناختی',
    cognitiveErrorsDesc: 'این فهرست خطاهای رایج در تفکر را نشان می‌دهد. یادتان باشد همه انسان‌ها گاهی این خطاها را دارند.',
    example: 'مثال:',
    costBenefit: 'تحلیل سود و زیان',
    behaviorLabel: 'باور یا رفتار مورد بررسی',
    behaviorPlaceholder: 'مثال: کمال‌گرایی، اجتناب از موقعیت‌های اجتماعی...',
    benefits: 'سودها',
    costs: 'هزینه‌ها',
    benefit: 'سود...',
    cost: 'هزینه...',
    add: '+ اضافه',
    worthIt: 'آیا سود این رفتار به هزینه‌اش می‌ارزد؟',
    worthLabel: 'میزان ارزشمندی',
    worthYes: 'بله، می‌ارزد ✅',
    worthMaybe: 'شاید... 🤔',
    worthNo: 'نه، نمی‌ارزد ❌',
    conclusion: 'نتیجه‌گیری شما',
    conclusionPlaceholder: 'با توجه به این تحلیل، چه تصمیمی می‌گیرید؟',
    saveAnalysis: 'ذخیره تحلیل ✓',
    updateAnalysis: 'بروزرسانی تحلیل ✓',
    analyses: 'تحلیل',
    noBeliefs: 'هنوز تحلیلی ندارید',
    noBeliefsHint: 'از دکمه + یک باور یا رفتار را تحلیل کنید',
    manageQuarantine: 'مدیریت',
    quarantineEmpty: 'جعبه خالی است',
    quarantineEmptyHint: 'افکار مزاحم را با دکمه + قرنطینه کنید',
    quarantineBox: 'جعبه قرنطینه',
    quarantineDesc: 'افکارِ مزاحم و وسواسی را اینجا بنداز. آن‌ها تار می‌شوند تا بعداً با آرامش برایشان راه‌حل پیدا کنی — مغزت نباید همه چیز را همزمان حمل کند.',
    intrusive: 'فکر مزاحم',
    intrusivePlaceholder: 'چه فکری ذهنت را درگیر کرده؟',
    quarantineIt: '🔒 قرنطینه کن',
    addThought: '+ فکر',
    inQuarantine: 'در قرنطینه',
    resolved: 'حل‌شده',
    show: 'نمایش',
    hide: 'پنهان',
    clickToSee: 'کلیک کن تا ببینی',
    foundSolution: '💡 پیدا کردم! راه‌حل دارم',
    solutionPlaceholder: 'راه‌حل یا پاسخ منطقی‌ات چیست؟',
    saveSolution: '💡 ثبت راه‌حل',
    solutionLabel: '💡 راه‌حل:',
    resolvedLabel: '✓ حل شد',
    deleteAnalysis: 'آیا این تحلیل حذف شود؟',
    deleteYesAnalysis: 'بله، حذف',
    expand: 'بیشتر',
    collapse: 'کمتر',
    printSession: 'چاپ جلسه',
    darkMode: 'تاریک',
    lightMode: 'روشن',
    reportTitle: 'گزارش NAT Tracker',
    date: 'تاریخ',
    situation: 'موقعیت',
    emotions: 'هیجان‌ها',
    sessionNotesTitle: 'یادداشت‌های جلسه',
    therapistQ: 'سوال تراپیست',
    myAnswerShort: 'پاسخ من',
    logEdited: '✓ لاگ ویرایش شد',
    logSaved: '✓ لاگ جدید ثبت شد',
    logDeleted: '✕ لاگ حذف شد',
    noteSaved: '✓ یادداشت ذخیره شد',
    noteEdited: '✓ یادداشت ویرایش شد',
    noteDeleted: '✕ یادداشت حذف شد',
    analysisSaved: '✓ تحلیل ذخیره شد',
    analysisEdited: '✓ تحلیل ویرایش شد',
    analysisDeleted: '✕ تحلیل حذف شد',
    thoughtQuarantined: '✓ فکر قرنطینه شد 🔒',
    solutionSaved: '✓ راه‌حل ثبت شد 💡',
    thoughtDeleted: '✕ فکر حذف شد',
    pdfDownloaded: '✓ PDF دانلود شد',
    wordDownloaded: '✓ فایل Word دانلود شد',
    pdfError: 'خطا در خروجی PDF',
    popupBlocked: 'پاپ‌آپ مرورگر مسدود است',
    enterSituation: 'لطفا موقعیت را وارد کنید تا لاگ ثبت شود.',
    enterBehavior: 'لطفا باور یا رفتار را وارد کنید',
    enterThought: 'فکر مزاحم را بنویسید',
    enterQA: 'لطفا فیلدهای سوال و جواب را پر کنید',
    enterSolution: 'راه‌حل خود را بنویسید',
    openQuarantine: 'باز کن',
  },
  en: {
    appName: 'NAT Tracker',
    appSubtitle: 'Your personalized space',
    loading: 'Getting ready...',
    dashboard: 'Dashboard',
    myLogs: 'My Logs',
    beliefAnalysis: 'Belief Analysis',
    quarantine: 'Quarantine',
    logCount: 'Logs',
    quarantineCount: 'Quarantine',
    noLogsYet: 'No thoughts logged yet',
    addLog: 'New Thought Log',
    editLog: 'Edit Log',
    saveLog: 'Save Log ✓',
    updateLog: 'Update Log ✓',
    cancel: 'Cancel',
    close: 'Close ✕',
    step1Date: '1. Date & Time',
    step2Situation: '2. Situation',
    step3Emotions: '3. Emotions',
    step4Thoughts: '4. Thoughts',
    step5Shame: '5. Shame Level',
    situationPlaceholder: 'What happened? Where were you?',
    thoughtPlaceholder: 'What thought crossed your mind?',
    beliefLevel: 'Belief Level',
    shame: 'Shame',
    shameLevel: 'Shame Level',
    addAnotherThought: '+ Add Another Thought',
    noShame: 'No Shame',
    shameRecorded: 'Recording',
    shameNotRecorded: 'Shame will not be recorded',
    shameQuestion: 'How much shame or worthlessness do you feel?',
    nowButton: 'Right Now',
    otherEmo: '+ Other',
    otherEmoInput: 'Other emotion...',
    thoughts: 'Thoughts',
    intensity: 'Intensity',
    belief: 'Belief',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirm: 'Delete this log?',
    deleteYes: 'Yes, Delete',
    sessionNotes: 'Homework / Notes',
    newNote: '+ New',
    therapistQuestion: 'Therapist Question or Homework',
    therapistQuestionPlaceholder: 'What did your therapist ask?',
    myAnswer: 'Your Answer',
    myAnswerPlaceholder: 'Write your answer here...',
    labelColor: 'Label Color',
    saveNote: 'Save ✓',
    updateNote: 'Update ✓',
    noNotes: 'No notes yet',
    noNotesHint: 'Use the "+ New" button to add notes',
    therapistLabel: 'Therapist:',
    cognitiveErrors: 'Cognitive Distortions',
    cognitiveErrorsDesc: 'This list shows common thinking errors. Remember, all humans experience these distortions at times.',
    example: 'Example:',
    costBenefit: 'Cost-Benefit Analysis',
    behaviorLabel: 'Belief or Behavior to Analyze',
    behaviorPlaceholder: 'e.g. Perfectionism, avoiding social situations...',
    benefits: 'Benefits',
    costs: 'Costs',
    benefit: 'Benefit...',
    cost: 'Cost...',
    add: '+ Add',
    worthIt: 'Is the benefit worth the cost?',
    worthLabel: 'Worth Rating',
    worthYes: 'Yes, worth it ✅',
    worthMaybe: 'Maybe... 🤔',
    worthNo: 'Not worth it ❌',
    conclusion: 'Your Conclusion',
    conclusionPlaceholder: 'Based on this analysis, what will you decide?',
    saveAnalysis: 'Save Analysis ✓',
    updateAnalysis: 'Update Analysis ✓',
    analyses: 'analyses',
    noBeliefs: 'No analyses yet',
    noBeliefsHint: 'Use + to analyze a belief or behavior',
    manageQuarantine: 'Manage',
    quarantineEmpty: 'Box is empty',
    quarantineEmptyHint: 'Quarantine intrusive thoughts with the + button',
    quarantineBox: 'Quarantine Box',
    quarantineDesc: 'Drop intrusive or obsessive thoughts here. They get blurred so you can calmly find solutions later — your mind shouldn\'t carry everything at once.',
    intrusive: 'Intrusive Thought',
    intrusivePlaceholder: 'What thought is consuming you?',
    quarantineIt: '🔒 Quarantine It',
    addThought: '+ Thought',
    inQuarantine: 'In Quarantine',
    resolved: 'Resolved',
    show: 'Show',
    hide: 'Hide',
    clickToSee: 'Click to reveal',
    foundSolution: '💡 I found a solution!',
    solutionPlaceholder: 'What is your logical response or solution?',
    saveSolution: '💡 Save Solution',
    solutionLabel: '💡 Solution:',
    resolvedLabel: '✓ Resolved',
    deleteAnalysis: 'Delete this analysis?',
    deleteYesAnalysis: 'Yes, Delete',
    expand: 'More',
    collapse: 'Less',
    printSession: 'Print Session',
    darkMode: 'Dark',
    lightMode: 'Light',
    reportTitle: 'NAT Tracker Report',
    date: 'Date',
    situation: 'Situation',
    emotions: 'Emotions',
    sessionNotesTitle: 'Session Notes',
    therapistQ: 'Therapist Question',
    myAnswerShort: 'My Answer',
    logEdited: '✓ Log updated',
    logSaved: '✓ New log saved',
    logDeleted: '✕ Log deleted',
    noteSaved: '✓ Note saved',
    noteEdited: '✓ Note updated',
    noteDeleted: '✕ Note deleted',
    analysisSaved: '✓ Analysis saved',
    analysisEdited: '✓ Analysis updated',
    analysisDeleted: '✕ Analysis deleted',
    thoughtQuarantined: '✓ Thought quarantined 🔒',
    solutionSaved: '✓ Solution saved 💡',
    thoughtDeleted: '✕ Thought deleted',
    pdfDownloaded: '✓ PDF downloaded',
    wordDownloaded: '✓ Word file downloaded',
    pdfError: 'PDF export error',
    popupBlocked: 'Browser popup blocked',
    enterSituation: 'Please enter the situation to save the log.',
    enterBehavior: 'Please enter the belief or behavior',
    enterThought: 'Write the intrusive thought',
    enterQA: 'Please fill in both question and answer fields',
    enterSolution: 'Write your solution',
    openQuarantine: 'Open',
  },
  ar: {
    appName: 'NAT Tracker',
    appSubtitle: 'مساحتك الشخصية',
    loading: 'جاري التحضير...',
    dashboard: 'لوحة التحكم',
    myLogs: 'سجلاتي',
    beliefAnalysis: 'تحليل المعتقد',
    quarantine: 'العزل',
    logCount: 'السجلات',
    quarantineCount: 'العزل',
    noLogsYet: 'لا توجد أفكار مسجّلة بعد',
    addLog: 'تسجيل فكرة جديدة',
    editLog: 'تعديل السجل',
    saveLog: 'حفظ السجل ✓',
    updateLog: 'تحديث السجل ✓',
    cancel: 'إلغاء',
    close: 'إغلاق ✕',
    step1Date: '١. التاريخ والوقت',
    step2Situation: '٢. الموقف',
    step3Emotions: '٣. المشاعر',
    step4Thoughts: '٤. الأفكار',
    step5Shame: '٥. مستوى الخجل',
    situationPlaceholder: 'ماذا حدث؟ أين كنت؟',
    thoughtPlaceholder: 'ما الفكرة التي مرّت بذهنك؟',
    beliefLevel: 'مستوى الإيمان بالفكرة',
    shame: 'الخجل',
    shameLevel: 'مستوى الخجل',
    addAnotherThought: '+ إضافة فكرة أخرى',
    noShame: 'بلا خجل',
    shameRecorded: 'يتم التسجيل',
    shameNotRecorded: 'لن يتم تسجيل الخجل',
    shameQuestion: 'كم تشعر بالخجل أو عدم القيمة؟',
    nowButton: 'الآن',
    otherEmo: '+ أخرى',
    otherEmoInput: 'مشاعر أخرى...',
    thoughts: 'الأفكار',
    intensity: 'الشدة',
    belief: 'الإيمان',
    edit: 'تعديل',
    delete: 'حذف',
    deleteConfirm: 'هل تريد حذف هذا السجل؟',
    deleteYes: 'نعم، احذف',
    sessionNotes: 'الواجبات / الملاحظات',
    newNote: '+ جديد',
    therapistQuestion: 'سؤال أو واجب المعالج',
    therapistQuestionPlaceholder: 'ماذا طلب منك معالجك؟',
    myAnswer: 'إجابتك',
    myAnswerPlaceholder: 'اكتب إجابتك هنا...',
    labelColor: 'لون التسمية',
    saveNote: 'حفظ ✓',
    updateNote: 'تحديث ✓',
    noNotes: 'لا توجد ملاحظات',
    noNotesHint: 'استخدم زر "+ جديد" للإضافة',
    therapistLabel: 'المعالج:',
    cognitiveErrors: 'الأخطاء المعرفية',
    cognitiveErrorsDesc: 'تعرض هذه القائمة الأخطاء الشائعة في التفكير. تذكر أن جميع البشر يعانون من هذه الأخطاء أحياناً.',
    example: 'مثال:',
    costBenefit: 'تحليل التكلفة والفائدة',
    behaviorLabel: 'المعتقد أو السلوك المراد تحليله',
    behaviorPlaceholder: 'مثال: الكمالية، تجنب المواقف الاجتماعية...',
    benefits: 'الفوائد',
    costs: 'التكاليف',
    benefit: 'فائدة...',
    cost: 'تكلفة...',
    add: '+ إضافة',
    worthIt: 'هل تستحق الفائدة تكلفتها؟',
    worthLabel: 'درجة الجدارة',
    worthYes: 'نعم، تستحق ✅',
    worthMaybe: 'ربما... 🤔',
    worthNo: 'لا تستحق ❌',
    conclusion: 'استنتاجك',
    conclusionPlaceholder: 'بناءً على هذا التحليل، ما قرارك؟',
    saveAnalysis: 'حفظ التحليل ✓',
    updateAnalysis: 'تحديث التحليل ✓',
    analyses: 'تحليل',
    noBeliefs: 'لا توجد تحليلات بعد',
    noBeliefsHint: 'استخدم + لتحليل معتقد أو سلوك',
    manageQuarantine: 'إدارة',
    quarantineEmpty: 'الصندوق فارغ',
    quarantineEmptyHint: 'ضع الأفكار المزعجة في العزل بزر +',
    quarantineBox: 'صندوق العزل',
    quarantineDesc: 'ضع هنا الأفكار الوسواسية والمزعجة. ستُعتَم حتى تجد لها حلاً لاحقاً بهدوء — عقلك لا يجب أن يحمل كل شيء في آنٍ واحد.',
    intrusive: 'فكرة مزعجة',
    intrusivePlaceholder: 'ما الفكرة التي تشغل تفكيرك؟',
    quarantineIt: '🔒 ضعها في العزل',
    addThought: '+ فكرة',
    inQuarantine: 'في العزل',
    resolved: 'محلولة',
    show: 'إظهار',
    hide: 'إخفاء',
    clickToSee: 'انقر للكشف',
    foundSolution: '💡 وجدت حلاً!',
    solutionPlaceholder: 'ما ردك المنطقي أو حلك؟',
    saveSolution: '💡 حفظ الحل',
    solutionLabel: '💡 الحل:',
    resolvedLabel: '✓ تم الحل',
    deleteAnalysis: 'هل تريد حذف هذا التحليل؟',
    deleteYesAnalysis: 'نعم، احذف',
    expand: 'المزيد',
    collapse: 'أقل',
    printSession: 'طباعة الجلسة',
    darkMode: 'داكن',
    lightMode: 'فاتح',
    reportTitle: 'تقرير NAT Tracker',
    date: 'التاريخ',
    situation: 'الموقف',
    emotions: 'المشاعر',
    sessionNotesTitle: 'ملاحظات الجلسة',
    therapistQ: 'سؤال المعالج',
    myAnswerShort: 'إجابتي',
    logEdited: '✓ تم تحديث السجل',
    logSaved: '✓ تم حفظ السجل الجديد',
    logDeleted: '✕ تم حذف السجل',
    noteSaved: '✓ تم حفظ الملاحظة',
    noteEdited: '✓ تم تحديث الملاحظة',
    noteDeleted: '✕ تم حذف الملاحظة',
    analysisSaved: '✓ تم حفظ التحليل',
    analysisEdited: '✓ تم تحديث التحليل',
    analysisDeleted: '✕ تم حذف التحليل',
    thoughtQuarantined: '✓ تم عزل الفكرة 🔒',
    solutionSaved: '✓ تم حفظ الحل 💡',
    thoughtDeleted: '✕ تم حذف الفكرة',
    pdfDownloaded: '✓ تم تنزيل PDF',
    wordDownloaded: '✓ تم تنزيل ملف Word',
    pdfError: 'خطأ في تصدير PDF',
    popupBlocked: 'النوافذ المنبثقة محجوبة',
    enterSituation: 'يرجى إدخال الموقف لحفظ السجل.',
    enterBehavior: 'يرجى إدخال المعتقد أو السلوك',
    enterThought: 'اكتب الفكرة المزعجة',
    enterQA: 'يرجى ملء حقلي السؤال والجواب',
    enterSolution: 'اكتب حلك',
    openQuarantine: 'افتح',
  }
};

// ─────────────────────────── CONSTANTS ───────────────────────────

const EMOTION_COLORS: Record<string, any> = {
  'اضطراب':     { hex: '#f59e0b', bgL: '#fef3c7', bgD: 'rgba(245,158,11,0.15)', txL: '#92400e', txD: '#fbbf24', bdL: '#fcd34d', bdD: 'rgba(245,158,11,0.35)' },
  'غم':         { hex: '#3b82f6', bgL: '#dbeafe', bgD: 'rgba(59,130,246,0.15)',  txL: '#1e40af', txD: '#60a5fa', bdL: '#93c5fd', bdD: 'rgba(59,130,246,0.35)' },
  'خشم':        { hex: '#ef4444', bgL: '#fee2e2', bgD: 'rgba(239,68,68,0.15)',   txL: '#991b1b', txD: '#f87171', bdL: '#fca5a5', bdD: 'rgba(239,68,68,0.35)'  },
  'ترس':        { hex: '#8b5cf6', bgL: '#ede9fe', bgD: 'rgba(139,92,246,0.15)',  txL: '#5b21b6', txD: '#a78bfa', bdL: '#c4b5fd', bdD: 'rgba(139,92,246,0.35)' },
  'عذاب وجدان': { hex: '#14b8a6', bgL: '#ccfbf1', bgD: 'rgba(20,184,166,0.15)', txL: '#0f766e', txD: '#2dd4bf', bdL: '#5eead4', bdD: 'rgba(20,184,166,0.35)' },
  'خجالت':      { hex: '#ec4899', bgL: '#fce7f3', bgD: 'rgba(236,72,153,0.15)', txL: '#9d174d', txD: '#f472b6', bdL: '#f9a8d4', bdD: 'rgba(236,72,153,0.35)' },
  'شادی':       { hex: '#22c55e', bgL: '#dcfce7', bgD: 'rgba(34,197,94,0.15)',   txL: '#15803d', txD: '#4ade80', bdL: '#86efac', bdD: 'rgba(34,197,94,0.35)'  },
  'ناامیدی':    { hex: '#6b7280', bgL: '#f3f4f6', bgD: 'rgba(107,114,128,0.15)',txL: '#374151', txD: '#9ca3af', bdL: '#d1d5db', bdD: 'rgba(107,114,128,0.35)' },
  'شرم':        { hex: '#4c1d95', bgL: '#f5f3ff', bgD: 'rgba(76,29,149,0.15)',  txL: '#5b21b6', txD: '#c4b5fd', bdL: '#ddd6fe', bdD: 'rgba(76,29,149,0.35)' },
  'حسادت':      { hex: '#84cc16', bgL: '#f7fee7', bgD: 'rgba(132,204,22,0.15)',  txL: '#3f6212', txD: '#a3e635', bdL: '#bef264', bdD: 'rgba(132,204,22,0.35)' },
  'دلتنگی':     { hex: '#a78bfa', bgL: '#ede9fe', bgD: 'rgba(167,139,250,0.15)', txL: '#5b21b6', txD: '#c4b5fd', bdL: '#ddd6fe', bdD: 'rgba(167,139,250,0.35)'},
  'تنهایی':     { hex: '#6366f1', bgL: '#e0e7ff', bgD: 'rgba(99,102,241,0.15)',  txL: '#3730a3', txD: '#818cf8', bdL: '#a5b4fc', bdD: 'rgba(99,102,241,0.35)' },
  'ناامنی':     { hex: '#f97316', bgL: '#ffedd5', bgD: 'rgba(249,115,22,0.15)',  txL: '#9a3412', txD: '#fb923c', bdL: '#fdba74', bdD: 'rgba(249,115,22,0.35)' },
  // English emotions
  'Anxiety':    { hex: '#f59e0b', bgL: '#fef3c7', bgD: 'rgba(245,158,11,0.15)', txL: '#92400e', txD: '#fbbf24', bdL: '#fcd34d', bdD: 'rgba(245,158,11,0.35)' },
  'Sadness':    { hex: '#3b82f6', bgL: '#dbeafe', bgD: 'rgba(59,130,246,0.15)',  txL: '#1e40af', txD: '#60a5fa', bdL: '#93c5fd', bdD: 'rgba(59,130,246,0.35)' },
  'Anger':      { hex: '#ef4444', bgL: '#fee2e2', bgD: 'rgba(239,68,68,0.15)',   txL: '#991b1b', txD: '#f87171', bdL: '#fca5a5', bdD: 'rgba(239,68,68,0.35)'  },
  'Fear':       { hex: '#8b5cf6', bgL: '#ede9fe', bgD: 'rgba(139,92,246,0.15)',  txL: '#5b21b6', txD: '#a78bfa', bdL: '#c4b5fd', bdD: 'rgba(139,92,246,0.35)' },
  'Guilt':      { hex: '#14b8a6', bgL: '#ccfbf1', bgD: 'rgba(20,184,166,0.15)', txL: '#0f766e', txD: '#2dd4bf', bdL: '#5eead4', bdD: 'rgba(20,184,166,0.35)' },
  'Embarrassment': { hex: '#ec4899', bgL: '#fce7f3', bgD: 'rgba(236,72,153,0.15)', txL: '#9d174d', txD: '#f472b6', bdL: '#f9a8d4', bdD: 'rgba(236,72,153,0.35)' },
  'Joy':        { hex: '#22c55e', bgL: '#dcfce7', bgD: 'rgba(34,197,94,0.15)',   txL: '#15803d', txD: '#4ade80', bdL: '#86efac', bdD: 'rgba(34,197,94,0.35)'  },
  'Hopelessness': { hex: '#6b7280', bgL: '#f3f4f6', bgD: 'rgba(107,114,128,0.15)',txL: '#374151', txD: '#9ca3af', bdL: '#d1d5db', bdD: 'rgba(107,114,128,0.35)' },
  'Shame':      { hex: '#4c1d95', bgL: '#f5f3ff', bgD: 'rgba(76,29,149,0.15)',  txL: '#5b21b6', txD: '#c4b5fd', bdL: '#ddd6fe', bdD: 'rgba(76,29,149,0.35)' },
  'Jealousy':   { hex: '#84cc16', bgL: '#f7fee7', bgD: 'rgba(132,204,22,0.15)',  txL: '#3f6212', txD: '#a3e635', bdL: '#bef264', bdD: 'rgba(132,204,22,0.35)' },
  'Longing':    { hex: '#a78bfa', bgL: '#ede9fe', bgD: 'rgba(167,139,250,0.15)', txL: '#5b21b6', txD: '#c4b5fd', bdL: '#ddd6fe', bdD: 'rgba(167,139,250,0.35)'},
  'Loneliness': { hex: '#6366f1', bgL: '#e0e7ff', bgD: 'rgba(99,102,241,0.15)',  txL: '#3730a3', txD: '#818cf8', bdL: '#a5b4fc', bdD: 'rgba(99,102,241,0.35)' },
  'Insecurity': { hex: '#f97316', bgL: '#ffedd5', bgD: 'rgba(249,115,22,0.15)',  txL: '#9a3412', txD: '#fb923c', bdL: '#fdba74', bdD: 'rgba(249,115,22,0.35)' },
  // Arabic emotions
  'قلق':        { hex: '#f59e0b', bgL: '#fef3c7', bgD: 'rgba(245,158,11,0.15)', txL: '#92400e', txD: '#fbbf24', bdL: '#fcd34d', bdD: 'rgba(245,158,11,0.35)' },
  'حزن':        { hex: '#3b82f6', bgL: '#dbeafe', bgD: 'rgba(59,130,246,0.15)',  txL: '#1e40af', txD: '#60a5fa', bdL: '#93c5fd', bdD: 'rgba(59,130,246,0.35)' },
  'غضب':        { hex: '#ef4444', bgL: '#fee2e2', bgD: 'rgba(239,68,68,0.15)',   txL: '#991b1b', txD: '#f87171', bdL: '#fca5a5', bdD: 'rgba(239,68,68,0.35)'  },
  'خوف':        { hex: '#8b5cf6', bgL: '#ede9fe', bgD: 'rgba(139,92,246,0.15)',  txL: '#5b21b6', txD: '#a78bfa', bdL: '#c4b5fd', bdD: 'rgba(139,92,246,0.35)' },
  'ذنب':        { hex: '#14b8a6', bgL: '#ccfbf1', bgD: 'rgba(20,184,166,0.15)', txL: '#0f766e', txD: '#2dd4bf', bdL: '#5eead4', bdD: 'rgba(20,184,166,0.35)' },
  'إحراج':      { hex: '#ec4899', bgL: '#fce7f3', bgD: 'rgba(236,72,153,0.15)', txL: '#9d174d', txD: '#f472b6', bdL: '#f9a8d4', bdD: 'rgba(236,72,153,0.35)' },
  'فرح':        { hex: '#22c55e', bgL: '#dcfce7', bgD: 'rgba(34,197,94,0.15)',   txL: '#15803d', txD: '#4ade80', bdL: '#86efac', bdD: 'rgba(34,197,94,0.35)'  },
  'يأس':        { hex: '#6b7280', bgL: '#f3f4f6', bgD: 'rgba(107,114,128,0.15)',txL: '#374151', txD: '#9ca3af', bdL: '#d1d5db', bdD: 'rgba(107,114,128,0.35)' },
  'خجل':        { hex: '#4c1d95', bgL: '#f5f3ff', bgD: 'rgba(76,29,149,0.15)',  txL: '#5b21b6', txD: '#c4b5fd', bdL: '#ddd6fe', bdD: 'rgba(76,29,149,0.35)' },
  'غيرة':       { hex: '#84cc16', bgL: '#f7fee7', bgD: 'rgba(132,204,22,0.15)',  txL: '#3f6212', txD: '#a3e635', bdL: '#bef264', bdD: 'rgba(132,204,22,0.35)' },
  'شوق':        { hex: '#a78bfa', bgL: '#ede9fe', bgD: 'rgba(167,139,250,0.15)', txL: '#5b21b6', txD: '#c4b5fd', bdL: '#ddd6fe', bdD: 'rgba(167,139,250,0.35)'},
  'وحدة':       { hex: '#6366f1', bgL: '#e0e7ff', bgD: 'rgba(99,102,241,0.15)',  txL: '#3730a3', txD: '#818cf8', bdL: '#a5b4fc', bdD: 'rgba(99,102,241,0.35)' },
  'انعدام الأمان': { hex: '#f97316', bgL: '#ffedd5', bgD: 'rgba(249,115,22,0.15)', txL: '#9a3412', txD: '#fb923c', bdL: '#fdba74', bdD: 'rgba(249,115,22,0.35)' },
};

const DEFAULT_EMOTIONS: Record<string, string[]> = {
  fa: ['اضطراب','غم','خشم','ترس','عذاب وجدان','خجالت','شرم','شادی','ناامیدی','دلتنگی','تنهایی','حسادت','ناامنی'],
  en: ['Anxiety','Sadness','Anger','Fear','Guilt','Embarrassment','Shame','Joy','Hopelessness','Longing','Loneliness','Jealousy','Insecurity'],
  ar: ['قلق','حزن','غضب','خوف','ذنب','إحراج','خجل','فرح','يأس','شوق','وحدة','غيرة','انعدام الأمان'],
};

const COGNITIVE_ERRORS: Record<string, {id:number,name:string,desc:string,ex:string}[]> = {
  fa: [
    { id:1,  name:'ذهن خوانی',                   desc:'فرض می‌گذارید که می‌دانید آدم‌ها چه فکر می‌کنند، بی‌آنکه شواهد کافی در مورد افکارشان داشته باشید.',  ex:'او فکر می‌کند من یک بازنده‌ام.' },
    { id:2,  name:'پیش گویی',                     desc:'آینده را پیش بینی می‌کنید. پیش بینی می‌کنید که اوضاع بدتر خواهد شد یا خطری در پیش است.',           ex:'در امتحان قبول نخواهم شد.' },
    { id:3,  name:'فاجعه سازی',                   desc:'بر این باورید که آنچه اتفاق افتاده آنچنان دردناک و غیرقابل تحمل خواهد بود که شما نمی‌توانید آن را تحمل کنید.',  ex:'اگر در امتحان رد شوم، وحشتناک است.' },
    { id:4,  name:'برچسب زدن',                    desc:'یک ویژگی منفی خیلی کلی را به خود و دیگران نسبت می‌دهید.',                                              ex:'من دوست داشتنی نیستم.' },
    { id:5,  name:'دست کم گرفتن جنبه‌های مثبت',  desc:'مدعی هستید که دستاوردهای مثبت شما یا دیگران ناچیز و جزئی هستند.',                                    ex:'این وظیفه زن خانه است.' },
    { id:6,  name:'فیلتر منفی',                   desc:'تقریباً منحصراً بر جنبه‌های منفی متمرکز می‌شوید و به ندرت به جنبه‌های مثبت توجه می‌کنید.',             ex:'گاهی به یاد می‌آزید چه تعداد آدم‌هایی مرا دوست ندارند.' },
    { id:7,  name:'تعمیم افراطی',                 desc:'صرفاً براساس یک رویداد خاص، یک الگوی کلی منفی را استنباط می‌کنید.',                                  ex:'این اتفاق همیشه برای من پیش می‌آید.' },
    { id:8,  name:'تفکر دو قطبی',                 desc:'آدم‌ها یا اتفاق‌ها را به صورت همه یا هیچ می‌بینید.',                                                    ex:'همه مرا کنار گذاشته‌اند.' },
    { id:9,  name:'بایدها',                        desc:'رویدادها را بر مبنای این‌که چطور باید بودند تفسیر می‌کنید، نه بر مبنای آنکه واقعاً چطور هستند.',      ex:'باید خوب عمل کنم، و اگر خوب عمل نکنم یعنی شکست خورده‌ام.' },
    { id:10, name:'شخصی سازی',                    desc:'به خاطر اتفاقات ناخوشایند منفی، تقصیر زیادی را به صورت غیرمنصفانه به خود نسبت می‌دهید.',              ex:'ازدواجم به بن بست رسید، چون من شکست خوردم.' },
    { id:11, name:'مقصر دانستن',                  desc:'فرد دیگری را منبع اصلی احساسات منفی‌تان می‌دانید.',                                                    ex:'تقصیر اوست که من الان این گونه احساس می‌کنم.' },
    { id:12, name:'مقایسه‌های غیرمنصفانه',        desc:'اتفاق‌ها را براساس استانداردهایی تفسیر می‌کنید که واقع‌بینانه نیستند.',                                 ex:'او در مقایسه با من موفق‌تر است.' },
    { id:13, name:'همیشه پشیمان بودن',            desc:'تمرکز ذهنی با این‌که از این‌ها عمل کنم بهتر از آن‌ها می‌توانستم عمل کنم.',                            ex:'اگر تلاش کرده بودم می‌توانستم شغل بهتری داشته باشم.' },
    { id:14, name:'چه می‌شود اگر؟',               desc:'یک سلسله سؤالات «چه می‌شود اگر؟» می‌پرسید.',                                                           ex:'اگر مضطرب شوم چه؟' },
    { id:15, name:'استدلال هیجانی',               desc:'اجازه می‌دهید که احساساتتان، تفسیرتان از واقعیت را هدایت کنند.',                                        ex:'احساس افسردگی می‌کنم، و این یعنی ازدواجم به بن بست خورده است.' },
    { id:16, name:'ناتوانی در عدم تأیید شواهد',  desc:'همه مدارک یا شواهد بر علیه افکار منفی‌تان را رد می‌کنید.',                                              ex:'مشکلات عمیق‌تر از این حرف‌ها هستند.' },
    { id:17, name:'برخورد قضاوتی',               desc:'خودتان، دیگران و اتفاق‌ها را به جای توصیف، به صورت سیاه و سفید ارزیابی می‌کنید.',                       ex:'در دانشگاه خوب درس نخواندم.' },
  ],
  en: [
    { id:1,  name:'Mind Reading',           desc:'You assume you know what people are thinking, without sufficient evidence.',                                   ex:'He thinks I\'m a loser.' },
    { id:2,  name:'Fortune Telling',        desc:'You predict that things will turn out badly.',                                                                  ex:'I\'m going to fail the exam.' },
    { id:3,  name:'Catastrophizing',        desc:'You believe that what has happened or will happen will be so awful and unbearable that you won\'t be able to stand it.', ex:'If I fail, it will be terrible.' },
    { id:4,  name:'Labeling',              desc:'You assign a global negative trait to yourself and others.',                                                      ex:'I\'m unlovable.' },
    { id:5,  name:'Discounting Positives', desc:'You claim that the positive things you or others do are trivial.',                                                ex:'That\'s what anyone would do.' },
    { id:6,  name:'Negative Filtering',    desc:'You almost exclusively focus on the negatives and seldom notice the positives.',                                 ex:'Look at all the people who don\'t like me.' },
    { id:7,  name:'Overgeneralizing',      desc:'You perceive a global pattern of negatives on the basis of a single incident.',                                  ex:'This always happens to me.' },
    { id:8,  name:'Black & White Thinking',desc:'You view events or people in all-or-nothing terms.',                                                             ex:'Everyone has abandoned me.' },
    { id:9,  name:'Should Statements',     desc:'You interpret events in terms of how things should be rather than simply focusing on what is.',                  ex:'I should always do well; if I don\'t, it means I\'ve failed.' },
    { id:10, name:'Personalizing',         desc:'You attribute a disproportionate amount of the blame to yourself for negative events.',                          ex:'My marriage failed because I failed.' },
    { id:11, name:'Blaming',              desc:'You focus on the other person as the source of your negative feelings.',                                          ex:'It\'s his fault I feel this way.' },
    { id:12, name:'Unfair Comparisons',   desc:'You interpret events in terms of standards that are unrealistic.',                                               ex:'She\'s more successful than me.' },
    { id:13, name:'Regret Orientation',   desc:'You focus on the idea that you could have done better in the past.',                                             ex:'If I had tried harder, I could have had a better job.' },
    { id:14, name:'What If?',             desc:'You keep asking a series of "what if" questions and are never satisfied with any answer.',                        ex:'But what if I get anxious?' },
    { id:15, name:'Emotional Reasoning',  desc:'You let your feelings guide your interpretation of reality.',                                                    ex:'I feel depressed, so my marriage must be a failure.' },
    { id:16, name:'Inability to Disconfirm', desc:'You reject any evidence or arguments that might contradict your negative thoughts.',                          ex:'The problems are deeper than that.' },
    { id:17, name:'Judgmental Focus',     desc:'You evaluate yourself, others, and events in terms of black-and-white judgments rather than simply describing them.', ex:'I didn\'t do well in school.' },
  ],
  ar: [
    { id:1,  name:'قراءة الأفكار',          desc:'تفترض أنك تعرف ما يفكر فيه الآخرون دون دليل كافٍ.',                                                           ex:'إنه يعتقد أنني خاسر.' },
    { id:2,  name:'التنبؤ بالمستقبل',        desc:'تتنبأ بأن الأمور ستسوء.',                                                                                      ex:'سأفشل في الامتحان.' },
    { id:3,  name:'الكارثية',               desc:'تعتقد أن ما سيحدث سيكون مروعاً لا يمكنك تحمله.',                                                               ex:'إذا فشلت، سيكون الأمر مرعباً.' },
    { id:4,  name:'التسمية السلبية',         desc:'تنسب صفة سلبية عامة لنفسك أو للآخرين.',                                                                        ex:'أنا غير محبوب.' },
    { id:5,  name:'تقليل الإيجابيات',       desc:'تدّعي أن الإنجازات الإيجابية لك أو للآخرين ضئيلة.',                                                            ex:'هذا ما يفعله أي شخص.' },
    { id:6,  name:'الفلترة السلبية',        desc:'تركز تقريباً حصرياً على الجوانب السلبية.',                                                                       ex:'انظر كم من الناس لا يحبونني.' },
    { id:7,  name:'التعميم المفرط',          desc:'تستنتج نمطاً سلبياً عاماً من حادثة واحدة.',                                                                     ex:'هذا يحدث لي دائماً.' },
    { id:8,  name:'التفكير الأبيض والأسود',  desc:'ترى الأشخاص أو الأحداث بشكل كل أو لا شيء.',                                                                   ex:'الجميع تخلى عني.' },
    { id:9,  name:'يجب أن...',              desc:'تفسّر الأحداث بناءً على كيف يجب أن تكون وليس ما هي عليه فعلاً.',                                               ex:'يجب أن أؤدي بشكل جيد، وإلا فأنا فاشل.' },
    { id:10, name:'التشخيص الذاتي',         desc:'تلوم نفسك بشكل مفرط وغير عادل على الأحداث السلبية.',                                                           ex:'فشل زواجي لأنني فشلت.' },
    { id:11, name:'إلقاء اللوم على الآخرين',desc:'ترى الآخر مصدراً رئيسياً لمشاعرك السلبية.',                                                                     ex:'إنه المسؤول عن شعوري هكذا.' },
    { id:12, name:'المقارنات غير العادلة',  desc:'تفسّر الأحداث وفق معايير غير واقعية.',                                                                         ex:'هي أكثر نجاحاً مني.' },
    { id:13, name:'التوجه نحو الندم',        desc:'تركز على أنك كنت تستطيع فعل أفضل في الماضي.',                                                                   ex:'لو اجتهدت، لحصلت على وظيفة أفضل.' },
    { id:14, name:'ماذا لو؟',               desc:'تطرح سلسلة من أسئلة "ماذا لو؟" ولا تقتنع بأي إجابة.',                                                          ex:'ولكن ماذا لو أصبت بالقلق؟' },
    { id:15, name:'الاستدلال العاطفي',       desc:'تدع مشاعرك تحكم تفسيرك للواقع.',                                                                               ex:'أشعر بالاكتئاب، إذن زواجي فاشل.' },
    { id:16, name:'عدم القدرة على دحض الأدلة',desc:'ترفض أي دليل أو حجة قد تتعارض مع أفكارك السلبية.',                                                          ex:'المشكلات أعمق من ذلك.' },
    { id:17, name:'التركيز القضائي',         desc:'تقيّم نفسك والآخرين والأحداث بأحكام متطرفة بدلاً من وصفها.',                                                    ex:'لم أدرس جيداً في الجامعة.' },
  ],
};

const NOTE_COLORS = ['#f59e0b','#22c55e','#3b82f6','#ec4899','#a78bfa','#f97316'];
const SHAMSI_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

const loadScript = (src: string) => new Promise<void>((res, rej) => {
  if (document.querySelector(`script[src="${src}"]`)) return res();
  const s = document.createElement('script');
  s.src = src; s.onload = () => res(); s.onerror = () => rej(new Error(src));
  document.head.appendChild(s);
});

const toPersianNum = (n: number | string) => n.toString().replace(/\d/g, (x: string) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(x)]);
const padZero = (n: number, lang: Lang) => {
  const s = n < 10 ? '0' + n : '' + n;
  return lang === 'fa' ? s.replace(/\d/g, (x) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(x)]) : s;
};

const getShamsiParts = () => {
  const d = new Date();
  const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', calendar: 'persian'
  }).formatToParts(d);
  const val = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
  return { y: val('year'), m: val('month'), d: val('day'), h: val('hour'), min: val('minute') };
};

const getGregorianParts = () => {
  const d = new Date();
  return { y: d.getFullYear(), m: d.getMonth()+1, d: d.getDate(), h: d.getHours(), min: d.getMinutes() };
};

const getTimestampFromParts = (p: any) => p.y * 100000000 + p.m * 1000000 + p.d * 10000 + p.h * 100 + p.min;

const formatShamsi = ({y, m, d, h, min}: any) =>
  `${toPersianNum(d)} ${SHAMSI_MONTHS[m-1]} ${toPersianNum(y)} - ${padZero(h,'fa')}:${padZero(min,'fa')}`;

const formatGregorian = ({y, m, d, h, min}: any) => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[m-1]} ${d}, ${y} - ${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
};

const formatDate = (parts: any, lang: Lang) => lang === 'fa' ? formatShamsi(parts) : formatGregorian(parts);
const getNowParts = (lang: Lang) => lang === 'fa' ? getShamsiParts() : getGregorianParts();
const getNow = (lang: Lang) => formatDate(getNowParts(lang), lang);

const getEC = (name: string, dark: boolean) => {
  const c = EMOTION_COLORS[name];
  if (!c) return { bg: dark ? 'rgba(99,102,241,0.15)' : '#e0e7ff', tx: dark ? '#818cf8' : '#3730a3', bd: dark ? 'rgba(99,102,241,0.35)' : '#a5b4fc', hex: '#6366f1' };
  return { bg: dark ? c.bgD : c.bgL, tx: dark ? c.txD : c.txL, bd: dark ? c.bdD : c.bdL, hex: c.hex };
};

const numFmt = (n: number, lang: Lang) => lang === 'fa' ? toPersianNum(n) : String(n);

// ─────────────────────────── ANIMATIONS CSS ───────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.8); opacity: 0; }
  }
  @keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes slideInUp {
    from { transform: translateY(60px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes slideUpFade {
    0% { opacity: 0; transform: translate(-50%, 20px); }
    15% { opacity: 1; transform: translate(-50%, 0); }
    75% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, -10px); }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fabExpand {
    from { opacity: 0; transform: scale(0.5) translateX(-10px); }
    to { opacity: 1; transform: scale(1) translateX(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50% { transform: translateY(-8px) rotate(2deg); }
  }
  @keyframes lockBounce {
    0%, 100% { transform: scale(1) rotate(-5deg); }
    50% { transform: scale(1.15) rotate(5deg); }
  }
  @keyframes scanline {
    0% { top: -10%; }
    100% { top: 110%; }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
    50% { box-shadow: 0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.2); }
  }
  @keyframes ripple {
    0% { transform: scale(0); opacity: 0.6; }
    100% { transform: scale(4); opacity: 0; }
  }
  @keyframes headerGlow {
    0%, 100% { text-shadow: 0 0 20px rgba(99,102,241,0.5); }
    50% { text-shadow: 0 0 40px rgba(99,102,241,0.9), 0 0 60px rgba(139,92,246,0.4); }
  }
  .native-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 6px;
    outline: none;
    margin: 0;
    padding: 0;
    background: linear-gradient(to left, var(--slider-color) var(--slider-fill), rgba(128,128,128,0.15) var(--slider-fill));
  }
  .native-slider[dir="ltr"] {
    background: linear-gradient(to right, var(--slider-color) var(--slider-fill), rgba(128,128,128,0.15) var(--slider-fill));
  }
  .native-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px; height: 24px;
    border-radius: 50%;
    background: white;
    border: 3px solid var(--slider-color);
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: transform 0.15s ease;
  }
  .native-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
  .native-slider::-moz-range-thumb {
    width: 24px; height: 24px;
    border-radius: 50%;
    background: white;
    border: 3px solid var(--slider-color);
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    cursor: pointer;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

  .lang-btn {
    transition: all 0.2s cubic-bezier(.34,1.56,.64,1);
  }
  .lang-btn:hover {
    transform: translateY(-2px);
  }
  .stat-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .stat-card:hover {
    transform: translateY(-3px);
  }
  .tab-btn {
    transition: all 0.25s cubic-bezier(.34,1.56,.64,1);
  }
  .tab-btn:hover:not(.tab-active) {
    transform: translateY(-1px);
  }
  .log-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .log-card:hover {
    transform: translateY(-2px);
  }
  .fab-btn {
    transition: all 0.25s cubic-bezier(.34,1.56,.64,1);
  }
  .fab-btn:hover {
    transform: scale(1.08);
  }
  .nav-btn {
    transition: all 0.2s ease;
  }
  .nav-btn:hover {
    transform: translateY(-2px);
  }
`;

// ─────────────────────────── MICRO COMPONENTS ───────────────────────────

const InitialLoading = ({ lang }: { lang: Lang }) => (
  <div style={{position:'fixed',inset:0,background:'#09090b',zIndex:9999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
    <div style={{position:'relative',marginBottom:24}}>
      <div style={{position:'absolute',inset:-16,borderRadius:'50%',background:'rgba(99,102,241,0.15)',animation:'pulse-ring 1.5s infinite ease-out'}}/>
      <div style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:24,padding:20,boxShadow:'0 0 40px rgba(99,102,241,0.4)'}}>
        <Brain size={48} color="white"/>
      </div>
    </div>
    <h2 style={{color:'white',marginTop:8,fontSize:22,fontWeight:900,letterSpacing:'-0.5px',animation:'headerGlow 2s ease-in-out infinite'}}>
      {T[lang].loading}
    </h2>
    <p style={{color:'#a1a1aa',fontSize:13,marginTop:8}}>{T[lang].appSubtitle}</p>
  </div>
);

const SaveAnimation = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,pointerEvents:'none'}}>
      <div style={{position:'relative'}}>
        <div style={{position:'absolute',inset:0,borderRadius:'50%',background:'rgba(34,197,94,0.4)',animation:'pulse-ring 0.8s ease-out 0.2s both'}}/>
        <div style={{
          background:'linear-gradient(135deg,#22c55e,#16a34a)',borderRadius:'50%',width:80,height:80,
          display:'flex',alignItems:'center',justifyContent:'center',
          animation:'popIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards',
          boxShadow:'0 0 40px rgba(34,197,94,0.5)'
        }}>
          <Check size={38} color="white" strokeWidth={3}/>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ msg }: { msg: string }) => {
  if (!msg) return null;
  return (
    <div style={{
      position:'fixed',bottom:90,left:'50%', transform:'translateX(-50%)',
      background:'linear-gradient(135deg,#18181b,#27272a)',color:'#f4f4f5',
      padding:'12px 24px',borderRadius:16,zIndex:9998,
      fontSize:13,fontWeight:700, animation:'slideUpFade 2.5s ease-in-out forwards',
      boxShadow:'0 8px 32px rgba(0,0,0,0.6)', whiteSpace:'nowrap',
      border:'1px solid rgba(255,255,255,0.1)'
    }}>{msg}</div>
  );
};

const CustomSlider = ({ value, onChange, label, color='#6366f1', isRTL=true }: any) => {
  const handleInputChange = (e: any) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    if (val > 100) val = 100;
    if (val < 0) val = 0;
    onChange(val);
  };
  return (
    <div className="w-full mb-5">
      <div className="flex justify-between items-center text-xs font-bold mb-3 px-1" style={{color}}>
        <span>{label}</span>
        <div style={{display:'flex', alignItems:'center', gap:'6px'}} dir="ltr">
          <span style={{fontSize: 12, fontWeight: 'bold'}}>%</span>
          <input
            type="number" min="0" max="100" value={value} onChange={handleInputChange}
            style={{width: '45px', textAlign: 'center', background: 'rgba(128,128,128,0.1)',
              border: `1.5px solid ${color}`, borderRadius: '8px', padding: '4px',
              color: 'inherit', fontSize: '13px', fontWeight:'900', outline:'none'}}
          />
        </div>
      </div>
      <input
        type="range" min="0" max="100" value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="native-slider" dir={isRTL ? "rtl" : "ltr"}
        style={{'--slider-color': color, '--slider-fill': `${value}%`} as any}
      />
    </div>
  );
};

// ─────────────────────────── LANGUAGE SWITCHER ───────────────────────────

const LanguageSwitcher = ({ lang, setLang, isDark }: { lang: Lang, setLang: (l: Lang) => void, isDark: boolean }) => {
  const [open, setOpen] = useState(false);
  const tx = isDark ? '#f4f4f5' : '#1e293b';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd = isDark ? '#27272a' : '#e2e8f0';
  const sub = isDark ? '#71717a' : '#64748b';

  const langs: {code: Lang, label: string, flag: string}[] = [
    { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const current = langs.find(l => l.code === lang)!;

  return (
    <div style={{position:'relative'}}>
      <button onClick={() => setOpen(!open)} className="lang-btn" style={{
        display:'flex',alignItems:'center',gap:6,
        background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
        border:`1.5px solid ${isDark?'rgba(99,102,241,0.4)':'rgba(99,102,241,0.3)'}`,
        borderRadius:12,padding:'7px 12px',cursor:'pointer',color:'#6366f1',
        fontSize:13,fontWeight:700,
        boxShadow: open ? '0 0 16px rgba(99,102,241,0.4)' : 'none'
      }}>
        <Globe size={15}/>
        <span>{current.flag}</span>
        <span style={{fontSize:12}}>{current.label}</span>
      </button>
      {open && (
        <div style={{
          position:'absolute',top:'calc(100% + 8px)',right:0,
          background:card,border:`1px solid ${bd}`,borderRadius:14,
          padding:6,zIndex:1000,minWidth:140,
          boxShadow:'0 12px 40px rgba(0,0,0,0.3)',
          animation:'popIn 0.2s cubic-bezier(.34,1.56,.64,1)'
        }}>
          {langs.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
              style={{
                display:'flex',alignItems:'center',gap:8,width:'100%',padding:'9px 12px',
                border:'none',borderRadius:10,cursor:'pointer',textAlign:'right',
                fontFamily:'Vazirmatn,Inter,sans-serif',fontSize:13,fontWeight:700,
                background: lang === l.code ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: lang === l.code ? '#6366f1' : tx,
                transition:'all 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = lang === l.code ? 'rgba(99,102,241,0.15)' : 'transparent')}
            >
              <span style={{fontSize:18}}>{l.flag}</span>
              <span>{l.label}</span>
              {lang === l.code && <Check size={13} style={{marginRight:'auto',marginLeft:0}} color="#6366f1"/>}
            </button>
          ))}
          <div style={{borderTop:`1px solid ${bd}`,marginTop:4,paddingTop:6,paddingBottom:2}}>
            <p style={{color:sub,fontSize:10,textAlign:'center',fontWeight:600}}>Select Language / انتخاب زبان</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────── FAB MENU ───────────────────────────

const FABMenu = ({ onAddLog, onAddNote, onAddBelief, onAddQuarantine, lang, isRTL }: any) => {
  const [open, setOpen] = useState(false);
  const t = T[lang];
  const items = [
    { icon: <Archive size={18}/>,  label: t.quarantineBox,    action: onAddQuarantine, color:'#f97316' },
    { icon: <Scale size={18}/>,    label: t.costBenefit,      action: onAddBelief,     color:'#14b8a6' },
    { icon: <FileText size={18}/>, label: t.sessionNotes,     action: onAddNote,       color:'#ec4899' },
    { icon: <Brain size={18}/>,    label: t.addLog,           action: onAddLog,        color:'#6366f1' },
  ];
  return (
    <div style={{position:'fixed',bottom:80,left: isRTL ? 20 : 'auto', right: isRTL ? 'auto' : 20, zIndex:100}}>
      {open && (
        <div style={{position:'absolute',bottom:68,left:0,display:'flex',flexDirection:'column',gap:10,alignItems:'flex-start'}}>
          {items.map((item,i)=>(
            <button key={i} onClick={()=>{setOpen(false);item.action();}} className="fab-btn"
              style={{
                display:'flex',alignItems:'center',gap:10, background:`linear-gradient(135deg,${item.color},${item.color}dd)`,color:'white',
                border:'none',borderRadius:16, padding:'10px 18px',
                fontSize:13,fontWeight:700,cursor:'pointer', boxShadow:`0 6px 24px ${item.color}60`,
                animation:`fabExpand .25s cubic-bezier(.34,1.56,.64,1) ${i*0.07}s both`, whiteSpace:'nowrap'
              }}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>
      )}
      <button onClick={()=>setOpen(!open)} className="fab-btn" style={{
        width:60,height:60,borderRadius:20,
        background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',border:'none',
        display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
        boxShadow:'0 0 30px rgba(99,102,241,0.5),0 8px 24px rgba(0,0,0,0.3)',
        transition:'all .25s cubic-bezier(.34,1.56,.64,1)',
        transform: open ? 'rotate(45deg) scale(1.05)' : 'rotate(0deg) scale(1)',
        animation:'glowPulse 3s ease-in-out infinite',
      }}>
        <Plus size={28} strokeWidth={2.5}/>
      </button>
    </div>
  );
};

// ─────────────────────────── COST-BENEFIT MODAL ───────────────────────────

const CostBenefitModal = ({ onClose, isDark, onSave, editData, showToast, lang, isRTL }: any) => {
  const t = T[lang];
  const [behavior, setBehavior] = useState(editData?.behavior || '');
  const [benefits, setBenefits] = useState<string[]>(editData?.benefits || ['']);
  const [costs, setCosts]       = useState<string[]>(editData?.costs || ['']);
  const [worthIt, setWorthIt]   = useState(editData?.worthIt ?? 50);
  const [conclusion, setConclusion] = useState(editData?.conclusion || '');

  const bg   = isDark ? '#09090b' : '#f8fafc';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#a1a1aa' : '#475569';
  const font = isRTL ? 'Vazirmatn,sans-serif' : 'Inter,sans-serif';

  const addRow = (list: string[], setList: any) => setList([...list, '']);
  const updateRow = (list: string[], setList: any, i: number, val: string) => {
    const n = [...list]; n[i] = val; setList(n);
  };
  const removeRow = (list: string[], setList: any, i: number) => {
    if (list.length === 1) return;
    setList(list.filter((_: any, j: number) => j !== i));
  };

  const handleSave = () => {
    if (!behavior.trim()) { showToast(t.enterBehavior); return; }
    onSave({
      id: editData?.id || Date.now().toString(),
      date: editData?.date || getNow(lang),
      timestamp: editData?.timestamp || Date.now(),
      behavior: behavior.trim(),
      benefits: benefits.filter(b => b.trim()),
      costs: costs.filter(c => c.trim()),
      worthIt,
      conclusion: conclusion.trim()
    });
  };

  const worthLabel = worthIt >= 70 ? { txt: t.worthYes, color: '#22c55e' }
    : worthIt >= 40 ? { txt: t.worthMaybe, color: '#f59e0b' }
    : { txt: t.worthNo, color: '#ef4444' };

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:isDark?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)',display:'flex',justifyContent:'center',overflowY:'auto'}} dir={isRTL?'rtl':'ltr'}>
      <div style={{background:bg,width:'100%',maxWidth:640,display:'flex',flexDirection:'column',animation:'slideInUp .3s ease-out',minHeight:'100vh',fontFamily:font}}>
        <div style={{position:'sticky',top:0,zIndex:10,background:isDark?'rgba(9,9,11,.94)':'rgba(248,250,252,.94)',backdropFilter:'blur(14px)',borderBottom:`1px solid ${bd}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={onClose} style={{color:sub,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer'}}>{t.close}</button>
          <h1 style={{color:tx,fontWeight:900,fontSize:17,display:'flex',alignItems:'center',gap:8}}>
            <Scale size={19} color="#14b8a6"/> {t.costBenefit}
          </h1>
          <div style={{width:40}}/>
        </div>
        <div style={{padding:'24px 20px',flex:1}}>
          <div style={{marginBottom:20}}>
            <label style={{color:sub,fontSize:12,fontWeight:700,display:'block',marginBottom:8}}>{t.behaviorLabel}</label>
            <input value={behavior} onChange={e=>setBehavior(e.target.value)} placeholder={t.behaviorPlaceholder}
              style={{width:'100%',boxSizing:'border-box',background:card,border:`2px solid #14b8a6`,borderRadius:14,
                padding:'12px 16px',color:tx,fontSize:14,fontFamily:font,outline:'none',fontWeight:700,transition:'border-color 0.2s'}}
            />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
            <div style={{background:isDark?'rgba(34,197,94,0.08)':'#f0fdf4',border:`1.5px solid ${isDark?'rgba(34,197,94,0.25)':'#86efac'}`,borderRadius:16,padding:14}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
                <span style={{fontSize:18}}>💰</span>
                <h3 style={{color:'#22c55e',fontWeight:900,fontSize:13,margin:0}}>{t.benefits}</h3>
              </div>
              {benefits.map((b, i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:6,marginBottom:8,background:isDark?'rgba(34,197,94,0.06)':'rgba(34,197,94,0.05)',borderRadius:10,padding:'6px 10px',border:`1px solid ${isDark?'rgba(34,197,94,0.15)':'#bbf7d0'}`}}>
                  <span style={{color:'#22c55e',fontSize:12,fontWeight:700,flexShrink:0}}>+</span>
                  <input value={b} onChange={e=>updateRow(benefits,setBenefits,i,e.target.value)} placeholder={t.benefit}
                    style={{flex:1,background:'transparent',border:'none',outline:'none',color:tx,fontSize:13,fontFamily:font,padding:'4px 0'}}/>
                  <button onClick={()=>removeRow(benefits,setBenefits,i)} style={{background:'none',border:'none',cursor:'pointer',color:'#22c55e',opacity:0.5,padding:2}}><X size={12}/></button>
                </div>
              ))}
              <button onClick={()=>addRow(benefits,setBenefits)} style={{width:'100%',padding:'8px',border:`1.5px dashed #22c55e`,borderRadius:10,background:'none',color:'#22c55e',fontSize:12,fontWeight:700,cursor:'pointer',marginTop:4}}>{t.add}</button>
            </div>
            <div style={{background:isDark?'rgba(239,68,68,0.08)':'#fef2f2',border:`1.5px solid ${isDark?'rgba(239,68,68,0.25)':'#fca5a5'}`,borderRadius:16,padding:14}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
                <span style={{fontSize:18}}>💸</span>
                <h3 style={{color:'#ef4444',fontWeight:900,fontSize:13,margin:0}}>{t.costs}</h3>
              </div>
              {costs.map((c, i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:6,marginBottom:8,background:isDark?'rgba(239,68,68,0.06)':'rgba(239,68,68,0.05)',borderRadius:10,padding:'6px 10px',border:`1px solid ${isDark?'rgba(239,68,68,0.15)':'#fecaca'}`}}>
                  <span style={{color:'#ef4444',fontSize:12,fontWeight:700,flexShrink:0}}>−</span>
                  <input value={c} onChange={e=>updateRow(costs,setCosts,i,e.target.value)} placeholder={t.cost}
                    style={{flex:1,background:'transparent',border:'none',outline:'none',color:tx,fontSize:13,fontFamily:font,padding:'4px 0'}}/>
                  <button onClick={()=>removeRow(costs,setCosts,i)} style={{background:'none',border:'none',cursor:'pointer',color:'#ef4444',opacity:0.5,padding:2}}><X size={12}/></button>
                </div>
              ))}
              <button onClick={()=>addRow(costs,setCosts)} style={{width:'100%',padding:'8px',border:`1.5px dashed #ef4444`,borderRadius:10,background:'none',color:'#ef4444',fontSize:12,fontWeight:700,cursor:'pointer',marginTop:4}}>{t.add}</button>
            </div>
          </div>
          <div style={{background:card,border:`1.5px solid ${bd}`,borderRadius:16,padding:16,marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <span style={{color:sub,fontSize:13,fontWeight:700}}>{t.worthIt}</span>
              <span style={{color:worthLabel.color,fontSize:13,fontWeight:900}}>{worthLabel.txt}</span>
            </div>
            <CustomSlider label={t.worthLabel} value={worthIt} onChange={setWorthIt} color={worthLabel.color} isRTL={isRTL}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{color:sub,fontSize:12,fontWeight:700,display:'block',marginBottom:8}}>{t.conclusion}</label>
            <textarea value={conclusion} onChange={e=>setConclusion(e.target.value)} placeholder={t.conclusionPlaceholder} rows={4}
              style={{width:'100%',boxSizing:'border-box',background:card,border:`1px solid ${bd}`,borderRadius:14,
                padding:'12px 14px',color:tx,fontSize:13,fontFamily:font,resize:'none',outline:'none'}}/>
          </div>
        </div>
        <div style={{padding:'14px 20px',borderTop:`1px solid ${bd}`,background:card}}>
          <button onClick={handleSave} style={{
            width:'100%',background:'linear-gradient(135deg,#14b8a6,#0d9488)',color:'white',border:'none',borderRadius:14,padding:'14px',
            fontSize:15,fontWeight:900,cursor:'pointer',boxShadow:'0 0 24px rgba(20,184,166,0.4)',fontFamily:font,
            transition:'transform 0.2s ease,box-shadow 0.2s ease'
          }} onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.01)';}} onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';}}>
            {editData ? t.updateAnalysis : t.saveAnalysis}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────── QUARANTINE MODAL ───────────────────────────

const QuarantineModal = ({ onClose, isDark, items, onAdd, onDelete, onResolve, showToast, lang, isRTL }: any) => {
  const t = T[lang];
  const [adding, setAdding] = useState(false);
  const [thought, setThought] = useState('');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const font = isRTL ? 'Vazirmatn,sans-serif' : 'Inter,sans-serif';

  const bg   = isDark ? '#09090b' : '#f8fafc';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#a1a1aa' : '#475569';

  const handleAdd = () => {
    if (!thought.trim()) { showToast(t.enterThought); return; }
    onAdd({ id: Date.now().toString(), thought: thought.trim(), date: getNow(lang), timestamp: Date.now(), resolved: false, resolution: '' });
    setThought(''); setAdding(false); showToast(t.thoughtQuarantined);
  };
  const toggleReveal = (id: string) => setRevealedIds(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const handleResolve = (id: string) => {
    if (!resolution.trim()) { showToast(t.enterSolution); return; }
    onResolve(id, resolution.trim()); setResolvingId(null); setResolution(''); showToast(t.solutionSaved);
  };

  const activeItems = items.filter((i: any) => !i.resolved);
  const resolvedItems = items.filter((i: any) => i.resolved);

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:isDark?'rgba(0,0,0,0.9)':'rgba(0,0,0,0.5)',backdropFilter:'blur(10px)',display:'flex',justifyContent:'center'}} dir={isRTL?'rtl':'ltr'}>
      <div style={{background:bg,width:'100%',maxWidth:640,display:'flex',flexDirection:'column',animation:'slideInUp .3s ease-out',minHeight:'100vh',overflowY:'auto',fontFamily:font}}>
        <div style={{position:'sticky',top:0,zIndex:10,background:isDark?'rgba(9,9,11,.96)':'rgba(248,250,252,.96)',backdropFilter:'blur(14px)',borderBottom:`1px solid ${bd}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={onClose} style={{color:sub,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer'}}>{t.close}</button>
          <h1 style={{color:tx,fontWeight:900,fontSize:17,display:'flex',alignItems:'center',gap:8}}>
            <Archive size={19} color="#f97316"/> {t.quarantineBox}
          </h1>
          <button onClick={()=>setAdding(true)} disabled={adding}
            style={{background:adding?'transparent':'linear-gradient(135deg,#f97316,#ea580c)',color:adding?'transparent':'white',border:'none',borderRadius:10,padding:'7px 14px',fontSize:13,fontWeight:700,cursor:adding?'default':'pointer',boxShadow:adding?'none':'0 4px 14px rgba(249,115,22,0.4)'}}>
            {t.addThought}
          </button>
        </div>
        <div style={{padding:'20px',flex:1}}>
          <div style={{background:isDark?'rgba(249,115,22,0.08)':'#fff7ed',border:`1px solid ${isDark?'rgba(249,115,22,0.2)':'#fed7aa'}`,borderRadius:16,padding:'14px 16px',marginBottom:20,display:'flex',gap:12,alignItems:'flex-start'}}>
            <Archive size={20} color="#f97316" style={{flexShrink:0,marginTop:2}}/>
            <p style={{color:isDark?'#fb923c':'#9a3412',fontSize:13,lineHeight:1.8,margin:0,fontWeight:600}}>{t.quarantineDesc}</p>
          </div>
          {adding && (
            <div style={{background:card,border:`2px solid #f97316`,borderRadius:18,padding:20,marginBottom:20,animation:'popIn .25s ease-out',boxShadow:'0 8px 32px rgba(249,115,22,0.2)'}}>
              <h3 style={{color:tx,fontWeight:900,marginBottom:12,fontSize:15,display:'flex',alignItems:'center',gap:8}}>
                <AlertTriangle size={16} color="#f97316"/> {t.intrusive}
              </h3>
              <textarea value={thought} onChange={e=>setThought(e.target.value)} rows={4} placeholder={t.intrusivePlaceholder}
                style={{width:'100%',boxSizing:'border-box',background:isDark?'#09090b':'#f8fafc',border:`1px solid ${bd}`,
                  borderRadius:12,padding:'12px 14px',color:tx,fontSize:13,fontFamily:font,resize:'none',outline:'none',marginBottom:14}}/>
              <div style={{display:'flex',gap:10}}>
                <button onClick={()=>{setAdding(false);setThought('');}} style={{flex:1,padding:'11px',borderRadius:12,background:isDark?'#27272a':'#f1f5f9',color:sub,border:'none',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.cancel}</button>
                <button onClick={handleAdd} style={{flex:2,padding:'11px',borderRadius:12,background:'linear-gradient(135deg,#f97316,#ea580c)',color:'white',border:'none',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:font,boxShadow:'0 4px 16px rgba(249,115,22,0.4)'}}>
                  {t.quarantineIt}
                </button>
              </div>
            </div>
          )}
          {activeItems.length > 0 && (
            <div style={{marginBottom:24}}>
              <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
                <Lock size={13}/> {t.inQuarantine} ({numFmt(activeItems.length, lang)})
              </h3>
              {activeItems.map((item: any, i: number) => {
                const isRevealed = revealedIds.has(item.id);
                const isResolving = resolvingId === item.id;
                return (
                  <div key={item.id} style={{
                    background:card,border:`1.5px solid ${isDark?'rgba(249,115,22,0.3)':'#fed7aa'}`,
                    borderRadius:18,padding:16,marginBottom:12,
                    animation:`fadeSlideIn .3s ease-out ${i*0.07}s both`,
                    position:'relative',overflow:'hidden',
                    boxShadow:isDark?'0 4px 16px rgba(0,0,0,0.3)':'0 4px 16px rgba(249,115,22,0.08)'
                  }}>
                    {!isRevealed && (
                      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:5,overflow:'hidden',borderRadius:18}}>
                        <div style={{position:'absolute',left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(249,115,22,0.3),transparent)',animation:'scanline 2.5s linear infinite'}}/>
                      </div>
                    )}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <span style={{color:'#f97316',fontSize:11,fontWeight:700,display:'flex',alignItems:'center',gap:4}}>
                        <Clock size={11}/> {item.date}
                      </span>
                      <div style={{display:'flex',gap:6,alignItems:'center'}}>
                        <button onClick={()=>toggleReveal(item.id)} style={{
                          display:'flex',alignItems:'center',gap:4,
                          background:isRevealed?'rgba(249,115,22,0.15)':'rgba(249,115,22,0.08)',
                          color:'#f97316',border:`1px solid ${isRevealed?'rgba(249,115,22,0.4)':'rgba(249,115,22,0.2)'}`,
                          borderRadius:8,padding:'5px 10px',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:font
                        }}>
                          {isRevealed ? <><Unlock size={11}/> {t.hide}</> : <><Lock size={11}/> {t.show}</>}
                        </button>
                        {deleteConfirm === item.id ? (
                          <>
                            <button onClick={()=>{onDelete(item.id);setDeleteConfirm(null);}} style={{background:'#ef4444',color:'white',border:'none',padding:'5px 8px',borderRadius:6,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.deleteYes}</button>
                            <button onClick={()=>setDeleteConfirm(null)} style={{background:isDark?'#27272a':'#e2e8f0',color:tx,border:'none',padding:'5px 8px',borderRadius:6,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.cancel}</button>
                          </>
                        ) : (
                          <button onClick={()=>setDeleteConfirm(item.id)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:4}}><Trash2 size={14}/></button>
                        )}
                      </div>
                    </div>
                    <div style={{position:'relative',borderRadius:12,overflow:'hidden',background:isDark?'rgba(249,115,22,0.06)':'rgba(249,115,22,0.04)',border:`1px solid ${isDark?'rgba(249,115,22,0.15)':'#fed7aa'}`,padding:'12px 14px',marginBottom:isRevealed?12:0}}>
                      <p style={{color:tx,fontSize:13,lineHeight:1.8,margin:0,filter:isRevealed?'none':'blur(7px)',userSelect:isRevealed?'auto':'none',transition:'filter 0.4s ease'}}>{item.thought}</p>
                      {!isRevealed && (
                        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:4}}>
                          <div style={{animation:'lockBounce 2s ease-in-out infinite'}}><Lock size={24} color="#f97316"/></div>
                          <span style={{color:'#f97316',fontSize:11,fontWeight:700}}>{t.clickToSee}</span>
                        </div>
                      )}
                    </div>
                    {isRevealed && (
                      <div style={{animation:'fadeSlideIn .3s ease-out'}}>
                        {isResolving ? (
                          <div>
                            <textarea value={resolution} onChange={e=>setResolution(e.target.value)} rows={3} placeholder={t.solutionPlaceholder} autoFocus
                              style={{width:'100%',boxSizing:'border-box',background:isDark?'#09090b':'#f8fafc',border:`1px solid ${bd}`,borderRadius:10,padding:'10px 12px',color:tx,fontSize:13,fontFamily:font,resize:'none',outline:'none',marginBottom:8}}/>
                            <div style={{display:'flex',gap:8}}>
                              <button onClick={()=>{setResolvingId(null);setResolution('');}} style={{flex:1,padding:'9px',borderRadius:10,background:isDark?'#27272a':'#f1f5f9',color:sub,border:'none',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.cancel}</button>
                              <button onClick={()=>handleResolve(item.id)} style={{flex:2,padding:'9px',borderRadius:10,background:'linear-gradient(135deg,#22c55e,#16a34a)',color:'white',border:'none',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.saveSolution}</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={()=>{setResolvingId(item.id);setResolution('');}} style={{width:'100%',padding:'10px',borderRadius:12,background:isDark?'rgba(34,197,94,0.1)':'#f0fdf4',color:'#22c55e',border:`1px solid ${isDark?'rgba(34,197,94,0.2)':'#86efac'}`,fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,fontFamily:font}}>
                            <Lightbulb size={15}/> {t.foundSolution}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {resolvedItems.length > 0 && (
            <div>
              <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
                <Unlock size={13}/> {t.resolved} ({numFmt(resolvedItems.length, lang)})
              </h3>
              {resolvedItems.map((item: any) => (
                <div key={item.id} style={{background:isDark?'rgba(34,197,94,0.05)':'#f0fdf4',border:`1px solid ${isDark?'rgba(34,197,94,0.2)':'#bbf7d0'}`,borderRadius:16,padding:14,marginBottom:10,opacity:0.75}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <span style={{color:'#22c55e',fontSize:11,fontWeight:700}}>{t.resolvedLabel}</span>
                    <button onClick={()=>onDelete(item.id)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:2}}><Trash2 size={13}/></button>
                  </div>
                  <p style={{color:sub,fontSize:12,lineHeight:1.7,marginBottom:8,textDecoration:'line-through',opacity:0.7}}>{item.thought}</p>
                  <div style={{background:isDark?'rgba(34,197,94,0.08)':'rgba(34,197,94,0.05)',borderRadius:10,padding:'8px 12px',border:`1px solid ${isDark?'rgba(34,197,94,0.15)':'#bbf7d0'}`}}>
                    <span style={{color:'#22c55e',fontSize:11,fontWeight:700}}>{t.solutionLabel} </span>
                    <span style={{color:tx,fontSize:12}}>{item.resolution}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {items.length === 0 && !adding && (
            <div style={{textAlign:'center',padding:'60px 24px',color:sub}}>
              <div style={{animation:'float 3s ease-in-out infinite',display:'inline-block',marginBottom:16}}><Archive size={52} style={{opacity:.25}}/></div>
              <p style={{fontWeight:700,marginBottom:6}}>{t.quarantineEmpty}</p>
              <p style={{fontSize:13}}>{t.quarantineEmptyHint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────── BELIEF CARD ───────────────────────────

const BeliefCard = ({ belief, isDark, onEdit, onDelete, lang, isRTL }: any) => {
  const t = T[lang];
  const [expanded, setExpanded] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const card = isDark ? '#18181b' : '#ffffff';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#71717a' : '#64748b';
  const font = isRTL ? 'Vazirmatn,sans-serif' : 'Inter,sans-serif';
  const worthColor = belief.worthIt >= 70 ? '#22c55e' : belief.worthIt >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{background:card,border:`1.5px solid ${isDark?'rgba(20,184,166,0.25)':'#99f6e4'}`,borderRadius:20,padding:18,
      marginBottom:14,borderRight:isRTL?`4px solid #14b8a6`:'none',borderLeft:isRTL?'none':`4px solid #14b8a6`,
      animation:'fadeSlideIn .4s ease-out',boxShadow:isDark?'0 4px 16px rgba(0,0,0,0.2)':'0 4px 16px rgba(20,184,166,0.08)',fontFamily:font}}>
      {deleteConfirm ? (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,flexDirection:'column',padding:'10px 0'}}>
          <span style={{color:tx,fontSize:14,fontWeight:900}}>{t.deleteAnalysis}</span>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>{onDelete();setDeleteConfirm(false);}} style={{background:'#ef4444',color:'white',border:'none',padding:'8px 16px',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.deleteYesAnalysis}</button>
            <button onClick={()=>setDeleteConfirm(false)} style={{background:isDark?'#27272a':'#e2e8f0',color:tx,border:'none',padding:'8px 16px',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.cancel}</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <Scale size={15} color="#14b8a6"/>
                <h3 style={{color:tx,fontWeight:900,fontSize:15,margin:0}}>{belief.behavior}</h3>
              </div>
              <span style={{color:sub,fontSize:11}}>{belief.date}</span>
            </div>
            <div style={{display:'flex',gap:6,alignItems:'center',marginRight:isRTL?8:0,marginLeft:isRTL?0:8}}>
              <div style={{background:isDark?'rgba(20,184,166,0.15)':'#ccfbf1',borderRadius:20,padding:'5px 12px'}}>
                <span style={{color:worthColor,fontSize:13,fontWeight:900}}>{numFmt(belief.worthIt, lang)}%</span>
              </div>
              <button onClick={onEdit} style={{color:sub,background:'none',border:'none',cursor:'pointer',padding:4}}><Edit2 size={15}/></button>
              <button onClick={()=>setDeleteConfirm(true)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:4}}><Trash2 size={15}/></button>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
            <div style={{background:isDark?'rgba(34,197,94,0.06)':'#f0fdf4',borderRadius:12,padding:'10px 12px',border:`1px solid ${isDark?'rgba(34,197,94,0.15)':'#bbf7d0'}`}}>
              <p style={{color:'#22c55e',fontSize:11,fontWeight:700,marginBottom:6}}>💰 {t.benefits} ({numFmt(belief.benefits?.length||0,lang)})</p>
              {belief.benefits?.slice(0, expanded?999:2).map((b: string, i: number) => (
                <p key={i} style={{color:tx,fontSize:12,margin:'2px 0',lineHeight:1.6}}>• {b}</p>
              ))}
            </div>
            <div style={{background:isDark?'rgba(239,68,68,0.06)':'#fef2f2',borderRadius:12,padding:'10px 12px',border:`1px solid ${isDark?'rgba(239,68,68,0.15)':'#fecaca'}`}}>
              <p style={{color:'#ef4444',fontSize:11,fontWeight:700,marginBottom:6}}>💸 {t.costs} ({numFmt(belief.costs?.length||0,lang)})</p>
              {belief.costs?.slice(0, expanded?999:2).map((c: string, i: number) => (
                <p key={i} style={{color:tx,fontSize:12,margin:'2px 0',lineHeight:1.6}}>• {c}</p>
              ))}
            </div>
          </div>
          {belief.conclusion && (
            <div style={{background:isDark?'rgba(99,102,241,0.08)':'#eef2ff',borderRadius:12,padding:'10px 14px',border:`1px solid ${isDark?'rgba(99,102,241,0.2)':'#c7d2fe'}`,marginBottom:10}}>
              <span style={{color:'#6366f1',fontSize:11,fontWeight:700}}>{t.conclusion}: </span>
              <span style={{color:tx,fontSize:12,lineHeight:1.7}}>{belief.conclusion}</span>
            </div>
          )}
          <button onClick={()=>setExpanded(!expanded)} style={{background:'none',border:'none',color:sub,fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontFamily:font}}>
            {expanded?<><ChevronUp size={14}/>{t.collapse}</>:<><ChevronDown size={14}/>{t.expand}</>}
          </button>
        </>
      )}
    </div>
  );
};

// ─────────────────────────── COGNITIVE ERRORS MODAL ───────────────────────────

const CognitiveErrorsModal = ({ onClose, isDark, lang, isRTL }: any) => {
  const t = T[lang];
  const errors = COGNITIVE_ERRORS[lang];
  const bg   = isDark ? '#09090b' : '#f8fafc';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#a1a1aa' : '#475569';
  const font = isRTL ? 'Vazirmatn,sans-serif' : 'Inter,sans-serif';

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:isDark?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)',display:'flex',justifyContent:'center'}} dir={isRTL?'rtl':'ltr'}>
      <div style={{background:bg,width:'100%',maxWidth:640,display:'flex',flexDirection:'column',animation:'slideInUp .3s ease-out',fontFamily:font}}>
        <div style={{position:'sticky',top:0,zIndex:10,background:isDark?'rgba(9,9,11,.92)':'rgba(248,250,252,.92)',backdropFilter:'blur(14px)',borderBottom:`1px solid ${bd}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={onClose} style={{color:sub,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer',fontFamily:font}}>{t.close}</button>
          <h1 style={{color:tx,fontWeight:900,fontSize:18,display:'flex',alignItems:'center',gap:8}}>
            <BookOpen size={20} color="#6366f1"/> {t.cognitiveErrors}
          </h1>
          <div style={{width:40}}/>
        </div>
        <div style={{padding:'24px 20px',flex:1,overflowY:'auto'}}>
          <p style={{color:sub,fontSize:13,textAlign:'center',marginBottom:20,lineHeight:1.7}}>{t.cognitiveErrorsDesc}</p>
          {errors.map((err,i) => (
            <div key={err.id} style={{background:card,border:`1px solid ${bd}`,borderRadius:16,padding:'18px 20px',marginBottom:10,animation:`fadeSlideIn .3s ease-out ${i*0.03}s both`,
              transition:'transform 0.2s ease',boxShadow:isDark?'none':'0 2px 8px rgba(0,0,0,0.05)'}}
              onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-2px)')}
              onMouseLeave={e=>(e.currentTarget.style.transform='translateY(0)')}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <span style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',borderRadius:10,width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,flexShrink:0}}>
                  {numFmt(err.id, lang)}
                </span>
                <h3 style={{color:tx,fontWeight:900,fontSize:15,margin:0}}>{err.name}</h3>
              </div>
              <p style={{color:sub,fontSize:13,lineHeight:1.8,marginBottom:10}}>{err.desc}</p>
              <div style={{background:isDark?'#27272a':'#f8fafc',border:`1px solid ${bd}`,borderRadius:10,padding:'10px 14px'}}>
                <span style={{color:'#6366f1',fontSize:11,fontWeight:700}}>{t.example} </span>
                <span style={{color:isDark?'#d4d4d8':'#374151',fontSize:13,fontStyle:'italic'}}>«{err.ex}»</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────── SESSION NOTES MODAL ───────────────────────────

const SessionNotesModal = ({ notes, onSave, onDelete, onClose, isDark, startAdding, showToast, lang, isRTL }: any) => {
  const t = T[lang];
  const [adding, setAdding] = useState(startAdding);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [deleteConfirm, setDeleteConfirm] = useState<string|null>(null);
  const [editDate, setEditDate] = useState<string|null>(null);
  const [editTimestamp, setEditTimestamp] = useState<number|null>(null);
  const font = isRTL ? 'Vazirmatn,sans-serif' : 'Inter,sans-serif';

  useEffect(() => { setAdding(startAdding); }, [startAdding]);

  const bg   = isDark ? '#09090b' : '#f8fafc';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#a1a1aa' : '#475569';

  const iStyle: any = {
    width:'100%',boxSizing:'border-box',background:isDark?'#09090b':'#f8fafc',border:`1px solid ${bd}`,borderRadius:12,
    padding:'12px 14px',color:tx,fontSize:13,fontFamily:font,resize:'none',outline:'none'
  };

  const handleEditReq = (note: any) => {
    setEditingId(note.id); setQ(note.question); setA(note.answer); setColor(note.color);
    setEditDate(note.date); setEditTimestamp(note.timestamp || parseInt(note.id)); setAdding(true);
  };
  const handleSave = () => {
    if (!q.trim() || !a.trim()) { showToast(t.enterQA); return; }
    onSave({ id: editingId||Date.now().toString(), date: editingId?editDate:getNow(lang), timestamp: editingId?editTimestamp:Date.now(), question: q.trim(), answer: a.trim(), color });
    setQ(''); setA(''); setEditingId(null); setAdding(false);
  };
  const cancelAdd = () => { setQ(''); setA(''); setEditingId(null); setAdding(false); };

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:isDark?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)',display:'flex',justifyContent:'center'}} dir={isRTL?'rtl':'ltr'}>
      <div style={{background:bg,width:'100%',maxWidth:640,display:'flex',flexDirection:'column',animation:'slideInUp .3s ease-out',fontFamily:font}}>
        <div style={{position:'sticky',top:0,zIndex:10,background:isDark?'rgba(9,9,11,.92)':'rgba(248,250,252,.92)',backdropFilter:'blur(14px)',borderBottom:`1px solid ${bd}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={onClose} style={{color:sub,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer',fontFamily:font}}>{t.close}</button>
          <h1 style={{color:tx,fontWeight:900,fontSize:18,display:'flex',alignItems:'center',gap:8}}>
            <MessageSquare size={20} color="#ec4899"/> {t.sessionNotes}
          </h1>
          <button onClick={()=>setAdding(true)} disabled={adding} style={{background:adding?'transparent':'linear-gradient(135deg,#ec4899,#db2777)',color:adding?'transparent':'white',border:'none',borderRadius:10,padding:'7px 14px',fontSize:13,fontWeight:700,cursor:adding?'default':'pointer',fontFamily:font,boxShadow:adding?'none':'0 4px 14px rgba(236,72,153,0.4)'}}>{t.newNote}</button>
        </div>
        <div style={{padding:'20px',flex:1,overflowY:'auto'}}>
          {adding && (
            <div style={{background:card,border:`2px solid #ec4899`,borderRadius:18,padding:20,marginBottom:20,animation:'popIn .25s ease-out',boxShadow:'0 8px 32px rgba(236,72,153,0.15)'}}>
              <h3 style={{color:tx,fontWeight:900,marginBottom:14,fontSize:15}}>{editingId?`${t.edit} 📝`:`${t.newNote} 📝`}</h3>
              <div style={{marginBottom:12}}>
                <label style={{color:sub,fontSize:12,fontWeight:700,display:'block',marginBottom:6}}>{t.therapistQuestion}</label>
                <textarea value={q} onChange={e=>setQ(e.target.value)} rows={3} placeholder={t.therapistQuestionPlaceholder} style={iStyle}/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{color:'#ec4899',fontSize:12,fontWeight:700,display:'block',marginBottom:6}}>{t.myAnswer}</label>
                <textarea value={a} onChange={e=>setA(e.target.value)} rows={5} placeholder={t.myAnswerPlaceholder} style={iStyle}/>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{color:sub,fontSize:12,fontWeight:700,display:'block',marginBottom:8}}>{t.labelColor}</label>
                <div style={{display:'flex',gap:8}}>
                  {NOTE_COLORS.map(c => (
                    <button key={c} onClick={()=>setColor(c)} style={{width:28,height:28,borderRadius:'50%',background:c,border:'none',cursor:'pointer',outline:color===c?`3px solid white`:'none',boxShadow:color===c?`0 0 0 5px ${c}50`:'none',transform:color===c?'scale(1.2)':'scale(1)',transition:'all .2s'}}/>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:10}}>
                <button onClick={cancelAdd} style={{flex:1,padding:'11px',borderRadius:12,background:isDark?'#27272a':'#f1f5f9',color:sub,border:'none',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.cancel}</button>
                <button onClick={handleSave} style={{flex:2,padding:'11px',borderRadius:12,background:'linear-gradient(135deg,#ec4899,#db2777)',color:'white',border:'none',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:font}}>{editingId?t.updateNote:t.saveNote}</button>
              </div>
            </div>
          )}
          {notes.length===0&&!adding?(
            <div style={{textAlign:'center',padding:'60px 24px',color:sub}}>
              <MessageSquare size={48} style={{margin:'0 auto 14px',opacity:.3,display:'block'}}/>
              <p style={{fontWeight:700,marginBottom:6}}>{t.noNotes}</p>
              <p style={{fontSize:13}}>{t.noNotesHint}</p>
            </div>
          ):notes.map((note: any,i: number)=>(
            <div key={note.id} style={{background:card,border:`1px solid ${isDark?'#27272a':'#e2e8f0'}`,borderRadius:16,padding:20,marginBottom:12,
              borderRight:isRTL?`4px solid ${note.color}`:'none',borderLeft:isRTL?'none':`4px solid ${note.color}`,
              animation:`fadeSlideIn .3s ease-out ${i*0.05}s both`,
              transition:'transform 0.2s ease',boxShadow:isDark?'none':'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <span style={{background:note.color+'25',color:note.color,fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20}}>{note.date}</span>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  {deleteConfirm===note.id?(
                    <>
                      <button onClick={()=>{onDelete(note.id);setDeleteConfirm(null);}} style={{background:'#ef4444',color:'white',border:'none',padding:'4px 8px',borderRadius:6,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.deleteYes}</button>
                      <button onClick={()=>setDeleteConfirm(null)} style={{background:isDark?'#27272a':'#e2e8f0',color:tx,border:'none',padding:'4px 8px',borderRadius:6,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.cancel}</button>
                    </>
                  ):(
                    <>
                      <button onClick={()=>handleEditReq(note)} style={{color:sub,background:'none',border:'none',cursor:'pointer',padding:4}}><Edit2 size={16}/></button>
                      <button onClick={()=>setDeleteConfirm(note.id)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:4}}><Trash2 size={16}/></button>
                    </>
                  )}
                </div>
              </div>
              <div style={{background:note.color+'15',borderRadius:10,padding:'10px 14px',marginBottom:10,border:`1px solid ${note.color}35`}}>
                <span style={{color:note.color,fontSize:11,fontWeight:700}}>{t.therapistLabel} </span>
                <p style={{color:tx,fontSize:13,margin:'4px 0 0',lineHeight:1.7}}>{note.question}</p>
              </div>
              <p style={{color:sub,fontSize:13,lineHeight:1.8}}>{note.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────── ADD LOG MODAL ───────────────────────────

const AddLogModal = ({ onSave, onClose, isDark, initialData, showToast, lang, isRTL }: any) => {
  const t = T[lang];
  const font = isRTL ? 'Vazirmatn,sans-serif' : 'Inter,sans-serif';

  const [dateStr, setDateStr]   = useState('');
  const [dateObj, setDateObj]   = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState({y: lang==='fa'?1403:2024, m: 1, d: 1, h: 12, min: 0});
  const [situation, setSituation] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<any[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [isAddingEmo, setIsAddingEmo] = useState(false);
  const [thoughts, setThoughts] = useState([{text:'',belief:50}]);
  const [hasShame, setHasShame] = useState(true);
  const [shameLevel, setShameLevel] = useState(50);

  useEffect(() => {
    if (initialData) {
      setSituation(initialData.situation); setSelectedEmotions(initialData.emotions);
      setThoughts(initialData.thoughts); setHasShame(initialData.hasShame);
      setShameLevel(initialData.shameLevel !== null ? initialData.shameLevel : 50);
      setDateStr(initialData.date); setDateObj(initialData.dateObj || getNowParts(lang));
    } else {
      const nowP = getNowParts(lang); setDateStr(formatDate(nowP, lang)); setDateObj(nowP);
    }
  }, [initialData]);

  const bg   = isDark ? '#09090b' : '#f8fafc';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#a1a1aa' : '#475569';

  const gregorianMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const selectStyle: any = {
    flex:1,background:isDark?'#09090b':'#f8fafc',color:tx,border:`1px solid ${bd}`,
    borderRadius:10,padding:'8px',fontSize:14,outline:'none',textAlign:'center',fontFamily:font
  };

  const toggleEmo = (name: string) => {
    const exists = selectedEmotions.find(e=>e.name===name);
    setSelectedEmotions(exists ? selectedEmotions.filter(e=>e.name!==name) : [...selectedEmotions,{name,intensity:50}]);
  };
  const addCustomEmo = () => {
    const v = customInput.trim();
    if (v && !selectedEmotions.find(e=>e.name===v)) setSelectedEmotions([...selectedEmotions,{name:v,intensity:50}]);
    setCustomInput(''); setIsAddingEmo(false);
  };
  const handleSave = () => {
    if (!situation.trim()) { showToast(t.enterSituation); return; }
    onSave({
      id: initialData?initialData.id:Date.now().toString(),
      date: dateStr, dateObj: dateObj,
      timestamp: dateObj?getTimestampFromParts(dateObj):Date.now(),
      situation, emotions: selectedEmotions,
      thoughts: thoughts.filter(t=>t.text.trim()!==''),
      hasShame, shameLevel: hasShame?shameLevel:null
    });
  };

  const yearRange = lang === 'fa' ? [...Array(20)].map((_,i)=>1395+i) : [...Array(20)].map((_,i)=>2010+i);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{background:isDark?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)'}} dir={isRTL?'rtl':'ltr'}>
      {showDatePicker && (
        <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)'}}>
          <div style={{background:card,padding:20,borderRadius:20,width:'90%',maxWidth:360,border:`1px solid ${bd}`,boxShadow:'0 10px 40px rgba(0,0,0,0.5)',animation:'popIn .2s ease-out',fontFamily:font}}>
            <h3 style={{color:tx,fontWeight:900,marginBottom:16,textAlign:'center'}}>{t.step1Date}</h3>
            <div style={{display:'flex',gap:8,marginBottom:12}} dir={isRTL?'rtl':'ltr'}>
              <select value={tempDate.d} onChange={e=>setTempDate({...tempDate,d:parseInt(e.target.value)})} style={selectStyle}>
                {[...Array(31)].map((_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
              </select>
              <select value={tempDate.m} onChange={e=>setTempDate({...tempDate,m:parseInt(e.target.value)})} style={selectStyle}>
                {(lang==='fa'?SHAMSI_MONTHS:gregorianMonths).map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}
              </select>
              <select value={tempDate.y} onChange={e=>setTempDate({...tempDate,y:parseInt(e.target.value)})} style={selectStyle}>
                {yearRange.map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:20}} dir="ltr">
              <select value={tempDate.h} onChange={e=>setTempDate({...tempDate,h:parseInt(e.target.value)})} style={selectStyle}>
                {[...Array(24)].map((_,i)=><option key={i} value={i}>{String(i).padStart(2,'0')}</option>)}
              </select>
              <span style={{color:tx,alignSelf:'center',fontWeight:'bold'}}>:</span>
              <select value={tempDate.min} onChange={e=>setTempDate({...tempDate,min:parseInt(e.target.value)})} style={selectStyle}>
                {[...Array(60)].map((_,i)=><option key={i} value={i}>{String(i).padStart(2,'0')}</option>)}
              </select>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setShowDatePicker(false)} style={{flex:1,padding:'10px',background:bg,color:sub,border:`1px solid ${bd}`,borderRadius:12,fontWeight:700,fontFamily:font,cursor:'pointer'}}>{t.cancel}</button>
              <button onClick={()=>{setDateObj(tempDate);setDateStr(formatDate(tempDate,lang));setShowDatePicker(false);}} style={{flex:2,padding:'10px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',border:'none',borderRadius:12,fontWeight:700,fontFamily:font,cursor:'pointer'}}>✓</button>
            </div>
          </div>
        </div>
      )}
      <div style={{background:bg,minHeight:'100vh',width:'100%',maxWidth:520,margin:'0 auto',display:'flex',flexDirection:'column',animation:'slideInUp .3s ease-out',fontFamily:font}}>
        <div style={{position:'sticky',top:0,zIndex:10,background:isDark?'rgba(9,9,11,.92)':'rgba(248,250,252,.92)',backdropFilter:'blur(14px)',borderBottom:`1px solid ${bd}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={onClose} style={{color:sub,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer',fontFamily:font}}>{t.cancel} ✕</button>
          <h1 style={{color:tx,fontWeight:900,fontSize:17,display:'flex',alignItems:'center',gap:8}}>
            {initialData?t.editLog:t.addLog} <Brain size={18} color="#6366f1"/>
          </h1>
          <div style={{width:40}}/>
        </div>
        <div style={{padding:'24px 20px',flex:1}}>
          <div style={{marginBottom:24}}>
            <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:8}}>{t.step1Date}</h3>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>{setTempDate(dateObj||getNowParts(lang));setShowDatePicker(true);}} style={{flex:1,background:card,border:`1px solid ${bd}`,borderRadius:12,padding:'11px 14px',color:tx,fontSize:13,textAlign:'right',fontFamily:font,cursor:'pointer'}}>{dateStr}</button>
              <button onClick={()=>{const nowP=getNowParts(lang);setDateObj(nowP);setDateStr(formatDate(nowP,lang));}} style={{flexShrink:0,background:isDark?'#27272a':'#e2e8f0',color:tx,border:'none',borderRadius:12,padding:'11px 14px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.nowButton}</button>
            </div>
          </div>
          <div style={{marginBottom:24}}>
            <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:8}}>{t.step2Situation}</h3>
            <textarea value={situation} onChange={e=>setSituation(e.target.value)} placeholder={t.situationPlaceholder} rows={4}
              style={{width:'100%',boxSizing:'border-box',background:card,border:`1px solid ${bd}`,borderRadius:14,padding:'12px 14px',color:tx,fontSize:13,fontFamily:font,resize:'none',outline:'none'}}/>
          </div>
          <div style={{marginBottom:24}}>
            <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:10}}>{t.step3Emotions}</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:14}}>
              {DEFAULT_EMOTIONS[lang].map(emo=>{
                const sel = selectedEmotions.some(e=>e.name===emo);
                const ec = getEC(emo, isDark);
                return (
                  <button key={emo} onClick={()=>toggleEmo(emo)} style={{
                    padding:'7px 14px',borderRadius:20,fontSize:12,fontWeight:700,
                    border:`1.5px solid ${sel?ec.bd:isDark?'#3f3f46':'#e2e8f0'}`,
                    background:sel?ec.bg:isDark?'#27272a':'#f8fafc',
                    color:sel?ec.tx:isDark?'#71717a':'#64748b',
                    cursor:'pointer',transition:'all .2s cubic-bezier(.34,1.56,.64,1)',
                    transform:sel?'scale(1.07)':'scale(1)',boxShadow:sel?`0 4px 14px ${ec.hex}40`:'',fontFamily:font
                  }}>{emo}</button>
                );
              })}
              {isAddingEmo?(
                <div style={{display:'flex',gap:6}}>
                  <input autoFocus value={customInput} onChange={e=>setCustomInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCustomEmo()} placeholder={t.otherEmoInput}
                    style={{background:card,border:`1px solid ${bd}`,borderRadius:20,padding:'6px 12px',color:tx,fontSize:12,outline:'none',width:120,fontFamily:font}}/>
                  <button onClick={addCustomEmo} style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',border:'none',borderRadius:20,padding:'6px 12px',fontSize:11,fontWeight:700,cursor:'pointer'}}>✓</button>
                </div>
              ):(
                <button onClick={()=>setIsAddingEmo(true)} style={{padding:'7px 14px',borderRadius:20,fontSize:12,fontWeight:700,border:`1.5px dashed ${isDark?'#3f3f46':'#cbd5e1'}`,background:'none',color:'#6366f1',cursor:'pointer',fontFamily:font}}>{t.otherEmo}</button>
              )}
            </div>
            <div>
              {selectedEmotions.map(emo=>{
                const ec=getEC(emo.name,isDark);
                return <CustomSlider key={emo.name} label={emo.name} value={emo.intensity} color={ec.hex} isRTL={isRTL}
                  onChange={(v: number)=>setSelectedEmotions(selectedEmotions.map(e=>e.name===emo.name?{...e,intensity:v}:e))}/>;
              })}
            </div>
          </div>
          <div style={{marginBottom:24}}>
            <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:10}}>{t.step4Thoughts}</h3>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:10}}>
              {thoughts.map((th,i)=>(
                <div key={i} style={{background:card,border:`1px solid ${bd}`,borderRadius:14,padding:14,position:'relative',boxShadow:isDark?'none':'0 2px 8px rgba(0,0,0,0.04)'}}>
                  {thoughts.length>1&&(
                    <button onClick={()=>setThoughts(thoughts.filter((_,j)=>j!==i))} style={{position:'absolute',top:10,left:isRTL?10:'auto',right:isRTL?'auto':10,background:'none',border:'none',cursor:'pointer',color:isDark?'#52525b':'#94a3b8'}}><X size={14}/></button>
                  )}
                  <textarea value={th.text} onChange={e=>{const n=[...thoughts];n[i].text=e.target.value;setThoughts(n);}} placeholder={t.thoughtPlaceholder} rows={2}
                    style={{width:'100%',background:'transparent',border:'none',outline:'none',color:tx,fontSize:13,fontFamily:font,resize:'none',marginBottom:10}}/>
                  <CustomSlider label={t.beliefLevel} value={th.belief} onChange={(v: number)=>{const n=[...thoughts];n[i].belief=v;setThoughts(n);}} isRTL={isRTL}/>
                </div>
              ))}
            </div>
            <button onClick={()=>setThoughts([...thoughts,{text:'',belief:50}])} style={{width:'100%',padding:'11px',border:`2px dashed ${isDark?'#3f3f46':'#cbd5e1'}`,borderRadius:12,background:'none',color:'#6366f1',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.addAnotherThought}</button>
          </div>
          <div style={{background:card,border:`1px solid ${bd}`,borderRadius:14,padding:16,marginBottom:24}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:hasShame?14:0}}>
              <h3 style={{color:sub,fontSize:12,fontWeight:700}}>{t.step5Shame}</h3>
              <button onClick={()=>setHasShame(!hasShame)} style={{display:'flex',alignItems:'center',gap:6,background:hasShame?(isDark?'rgba(99,102,241,0.2)':'#e0e7ff'):(isDark?'#27272a':'#f1f5f9'),color:hasShame?'#6366f1':sub,border:'none',borderRadius:10,padding:'7px 12px',fontSize:12,fontWeight:700,cursor:'pointer',transition:'all .2s',fontFamily:font}}>
                {hasShame?<ToggleRight size={16}/>:<ToggleLeft size={16}/>}
                {hasShame?t.shameRecorded:t.noShame}
              </button>
            </div>
            <div style={{maxHeight:hasShame?120:0,overflow:'hidden',transition:'max-height .3s ease'}}>
              <p style={{color:sub,fontSize:12,marginBottom:10}}>{t.shameQuestion}</p>
              <CustomSlider label={t.shame} value={shameLevel} onChange={setShameLevel} color="#8b5cf6" isRTL={isRTL}/>
            </div>
            {!hasShame&&<p style={{color:isDark?'#52525b':'#94a3b8',fontSize:11,fontWeight:600,textAlign:'center',marginTop:4}}>{t.shameNotRecorded}</p>}
          </div>
        </div>
        <div style={{padding:'14px 20px',borderTop:`1px solid ${bd}`,background:card}}>
          <button onClick={handleSave} style={{width:'100%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',border:'none',borderRadius:14,padding:'14px',fontSize:15,fontWeight:900,cursor:'pointer',boxShadow:'0 0 24px rgba(99,102,241,0.4)',fontFamily:font,transition:'transform 0.2s ease'}}>
            {initialData?t.updateLog:t.saveLog}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────── PDF TABLE ───────────────────────────

const PdfTable = ({ logs, sessionNotes, includeNotesExport, lang, isRTL }: any) => {
  const t = T[lang];
  const font = isRTL ? 'Vazirmatn,serif' : 'Inter,serif';
  return (
    <div id="export-container-data" style={{position:'absolute',left:-9999,top:0,width:860,background:'white',color:'black',padding:36,fontFamily:font}} dir={isRTL?'rtl':'ltr'}>
      <h1 style={{textAlign:'center',fontSize:22,fontWeight:900,marginBottom:24,borderBottom:'2px solid #e2e8f0',paddingBottom:12}}>{t.reportTitle}</h1>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,textAlign:'right',marginBottom:32}}>
        <thead>
          <tr style={{background:'#f8fafc'}}>
            <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'14%'}}>{t.date}</th>
            <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'28%'}}>{t.situation}</th>
            <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'16%'}}>{t.emotions}</th>
            <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'32%'}}>{t.thoughts}</th>
            <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'10%',textAlign:'center'}}>{t.shame}</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log: any) => (
            <tr key={log.id}>
              <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top'}}>{log.date}</td>
              <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top',lineHeight:1.7}}>{log.situation}</td>
              <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top',lineHeight:1.7}}>
                {log.emotions.length>0?log.emotions.map((e: any)=>`${e.name} (${numFmt(e.intensity,lang)}%)`).join('، '):'—'}
              </td>
              <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top'}}>
                <ul style={{paddingRight:isRTL?16:0,paddingLeft:isRTL?0:16,margin:0}}>
                  {log.thoughts.map((th: any,i: number)=>(<li key={i} style={{marginBottom:4}}>{th.text} <span style={{color:'#6366f1',fontSize:10}}>({numFmt(th.belief,lang)}%)</span></li>))}
                </ul>
              </td>
              <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top',textAlign:'center',fontWeight:700}}>
                {log.hasShame&&log.shameLevel!=null?`${numFmt(log.shameLevel,lang)}%`:'-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {includeNotesExport&&sessionNotes&&sessionNotes.length>0&&(
        <div style={{marginBottom:32}}>
          <h2 style={{fontSize:18,fontWeight:900,marginBottom:16,borderBottom:'2px solid #e2e8f0',paddingBottom:8}}>{t.sessionNotesTitle}</h2>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,textAlign:'right'}}>
            <thead><tr style={{background:'#f8fafc'}}>
              <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'15%'}}>{t.date}</th>
              <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'40%'}}>{t.therapistQ}</th>
              <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'45%'}}>{t.myAnswerShort}</th>
            </tr></thead>
            <tbody>
              {sessionNotes.map((n: any)=>(<tr key={n.id}>
                <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top'}}>{n.date}</td>
                <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top',lineHeight:1.7}}>{n.question}</td>
                <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top',lineHeight:1.7}}>{n.answer}</td>
              </tr>))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────── DASHBOARD ───────────────────────────

type ActiveTab = 'logs' | 'beliefs' | 'quarantine';

const DashboardView = ({
  logs, beliefs, quarantine,
  onExportPDF, onExportWord, onPrint,
  isDark, toggleTheme, isExporting,
  openCognitive, openNotes,
  onEditLog, onDeleteLog,
  onEditBelief, onDeleteBelief,
  onOpenQuarantine,
  includeNotesExport, setIncludeNotesExport,
  lang, isRTL
}: any) => {
  const t = T[lang];
  const [deleteConfirmId, setDeleteConfirmId] = useState<string|null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('logs');
  const font = isRTL ? 'Vazirmatn,sans-serif' : 'Inter,sans-serif';

  const bg   = isDark ? '#09090b' : '#f8fafc';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#71717a' : '#64748b';

  const tabs: {id: ActiveTab, label: string, icon: any, color: string}[] = [
    { id:'logs',      label: t.myLogs,         icon:<Brain size={15}/>,    color:'#6366f1' },
    { id:'beliefs',   label: t.beliefAnalysis,  icon:<Scale size={15}/>,    color:'#14b8a6' },
    { id:'quarantine',label: t.quarantine,       icon:<Archive size={15}/>,  color:'#f97316' },
  ];

  return (
    <div style={{minHeight:'100vh',paddingBottom:100,background:bg,transition:'background .3s',fontFamily:font}}>
      {/* Header with gradient */}
      <div style={{
        position:'sticky',top:0,zIndex:10,
        background:isDark
          ? 'linear-gradient(135deg,rgba(9,9,11,0.95),rgba(15,10,30,0.95))'
          : 'linear-gradient(135deg,rgba(248,250,252,0.95),rgba(238,242,255,0.95))',
        backdropFilter:'blur(20px)',
        borderBottom:`1px solid ${isDark?'rgba(99,102,241,0.2)':bd}`,
        padding:'14px 20px',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        boxShadow:isDark?'0 4px 24px rgba(99,102,241,0.1)':'0 4px 24px rgba(0,0,0,0.06)'
      }}>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <label style={{display:'flex',alignItems:'center',gap:6,color:tx,fontSize:11,fontWeight:700,cursor:'pointer',
            background:isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)',padding:'6px 10px',borderRadius:8,border:`1px solid ${bd}`}}>
            <input type="checkbox" checked={includeNotesExport} onChange={(e: any)=>setIncludeNotesExport(e.target.checked)} style={{cursor:'pointer'}}/>
            {t.printSession}
          </label>
          <button onClick={onPrint} title="Print" style={{display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:`1px solid ${bd}`,borderRadius:10,padding:'8px',color:'#6366f1',cursor:'pointer',transition:'all 0.2s ease'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(99,102,241,0.1)';}} onMouseLeave={e=>{e.currentTarget.style.background='none';}}><Printer size={17}/></button>
          <button onClick={onExportWord} title="Word" style={{display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:`1px solid ${bd}`,borderRadius:10,padding:'8px',color:'#6366f1',cursor:'pointer',transition:'all 0.2s ease'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(99,102,241,0.1)';}} onMouseLeave={e=>{e.currentTarget.style.background='none';}}><FileText size={17}/></button>
          <button onClick={onExportPDF} disabled={isExporting} title="PDF" style={{display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:`1px solid ${bd}`,borderRadius:10,padding:'8px',color:'#6366f1',cursor:'pointer',transition:'all 0.2s ease'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(99,102,241,0.1)';}} onMouseLeave={e=>{e.currentTarget.style.background='none';}}>
            {isExporting?<Loader2 size={17} className="animate-spin"/>:<Download size={17}/>}
          </button>
        </div>

        <h1 style={{
          color:tx,fontWeight:900,fontSize:17,display:'flex',alignItems:'center',gap:8,
          animation:'headerGlow 4s ease-in-out infinite'
        }}>
          <div style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:10,padding:'6px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 16px rgba(99,102,241,0.4)'}}>
            <Brain size={16} color="white"/>
          </div>
          {t.appName}
        </h1>
      </div>

      <div style={{padding:'20px',maxWidth:900,margin:'0 auto'}}>
        {/* Stats — 2 items only (removed shame average) */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}}>
          <div className="stat-card" style={{
            background: isDark
              ? 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15))'
              : 'linear-gradient(135deg,#eef2ff,#f5f3ff)',
            border:`1px solid ${isDark?'rgba(99,102,241,0.3)':'#c7d2fe'}`,
            borderRadius:20,padding:'18px',display:'flex',flexDirection:'column',alignItems:'center',
            boxShadow:isDark?'0 4px 20px rgba(99,102,241,0.1)':'0 4px 20px rgba(99,102,241,0.08)'
          }}>
            <div style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:12,padding:8,marginBottom:10,boxShadow:'0 4px 12px rgba(99,102,241,0.3)'}}>
              <Brain size={18} color="white"/>
            </div>
            <span style={{color:isDark?'#818cf8':'#6366f1',fontSize:12,marginBottom:4,fontWeight:700}}>{t.logCount}</span>
            <span style={{color:isDark?'#a5b4fc':'#4f46e5',fontSize:34,fontWeight:900}}>{numFmt(logs.length,lang)}</span>
          </div>
          <div className="stat-card" style={{
            background: isDark
              ? 'linear-gradient(135deg,rgba(249,115,22,0.12),rgba(251,146,60,0.12))'
              : 'linear-gradient(135deg,#fff7ed,#ffedd5)',
            border:`1px solid ${isDark?'rgba(249,115,22,0.3)':'#fed7aa'}`,
            borderRadius:20,padding:'18px',display:'flex',flexDirection:'column',alignItems:'center',
            boxShadow:isDark?'0 4px 20px rgba(249,115,22,0.08)':'0 4px 20px rgba(249,115,22,0.08)'
          }}>
            <div style={{background:'linear-gradient(135deg,#f97316,#ea580c)',borderRadius:12,padding:8,marginBottom:10,boxShadow:'0 4px 12px rgba(249,115,22,0.3)'}}>
              <Archive size={18} color="white"/>
            </div>
            <span style={{color:'#f97316',fontSize:12,marginBottom:4,fontWeight:700}}>{t.quarantineCount}</span>
            <span style={{color:isDark?'#fb923c':'#ea580c',fontSize:34,fontWeight:900}}>{numFmt(quarantine.filter((q: any)=>!q.resolved).length,lang)}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:6,marginBottom:22,background:card,padding:6,borderRadius:18,border:`1px solid ${bd}`,boxShadow:isDark?'0 4px 16px rgba(0,0,0,0.2)':'0 4px 16px rgba(0,0,0,0.04)'}}>
          {tabs.map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`tab-btn${activeTab===tab.id?' tab-active':''}`} style={{
              flex:1,padding:'11px 8px',borderRadius:14,border:'none',cursor:'pointer',fontFamily:font,
              fontWeight:700,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',gap:5,
              background:activeTab===tab.id?`linear-gradient(135deg,${tab.color},${tab.color}dd)`:'transparent',
              color:activeTab===tab.id?'white':sub,
              boxShadow:activeTab===tab.id?`0 4px 16px ${tab.color}50`:''
            }}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* ── Logs Tab ── */}
        {activeTab === 'logs' && (
          <>
            <h2 style={{color:tx,fontWeight:900,fontSize:16,marginBottom:14}}>{t.myLogs}</h2>
            {logs.length===0?(
              <div style={{textAlign:'center',padding:'60px 24px',color:sub}}>
                <div style={{animation:'float 3s ease-in-out infinite',display:'inline-block',marginBottom:16}}>
                  <Brain size={52} style={{opacity:.2}}/>
                </div>
                <p style={{fontWeight:700,fontSize:15,marginBottom:6}}>{t.noLogsYet}</p>
              </div>
            ):(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
                {logs.map((log: any,li: number)=>(
                  <div key={log.id} className="log-card" style={{
                    position:'relative',background:card,border:`1px solid ${bd}`,borderRadius:22,padding:'18px',
                    display:'flex',flexDirection:'column',
                    animation:`fadeSlideIn .4s ease-out ${li*0.06}s both`,
                    boxShadow:isDark?'0 4px 20px rgba(0,0,0,0.25)':'0 4px 20px rgba(0,0,0,0.06)',
                    borderTop:`3px solid ${isDark?'rgba(99,102,241,0.4)':'rgba(99,102,241,0.2)'}`
                  }}>
                    {deleteConfirmId===log.id&&(
                      <div style={{position:'absolute',inset:0,background:card,borderRadius:22,display:'flex',alignItems:'center',justifyContent:'center',gap:10,zIndex:20,flexDirection:'column'}}>
                        <span style={{color:tx,fontSize:14,fontWeight:900,marginBottom:10}}>{t.deleteConfirm}</span>
                        <div style={{display:'flex',gap:10}}>
                          <button onClick={()=>{onDeleteLog(log.id);setDeleteConfirmId(null);}} style={{background:'linear-gradient(135deg,#ef4444,#dc2626)',color:'white',border:'none',padding:'8px 16px',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.deleteYes}</button>
                          <button onClick={()=>setDeleteConfirmId(null)} style={{background:isDark?'#27272a':'#e2e8f0',color:tx,border:'none',padding:'8px 16px',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:font}}>{t.cancel}</button>
                        </div>
                      </div>
                    )}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                      <span style={{color:sub,fontSize:11,display:'flex',alignItems:'center',gap:4}}><Clock size={11}/> {log.date}</span>
                      {log.hasShame&&log.shameLevel!=null?(
                        <span style={{background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15))',color:'#6366f1',fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:10,border:'1px solid rgba(99,102,241,0.2)'}}>
                          {t.shame} {numFmt(log.shameLevel,lang)}%
                        </span>
                      ):(
                        <span style={{background:isDark?'rgba(255,255,255,0.05)':'#f8fafc',color:sub,fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:10,border:`1px solid ${bd}`}}>{t.noShame}</span>
                      )}
                    </div>
                    <p style={{color:tx,fontSize:13,lineHeight:1.7,marginBottom:16,fontWeight:500}}>{log.situation}</p>
                    {log.emotions&&log.emotions.length>0&&(
                      <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
                        {log.emotions.map((emo: any)=>{
                          const ec=getEC(emo.name,isDark);
                          return (<span key={emo.name} style={{background:ec.bg,color:ec.tx,border:`1.5px solid ${ec.bd}`,fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20,display:'flex',alignItems:'center',gap:4}}>
                            <span style={{width:7,height:7,borderRadius:'50%',background:ec.hex,flexShrink:0}}/>{emo.name} {numFmt(emo.intensity,lang)}%
                          </span>);
                        })}
                      </div>
                    )}
                    {log.thoughts&&log.thoughts.length>0&&(
                      <div style={{marginTop:'auto',paddingTop:16,borderTop:`1px solid ${bd}`}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                          <h4 style={{display:'flex',alignItems:'center',gap:6,color:sub,fontSize:12,fontWeight:700}}>
                            <MessageSquare size={14}/> {t.thoughts} ({numFmt(log.thoughts.length,lang)})
                          </h4>
                          <div style={{display:'flex',gap:8}}>
                            <button onClick={()=>onEditLog(log)} style={{color:sub,background:'none',border:'none',cursor:'pointer',padding:4,transition:'color 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.color='#6366f1')} onMouseLeave={e=>(e.currentTarget.style.color=sub)}><Edit2 size={16}/></button>
                            <button onClick={()=>setDeleteConfirmId(log.id)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:4}}><Trash2 size={16}/></button>
                          </div>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',gap:8}}>
                          {log.thoughts.map((th: any,i: number)=>(
                            <div key={i} style={{background:isDark?'rgba(99,102,241,0.06)':'#f8faff',border:`1px solid ${isDark?'rgba(99,102,241,0.15)':'#e0e7ff'}`,borderRadius:14,padding:'12px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
                              <span style={{background:isDark?'rgba(99,102,241,0.2)':'#e0e7ff',color:isDark?'#a5b4fc':'#4f46e5',fontSize:11,fontWeight:700,padding:'5px 12px',borderRadius:20,whiteSpace:'nowrap'}}>
                                {t.belief} {numFmt(th.belief,lang)}%
                              </span>
                              <span style={{color:tx,fontSize:13,fontWeight:600,lineHeight:1.6,textAlign:isRTL?'right':'left',flex:1}}>{th.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Beliefs Tab ── */}
        {activeTab === 'beliefs' && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h2 style={{color:tx,fontWeight:900,fontSize:16,margin:0}}>{t.beliefAnalysis}</h2>
              <div style={{background:isDark?'rgba(20,184,166,0.1)':'#ccfbf1',borderRadius:12,padding:'6px 14px',display:'flex',alignItems:'center',gap:4,border:'1px solid rgba(20,184,166,0.3)'}}>
                <Scale size={13} color="#14b8a6"/>
                <span style={{color:'#14b8a6',fontSize:12,fontWeight:700}}>{numFmt(beliefs.length,lang)} {t.analyses}</span>
              </div>
            </div>
            {beliefs.length===0?(
              <div style={{textAlign:'center',padding:'60px 24px',color:sub}}>
                <div style={{animation:'float 3s ease-in-out infinite',display:'inline-block',marginBottom:16}}><Scale size={52} style={{opacity:.2}}/></div>
                <p style={{fontWeight:700,marginBottom:6}}>{t.noBeliefs}</p>
                <p style={{fontSize:13}}>{t.noBeliefsHint}</p>
              </div>
            ):beliefs.map((b: any)=>(
              <BeliefCard key={b.id} belief={b} isDark={isDark} lang={lang} isRTL={isRTL}
                onEdit={()=>onEditBelief(b)} onDelete={()=>onDeleteBelief(b.id)}/>
            ))}
          </>
        )}

        {/* ── Quarantine Tab ── */}
        {activeTab === 'quarantine' && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h2 style={{color:tx,fontWeight:900,fontSize:16,margin:0}}>{t.quarantineBox}</h2>
              <button onClick={onOpenQuarantine} style={{display:'flex',alignItems:'center',gap:6,background:'linear-gradient(135deg,#f97316,#ea580c)',color:'white',border:'none',borderRadius:12,padding:'8px 16px',fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 16px rgba(249,115,22,0.35)',fontFamily:font}}>
                <Archive size={15}/> {t.manageQuarantine}
              </button>
            </div>
            {quarantine.length===0?(
              <div style={{textAlign:'center',padding:'60px 24px',color:sub}}>
                <div style={{animation:'float 3s ease-in-out infinite',display:'inline-block',marginBottom:16}}><Archive size={52} style={{opacity:.25}}/></div>
                <p style={{fontWeight:700,marginBottom:6}}>{t.quarantineEmpty}</p>
                <p style={{fontSize:13}}>{t.quarantineEmptyHint}</p>
              </div>
            ):(
              <div>
                {quarantine.filter((i: any)=>!i.resolved).length>0&&(
                  <div style={{marginBottom:16}}>
                    <p style={{color:sub,fontSize:12,fontWeight:700,marginBottom:10,display:'flex',alignItems:'center',gap:5}}><Lock size={12}/> {t.inQuarantine} ({numFmt(quarantine.filter((i: any)=>!i.resolved).length,lang)})</p>
                    {quarantine.filter((i: any)=>!i.resolved).map((item: any)=>(
                      <div key={item.id} style={{background:card,border:`1px solid ${isDark?'rgba(249,115,22,0.25)':'#fed7aa'}`,borderRadius:14,padding:14,marginBottom:8,display:'flex',alignItems:'center',gap:10}}>
                        <Lock size={16} color="#f97316" style={{flexShrink:0}}/>
                        <p style={{color:sub,fontSize:13,margin:0,filter:'blur(5px)',flex:1}}>████████████</p>
                        <button onClick={onOpenQuarantine} style={{color:'#f97316',fontSize:11,fontWeight:700,background:'rgba(249,115,22,0.1)',border:'1px solid rgba(249,115,22,0.3)',borderRadius:8,padding:'5px 10px',cursor:'pointer',fontFamily:font}}>{t.openQuarantine}</button>
                      </div>
                    ))}
                  </div>
                )}
                {quarantine.filter((i: any)=>i.resolved).length>0&&(
                  <div>
                    <p style={{color:sub,fontSize:12,fontWeight:700,marginBottom:10,display:'flex',alignItems:'center',gap:5}}><Unlock size={12}/> {t.resolved} ({numFmt(quarantine.filter((i: any)=>i.resolved).length,lang)})</p>
                    {quarantine.filter((i: any)=>i.resolved).map((item: any)=>(
                      <div key={item.id} style={{background:isDark?'rgba(34,197,94,0.06)':'#f0fdf4',border:`1px solid ${isDark?'rgba(34,197,94,0.2)':'#bbf7d0'}`,borderRadius:14,padding:14,marginBottom:8,opacity:0.8}}>
                        <p style={{color:sub,fontSize:12,margin:'0 0 6px',textDecoration:'line-through'}}>{item.thought}</p>
                        <p style={{color:'#22c55e',fontSize:12,margin:0}}>💡 {item.resolution}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position:'fixed',bottom:0,width:'100%',
        background:isDark?'rgba(9,9,11,0.96)':'rgba(255,255,255,0.96)',
        backdropFilter:'blur(20px)',
        borderTop:`1px solid ${isDark?'rgba(99,102,241,0.15)':bd}`,
        padding:'10px 20px 18px',display:'flex',justifyContent:'space-around',alignItems:'center',zIndex:50,
        boxShadow:isDark?'0 -4px 24px rgba(0,0,0,0.3)':'0 -4px 24px rgba(0,0,0,0.06)'
      }}>
        <button onClick={openCognitive} className="nav-btn" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',color:sub,fontFamily:font}}>
          <BookOpen size={21}/><span style={{fontSize:10,fontWeight:600}}>{t.cognitiveErrors.split(' ')[0]}</span>
        </button>
        <button onClick={toggleTheme} className="nav-btn" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',color:sub,fontFamily:font}}>
          {isDark?<Sun size={21}/>:<Moon size={21}/>}<span style={{fontSize:10,fontWeight:600}}>{isDark?t.lightMode:t.darkMode}</span>
        </button>
        <div style={{width:64}}/>
        <button className="nav-btn" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',color:'#6366f1',fontFamily:font}}>
          <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15))',padding:'6px',borderRadius:12,border:'1px solid rgba(99,102,241,0.25)'}}>
            <LayoutGrid size={21}/>
          </div>
          <span style={{fontSize:10,fontWeight:700}}>{t.dashboard}</span>
        </button>
        <button onClick={()=>openNotes(false)} className="nav-btn" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',color:sub,fontFamily:font}}>
          <MessageSquare size={21}/><span style={{fontSize:10,fontWeight:600}}>{t.sessionNotes.split(' ')[0]}</span>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────── MAIN APP ───────────────────────────

export default function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [lang, setLang]   = useState<Lang>(()=>{
    try { return (localStorage.getItem('nat_lang') as Lang) || 'fa'; } catch { return 'fa'; }
  });
  const isRTL = lang === 'fa' || lang === 'ar';

  const [modals, setModals] = useState({ addLog:false, cognitive:false, notes:false, belief:false, quarantine:false });
  const [notesStartAdding, setNotesStartAdding] = useState(false);
  const [editingLog,    setEditingLog]    = useState<any>(null);
  const [editingBelief, setEditingBelief] = useState<any>(null);
  const [isDark, setIsDark]     = useState(true);
  const [isExporting, setExp]   = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [toast, setToast]       = useState('');
  const [includeNotesExport, setIncludeNotesExport] = useState(true);
  const toastTimer = useRef<any>(null);

  const [logs, setLogs] = useState<any[]>(()=>{
    try { const s=localStorage.getItem('nat_tracker_logs'); return s?JSON.parse(s):[]; } catch{ return []; }
  });
  const [sessionNotes, setNotes] = useState<any[]>(()=>{
    try { const s=localStorage.getItem('nat_tracker_notes'); return s?JSON.parse(s):[]; } catch{ return []; }
  });
  const [beliefs, setBeliefs] = useState<any[]>(()=>{
    try { const s=localStorage.getItem('nat_tracker_beliefs'); return s?JSON.parse(s):[]; } catch{ return []; }
  });
  const [quarantine, setQuarantine] = useState<any[]>(()=>{
    try { const s=localStorage.getItem('nat_tracker_quarantine'); return s?JSON.parse(s):[]; } catch{ return []; }
  });

  const sortedLogs       = [...logs].sort((a,b)=>(b.timestamp||parseInt(b.id)||0)-(a.timestamp||parseInt(a.id)||0));
  const sortedNotes      = [...sessionNotes].sort((a,b)=>(b.timestamp||parseInt(b.id)||0)-(a.timestamp||parseInt(a.id)||0));
  const sortedBeliefs    = [...beliefs].sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
  const sortedQuarantine = [...quarantine].sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));

  useEffect(()=>{ setTimeout(()=>setAppLoading(false), 800); }, []);
  useEffect(()=>{ localStorage.setItem('nat_tracker_logs',JSON.stringify(logs)); }, [logs]);
  useEffect(()=>{ localStorage.setItem('nat_tracker_notes',JSON.stringify(sessionNotes)); }, [sessionNotes]);
  useEffect(()=>{ localStorage.setItem('nat_tracker_beliefs',JSON.stringify(beliefs)); }, [beliefs]);
  useEffect(()=>{ localStorage.setItem('nat_tracker_quarantine',JSON.stringify(quarantine)); }, [quarantine]);
  useEffect(()=>{ localStorage.setItem('nat_lang', lang); }, [lang]);

  // Update document direction
  useEffect(()=>{
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(()=>setToast(''), 2500);
  };

  const openModal  = (name: string) => setModals(m=>({...m,[name]:true}));
  const closeModal = (name: string) => setModals(m=>({...m,[name]:false}));

  const handleSaveLog = (newLog: any) => {
    const t = T[lang];
    if (editingLog) { setLogs(logs.map(l=>l.id===newLog.id?newLog:l)); showToast(t.logEdited); }
    else { setLogs([newLog,...logs]); showToast(t.logSaved); }
    setEditingLog(null); closeModal('addLog');
    setShowSave(true); setTimeout(()=>setShowSave(false),2000);
  };
  const handleEditLog   = (log: any)   => { setEditingLog(log); openModal('addLog'); };
  const handleDeleteLog = (id: string) => { setLogs(logs.filter(l=>l.id!==id)); showToast(T[lang].logDeleted); };

  const handleSaveNote = (note: any) => {
    const t = T[lang];
    const exists = sessionNotes.find(n=>n.id===note.id);
    if (exists) { setNotes(sessionNotes.map(n=>n.id===note.id?note:n)); showToast(t.noteEdited); }
    else { setNotes([note,...sessionNotes]); showToast(t.noteSaved); }
  };
  const handleDeleteNote = (id: string) => { setNotes(sessionNotes.filter(n=>n.id!==id)); showToast(T[lang].noteDeleted); };

  const handleSaveBelief = (belief: any) => {
    const t = T[lang];
    const exists = beliefs.find(b=>b.id===belief.id);
    if (exists) { setBeliefs(beliefs.map(b=>b.id===belief.id?belief:b)); showToast(t.analysisEdited); }
    else { setBeliefs([belief,...beliefs]); showToast(t.analysisSaved); }
    setEditingBelief(null); closeModal('belief');
    setShowSave(true); setTimeout(()=>setShowSave(false),2000);
  };
  const handleEditBelief   = (b: any)    => { setEditingBelief(b); openModal('belief'); };
  const handleDeleteBelief = (id: string)=> { setBeliefs(beliefs.filter(b=>b.id!==id)); showToast(T[lang].analysisDeleted); };

  const handleAddQuarantine    = (item: any)                   => { setQuarantine(prev=>[item,...prev]); };
  const handleDeleteQuarantine = (id: string)                  => { setQuarantine(quarantine.filter(q=>q.id!==id)); showToast(T[lang].thoughtDeleted); };
  const handleResolveQuarantine= (id: string, res: string)     => { setQuarantine(quarantine.map(q=>q.id===id?{...q,resolved:true,resolution:res}:q)); };

  const handleExportPDF = async () => {
    const t = T[lang];
    setExp(true);
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      const el = document.getElementById('export-container-data');
      if (!el) return;
      const canvas = await (window as any).html2canvas(el,{scale:2,useCORS:true,backgroundColor:'#ffffff'});
      const pdf = new (window as any).jspdf.jsPDF('p','mm','a4');
      const w = pdf.internal.pageSize.getWidth();
      pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,0,w,(canvas.height*w)/canvas.width);
      pdf.save('NAT_Tracker_Report.pdf');
      showToast(t.pdfDownloaded);
    } catch(e){ console.error(e); showToast(t.pdfError); }
    finally { setExp(false); }
  };

  const handlePrint = () => {
    const t = T[lang];
    const el = document.getElementById('export-container-data');
    if (!el) return;
    const printWindow = window.open('','_blank','width=800,height=600');
    if (!printWindow) return showToast(t.popupBlocked);
    printWindow.document.write(`<html dir="${isRTL?'rtl':'ltr'}" lang="${lang}"><head><title>NAT Report</title><link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet"/><style>body{font-family:'${isRTL?'Vazirmatn':'Inter'}',sans-serif;padding:20px;color:black;background:white;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;text-align:${isRTL?'right':'left'};}th{background:#f0f0f0;}</style></head><body>${el.innerHTML}<script>setTimeout(()=>{window.print();window.close();},500);<\/script></body></html>`);
    printWindow.document.close();
  };

  const handleExportWord = () => {
    const t = T[lang];
    const el = document.getElementById('export-container-data');
    if (!el) return;
    const content = el.innerHTML;
    const source = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40' dir='${isRTL?'rtl':'ltr'}'><head><meta charset='utf-8'><title>NAT Report</title></head><body>${content}</body></html>`;
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = 'data:application/vnd.ms-word;charset=utf-8,'+encodeURIComponent(source);
    a.download = 'NAT_Tracker_Report.doc';
    a.click();
    document.body.removeChild(a);
    showToast(t.wordDownloaded);
  };

  const font = isRTL ? 'Vazirmatn,sans-serif' : 'Inter,sans-serif';

  if (appLoading) return (
    <>
      <style dangerouslySetInnerHTML={{__html: globalCSS}}/>
      <InitialLoading lang={lang}/>
    </>
  );

  return (
    <div dir={isRTL?'rtl':'ltr'} style={{fontFamily:font,minHeight:'100vh',background:isDark?'#09090b':'#f8fafc',color:isDark?'#f4f4f5':'#1e293b',position:'relative'}}>
      <style dangerouslySetInnerHTML={{__html: globalCSS}}/>

      {/* Language Switcher — fixed top corner */}
      <div style={{
        position:'fixed',
        top:14,
        right: isRTL ? 14 : 'auto',
        left: isRTL ? 'auto' : 14,
        zIndex:200
      }}>
        <LanguageSwitcher lang={lang} setLang={setLang} isDark={isDark}/>
      </div>

      <PdfTable logs={sortedLogs} sessionNotes={sortedNotes} includeNotesExport={includeNotesExport} lang={lang} isRTL={isRTL}/>
      <SaveAnimation show={showSave}/>
      <Toast msg={toast}/>

      <DashboardView
        logs={sortedLogs} sessionNotes={sortedNotes} beliefs={sortedBeliefs} quarantine={sortedQuarantine}
        onExportPDF={handleExportPDF} onExportWord={handleExportWord} onPrint={handlePrint}
        isDark={isDark} toggleTheme={()=>setIsDark(!isDark)} isExporting={isExporting}
        openCognitive={()=>openModal('cognitive')}
        openNotes={(autoAdd: boolean)=>{ setNotesStartAdding(autoAdd===true); openModal('notes'); }}
        onEditLog={handleEditLog} onDeleteLog={handleDeleteLog}
        onEditBelief={handleEditBelief} onDeleteBelief={handleDeleteBelief}
        onOpenQuarantine={()=>openModal('quarantine')}
        showToast={showToast}
        includeNotesExport={includeNotesExport} setIncludeNotesExport={setIncludeNotesExport}
        lang={lang} setLang={setLang} isRTL={isRTL}
      />

      <FABMenu
        onAddLog={()=>{ setEditingLog(null); openModal('addLog'); }}
        onAddNote={()=>{ setNotesStartAdding(true); openModal('notes'); }}
        onAddBelief={()=>{ setEditingBelief(null); openModal('belief'); }}
        onAddQuarantine={()=>openModal('quarantine')}
        lang={lang} isRTL={isRTL}
      />

      {modals.addLog&&(
        <AddLogModal initialData={editingLog} onSave={handleSaveLog}
          onClose={()=>{ setEditingLog(null); closeModal('addLog'); }}
          isDark={isDark} showToast={showToast} lang={lang} isRTL={isRTL}/>
      )}
      {modals.cognitive&&(
        <CognitiveErrorsModal onClose={()=>closeModal('cognitive')} isDark={isDark} lang={lang} isRTL={isRTL}/>
      )}
      {modals.notes&&(
        <SessionNotesModal notes={sortedNotes} startAdding={notesStartAdding}
          onSave={handleSaveNote} onDelete={handleDeleteNote}
          onClose={()=>closeModal('notes')} isDark={isDark} showToast={showToast} lang={lang} isRTL={isRTL}/>
      )}
      {modals.belief&&(
        <CostBenefitModal onClose={()=>{ setEditingBelief(null); closeModal('belief'); }}
          isDark={isDark} onSave={handleSaveBelief} editData={editingBelief} showToast={showToast} lang={lang} isRTL={isRTL}/>
      )}
      {modals.quarantine&&(
        <QuarantineModal onClose={()=>closeModal('quarantine')} isDark={isDark}
          items={sortedQuarantine}
          onAdd={handleAddQuarantine} onDelete={handleDeleteQuarantine} onResolve={handleResolveQuarantine}
          showToast={showToast} lang={lang} isRTL={isRTL}/>
      )}
    </div>
  );
}
