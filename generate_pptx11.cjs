const pptxgen = require('pptxgenjs');
let pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

const c = {
    bg: "0B1320",         
    mint: "2DD4BF",       
    white: "F8FAFC",      
    lightGray: "94A3B8",  
    panelBg: "1E293B",    
    panelBorder: "334155", 
    orange: "FB923C",     
    blue: "3B82F6"        
};

pptx.defineSlideMaster({
  title: "DARK_MASTER",
  background: { color: c.bg },
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.05, fill: { color: c.mint } } },
    { text: { text: "TensPilot+ Smart Telemetry Ecosystem", options: { x: 0.5, y: 5.3, w: 4, h: 0.3, color: c.lightGray, fontSize: 10 } } },
    { text: { text: "CODET Project Presentation", options: { x: 8.8, y: 5.3, w: 4, h: 0.3, align: "right", color: c.lightGray, fontSize: 10 } } }
  ]
});

const addContentTitle = (slide, text) => {
    slide.addText(text, { x: 0.5, y: 0.3, w: 9.0, h: 0.6, fontFace: "Calibri", fontSize: 32, bold: true, color: c.mint, align: "left", valign: "middle" });
};

const addDashedPlaceholder = (slide, x, y, w, h, text) => {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: c.bg }, line: { type: 'dash', color: c.mint, width: 2 } });
  slide.addText(text, { x, y, w, h, fontSize: 16, bold: true, color: c.mint, align: "center", valign: "middle" });
};

// --- SLIDE 1: TITLE SLIDE ---
let slide1 = pptx.addSlide({ masterName: "DARK_MASTER" });
slide1.addText("TensPilot+", { x: 0.5, y: 2.0, w: 9, h: 1, fontFace: "Calibri", fontSize: 60, bold: true, color: c.mint, align: "center" });
slide1.addText("Design of a Dual-Mode TENS Device", { x: 0.5, y: 3.1, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 28, color: c.white, align: "center" });
slide1.addText("with a Companion Web Application", { x: 0.5, y: 3.65, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 20, color: c.lightGray, align: "center", italic: true });

// --- SLIDE 2: PRESENTATION OUTLINE ---
let slide2 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide2, "Presentation Outline");
slide2.addText("• The Problem & Our Solution\n\n• Hardware Design & Specifications\n\n• Testing & Clinical Results\n\n• Two Therapy Modes\n\n• Software Ecosystem (Patient App & Doctor Dashboard)\n\n• AI Integration (Gemini)\n\n• Innovation & Key Features\n\n• Impact & SDGs", 
    { x: 1.0, y: 1.2, w: 8.0, h: 3.5, fontFace: "Calibri", fontSize: 22, color: c.white, lineSpacing: 25, bullet: true });

// --- SLIDE 3: PROBLEM & MOTIVATION ---
let slide3 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide3, "1. The Problem & Our Solution");
slide3.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide3.addText("The Problem", { x: 0.8, y: 1.5, w: 3.7, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.orange });
slide3.addText("• Standard TENS machines are standalone systems.\n• No tracking of pulse width, frequency, or intensity.\n• Reliance on unreliable paper diaries.\n• Doctors have limited visibility into home therapy.", { x: 0.8, y: 2.2, w: 3.7, h: 2.0, fontFace: "Calibri", fontSize: 18, color: c.white, lineSpacing: 20 });
slide3.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide3.addText("Our Solution", { x: 5.5, y: 1.5, w: 3.7, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.blue });
slide3.addText("A low-cost, locally developed TENS device integrated with an intelligent monitoring platform to bridge the gap between home and hospital.", { x: 5.5, y: 2.2, w: 3.7, h: 2.0, fontFace: "Calibri", fontSize: 18, color: c.white, lineSpacing: 20 });

// --- SLIDE 4: HARDWARE DESIGN (From Screenshot) ---
let slide4 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide4, "2. Hardware Design");
addDashedPlaceholder(slide4, 0.5, 1.3, 4.5, 3.6, "HARDWARE PHOTO\n\n(Device showing\nLCD display, controls & layout)");
slide4.addText("Specifications", { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.mint });
slide4.addText("• Arduino Uno (ATmega328P)\n• L298N H-Bridge driver\n• XL6009 Boost converter\n• 20x4 LCD display\n• 5V Power Bank\n• Size: 150×100×56 mm\n• Weight: ~350g\n• Battery: 4+ hours", { x: 5.2, y: 1.9, w: 4.3, h: 2.8, fontFace: "Calibri", fontSize: 18, color: c.white, lineSpacing: 18 });

// --- SLIDE 5: TESTING & RESULTS (From Screenshot) ---
let slide5 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide5, "3. Testing & Results");
addDashedPlaceholder(slide5, 0.5, 1.3, 4.5, 3.6, "VOLUNTEER\nTESTING PHOTO\n\n(Device on\nforearm, electrodes placed)");
slide5.addText("Results from 12 Volunteers", { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.mint });
slide5.addText("• Signal accuracy: ±2%\n• Charge balance: >98%\n• Frequency range: 1–120 Hz stable\n• Battery life: 4+ hours continuous\n• Conventional mode: smooth tingling\n• Acupuncture mode: rhythmic tapping\n• No adverse effects reported\n• Safe electrical parameters", { x: 5.2, y: 1.9, w: 4.3, h: 2.8, fontFace: "Calibri", fontSize: 16, color: c.white, lineSpacing: 15 });

// --- SLIDE 6: TWO THERAPY MODES ---
let slide6 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide6, "4. Two Therapy Modes");
slide6.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide6.addText("CONVENTIONAL MODE", { x: 0.5, y: 1.5, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.orange, align: "center" });
slide6.addText("20–120 Hz", { x: 0.5, y: 2.0, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 26, bold: true, color: c.white, align: "center" });
slide6.addText("Fast pain relief (10–20 minutes)\n\nFor acute pain & muscle soreness\n\nSmooth tingling sensation", { x: 0.5, y: 2.6, w: 4.3, h: 1.5, fontFace: "Calibri", fontSize: 18, color: c.lightGray, align: "center", lineSpacing: 18 });

slide6.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide6.addText("ACUPUNCTURE-LIKE MODE", { x: 5.2, y: 1.5, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.mint, align: "center" });
slide6.addText("1–10 Hz", { x: 5.2, y: 2.0, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 26, bold: true, color: c.white, align: "center" });
slide6.addText("Longer relief (90–180 minutes)\n\nFor chronic & neuropathic pain\n\nRhythmic tapping with contractions", { x: 5.2, y: 2.6, w: 4.3, h: 1.5, fontFace: "Calibri", fontSize: 18, color: c.lightGray, align: "center", lineSpacing: 18 });

// --- SLIDE 7: SOFTWARE ECOSYSTEM (PATIENT) ---
let slide7 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide7, "5. Ecosystem: Patient Application");
addDashedPlaceholder(slide7, 0.5, 1.1, 2.0, 3.8, "Home & Setup\nScreenshot");
addDashedPlaceholder(slide7, 2.6, 1.1, 2.0, 3.8, "Active Session\nScreenshot");
addDashedPlaceholder(slide7, 4.7, 1.1, 2.0, 3.8, "Session History\nScreenshot");
slide7.addText("App Features", { x: 7.0, y: 1.5, w: 2.5, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.mint });
slide7.addText("• Intuitive Setup\n\n• Live Logging\n\n• Pain Tracking Algorithm\n\n• Offline Access (PWA)", { x: 7.0, y: 2.2, w: 2.5, h: 2.5, fontFace: "Calibri", fontSize: 18, color: c.white });

// --- SLIDE 8: SOFTWARE ECOSYSTEM (DOCTOR DASHBOARD) ---
let slide8 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide8, "6. Ecosystem: Doctor Dashboard");
addDashedPlaceholder(slide8, 0.5, 1.1, 4.0, 3.8, "Main Dashboard View\n\n(Total Patients, Pain Stats,\nWeekly Activity)");
addDashedPlaceholder(slide8, 4.7, 1.1, 2.0, 3.8, "Patient Invite\nModal Code");
slide8.addText("Clinical Oversight", { x: 7.0, y: 1.5, w: 2.5, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.mint });
slide8.addText("• Remote Session Tracking\n\n• Patient Compliance Analytics\n\n• Generate Invite Codes\n\n• Real-Time Progress Charts", { x: 7.0, y: 2.2, w: 2.5, h: 2.5, fontFace: "Calibri", fontSize: 16, color: c.white });

// --- SLIDE 9: AI INTEGRATION ---
let slide9 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide9, "7. AI Integration: Gemini Virtual Assistant");
addDashedPlaceholder(slide9, 0.5, 1.1, 5.0, 3.8, "AI Chat\nScreenshot");
slide9.addText("Gemini Capabilities", { x: 5.8, y: 1.5, w: 3.7, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.white });
slide9.addText("• Recommends electrode placement based on pain type.\n• Provides therapy guidance 24/7.", { x: 5.8, y: 2.1, w: 3.7, h: 1.0, fontFace: "Calibri", fontSize: 18, color: c.lightGray, lineSpacing: 15 });
slide9.addText("Key Benefits", { x: 5.8, y: 3.2, w: 3.7, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.mint });
slide9.addText("• Reduces patient misinformation.\n• Improves therapy adherence.", { x: 5.8, y: 3.8, w: 3.7, h: 1.0, fontFace: "Calibri", fontSize: 18, color: c.lightGray, lineSpacing: 15 });

// --- SLIDE 10: INNOVATION & KEY FEATURES ---
let slide10 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide10, "8. Innovation & Key Features");

slide10.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.3, w: 2.8, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1, line: { color: c.orange, width: 2 } });
slide10.addText("Hardware", { x: 0.5, y: 1.5, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.orange, align: "center" });
slide10.addText("• Dual-mode capability\n\n• Arduino-based\n\n• Open-source design\n\n• 20–30% cheaper", { x: 0.7, y: 2.2, w: 2.4, h: 2.0, fontFace: "Calibri", fontSize: 16, color: c.white, lineSpacing: 15 });

slide10.addShape(pptx.ShapeType.roundRect, { x: 3.6, y: 1.3, w: 2.8, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1, line: { color: c.mint, width: 2 } });
slide10.addText("Software", { x: 3.6, y: 1.5, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.mint, align: "center" });
slide10.addText("• Progressive Web App\n\n• Offline-first (no internet)\n\n• Local data storage\n\n• Privacy-focused", { x: 3.8, y: 2.2, w: 2.4, h: 2.0, fontFace: "Calibri", fontSize: 16, color: c.white, lineSpacing: 15 });

slide10.addShape(pptx.ShapeType.roundRect, { x: 6.7, y: 1.3, w: 2.8, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1, line: { color: c.blue, width: 2 } });
slide10.addText("Integration", { x: 6.7, y: 1.5, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.blue, align: "center" });
slide10.addText("• Manual data entry (current)\n\n• Session tracking\n\n• Progress analytics\n\n• Future: Bluetooth", { x: 6.9, y: 2.2, w: 2.4, h: 2.0, fontFace: "Calibri", fontSize: 16, color: c.white, lineSpacing: 15 });

// --- SLIDE 11: IMPACT & SDGs ---
let slide11 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide11, "9. Impact, Accessibility & SDGs");
slide11.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide11.addText("Designed for Nigeria", { x: 0.8, y: 1.5, w: 4, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.mint });
slide11.addText("✅ Works Offline via Service Workers\n✅ Runs on low-end Android phones\n✅ Reduces transportation costs\n✅ Targets Vulnerable Demographics (Women, Elderly, Children)", { x: 0.8, y: 2.1, w: 3.7, h: 2.5, fontFace: "Calibri", fontSize: 18, color: c.white, lineSpacing: 15 });
slide11.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide11.addText("Addressing SDGs", { x: 5.5, y: 1.5, w: 4, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.blue });
slide11.addText("• SDG 3: Good Health & Well-being\n\n• SDG 9: Industry & Innovation\n\n• SDG 10: Reduced Inequalities\n\n• SDG 17: Partnerships for the Goals", { x: 5.5, y: 2.1, w: 3.7, h: 2.5, fontFace: "Calibri", fontSize: 18, color: c.white, lineSpacing: 15 });

// --- SLIDE 12: THANK YOU ---
let slide12 = pptx.addSlide({ masterName: "DARK_MASTER" });
slide12.addText("Thank You For Listening!", { x: 0.5, y: 2.0, w: 9, h: 1, fontFace: "Calibri", fontSize: 52, bold: true, color: c.mint, align: "center" });
slide12.addText("TensPilot+", { x: 0.5, y: 3.0, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 24, color: c.white, align: "center" });
slide12.addText("Any Questions?", { x: 0.5, y: 3.6, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 20, color: c.lightGray, align: "center", italic: true });

pptx.writeFile({ fileName: "TensPilot_DarkTheme_Final2.pptx" }).then(() => {
    console.log("PPTX created successfully.");
});
