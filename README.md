# 🧠 NAT Tracker

> A privacy-first, CBT-based web app for tracking and reframing **Negative Automatic Thoughts (NATs)**.

NAT Tracker helps users capture unhelpful automatic thoughts and work through them using proven Cognitive Behavioral Therapy (CBT) tools — emotion logging, cost–benefit analysis, a "thought quarantine" box, and guided session notes. Everything runs locally in the browser, so your data never leaves your device.

[**🚀 Live Demo**](https://nattracker.vercel.app)

---

## ✨ Features

- 📝 **Thought Logging** — Record situations, emotions (with intensity), automatic thoughts (with belief level), and shame levels.
- ⚖️ **Cost–Benefit Analysis** — Evaluate beliefs and behaviors by weighing their benefits against their costs.
- 🔒 **Thought Quarantine** — Set aside intrusive/obsessive thoughts to revisit calmly later, then mark them resolved with a rational response.
- 🗒️ **Session Notes** — Track therapist questions and your own answers between sessions.
- 🌍 **Trilingual** — Full support for **English, Persian (فارسی), and Arabic (العربية)** with correct **RTL / LTR** layouts.
- 🌗 **Light & Dark Mode** — Polished, accessible theming.
- 📱 **Responsive** — Mobile-first design that works on phones, tablets, and desktops.
- 📄 **Export Anywhere** — One-click export to **PDF**, **Word (.doc)**, and **Print**, with selectable sections (Session Notes, Cost–Benefit, Quarantine).
- 🔐 **Privacy-First** — All data is stored in the browser's `localStorage`. No servers, no accounts, no tracking.

---

## 🛠️ Tech Stack

- **React** — Component-based UI
- **TypeScript** — Type-safe development
- **Lucide React** — Icon set
- **localStorage** — Client-side persistence
- **html2canvas + jsPDF** — PDF generation
- Deployed on **Vercel**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/nat-tracker.git
cd nat-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
nat-tracker/
├── src/
│   ├── App.tsx        # Main application (UI, state, i18n, export logic)
│   └── main.tsx       # App entry point
├── index.html
├── package.json
└── README.md
```

> **Note:** Make sure `index.html` contains the viewport meta tag for correct mobile rendering:
> ```html
> <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
> ```

---

## 🌐 Internationalization (i18n)

All UI strings are stored in a single translation map (`T`) keyed by language code (`fa`, `en`, `ar`).
The app automatically switches between **RTL** (Persian/Arabic) and **LTR** (English) layouts and applies the appropriate font (Vazirmatn for RTL, Inter for LTR).

To add a new language:
1. Add a new key (e.g. `de`) to the `T` map with all translation strings.
2. Add the language option to the `LanguageSwitcher` component.

---

## 🔐 Data & Privacy

NAT Tracker is **100% client-side**. All entries — logs, notes, cost–benefit analyses, and quarantine items — are stored in your browser's `localStorage`:

| Key | Stored data |
|-----|-------------|
| `nat_tracker_logs` | Thought logs |
| `nat_tracker_notes` | Session notes |
| `nat_tracker_beliefs` | Cost–benefit analyses |
| `nat_tracker_quarantine` | Quarantined thoughts |
| `nat_lang` | Selected language |

This means:
- ✅ Your data is private and never sent to any server.
- ⚠️ Data is tied to a single browser/device and is lost if you clear site data or switch devices.

> 💡 *Planned: JSON backup/restore so users can move their data between devices.*

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Mohammad Mosupor**

- Portfolio: [Contra](https://contra.com/mohammad_mosupor_nu3e5to1)
- Built with ❤️ for better mental well-being.
