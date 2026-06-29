import { useState, useEffect, useRef } from 'react';
import {
  Download, Plus, Brain, X, Clock,
  Sun, Moon, ToggleLeft, ToggleRight, Loader2, Check,
  BookOpen, MessageSquare, LayoutGrid, FileText,
  Trash2, Edit2, Printer, Scale, Archive, Lock, Unlock,
  Lightbulb, ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';

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
};

const getEC = (name: string, dark: boolean) => {
  const c = EMOTION_COLORS[name];
  if (!c) return { bg: dark ? 'rgba(99,102,241,0.15)' : '#e0e7ff', tx: dark ? '#818cf8' : '#3730a3', bd: dark ? 'rgba(99,102,241,0.35)' : '#a5b4fc', hex: '#6366f1' };
  return { bg: dark ? c.bgD : c.bgL, tx: dark ? c.txD : c.txL, bd: dark ? c.bdD : c.bdL, hex: c.hex };
};

const DEFAULT_EMOTIONS = ['اضطراب','غم','خشم','ترس','عذاب وجدان','خجالت','شرم','شادی','ناامیدی','دلتنگی','تنهایی','حسادت','ناامنی'];

const COGNITIVE_ERRORS = [
  { id:1,  name:'ذهن خوانی',                   desc:'فرض می‌گذارید که می‌دانید آدم‌ها چه فکر می‌کنند، بی‌آنکه شواهد کافی در مورد افکارشان داشته باشید.',  ex:'او فکر می‌کند من یک بازنده‌ام.' },
  { id:2,  name:'پیش گویی',                     desc:'آینده را پیش بینی می‌کنید. پیش بینی می‌کنید که اوضاع بدتر خواهد شد یا خطری در پیش است.',           ex:'در امتحان قبول نخواهم شد. یا: این شغل را به دست نخواهم آورد.' },
  { id:3,  name:'فاجعه سازی',                   desc:'بر این باورید که آنچه اتفاق افتاده آنچنان دردناک و غیرقابل تحمل خواهد بود که شما نمی‌توانید آن را تحمل کنید.',  ex:'اگر در امتحان رد شوم، وحشتناک است.' },
  { id:4,  name:'برچسب زدن',                    desc:'یک ویژگی منفی خیلی کلی را به خود و دیگران نسبت می‌دهید.',                                              ex:'من دوست داشتنی نیستم. یا: او بی‌لیاقت است.' },
  { id:5,  name:'دست کم گرفتن جنبه‌های مثبت',  desc:'مدعی هستید که دستاوردهای مثبت شما یا دیگران ناچیز و جزئی هستند.',                                    ex:'این وظیفه زن خانه است. یا: این موفقیت‌ها مهم نیستند، خیلی آسان به دست آمدند.' },
  { id:6,  name:'فیلتر منفی',                   desc:'تقریباً منحصراً بر جنبه‌های منفی متمرکز می‌شوید و به ندرت به جنبه‌های مثبت توجه می‌کنید.',             ex:'اگر گاهی به یاد بیازید متوجه می‌شوید که چه تعداد آدم‌هایی مرا دوست ندارند.' },
  { id:7,  name:'تعمیم افراطی',                 desc:'صرفاً براساس یک رویداد خاص، یک الگوی کلی منفی را استنباط می‌کنید.',                                  ex:'این اتفاق همیشه برای من پیش می‌آید. انگار من خیلی جاها شکست می‌خورم.' },
  { id:8,  name:'تفکر دو قطبی',                 desc:'آدم‌ها یا اتفاق‌ها را به صورت همه یا هیچ می‌بینند.',                                                    ex:'همه مرا کنار گذاشته‌اند. یا: وقت تلف کردن بود.' },
  { id:9,  name:'بایدها',                        desc:'رویدادها را بر مبنای این‌که چطور باید بودند تفسیر می‌کنید، نه بر مبنای آنکه واقعاً چطور هستند.',      ex:'باید خوب عمل کنم، و اگر خوب عمل نکنم یعنی شکست خورده‌ام.' },
  { id:10, name:'شخصی سازی',                    desc:'به خاطر اتفاقات ناخوشایند منفی، تقصیر زیادی را به صورت غیرمنصفانه به خود نسبت می‌دهید.',              ex:'ازدواجم به بن بست رسید، چون من شکست خوردم.' },
  { id:11, name:'مقصر دانستن',                  desc:'فرد دیگری را منبع اصلی احساسات منفی‌تان می‌دانید و مسئولیت تغییر خودتان را نمی‌پذیرید.',              ex:'تقصیر اوست که من الان این گونه احساس می‌کنم.' },
  { id:12, name:'مقایسه‌های غیرمنصفانه',        desc:'اتفاق‌ها را براساس استانداردهایی تفسیر می‌کنید که واقع‌بینانه نیستند.',                                 ex:'او در مقایسه با من موفق‌تر است. یا: دیگران بهتر از من امتحان دادند.' },
  { id:13, name:'همیشه پشیمان بودن',            desc:'تمرکز ذهنی با این‌که از این‌ها عمل کنم بهتر از آن‌ها می‌توانستم عمل کنم، به جای توجه به کارهایی که الان می‌توانم بهتر انجام بدهم.', ex:'اگر تلاش کرده بودم می‌توانستم شغل بهتری داشته باشم.' },
  { id:14, name:'چه می‌شود اگر؟',               desc:'یک سلسله سؤالات «چه می‌شود اگر؟» می‌پرسید و از پاسخی که به خود می‌دهید هرگز راضی نیستید.',          ex:'درست، ولی اگر مضطرب شوم چه؟ یا: اگر نتوانم درست نفس بکشم چه؟' },
  { id:15, name:'استدلال هیجانی',               desc:'اجازه می‌دهید که احساساتتان، تفسیرتان از واقعیت را هدایت کنند.',                                        ex:'احساس افسردگی می‌کنم، و این یعنی ازدواجم به بن بست خورده است.' },
  { id:16, name:'ناتوانی در عدم تأیید شواهد',  desc:'همه مدارک یا شواهد بر علیه افکار منفی‌تان را رد می‌کنید. در نتیجه افکارتان قابل رد کردن نیستند.',     ex:'موضوع واقعاً این نیست، مشکلات عمیق‌تر از این حرف‌ها هستند.' },
  { id:17, name:'برخورد قضاوتی',               desc:'خودتان، دیگران و اتفاق‌ها را به جای توصیف، پذیرش یا درک، به صورت سیاه و سفید ارزیابی می‌کنید.',      ex:'در دانشگاه خوب درس نخواندم. یا: ببین چقدر موفق است، من نیستم.' },
];

const NOTE_COLORS = ['#f59e0b','#22c55e','#3b82f6','#ec4899','#a78bfa','#f97316'];
const SHAMSI_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

const loadScript = (src: string) => new Promise<void>((res, rej) => {
  if (document.querySelector(`script[src="${src}"]`)) return res();
  const s = document.createElement('script');
  s.src = src; s.onload = () => res(); s.onerror = () => rej(new Error(src));
  document.head.appendChild(s);
});

const toPersianNum = (n: number | string) => n.toString().replace(/\d/g, (x: string) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(x)]);
const padZero = (n: number) => n < 10 ? '۰' + toPersianNum(n) : toPersianNum(n);

const getShamsiParts = () => {
  const d = new Date();
  const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', calendar: 'persian'
  }).formatToParts(d);
  const val = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
  return { y: val('year'), m: val('month'), d: val('day'), h: val('hour'), min: val('minute') };
};

const getTimestampFromParts = (p: any) => p.y * 100000000 + p.m * 1000000 + p.d * 10000 + p.h * 100 + p.min;

const formatShamsi = ({y, m, d, h, min}: any) => {
  return `${toPersianNum(d)} ${SHAMSI_MONTHS[m-1]} ${toPersianNum(y)} - ${padZero(h)}:${padZero(min)}`;
};

const getShamsiNow = () => formatShamsi(getShamsiParts());

// ─────────────────────────── ANIMATIONS CSS ───────────────────────────
const globalCSS = `
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
  @keyframes glitch {
    0%, 100% { filter: blur(0px); }
    33% { filter: blur(1px); transform: translateX(1px); }
    66% { filter: blur(0.5px); transform: translateX(-1px); }
  }
  @keyframes scanline {
    0% { top: -10%; }
    100% { top: 110%; }
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
  .native-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px; height: 24px;
    border-radius: 50%;
    background: white;
    border: 3px solid var(--slider-color);
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    cursor: pointer;
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
  .quarantine-card-blurred { filter: blur(6px); user-select: none; pointer-events: none; }
  .quarantine-reveal { animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards; }
`;

// ─────────────────────────── MICRO COMPONENTS ───────────────────────────

const InitialLoading = () => (
  <div style={{position:'fixed',inset:0,background:'#09090b',zIndex:9999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
    <Brain size={64} color="#6366f1" style={{animation:'pulse-ring 1.5s infinite ease-out'}} />
    <h2 style={{color:'white',marginTop:24,fontSize:20,fontWeight:900,letterSpacing:'-0.5px'}}>در حال آماده‌سازی...</h2>
    <p style={{color:'#a1a1aa',fontSize:13,marginTop:8}}>فضای شخصی‌سازی شده شما</p>
  </div>
);

const SaveAnimation = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,pointerEvents:'none'}}>
      <div style={{position:'relative'}}>
        <div style={{position:'absolute',inset:0,borderRadius:'50%',background:'rgba(34,197,94,0.4)',animation:'pulse-ring 0.8s ease-out 0.2s both'}}/>
        <div style={{
          background:'#22c55e',borderRadius:'50%',width:80,height:80,
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
      background:'#18181b',color:'#f4f4f5', padding:'10px 20px',borderRadius:12,zIndex:9998,
      fontSize:13,fontWeight:700, animation:'slideUpFade 2.5s ease-in-out forwards',
      boxShadow:'0 4px 20px rgba(0,0,0,0.5)', whiteSpace:'nowrap',border:'1px solid #3f3f46'
    }}>{msg}</div>
  );
};

const CustomSlider = ({ value, onChange, label, color='#6366f1' }: any) => {
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
        className="native-slider" dir="rtl"
        style={{'--slider-color': color, '--slider-fill': `${value}%`} as any}
      />
    </div>
  );
};

// ─────────────────────────── FAB MENU ───────────────────────────

const FABMenu = ({ onAddLog, onAddNote, onAddBelief, onAddQuarantine }: any) => {
  const [open, setOpen] = useState(false);
  const items = [
    { icon: <Archive size={18}/>,  label:'جعبه قرنطینه',    action: onAddQuarantine, color:'#f97316' },
    { icon: <Scale size={18}/>,    label:'تحلیل سود و زیان', action: onAddBelief,     color:'#14b8a6' },
    { icon: <FileText size={18}/>, label:'تکلیف / یادداشت',  action: onAddNote,       color:'#ec4899' },
    { icon: <Brain size={18}/>,    label:'ثبت افکار',         action: onAddLog,        color:'#6366f1' },
  ];
  return (
    <div style={{position:'fixed',bottom:80,left:20,zIndex:100}}>
      {open && (
        <div style={{position:'absolute',bottom:68,left:0,display:'flex',flexDirection:'column',gap:10,alignItems:'flex-start'}}>
          {items.map((item,i)=>(
            <button key={i} onClick={()=>{setOpen(false);item.action();}}
              style={{
                display:'flex',alignItems:'center',gap:10, background:item.color,color:'white',
                border:'none',borderRadius:14, padding:'10px 16px',
                fontSize:13,fontWeight:700,cursor:'pointer', boxShadow:`0 4px 20px ${item.color}60`,
                animation:`fabExpand .25s cubic-bezier(.34,1.56,.64,1) ${i*0.07}s both`, whiteSpace:'nowrap'
              }}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>
      )}
      <button onClick={()=>setOpen(!open)} style={{
        width:56,height:56,borderRadius:18, background:'#6366f1',color:'white',border:'none',
        display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
        boxShadow:'0 0 24px rgba(99,102,241,0.5)', transition:'all .25s cubic-bezier(.34,1.56,.64,1)',
        transform: open ? 'rotate(45deg) scale(1.05)' : 'rotate(0deg) scale(1)',
      }}>
        <Plus size={28} strokeWidth={2.5}/>
      </button>
    </div>
  );
};

// ─────────────────────────── COST-BENEFIT MATRIX MODAL ───────────────────────────

const CostBenefitModal = ({ onClose, isDark, onSave, editData, showToast }: any) => {
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

  const addRow = (list: string[], setList: any) => setList([...list, '']);
  const updateRow = (list: string[], setList: any, i: number, val: string) => {
    const n = [...list]; n[i] = val; setList(n);
  };
  const removeRow = (list: string[], setList: any, i: number) => {
    if (list.length === 1) return;
    setList(list.filter((_: any, j: number) => j !== i));
  };

  const handleSave = () => {
    if (!behavior.trim()) { showToast('لطفا باور یا رفتار را وارد کنید'); return; }
    onSave({
      id: editData?.id || Date.now().toString(),
      date: editData?.date || getShamsiNow(),
      timestamp: editData?.timestamp || Date.now(),
      behavior: behavior.trim(),
      benefits: benefits.filter(b => b.trim()),
      costs: costs.filter(c => c.trim()),
      worthIt,
      conclusion: conclusion.trim()
    });
  };

  const rowInput = (val: string, onChange: any, placeholder: string) => (
    <input value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{flex:1, background:'transparent', border:'none', outline:'none', color:tx,
        fontSize:13, fontFamily:'Vazirmatn,sans-serif', padding:'6px 0'}}
    />
  );

  // Worth-it label
  const worthLabel = worthIt >= 70 ? { txt: 'بله، می‌ارزد ✅', color: '#22c55e' }
    : worthIt >= 40 ? { txt: 'شاید... 🤔', color: '#f59e0b' }
    : { txt: 'نه، نمی‌ارزد ❌', color: '#ef4444' };

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:isDark?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)',display:'flex',justifyContent:'center',overflowY:'auto'}}>
      <div style={{background:bg,width:'100%',maxWidth:640,display:'flex',flexDirection:'column',animation:'slideInUp .3s ease-out',minHeight:'100vh'}}>
        {/* Header */}
        <div style={{position:'sticky',top:0,zIndex:10,background:isDark?'rgba(9,9,11,.94)':'rgba(248,250,252,.94)',backdropFilter:'blur(14px)',borderBottom:`1px solid ${bd}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={onClose} style={{color:sub,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer'}}>بستن ✕</button>
          <h1 style={{color:tx,fontWeight:900,fontSize:17,display:'flex',alignItems:'center',gap:8}}>
            <Scale size={19} color="#14b8a6"/> تحلیل سود و زیان
          </h1>
          <div style={{width:40}}/>
        </div>

        <div style={{padding:'24px 20px',flex:1}}>
          {/* Behavior input */}
          <div style={{marginBottom:20}}>
            <label style={{color:sub,fontSize:12,fontWeight:700,display:'block',marginBottom:8}}>باور یا رفتار مورد بررسی</label>
            <input value={behavior} onChange={e=>setBehavior(e.target.value)}
              placeholder="مثال: کمال‌گرایی، اجتناب از موقعیت‌های اجتماعی..."
              style={{width:'100%',boxSizing:'border-box',background:card,border:`2px solid #14b8a6`,borderRadius:14,
                padding:'12px 16px',color:tx,fontSize:14,fontFamily:'Vazirmatn,sans-serif',outline:'none',fontWeight:700}}
            />
          </div>

          {/* Matrix */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
            {/* Benefits column */}
            <div style={{background:isDark?'rgba(34,197,94,0.08)':'#f0fdf4',border:`1.5px solid ${isDark?'rgba(34,197,94,0.25)':'#86efac'}`,borderRadius:16,padding:14}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
                <span style={{fontSize:18}}>💰</span>
                <h3 style={{color:'#22c55e',fontWeight:900,fontSize:13,margin:0}}>سودها</h3>
              </div>
              {benefits.map((b, i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:6,marginBottom:8,background:isDark?'rgba(34,197,94,0.06)':'rgba(34,197,94,0.05)',borderRadius:10,padding:'6px 10px',border:`1px solid ${isDark?'rgba(34,197,94,0.15)':'#bbf7d0'}`}}>
                  <span style={{color:'#22c55e',fontSize:12,fontWeight:700,flexShrink:0}}>+</span>
                  {rowInput(b, (v: string) => updateRow(benefits, setBenefits, i, v), 'سود...')}
                  <button onClick={() => removeRow(benefits, setBenefits, i)} style={{background:'none',border:'none',cursor:'pointer',color:'#22c55e',opacity:0.5,padding:2}}>
                    <X size={12}/>
                  </button>
                </div>
              ))}
              <button onClick={() => addRow(benefits, setBenefits)} style={{width:'100%',padding:'8px',border:`1.5px dashed #22c55e`,borderRadius:10,background:'none',color:'#22c55e',fontSize:12,fontWeight:700,cursor:'pointer',marginTop:4}}>
                + اضافه
              </button>
            </div>

            {/* Costs column */}
            <div style={{background:isDark?'rgba(239,68,68,0.08)':'#fef2f2',border:`1.5px solid ${isDark?'rgba(239,68,68,0.25)':'#fca5a5'}`,borderRadius:16,padding:14}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
                <span style={{fontSize:18}}>💸</span>
                <h3 style={{color:'#ef4444',fontWeight:900,fontSize:13,margin:0}}>هزینه‌ها</h3>
              </div>
              {costs.map((c, i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:6,marginBottom:8,background:isDark?'rgba(239,68,68,0.06)':'rgba(239,68,68,0.05)',borderRadius:10,padding:'6px 10px',border:`1px solid ${isDark?'rgba(239,68,68,0.15)':'#fecaca'}`}}>
                  <span style={{color:'#ef4444',fontSize:12,fontWeight:700,flexShrink:0}}>−</span>
                  {rowInput(c, (v: string) => updateRow(costs, setCosts, i, v), 'هزینه...')}
                  <button onClick={() => removeRow(costs, setCosts, i)} style={{background:'none',border:'none',cursor:'pointer',color:'#ef4444',opacity:0.5,padding:2}}>
                    <X size={12}/>
                  </button>
                </div>
              ))}
              <button onClick={() => addRow(costs, setCosts)} style={{width:'100%',padding:'8px',border:`1.5px dashed #ef4444`,borderRadius:10,background:'none',color:'#ef4444',fontSize:12,fontWeight:700,cursor:'pointer',marginTop:4}}>
                + اضافه
              </button>
            </div>
          </div>

          {/* Worth It Slider */}
          <div style={{background:card,border:`1.5px solid ${bd}`,borderRadius:16,padding:16,marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <span style={{color:sub,fontSize:13,fontWeight:700}}>آیا سود این رفتار به هزینه‌اش می‌ارزد؟</span>
              <span style={{color:worthLabel.color,fontSize:13,fontWeight:900,direction:'rtl'}}>{worthLabel.txt}</span>
            </div>
            <CustomSlider label="میزان ارزشمندی" value={worthIt} onChange={setWorthIt} color={worthLabel.color}/>
          </div>

          {/* Conclusion */}
          <div style={{marginBottom:20}}>
            <label style={{color:sub,fontSize:12,fontWeight:700,display:'block',marginBottom:8}}>نتیجه‌گیری شما</label>
            <textarea value={conclusion} onChange={e=>setConclusion(e.target.value)}
              placeholder="با توجه به این تحلیل، چه تصمیمی می‌گیرید؟" rows={4}
              style={{width:'100%',boxSizing:'border-box',background:card,border:`1px solid ${bd}`,borderRadius:14,
                padding:'12px 14px',color:tx,fontSize:13,fontFamily:'Vazirmatn,sans-serif',resize:'none',outline:'none'}}
            />
          </div>
        </div>

        <div style={{padding:'14px 20px',borderTop:`1px solid ${bd}`,background:card}}>
          <button onClick={handleSave} style={{
            width:'100%',background:'#14b8a6',color:'white',border:'none',borderRadius:14,padding:'14px',
            fontSize:15,fontWeight:900,cursor:'pointer',boxShadow:'0 0 20px rgba(20,184,166,0.4)'
          }}>
            {editData ? 'بروزرسانی تحلیل ✓' : 'ذخیره تحلیل ✓'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────── QUARANTINE BOX MODAL ───────────────────────────

const QuarantineModal = ({ onClose, isDark, items, onAdd, onDelete, onResolve, showToast }: any) => {
  const [adding, setAdding] = useState(false);
  const [thought, setThought] = useState('');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const bg   = isDark ? '#09090b' : '#f8fafc';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#a1a1aa' : '#475569';

  const handleAdd = () => {
    if (!thought.trim()) { showToast('فکر مزاحم را بنویسید'); return; }
    onAdd({ id: Date.now().toString(), thought: thought.trim(), date: getShamsiNow(), timestamp: Date.now(), resolved: false, resolution: '' });
    setThought('');
    setAdding(false);
    showToast('✓ فکر قرنطینه شد 🔒');
  };

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleResolve = (id: string) => {
    if (!resolution.trim()) { showToast('راه‌حل خود را بنویسید'); return; }
    onResolve(id, resolution.trim());
    setResolvingId(null);
    setResolution('');
    showToast('✓ راه‌حل ثبت شد 💡');
  };

  const activeItems  = items.filter((i: any) => !i.resolved);
  const resolvedItems = items.filter((i: any) => i.resolved);

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:isDark?'rgba(0,0,0,0.9)':'rgba(0,0,0,0.5)',backdropFilter:'blur(10px)',display:'flex',justifyContent:'center'}}>
      <div style={{background:bg,width:'100%',maxWidth:640,display:'flex',flexDirection:'column',animation:'slideInUp .3s ease-out',minHeight:'100vh',overflowY:'auto'}}>

        {/* Header */}
        <div style={{position:'sticky',top:0,zIndex:10,background:isDark?'rgba(9,9,11,.96)':'rgba(248,250,252,.96)',backdropFilter:'blur(14px)',borderBottom:`1px solid ${bd}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={onClose} style={{color:sub,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer'}}>بستن ✕</button>
          <h1 style={{color:tx,fontWeight:900,fontSize:17,display:'flex',alignItems:'center',gap:8}}>
            <Archive size={19} color="#f97316"/> جعبه قرنطینه
          </h1>
          <button onClick={() => setAdding(true)} disabled={adding}
            style={{background:adding?'transparent':'#f97316',color:adding?'transparent':'white',border:'none',borderRadius:10,padding:'7px 14px',fontSize:13,fontWeight:700,cursor:adding?'default':'pointer'}}>
            + فکر
          </button>
        </div>

        <div style={{padding:'20px',flex:1}}>

          {/* Hero description */}
          <div style={{background:isDark?'rgba(249,115,22,0.08)':'#fff7ed',border:`1px solid ${isDark?'rgba(249,115,22,0.2)':'#fed7aa'}`,borderRadius:16,padding:'14px 16px',marginBottom:20,display:'flex',gap:12,alignItems:'flex-start'}}>
            <Archive size={20} color="#f97316" style={{flexShrink:0,marginTop:2}}/>
            <p style={{color:isDark?'#fb923c':'#9a3412',fontSize:13,lineHeight:1.8,margin:0,fontWeight:600}}>
              افکارِ مزاحم و وسواسی را اینجا بنداز. آن‌ها تار می‌شوند تا بعداً با آرامش برایشان راه‌حل پیدا کنی — مغزت نباید همه چیز را همزمان حمل کند.
            </p>
          </div>

          {/* Add form */}
          {adding && (
            <div style={{background:card,border:`2px solid #f97316`,borderRadius:18,padding:20,marginBottom:20,animation:'popIn .25s ease-out'}}>
              <h3 style={{color:tx,fontWeight:900,marginBottom:12,fontSize:15,display:'flex',alignItems:'center',gap:8}}>
                <AlertTriangle size={16} color="#f97316"/> فکر مزاحم
              </h3>
              <textarea value={thought} onChange={e=>setThought(e.target.value)} rows={4}
                placeholder="چه فکری ذهنت را درگیر کرده؟ 'اگه فلان بشه چی؟' یا هر وسواس دیگری..."
                style={{width:'100%',boxSizing:'border-box',background:isDark?'#09090b':'#f8fafc',border:`1px solid ${bd}`,
                  borderRadius:12,padding:'12px 14px',color:tx,fontSize:13,fontFamily:'Vazirmatn,sans-serif',resize:'none',outline:'none',marginBottom:14}}
              />
              <div style={{display:'flex',gap:10}}>
                <button onClick={()=>{setAdding(false);setThought('');}} style={{flex:1,padding:'11px',borderRadius:12,background:isDark?'#27272a':'#f1f5f9',color:sub,border:'none',fontSize:13,fontWeight:700,cursor:'pointer'}}>لغو</button>
                <button onClick={handleAdd} style={{flex:2,padding:'11px',borderRadius:12,background:'#f97316',color:'white',border:'none',fontSize:13,fontWeight:700,cursor:'pointer'}}>
                  🔒 قرنطینه کن
                </button>
              </div>
            </div>
          )}

          {/* Active quarantine items */}
          {activeItems.length > 0 && (
            <div style={{marginBottom:24}}>
              <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
                <Lock size={13}/> در قرنطینه ({toPersianNum(activeItems.length)})
              </h3>
              {activeItems.map((item: any, i: number) => {
                const isRevealed = revealedIds.has(item.id);
                const isResolving = resolvingId === item.id;
                return (
                  <div key={item.id} style={{
                    background:card,border:`1.5px solid ${isDark?'rgba(249,115,22,0.3)':'#fed7aa'}`,
                    borderRadius:18,padding:16,marginBottom:12,
                    animation:`fadeSlideIn .3s ease-out ${i*0.07}s both`,
                    position:'relative',overflow:'hidden'
                  }}>
                    {/* scanline effect on locked card */}
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
                        <button onClick={() => toggleReveal(item.id)} style={{
                          display:'flex',alignItems:'center',gap:4,
                          background:isRevealed?'rgba(249,115,22,0.15)':'rgba(249,115,22,0.08)',
                          color:'#f97316',border:`1px solid ${isRevealed?'rgba(249,115,22,0.4)':'rgba(249,115,22,0.2)'}`,
                          borderRadius:8,padding:'5px 10px',fontSize:11,fontWeight:700,cursor:'pointer'
                        }}>
                          {isRevealed ? <><Unlock size={11}/> پنهان</> : <><Lock size={11}/> نمایش</>}
                        </button>
                        {deleteConfirm === item.id ? (
                          <>
                            <button onClick={()=>{onDelete(item.id);setDeleteConfirm(null);}} style={{background:'#ef4444',color:'white',border:'none',padding:'5px 8px',borderRadius:6,fontSize:11,fontWeight:700,cursor:'pointer'}}>حذف</button>
                            <button onClick={()=>setDeleteConfirm(null)} style={{background:isDark?'#27272a':'#e2e8f0',color:tx,border:'none',padding:'5px 8px',borderRadius:6,fontSize:11,fontWeight:700,cursor:'pointer'}}>لغو</button>
                          </>
                        ) : (
                          <button onClick={() => setDeleteConfirm(item.id)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:4}}>
                            <Trash2 size={14}/>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Thought content - blurred when locked */}
                    <div style={{
                      position:'relative',borderRadius:12,overflow:'hidden',
                      background:isDark?'rgba(249,115,22,0.06)':'rgba(249,115,22,0.04)',
                      border:`1px solid ${isDark?'rgba(249,115,22,0.15)':'#fed7aa'}`,
                      padding:'12px 14px',marginBottom:isRevealed?12:0
                    }}>
                      <p style={{
                        color:tx,fontSize:13,lineHeight:1.8,margin:0,
                        filter:isRevealed?'none':'blur(7px)',
                        userSelect:isRevealed?'auto':'none',
                        transition:'filter 0.4s ease'
                      }}>{item.thought}</p>
                      {!isRevealed && (
                        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:4}}>
                          <div style={{animation:'lockBounce 2s ease-in-out infinite'}}>
                            <Lock size={24} color="#f97316"/>
                          </div>
                          <span style={{color:'#f97316',fontSize:11,fontWeight:700}}>کلیک کن تا ببینی</span>
                        </div>
                      )}
                    </div>

                    {/* Resolve section (only when revealed) */}
                    {isRevealed && (
                      <div style={{animation:'fadeSlideIn .3s ease-out'}}>
                        {isResolving ? (
                          <div>
                            <textarea value={resolution} onChange={e=>setResolution(e.target.value)} rows={3}
                              placeholder="راه‌حل یا پاسخ منطقی‌ات چیست؟" autoFocus
                              style={{width:'100%',boxSizing:'border-box',background:isDark?'#09090b':'#f8fafc',border:`1px solid ${bd}`,
                                borderRadius:10,padding:'10px 12px',color:tx,fontSize:13,fontFamily:'Vazirmatn,sans-serif',resize:'none',outline:'none',marginBottom:8}}
                            />
                            <div style={{display:'flex',gap:8}}>
                              <button onClick={()=>{setResolvingId(null);setResolution('');}} style={{flex:1,padding:'9px',borderRadius:10,background:isDark?'#27272a':'#f1f5f9',color:sub,border:'none',fontSize:12,fontWeight:700,cursor:'pointer'}}>لغو</button>
                              <button onClick={()=>handleResolve(item.id)} style={{flex:2,padding:'9px',borderRadius:10,background:'#22c55e',color:'white',border:'none',fontSize:12,fontWeight:700,cursor:'pointer'}}>💡 ثبت راه‌حل</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={()=>{setResolvingId(item.id);setResolution('');}} style={{
                            width:'100%',padding:'10px',borderRadius:12,
                            background:isDark?'rgba(34,197,94,0.1)':'#f0fdf4',
                            color:'#22c55e',border:`1px solid ${isDark?'rgba(34,197,94,0.2)':'#86efac'}`,
                            fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6
                          }}>
                            <Lightbulb size={15}/> پیدا کردم! راه‌حل دارم
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Resolved items */}
          {resolvedItems.length > 0 && (
            <div>
              <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
                <Unlock size={13}/> حل‌شده ({toPersianNum(resolvedItems.length)})
              </h3>
              {resolvedItems.map((item: any) => (
                <div key={item.id} style={{
                  background:isDark?'rgba(34,197,94,0.05)':'#f0fdf4',
                  border:`1px solid ${isDark?'rgba(34,197,94,0.2)':'#bbf7d0'}`,
                  borderRadius:16,padding:14,marginBottom:10,opacity:0.75
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <span style={{color:'#22c55e',fontSize:11,fontWeight:700}}>✓ حل شد</span>
                    <button onClick={()=>onDelete(item.id)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:2}}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                  <p style={{color:sub,fontSize:12,lineHeight:1.7,marginBottom:8,textDecoration:'line-through',opacity:0.7}}>{item.thought}</p>
                  <div style={{background:isDark?'rgba(34,197,94,0.08)':'rgba(34,197,94,0.05)',borderRadius:10,padding:'8px 12px',border:`1px solid ${isDark?'rgba(34,197,94,0.15)':'#bbf7d0'}`}}>
                    <span style={{color:'#22c55e',fontSize:11,fontWeight:700}}>💡 راه‌حل: </span>
                    <span style={{color:tx,fontSize:12}}>{item.resolution}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length === 0 && !adding && (
            <div style={{textAlign:'center',padding:'60px 24px',color:sub}}>
              <div style={{animation:'float 3s ease-in-out infinite',display:'inline-block',marginBottom:16}}>
                <Archive size={52} style={{opacity:.25}}/>
              </div>
              <p style={{fontWeight:700,marginBottom:6}}>جعبه خالی است</p>
              <p style={{fontSize:13}}>افکار مزاحم را اینجا قرنطینه کن</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────── BELIEF ANALYSIS VIEW (در داشبورد) ───────────────────────────

const BeliefCard = ({ belief, isDark, onEdit, onDelete }: any) => {
  const [expanded, setExpanded] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const card = isDark ? '#18181b' : '#ffffff';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#71717a' : '#64748b';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  void bd;

  const worthColor = belief.worthIt >= 70 ? '#22c55e' : belief.worthIt >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{background:card,border:`1.5px solid ${isDark?'rgba(20,184,166,0.25)':'#99f6e4'}`,borderRadius:20,padding:18,
      marginBottom:14,borderRight:`4px solid #14b8a6`,animation:'fadeSlideIn .4s ease-out'}}>
      {deleteConfirm && (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,flexDirection:'column',padding:'10px 0'}}>
          <span style={{color:tx,fontSize:14,fontWeight:900}}>آیا این تحلیل حذف شود؟</span>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>{onDelete();setDeleteConfirm(false);}} style={{background:'#ef4444',color:'white',border:'none',padding:'8px 16px',borderRadius:10,fontWeight:700,cursor:'pointer'}}>بله، حذف</button>
            <button onClick={()=>setDeleteConfirm(false)} style={{background:isDark?'#27272a':'#e2e8f0',color:tx,border:'none',padding:'8px 16px',borderRadius:10,fontWeight:700,cursor:'pointer'}}>لغو</button>
          </div>
        </div>
      )}
      {!deleteConfirm && <>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
              <Scale size={15} color="#14b8a6"/>
              <h3 style={{color:tx,fontWeight:900,fontSize:15,margin:0}}>{belief.behavior}</h3>
            </div>
            <span style={{color:sub,fontSize:11}}>{belief.date}</span>
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center',marginRight:8}}>
            <div style={{background:isDark?'rgba(20,184,166,0.15)':'#ccfbf1',borderRadius:20,padding:'5px 12px',display:'flex',alignItems:'center',gap:4}}>
              <span style={{color:worthColor,fontSize:13,fontWeight:900}}>{toPersianNum(belief.worthIt)}٪</span>
            </div>
            <button onClick={onEdit} style={{color:sub,background:'none',border:'none',cursor:'pointer',padding:4}}><Edit2 size={15}/></button>
            <button onClick={()=>setDeleteConfirm(true)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:4}}><Trash2 size={15}/></button>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
          <div style={{background:isDark?'rgba(34,197,94,0.06)':'#f0fdf4',borderRadius:12,padding:'10px 12px',border:`1px solid ${isDark?'rgba(34,197,94,0.15)':'#bbf7d0'}`}}>
            <p style={{color:'#22c55e',fontSize:11,fontWeight:700,marginBottom:6}}>💰 سودها ({toPersianNum(belief.benefits?.length || 0)})</p>
            {belief.benefits?.slice(0, expanded ? 999 : 2).map((b: string, i: number) => (
              <p key={i} style={{color:tx,fontSize:12,margin:'2px 0',lineHeight:1.6}}>• {b}</p>
            ))}
          </div>
          <div style={{background:isDark?'rgba(239,68,68,0.06)':'#fef2f2',borderRadius:12,padding:'10px 12px',border:`1px solid ${isDark?'rgba(239,68,68,0.15)':'#fecaca'}`}}>
            <p style={{color:'#ef4444',fontSize:11,fontWeight:700,marginBottom:6}}>💸 هزینه‌ها ({toPersianNum(belief.costs?.length || 0)})</p>
            {belief.costs?.slice(0, expanded ? 999 : 2).map((c: string, i: number) => (
              <p key={i} style={{color:tx,fontSize:12,margin:'2px 0',lineHeight:1.6}}>• {c}</p>
            ))}
          </div>
        </div>

        {belief.conclusion && (
          <div style={{background:isDark?'rgba(99,102,241,0.08)':'#eef2ff',borderRadius:12,padding:'10px 14px',border:`1px solid ${isDark?'rgba(99,102,241,0.2)':'#c7d2fe'}`,marginBottom:10}}>
            <span style={{color:'#6366f1',fontSize:11,fontWeight:700}}>نتیجه‌گیری: </span>
            <span style={{color:tx,fontSize:12,lineHeight:1.7}}>{belief.conclusion}</span>
          </div>
        )}

        <button onClick={()=>setExpanded(!expanded)} style={{background:'none',border:'none',color:sub,fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
          {expanded ? <><ChevronUp size={14}/> کمتر</> : <><ChevronDown size={14}/> بیشتر</>}
        </button>
      </>}
    </div>
  );
};

// ─────────────────────────── OTHER MODALS ───────────────────────────

const CognitiveErrorsModal = ({ onClose, isDark }: any) => {
  const bg   = isDark ? '#09090b' : '#f8fafc';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#a1a1aa' : '#475569';
  const ex   = isDark ? '#d4d4d8' : '#374151';
  const exBg = isDark ? '#27272a' : '#f8fafc';

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:isDark?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)',display:'flex',justifyContent:'center'}}>
      <div style={{background:bg,width:'100%',maxWidth:640,display:'flex',flexDirection:'column',animation:'slideInUp .3s ease-out'}}>
        <div style={{position:'sticky',top:0,zIndex:10,background:isDark?'rgba(9,9,11,.92)':'rgba(248,250,252,.92)',backdropFilter:'blur(14px)',borderBottom:`1px solid ${bd}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={onClose} style={{color:sub,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer'}}>بستن ✕</button>
          <h1 style={{color:tx,fontWeight:900,fontSize:18,display:'flex',alignItems:'center',gap:8}}>
            <BookOpen size={20} color="#6366f1"/> خطاهای شناختی
          </h1>
          <div style={{width:40}}/>
        </div>
        <div style={{padding:'24px 20px',flex:1,overflowY:'auto'}}>
          <p style={{color:sub,fontSize:13,textAlign:'center',marginBottom:20,lineHeight:1.7}}>
            این فهرست خطاهای رایج در تفکر را نشان می‌دهد. یادتان باشد همه انسان‌ها گاهی این خطاها را دارند.
          </p>
          {COGNITIVE_ERRORS.map((err,i)=>(
            <div key={err.id} style={{background:card,border:`1px solid ${bd}`,borderRadius:16,padding:'18px 20px',marginBottom:10,animation:`fadeSlideIn .3s ease-out ${i*0.035}s both`}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <span style={{background:'#6366f1',color:'white',borderRadius:8,width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,flexShrink:0}}>
                  {toPersianNum(err.id)}
                </span>
                <h3 style={{color:tx,fontWeight:900,fontSize:15,margin:0}}>{err.name}</h3>
              </div>
              <p style={{color:sub,fontSize:13,lineHeight:1.8,marginBottom:10}}>{err.desc}</p>
              <div style={{background:exBg,border:`1px solid ${bd}`,borderRadius:10,padding:'10px 14px'}}>
                <span style={{color:'#6366f1',fontSize:11,fontWeight:700}}>مثال: </span>
                <span style={{color:ex,fontSize:13,fontStyle:'italic'}}>«{err.ex}»</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SessionNotesModal = ({ notes, onSave, onDelete, onClose, isDark, startAdding, showToast }: any) => {
  const [adding, setAdding] = useState(startAdding);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [deleteConfirm, setDeleteConfirm] = useState<string|null>(null);
  const [editDate, setEditDate] = useState<string|null>(null);
  const [editTimestamp, setEditTimestamp] = useState<number|null>(null);

  useEffect(() => { setAdding(startAdding); }, [startAdding]);

  const bg   = isDark ? '#09090b' : '#f8fafc';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#a1a1aa' : '#475569';
  const inp  = isDark ? '#09090b' : '#f8fafc';

  const iStyle: any = {
    width:'100%',boxSizing:'border-box',background:inp,border:`1px solid ${bd}`,borderRadius:12,
    padding:'12px 14px',color:tx,fontSize:13,fontFamily:'Vazirmatn,sans-serif',resize:'none',outline:'none'
  };

  const handleEditReq = (note: any) => {
    setEditingId(note.id); setQ(note.question); setA(note.answer); setColor(note.color);
    setEditDate(note.date); setEditTimestamp(note.timestamp || parseInt(note.id));
    setAdding(true);
  };

  const handleSave = () => {
    if (!q.trim() || !a.trim()) { showToast('لطفا فیلدهای سوال و جواب را پر کنید'); return; }
    onSave({ id: editingId || Date.now().toString(), date: editingId ? editDate : getShamsiNow(),
      timestamp: editingId ? editTimestamp : Date.now(), question: q.trim(), answer: a.trim(), color });
    setQ(''); setA(''); setEditingId(null); setAdding(false); setEditDate(null); setEditTimestamp(null);
  };

  const cancelAdd = () => { setQ(''); setA(''); setEditingId(null); setAdding(false); setEditDate(null); setEditTimestamp(null); };

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:isDark?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)',display:'flex',justifyContent:'center'}}>
      <div style={{background:bg,width:'100%',maxWidth:640,display:'flex',flexDirection:'column',animation:'slideInUp .3s ease-out'}}>
        <div style={{position:'sticky',top:0,zIndex:10,background:isDark?'rgba(9,9,11,.92)':'rgba(248,250,252,.92)',backdropFilter:'blur(14px)',borderBottom:`1px solid ${bd}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={onClose} style={{color:sub,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer'}}>بستن ✕</button>
          <h1 style={{color:tx,fontWeight:900,fontSize:18,display:'flex',alignItems:'center',gap:8}}>
            <MessageSquare size={20} color="#ec4899"/> تکلیف / یادداشت
          </h1>
          <button onClick={()=>setAdding(true)} disabled={adding} style={{background:adding?'transparent':'#ec4899',color:adding?'transparent':'white',border:'none',borderRadius:10,padding:'7px 14px',fontSize:13,fontWeight:700,cursor:adding?'default':'pointer'}}>+ جدید</button>
        </div>
        <div style={{padding:'20px',flex:1,overflowY:'auto'}}>
          {adding && (
            <div style={{background:card,border:`2px solid #ec4899`,borderRadius:18,padding:20,marginBottom:20,animation:'popIn .25s ease-out'}}>
              <h3 style={{color:tx,fontWeight:900,marginBottom:14,fontSize:15}}>{editingId ? 'ویرایش یادداشت 📝' : 'یادداشت جدید 📝'}</h3>
              <div style={{marginBottom:12}}>
                <label style={{color:sub,fontSize:12,fontWeight:700,display:'block',marginBottom:6}}>سوال یا تکلیف تراپیست</label>
                <textarea value={q} onChange={e=>setQ(e.target.value)} rows={3} placeholder="تراپیست از شما چه خواست؟" style={iStyle}/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{color:'#ec4899',fontSize:12,fontWeight:700,display:'block',marginBottom:6}}>جواب شما</label>
                <textarea value={a} onChange={e=>setA(e.target.value)} rows={5} placeholder="جواب خودتان را اینجا بنویسید..." style={iStyle}/>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{color:sub,fontSize:12,fontWeight:700,display:'block',marginBottom:8}}>رنگ برچسب</label>
                <div style={{display:'flex',gap:8}}>
                  {NOTE_COLORS.map(c=>(
                    <button key={c} onClick={()=>setColor(c)} style={{width:28,height:28,borderRadius:'50%',background:c,border:'none',cursor:'pointer',outline:color===c?`3px solid white`:'none',boxShadow:color===c?`0 0 0 5px ${c}50`:'none',transform:color===c?'scale(1.2)':'scale(1)',transition:'all .2s'}}/>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:10}}>
                <button onClick={cancelAdd} style={{flex:1,padding:'11px',borderRadius:12,background:isDark?'#27272a':'#f1f5f9',color:sub,border:'none',fontSize:13,fontWeight:700,cursor:'pointer'}}>لغو</button>
                <button onClick={handleSave} style={{flex:2,padding:'11px',borderRadius:12,background:'#ec4899',color:'white',border:'none',fontSize:13,fontWeight:700,cursor:'pointer'}}>{editingId ? 'بروزرسانی ✓' : 'ذخیره ✓'}</button>
              </div>
            </div>
          )}
          {notes.length===0 && !adding ? (
            <div style={{textAlign:'center',padding:'60px 24px',color:sub}}>
              <MessageSquare size={48} style={{margin:'0 auto 14px',opacity:.3,display:'block'}}/>
              <p style={{fontWeight:700,marginBottom:6}}>یادداشتی ندارید</p>
              <p style={{fontSize:13}}>از دکمه «+ جدید» استفاده کنید</p>
            </div>
          ) : notes.map((note: any,i: number)=>(
            <div key={note.id} style={{background:card,border:`1px solid ${bd}`,borderRadius:16,padding:20,marginBottom:12,borderRight:`4px solid ${note.color}`,animation:`fadeSlideIn .3s ease-out ${i*0.05}s both`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <span style={{background:note.color+'25',color:note.color,fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20}}>{toPersianNum(note.date)}</span>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  {deleteConfirm===note.id ? (
                    <>
                      <button onClick={()=>{onDelete(note.id);setDeleteConfirm(null);}} style={{background:'#ef4444',color:'white',border:'none',padding:'4px 8px',borderRadius:6,fontSize:11,fontWeight:700,cursor:'pointer'}}>حذف</button>
                      <button onClick={()=>setDeleteConfirm(null)} style={{background:isDark?'#27272a':'#e2e8f0',color:tx,border:'none',padding:'4px 8px',borderRadius:6,fontSize:11,fontWeight:700,cursor:'pointer'}}>لغو</button>
                    </>
                  ) : (
                    <>
                      <button onClick={()=>handleEditReq(note)} style={{color:sub,background:'none',border:'none',cursor:'pointer',padding:4}}><Edit2 size={16}/></button>
                      <button onClick={()=>setDeleteConfirm(note.id)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:4}}><Trash2 size={16}/></button>
                    </>
                  )}
                </div>
              </div>
              <div style={{background:note.color+'15',borderRadius:10,padding:'10px 14px',marginBottom:10,border:`1px solid ${note.color}35`}}>
                <span style={{color:note.color,fontSize:11,fontWeight:700}}>سوال تراپیست: </span>
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

const AddLogModal = ({ onSave, onClose, isDark, initialData, showToast }: any) => {
  const [dateStr, setDateStr] = useState('');
  const [dateObj, setDateObj] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState({y: 1403, m: 1, d: 1, h: 12, min: 0});
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
      setDateStr(initialData.date); setDateObj(initialData.dateObj || getShamsiParts());
    } else {
      const nowP = getShamsiParts(); setDateStr(formatShamsi(nowP)); setDateObj(nowP);
    }
  }, [initialData]);

  const bg   = isDark ? '#09090b' : '#f8fafc';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#a1a1aa' : '#475569';

  const selectStyle: any = {
    flex:1, background:isDark?'#09090b':'#f8fafc', color:tx,
    border:`1px solid ${bd}`, borderRadius:10, padding:'8px',
    fontSize:14, outline:'none', textAlign:'center', fontFamily:'Vazirmatn'
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
    if (!situation.trim()) { showToast('لطفا موقعیت را وارد کنید تا لاگ ثبت شود.'); return; }
    onSave({
      id: initialData ? initialData.id : Date.now().toString(),
      date: dateStr, dateObj: dateObj,
      timestamp: dateObj ? getTimestampFromParts(dateObj) : Date.now(),
      situation, emotions: selectedEmotions,
      thoughts: thoughts.filter(t=>t.text.trim()!==''),
      hasShame, shameLevel: hasShame ? shameLevel : null
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{background:isDark?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)'}}>
      {showDatePicker && (
        <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)'}}>
          <div style={{background:card,padding:20,borderRadius:20,width:'90%',maxWidth:360,border:`1px solid ${bd}`,boxShadow:'0 10px 40px rgba(0,0,0,0.5)',animation:'popIn .2s ease-out'}}>
            <h3 style={{color:tx,fontWeight:900,marginBottom:16,textAlign:'center'}}>انتخاب تاریخ و زمان</h3>
            <div style={{display:'flex',gap:8,marginBottom:12}} dir="rtl">
              <select value={tempDate.d} onChange={e=>setTempDate({...tempDate,d:parseInt(e.target.value)})} style={selectStyle}>
                {[...Array(31)].map((_,i)=><option key={i+1} value={i+1}>{toPersianNum(i+1)}</option>)}
              </select>
              <select value={tempDate.m} onChange={e=>setTempDate({...tempDate,m:parseInt(e.target.value)})} style={selectStyle}>
                {SHAMSI_MONTHS.map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}
              </select>
              <select value={tempDate.y} onChange={e=>setTempDate({...tempDate,y:parseInt(e.target.value)})} style={selectStyle}>
                {[...Array(20)].map((_,i)=><option key={1395+i} value={1395+i}>{toPersianNum(1395+i)}</option>)}
              </select>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:20}} dir="ltr">
              <select value={tempDate.h} onChange={e=>setTempDate({...tempDate,h:parseInt(e.target.value)})} style={selectStyle}>
                {[...Array(24)].map((_,i)=><option key={i} value={i}>{padZero(i)}</option>)}
              </select>
              <span style={{color:tx,alignSelf:'center',fontWeight:'bold'}}>:</span>
              <select value={tempDate.min} onChange={e=>setTempDate({...tempDate,min:parseInt(e.target.value)})} style={selectStyle}>
                {[...Array(60)].map((_,i)=><option key={i} value={i}>{padZero(i)}</option>)}
              </select>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setShowDatePicker(false)} style={{flex:1,padding:'10px',background:bg,color:sub,border:`1px solid ${bd}`,borderRadius:12,fontWeight:700,fontFamily:'Vazirmatn',cursor:'pointer'}}>لغو</button>
              <button onClick={()=>{setDateObj(tempDate);setDateStr(formatShamsi(tempDate));setShowDatePicker(false);}} style={{flex:2,padding:'10px',background:'#6366f1',color:'white',border:'none',borderRadius:12,fontWeight:700,fontFamily:'Vazirmatn',cursor:'pointer'}}>تایید ✓</button>
            </div>
          </div>
        </div>
      )}
      <div style={{background:bg,minHeight:'100vh',width:'100%',maxWidth:520,margin:'0 auto',display:'flex',flexDirection:'column',animation:'slideInUp .3s ease-out'}}>
        <div style={{position:'sticky',top:0,zIndex:10,background:isDark?'rgba(9,9,11,.92)':'rgba(248,250,252,.92)',backdropFilter:'blur(14px)',borderBottom:`1px solid ${bd}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={onClose} style={{color:sub,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer'}}>لغو ✕</button>
          <h1 style={{color:tx,fontWeight:900,fontSize:17,display:'flex',alignItems:'center',gap:8}}>
            {initialData ? 'ویرایش فکر' : 'ثبت فکر جدید'} <Brain size={18} color="#6366f1"/>
          </h1>
          <div style={{width:40}}/>
        </div>
        <div style={{padding:'24px 20px',flex:1}}>
          <div style={{marginBottom:24}}>
            <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:8}}>۱. تاریخ و ساعت</h3>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>{setTempDate(dateObj||getShamsiParts());setShowDatePicker(true);}} style={{flex:1,background:card,border:`1px solid ${bd}`,borderRadius:12,padding:'11px 14px',color:tx,fontSize:13,textAlign:'right',fontFamily:'Vazirmatn',cursor:'pointer'}}>{dateStr}</button>
              <button onClick={()=>{const nowP=getShamsiParts();setDateObj(nowP);setDateStr(formatShamsi(nowP));}} style={{flexShrink:0,background:isDark?'#27272a':'#e2e8f0',color:tx,border:'none',borderRadius:12,padding:'11px 14px',fontSize:12,fontWeight:700,cursor:'pointer'}}>همین الان</button>
            </div>
          </div>
          <div style={{marginBottom:24}}>
            <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:8}}>۲. موقعیت</h3>
            <textarea value={situation} onChange={e=>setSituation(e.target.value)} placeholder="چه اتفاقی افتاد؟ کجا بودید؟" rows={4}
              style={{width:'100%',boxSizing:'border-box',background:card,border:`1px solid ${bd}`,borderRadius:14,padding:'12px 14px',color:tx,fontSize:13,fontFamily:'Vazirmatn,sans-serif',resize:'none',outline:'none'}}
            />
          </div>
          <div style={{marginBottom:24}}>
            <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:10}}>۳. هیجان‌ها</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:14}}>
              {DEFAULT_EMOTIONS.map(emo=>{
                const sel = selectedEmotions.some(e=>e.name===emo);
                const ec = getEC(emo, isDark);
                return (
                  <button key={emo} onClick={()=>toggleEmo(emo)} style={{
                    padding:'6px 14px',borderRadius:20,fontSize:12,fontWeight:700,
                    border:`1.5px solid ${sel?ec.bd:isDark?'#3f3f46':'#e2e8f0'}`,
                    background:sel?ec.bg:isDark?'#27272a':'#f8fafc',
                    color:sel?ec.tx:isDark?'#71717a':'#64748b',
                    cursor:'pointer',transition:'all .2s cubic-bezier(.34,1.56,.64,1)',
                    transform:sel?'scale(1.05)':'scale(1)',boxShadow:sel?`0 2px 10px ${ec.hex}40`:''
                  }}>{emo}</button>
                );
              })}
              {isAddingEmo ? (
                <div style={{display:'flex',gap:6}}>
                  <input autoFocus value={customInput} onChange={e=>setCustomInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCustomEmo()} placeholder="هیجان دیگر..."
                    style={{background:card,border:`1px solid ${bd}`,borderRadius:20,padding:'6px 12px',color:tx,fontSize:12,outline:'none',width:100}}/>
                  <button onClick={addCustomEmo} style={{background:'#6366f1',color:'white',border:'none',borderRadius:20,padding:'6px 12px',fontSize:11,fontWeight:700,cursor:'pointer'}}>✓</button>
                </div>
              ) : (
                <button onClick={()=>setIsAddingEmo(true)} style={{padding:'6px 14px',borderRadius:20,fontSize:12,fontWeight:700,border:`1.5px dashed ${isDark?'#3f3f46':'#cbd5e1'}`,background:'none',color:'#6366f1',cursor:'pointer'}}>+ دیگر</button>
              )}
            </div>
            <div>
              {selectedEmotions.map(emo=>{
                const ec=getEC(emo.name,isDark);
                return <CustomSlider key={emo.name} label={emo.name} value={emo.intensity} color={ec.hex}
                  onChange={(v: number)=>setSelectedEmotions(selectedEmotions.map(e=>e.name===emo.name?{...e,intensity:v}:e))}/>;
              })}
            </div>
          </div>
          <div style={{marginBottom:24}}>
            <h3 style={{color:sub,fontSize:12,fontWeight:700,marginBottom:10}}>۴. افکار</h3>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:10}}>
              {thoughts.map((t,i)=>(
                <div key={i} style={{background:card,border:`1px solid ${bd}`,borderRadius:14,padding:14,position:'relative'}}>
                  {thoughts.length>1&&(
                    <button onClick={()=>setThoughts(thoughts.filter((_,j)=>j!==i))} style={{position:'absolute',top:10,left:10,background:'none',border:'none',cursor:'pointer',color:isDark?'#52525b':'#94a3b8'}}><X size={14}/></button>
                  )}
                  <textarea value={t.text} onChange={e=>{const n=[...thoughts];n[i].text=e.target.value;setThoughts(n);}} placeholder="چه فکری از سرت گذشت؟" rows={2}
                    style={{width:'100%',background:'transparent',border:'none',outline:'none',color:tx,fontSize:13,fontFamily:'Vazirmatn,sans-serif',resize:'none',marginBottom:10}}/>
                  <CustomSlider label="میزان باور" value={t.belief} onChange={(v: number)=>{const n=[...thoughts];n[i].belief=v;setThoughts(n);}}/>
                </div>
              ))}
            </div>
            <button onClick={()=>setThoughts([...thoughts,{text:'',belief:50}])} style={{width:'100%',padding:'11px',border:`2px dashed ${isDark?'#3f3f46':'#cbd5e1'}`,borderRadius:12,background:'none',color:'#6366f1',fontSize:13,fontWeight:700,cursor:'pointer'}}>+ افزودن فکر دیگر</button>
          </div>
          <div style={{background:card,border:`1px solid ${bd}`,borderRadius:14,padding:16,marginBottom:24}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:hasShame?14:0}}>
              <h3 style={{color:sub,fontSize:12,fontWeight:700}}>۵. میزان شرم</h3>
              <button onClick={()=>setHasShame(!hasShame)} style={{display:'flex',alignItems:'center',gap:6,background:hasShame?(isDark?'rgba(99,102,241,0.2)':'#e0e7ff'):(isDark?'#27272a':'#f1f5f9'),color:hasShame?'#6366f1':sub,border:'none',borderRadius:10,padding:'7px 12px',fontSize:12,fontWeight:700,cursor:'pointer',transition:'all .2s'}}>
                {hasShame?<ToggleRight size={16}/>:<ToggleLeft size={16}/>}
                {hasShame?'ثبت می‌شود':'بدون شرم'}
              </button>
            </div>
            <div style={{maxHeight:hasShame?100:0,overflow:'hidden',transition:'max-height .3s ease'}}>
              <p style={{color:sub,fontSize:12,marginBottom:10}}>چقدر احساس شرم یا بی‌ارزشی دارید؟</p>
              <CustomSlider label="شرم" value={shameLevel} onChange={setShameLevel} color="#8b5cf6"/>
            </div>
            {!hasShame&&<p style={{color:isDark?'#52525b':'#94a3b8',fontSize:11,fontWeight:600,textAlign:'center',marginTop:4}}>احساس شرم ثبت نمی‌شود</p>}
          </div>
        </div>
        <div style={{padding:'14px 20px',borderTop:`1px solid ${bd}`,background:card}}>
          <button onClick={handleSave} style={{width:'100%',background:'#6366f1',color:'white',border:'none',borderRadius:14,padding:'14px',fontSize:15,fontWeight:900,cursor:'pointer',boxShadow:'0 0 20px rgba(99,102,241,0.4)'}}>
            {initialData ? 'بروزرسانی لاگ ✓' : 'ثبت لاگ ✓'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────── PDF TABLE ───────────────────────────

const PdfTable = ({ logs, sessionNotes, includeNotesExport }: any) => (
  <div id="export-container-data" style={{position:'absolute',left:-9999,top:0,width:860,background:'white',color:'black',padding:36,fontFamily:'Vazirmatn,serif'}} dir="rtl">
    <h1 style={{textAlign:'center',fontSize:22,fontWeight:900,marginBottom:24,borderBottom:'2px solid #e2e8f0',paddingBottom:12}}>گزارش NAT Tracker</h1>
    <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,textAlign:'right',marginBottom:32}}>
      <thead>
        <tr style={{background:'#f8fafc'}}>
          <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'14%'}}>تاریخ</th>
          <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'28%'}}>موقعیت</th>
          <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'16%'}}>هیجان‌ها</th>
          <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'32%'}}>افکار</th>
          <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'10%',textAlign:'center'}}>شرم</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log: any)=>(
          <tr key={log.id}>
            <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top'}}>{toPersianNum(log.date)}</td>
            <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top',lineHeight:1.7}}>{log.situation}</td>
            <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top',lineHeight:1.7}}>{log.emotions.length>0?log.emotions.map((e: any)=>`${e.name} (${toPersianNum(e.intensity)}%)`).join('، '):'—'}</td>
            <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top'}}>
              <ul style={{paddingRight:16,margin:0}}>
                {log.thoughts.map((t: any,i: number)=>(<li key={i} style={{marginBottom:4}}>{t.text} <span style={{color:'#6366f1',fontSize:10}}>({toPersianNum(t.belief)}%)</span></li>))}
              </ul>
            </td>
            <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top',textAlign:'center',fontWeight:700}}>{log.hasShame&&log.shameLevel!=null?`${toPersianNum(log.shameLevel)}%`:'-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {includeNotesExport && sessionNotes && sessionNotes.length>0 && (
      <div style={{marginBottom:32}}>
        <h2 style={{fontSize:18,fontWeight:900,marginBottom:16,borderBottom:'2px solid #e2e8f0',paddingBottom:8}}>یادداشت‌های جلسه</h2>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,textAlign:'right'}}>
          <thead><tr style={{background:'#f8fafc'}}>
            <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'15%'}}>تاریخ</th>
            <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'40%'}}>سوال تراپیست</th>
            <th style={{border:'1px solid #e2e8f0',padding:'10px 12px',fontWeight:800,width:'45%'}}>پاسخ من</th>
          </tr></thead>
          <tbody>
            {sessionNotes.map((n: any)=>(<tr key={n.id}>
              <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top'}}>{toPersianNum(n.date)}</td>
              <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top',lineHeight:1.7}}>{n.question}</td>
              <td style={{border:'1px solid #e2e8f0',padding:'10px 12px',verticalAlign:'top',lineHeight:1.7}}>{n.answer}</td>
            </tr>))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// ─────────────────────────── DASHBOARD ───────────────────────────

type ActiveTab = 'logs' | 'beliefs' | 'quarantine';

const DashboardView = ({ logs, sessionNotes, beliefs, quarantine, onExportPDF, onExportWord, onPrint, isDark, toggleTheme, isExporting, openCognitive, openNotes, onEditLog, onDeleteLog, onEditBelief, onDeleteBelief, onOpenQuarantine, showToast, includeNotesExport, setIncludeNotesExport }: any) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string|null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('logs');

  const logsWithShame = logs.filter((l: any)=>l.hasShame&&l.shameLevel!=null);
  const avgShame = logsWithShame.length===0?0:Math.round(logsWithShame.reduce((a: number,l: any)=>a+l.shameLevel,0)/logsWithShame.length);

  const bg   = isDark ? '#09090b' : '#f8fafc';
  const card = isDark ? '#18181b' : '#ffffff';
  const bd   = isDark ? '#27272a' : '#e2e8f0';
  const tx   = isDark ? '#f4f4f5' : '#1e293b';
  const sub  = isDark ? '#71717a' : '#64748b';

  const tabs: {id: ActiveTab, label: string, icon: any, color: string}[] = [
    { id:'logs',      label:'ثبت‌های من',  icon:<Brain size={15}/>,    color:'#6366f1' },
    { id:'beliefs',   label:'تحلیل باور',  icon:<Scale size={15}/>,    color:'#14b8a6' },
    { id:'quarantine',label:'قرنطینه',     icon:<Archive size={15}/>,  color:'#f97316' },
  ];

  return (
    <div style={{minHeight:'100vh',paddingBottom:100,background:bg,transition:'background .3s'}}>
      <div style={{position:'sticky',top:0,zIndex:10,background:isDark?'rgba(9,9,11,0.9)':'rgba(248,250,252,0.9)',backdropFilter:'blur(14px)',borderBottom:`1px solid ${bd}`,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <label style={{display:'flex',alignItems:'center',gap:6,color:tx,fontSize:11,fontWeight:700,cursor:'pointer',marginLeft:8,background:isDark?'#27272a':'#e2e8f0',padding:'6px 10px',borderRadius:8}}>
            <input type="checkbox" checked={includeNotesExport} onChange={(e: any)=>setIncludeNotesExport(e.target.checked)} style={{cursor:'pointer'}}/>
            چاپ جلسه
          </label>
          <button onClick={onPrint} title="پرینت" style={{display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:`1px solid ${bd}`,borderRadius:10,padding:'8px',color:'#6366f1',cursor:'pointer'}}><Printer size={18}/></button>
          <button onClick={onExportWord} title="Word" style={{display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:`1px solid ${bd}`,borderRadius:10,padding:'8px',color:'#6366f1',cursor:'pointer'}}><FileText size={18}/></button>
          <button onClick={onExportPDF} disabled={isExporting} title="PDF" style={{display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:`1px solid ${bd}`,borderRadius:10,padding:'8px',color:'#6366f1',cursor:'pointer'}}>
            {isExporting?<Loader2 size={18} className="animate-spin"/>:<Download size={18}/>}
          </button>
        </div>
        <h1 style={{color:tx,fontWeight:900,fontSize:17,display:'flex',alignItems:'center',gap:8}}>
          NAT Tracker <Brain size={19} color="#6366f1"/>
        </h1>
      </div>

      <div style={{padding:'20px',maxWidth:900,margin:'0 auto'}}>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:20}}>
          <div style={{background:card,border:`1px solid ${bd}`,borderRadius:18,padding:'14px',display:'flex',flexDirection:'column',alignItems:'center',boxShadow:isDark?'0 4px 20px rgba(0,0,0,0.3)':'0 2px 12px rgba(0,0,0,0.06)'}}>
            <span style={{color:sub,fontSize:11,marginBottom:3}}>ثبت‌ها</span>
            <span style={{color:tx,fontSize:28,fontWeight:900}}>{toPersianNum(logs.length)}</span>
          </div>
          <div style={{background:isDark?'rgba(99,102,241,0.12)':'#eef2ff',border:`1px solid ${isDark?'rgba(99,102,241,0.25)':'#c7d2fe'}`,borderRadius:18,padding:'14px',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <span style={{color:'#6366f1',fontSize:11,marginBottom:3}}>میانگین شرم</span>
            <span style={{color:'#6366f1',fontSize:28,fontWeight:900}}>{toPersianNum(avgShame)}٪</span>
          </div>
          <div style={{background:isDark?'rgba(249,115,22,0.1)':'#fff7ed',border:`1px solid ${isDark?'rgba(249,115,22,0.25)':'#fed7aa'}`,borderRadius:18,padding:'14px',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <span style={{color:'#f97316',fontSize:11,marginBottom:3}}>قرنطینه</span>
            <span style={{color:'#f97316',fontSize:28,fontWeight:900}}>{toPersianNum(quarantine.filter((q: any)=>!q.resolved).length)}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:6,marginBottom:20,background:card,padding:6,borderRadius:16,border:`1px solid ${bd}`}}>
          {tabs.map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{
              flex:1,padding:'10px 8px',borderRadius:12,border:'none',cursor:'pointer',fontFamily:'Vazirmatn',
              fontWeight:700,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',gap:5,
              transition:'all .2s',
              background:activeTab===tab.id?tab.color:'transparent',
              color:activeTab===tab.id?'white':sub,
              boxShadow:activeTab===tab.id?`0 2px 12px ${tab.color}50`:''
            }}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <>
            <h2 style={{color:tx,fontWeight:900,fontSize:16,marginBottom:14}}>ثبت‌های من</h2>
            {logs.length===0 ? (
              <div style={{textAlign:'center',padding:'60px 24px',color:sub}}>
                <Brain size={48} style={{margin:'0 auto 14px',opacity:.3,display:'block'}}/>
                <p style={{fontWeight:700}}>هیچ فکری ثبت نشده</p>
              </div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
                {logs.map((log: any,li: number)=>(
                  <div key={log.id} style={{position:'relative',background:card,border:`1px solid ${bd}`,borderRadius:20,padding:'18px',display:'flex',flexDirection:'column',transition:'all .25s',animation:`fadeSlideIn .4s ease-out ${li*0.06}s both`,boxShadow:isDark?'0 2px 12px rgba(0,0,0,0.2)':'0 2px 12px rgba(0,0,0,0.04)'}}>
                    {deleteConfirmId===log.id && (
                      <div style={{position:'absolute',inset:0,background:card,borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',gap:10,zIndex:20,flexDirection:'column'}}>
                        <span style={{color:tx,fontSize:14,fontWeight:900,marginBottom:10}}>آیا این لاگ حذف شود؟</span>
                        <div style={{display:'flex',gap:10}}>
                          <button onClick={()=>{onDeleteLog(log.id);setDeleteConfirmId(null);}} style={{background:'#ef4444',color:'white',border:'none',padding:'8px 16px',borderRadius:10,fontWeight:700,cursor:'pointer'}}>بله، حذف</button>
                          <button onClick={()=>setDeleteConfirmId(null)} style={{background:isDark?'#27272a':'#e2e8f0',color:tx,border:'none',padding:'8px 16px',borderRadius:10,fontWeight:700,cursor:'pointer'}}>لغو</button>
                        </div>
                      </div>
                    )}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                      <span style={{color:sub,fontSize:11,display:'flex',alignItems:'center',gap:4}}><Clock size={11}/> {toPersianNum(log.date)}</span>
                      {log.hasShame&&log.shameLevel!=null ? (
                        <span style={{background:isDark?'rgba(99,102,241,0.15)':'#eef2ff',color:'#6366f1',fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:8}}>شرم {toPersianNum(log.shameLevel)}٪</span>
                      ) : (
                        <span style={{background:isDark?'#27272a':'#f8fafc',color:sub,fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:8}}>بدون شرم</span>
                      )}
                    </div>
                    <p style={{color:tx,fontSize:13,lineHeight:1.7,marginBottom:16,fontWeight:500}}>{log.situation}</p>
                    {log.emotions&&log.emotions.length>0&&(
                      <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
                        {log.emotions.map((emo: any)=>{
                          const ec=getEC(emo.name,isDark);
                          return (<span key={emo.name} style={{background:ec.bg,color:ec.tx,border:`1.5px solid ${ec.bd}`,fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20,display:'flex',alignItems:'center',gap:4}}>
                            <span style={{width:7,height:7,borderRadius:'50%',background:ec.hex,flexShrink:0}}/>{emo.name} {toPersianNum(emo.intensity)}٪
                          </span>);
                        })}
                      </div>
                    )}
                    {log.thoughts&&log.thoughts.length>0&&(
                      <div style={{marginTop:'auto',paddingTop:16,borderTop:`1px solid ${bd}`}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                          <h4 style={{display:'flex',alignItems:'center',gap:6,color:sub,fontSize:12,fontWeight:700}}>
                            <MessageSquare size={14}/> افکار ({toPersianNum(log.thoughts.length)})
                          </h4>
                          <div style={{display:'flex',gap:8}}>
                            <button onClick={()=>onEditLog(log)} style={{color:sub,background:'none',border:'none',cursor:'pointer',padding:4}}><Edit2 size={16}/></button>
                            <button onClick={()=>setDeleteConfirmId(log.id)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:4}}><Trash2 size={16}/></button>
                          </div>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',gap:8}}>
                          {log.thoughts.map((th: any,i: number)=>(
                            <div key={i} style={{background:isDark?'#1f1f22':'#f8fafc',border:`1px solid ${isDark?'#27272a':'#e2e8f0'}`,borderRadius:14,padding:'12px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
                              <span style={{background:isDark?'#09090b':'#e2e8f0',color:tx,fontSize:11,fontWeight:700,padding:'6px 12px',borderRadius:20,whiteSpace:'nowrap'}}>باور {toPersianNum(th.belief)}٪</span>
                              <span style={{color:tx,fontSize:13,fontWeight:600,lineHeight:1.6,textAlign:'right',flex:1}}>{th.text}</span>
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

        {/* Beliefs Tab */}
        {activeTab === 'beliefs' && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h2 style={{color:tx,fontWeight:900,fontSize:16,margin:0}}>تحلیل باورها</h2>
              <div style={{background:isDark?'rgba(20,184,166,0.1)':'#ccfbf1',borderRadius:10,padding:'6px 12px',display:'flex',alignItems:'center',gap:4}}>
                <Scale size={13} color="#14b8a6"/>
                <span style={{color:'#14b8a6',fontSize:12,fontWeight:700}}>{toPersianNum(beliefs.length)} تحلیل</span>
              </div>
            </div>
            {beliefs.length===0 ? (
              <div style={{textAlign:'center',padding:'60px 24px',color:sub}}>
                <Scale size={48} style={{margin:'0 auto 14px',opacity:.25,display:'block'}}/>
                <p style={{fontWeight:700,marginBottom:6}}>هنوز تحلیلی ندارید</p>
                <p style={{fontSize:13}}>از دکمه + یک باور یا رفتار را تحلیل کنید</p>
              </div>
            ) : beliefs.map((b: any) => (
              <BeliefCard key={b.id} belief={b} isDark={isDark} onEdit={()=>onEditBelief(b)} onDelete={()=>onDeleteBelief(b.id)}/>
            ))}
          </>
        )}

        {/* Quarantine Tab */}
        {activeTab === 'quarantine' && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h2 style={{color:tx,fontWeight:900,fontSize:16,margin:0}}>جعبه قرنطینه</h2>
              <button onClick={onOpenQuarantine} style={{display:'flex',alignItems:'center',gap:6,background:'#f97316',color:'white',border:'none',borderRadius:12,padding:'8px 14px',fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 14px rgba(249,115,22,0.35)'}}>
                <Archive size={15}/> مدیریت
              </button>
            </div>
            {quarantine.length===0 ? (
              <div style={{textAlign:'center',padding:'60px 24px',color:sub}}>
                <div style={{animation:'float 3s ease-in-out infinite',display:'inline-block',marginBottom:16}}><Archive size={52} style={{opacity:.25}}/></div>
                <p style={{fontWeight:700,marginBottom:6}}>جعبه خالی است</p>
                <p style={{fontSize:13}}>افکار مزاحم را با دکمه + قرنطینه کنید</p>
              </div>
            ) : (
              <div>
                {quarantine.filter((i: any)=>!i.resolved).length > 0 && (
                  <div style={{marginBottom:16}}>
                    <p style={{color:sub,fontSize:12,fontWeight:700,marginBottom:10,display:'flex',alignItems:'center',gap:5}}><Lock size={12}/> در قرنطینه ({toPersianNum(quarantine.filter((i: any)=>!i.resolved).length)})</p>
                    {quarantine.filter((i: any)=>!i.resolved).map((item: any)=>(
                      <div key={item.id} style={{background:card,border:`1px solid ${isDark?'rgba(249,115,22,0.25)':'#fed7aa'}`,borderRadius:14,padding:14,marginBottom:8,display:'flex',alignItems:'center',gap:10}}>
                        <Lock size={16} color="#f97316" style={{flexShrink:0}}/>
                        <p style={{color:sub,fontSize:13,margin:0,filter:'blur(5px)',flex:1}}>████████████</p>
                        <button onClick={onOpenQuarantine} style={{color:'#f97316',fontSize:11,fontWeight:700,background:'rgba(249,115,22,0.1)',border:'1px solid rgba(249,115,22,0.3)',borderRadius:8,padding:'5px 10px',cursor:'pointer'}}>باز کن</button>
                      </div>
                    ))}
                  </div>
                )}
                {quarantine.filter((i: any)=>i.resolved).length > 0 && (
                  <div>
                    <p style={{color:sub,fontSize:12,fontWeight:700,marginBottom:10,display:'flex',alignItems:'center',gap:5}}><Unlock size={12}/> حل‌شده ({toPersianNum(quarantine.filter((i: any)=>i.resolved).length)})</p>
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

      {/* Bottom nav */}
      <div style={{position:'fixed',bottom:0,width:'100%',background:isDark?'rgba(9,9,11,0.95)':'rgba(255,255,255,0.95)',backdropFilter:'blur(12px)',borderTop:`1px solid ${bd}`,padding:'10px 20px 16px',display:'flex',justifyContent:'space-around',alignItems:'center',zIndex:50}}>
        <button onClick={openCognitive} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',color:sub}}>
          <BookOpen size={21}/><span style={{fontSize:10,fontWeight:600}}>خطاهای شناختی</span>
        </button>
        <button onClick={toggleTheme} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',color:sub}}>
          {isDark?<Sun size={21}/>:<Moon size={21}/>}<span style={{fontSize:10,fontWeight:600}}>{isDark?'روشن':'تاریک'}</span>
        </button>
        <div style={{width:60}}/>
        <button style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',color:'#6366f1'}}>
          <div style={{background:'rgba(99,102,241,0.12)',padding:'6px',borderRadius:10}}><LayoutGrid size={21}/></div>
          <span style={{fontSize:10,fontWeight:700}}>داشبورد</span>
        </button>
        <button onClick={()=>openNotes(false)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',color:sub}}>
          <MessageSquare size={21}/><span style={{fontSize:10,fontWeight:600}}>جلسه</span>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────── MAIN APP ───────────────────────────

export default function App() {
  const [appLoading, setAppLoading]   = useState(true);
  const [modals, setModals]           = useState({ addLog:false, cognitive:false, notes:false, belief:false, quarantine:false });
  const [notesStartAdding, setNotesStartAdding] = useState(false);
  const [editingLog, setEditingLog]   = useState<any>(null);
  const [editingBelief, setEditingBelief] = useState<any>(null);
  const [isDark, setIsDark]           = useState(true);
  const [isExporting, setExp]         = useState(false);
  const [showSave, setShowSave]       = useState(false);
  const [toast, setToast]             = useState('');
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

  const sortedLogs  = [...logs].sort((a,b)=>(b.timestamp||parseInt(b.id)||0)-(a.timestamp||parseInt(a.id)||0));
  const sortedNotes = [...sessionNotes].sort((a,b)=>(b.timestamp||parseInt(b.id)||0)-(a.timestamp||parseInt(a.id)||0));
  const sortedBeliefs = [...beliefs].sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
  const sortedQuarantine = [...quarantine].sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));

  useEffect(()=>{ setTimeout(()=>setAppLoading(false), 900); }, []);
  useEffect(()=>{ localStorage.setItem('nat_tracker_logs',JSON.stringify(logs)); }, [logs]);
  useEffect(()=>{ localStorage.setItem('nat_tracker_notes',JSON.stringify(sessionNotes)); }, [sessionNotes]);
  useEffect(()=>{ localStorage.setItem('nat_tracker_beliefs',JSON.stringify(beliefs)); }, [beliefs]);
  useEffect(()=>{ localStorage.setItem('nat_tracker_quarantine',JSON.stringify(quarantine)); }, [quarantine]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(()=>setToast(''), 2500);
  };

  const openModal  = (name: string) => setModals(m=>({...m,[name]:true}));
  const closeModal = (name: string) => setModals(m=>({...m,[name]:false}));

  const handleSaveLog = (newLog: any) => {
    if (editingLog) { setLogs(logs.map(l=>l.id===newLog.id?newLog:l)); showToast('✓ لاگ ویرایش شد'); }
    else { setLogs([newLog,...logs]); showToast('✓ لاگ جدید ثبت شد'); }
    setEditingLog(null); closeModal('addLog');
    setShowSave(true); setTimeout(()=>setShowSave(false),2000);
  };
  const handleEditLog    = (log: any)  => { setEditingLog(log); openModal('addLog'); };
  const handleDeleteLog  = (id: string) => { setLogs(logs.filter(l=>l.id!==id)); showToast('✕ لاگ حذف شد'); };

  const handleSaveNote   = (note: any) => {
    const exists = sessionNotes.find(n=>n.id===note.id);
    if (exists) { setNotes(sessionNotes.map(n=>n.id===note.id?note:n)); showToast('✓ یادداشت ویرایش شد'); }
    else { setNotes([note,...sessionNotes]); showToast('✓ یادداشت ذخیره شد'); }
  };
  const handleDeleteNote = (id: string) => { setNotes(sessionNotes.filter(n=>n.id!==id)); showToast('✕ یادداشت حذف شد'); };

  const handleSaveBelief = (belief: any) => {
    const exists = beliefs.find(b=>b.id===belief.id);
    if (exists) { setBeliefs(beliefs.map(b=>b.id===belief.id?belief:b)); showToast('✓ تحلیل ویرایش شد'); }
    else { setBeliefs([belief,...beliefs]); showToast('✓ تحلیل ذخیره شد'); }
    setEditingBelief(null); closeModal('belief');
    setShowSave(true); setTimeout(()=>setShowSave(false),2000);
  };
  const handleEditBelief   = (b: any)   => { setEditingBelief(b); openModal('belief'); };
  const handleDeleteBelief = (id: string) => { setBeliefs(beliefs.filter(b=>b.id!==id)); showToast('✕ تحلیل حذف شد'); };

  const handleAddQuarantine = (item: any) => { setQuarantine(prev=>[item,...prev]); };
  const handleDeleteQuarantine = (id: string) => { setQuarantine(quarantine.filter(q=>q.id!==id)); showToast('✕ فکر حذف شد'); };
  const handleResolveQuarantine = (id: string, resolution: string) => {
    setQuarantine(quarantine.map(q=>q.id===id?{...q,resolved:true,resolution}:q));
  };

  const handleExportPDF = async () => {
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
      showToast('✓ PDF دانلود شد');
    } catch(e){ console.error(e); showToast('خطا در خروجی PDF'); }
    finally { setExp(false); }
  };

  const handlePrint = () => {
    const el = document.getElementById('export-container-data');
    if (!el) return;
    const printContent = el.innerHTML;
    const printWindow = window.open('','_blank','width=800,height=600');
    if (!printWindow) return showToast('پاپ‌آپ مرورگر مسدود است');
    printWindow.document.write(`<html dir="rtl" lang="fa"><head><title>پرینت NAT</title><link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet"/><style>body{font-family:'Vazirmatn',sans-serif;padding:20px;color:black;background:white;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;text-align:right;}th{background:#f0f0f0;}</style></head><body>${printContent}<script>setTimeout(()=>{window.print();window.close();},500);</script></body></html>`);
    printWindow.document.close();
  };

  const handleExportWord = () => {
    const el = document.getElementById('export-container-data');
    if (!el) return;
    const content = el.innerHTML;
    const source = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40' dir='rtl'><head><meta charset='utf-8'><title>NAT Report</title><style>body{font-family:Tahoma,Arial,sans-serif;}</style></head><body>${content}</body></html>`;
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(source);
    a.download = 'NAT_Tracker_Report.doc';
    a.click();
    document.body.removeChild(a);
    showToast('✓ فایل Word دانلود شد');
  };

  if (appLoading) return <InitialLoading/>;

  return (
    <div dir="rtl" style={{fontFamily:'Vazirmatn,sans-serif',minHeight:'100vh',background:isDark?'#09090b':'#f8fafc',color:isDark?'#f4f4f5':'#1e293b'}}>
      <style dangerouslySetInnerHTML={{__html: globalCSS}}/>
      <PdfTable logs={sortedLogs} sessionNotes={sortedNotes} beliefs={sortedBeliefs} quarantine={sortedQuarantine} includeNotesExport={includeNotesExport}/>
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
      />

      <FABMenu
        onAddLog={()=>{ setEditingLog(null); openModal('addLog'); }}
        onAddNote={()=>{ setNotesStartAdding(true); openModal('notes'); }}
        onAddBelief={()=>{ setEditingBelief(null); openModal('belief'); }}
        onAddQuarantine={()=>openModal('quarantine')}
      />

      {modals.addLog && (
        <AddLogModal initialData={editingLog} onSave={handleSaveLog}
          onClose={()=>{ setEditingLog(null); closeModal('addLog'); }}
          isDark={isDark} showToast={showToast}/>
      )}
      {modals.cognitive && (
        <CognitiveErrorsModal onClose={()=>closeModal('cognitive')} isDark={isDark}/>
      )}
      {modals.notes && (
        <SessionNotesModal notes={sortedNotes} startAdding={notesStartAdding}
          onSave={handleSaveNote} onDelete={handleDeleteNote}
          onClose={()=>closeModal('notes')} isDark={isDark} showToast={showToast}/>
      )}
      {modals.belief && (
        <CostBenefitModal onClose={()=>{ setEditingBelief(null); closeModal('belief'); }}
          isDark={isDark} onSave={handleSaveBelief} editData={editingBelief} showToast={showToast}/>
      )}
      {modals.quarantine && (
        <QuarantineModal onClose={()=>closeModal('quarantine')} isDark={isDark}
          items={sortedQuarantine}
          onAdd={handleAddQuarantine} onDelete={handleDeleteQuarantine} onResolve={handleResolveQuarantine}
          showToast={showToast}/>
      )}
    </div>
  );
}
