const pptxgen = require('pptxgenjs');
let pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

// Define Color Palette
const c = {
    darkTeal: "028090",
    secondaryTeal: "00A896",
    mintGreen: "02C39A",
    navyBlue: "1C3A47",
    lightGray: "F0F4F8",
    white: "FFFFFF",
    darkText: "1A1A1A",
    orange: "FF6B35",
    darkGreen: "2D6A4F",
    lightBlue: "E3F2FD"
};

// Common Title Master for Slides 2-11
pptx.defineSlideMaster({
  title: "CONTENT_MASTER",
  background: { color: c.white },
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.85, fill: { color: c.darkTeal } } }
  ]
});

// Helper for title on content slides
const addContentTitle = (slide, text) => {
    slide.addText(text, { x: 0.5, y: 0.15, w: 9.0, h: 0.55, fontFace: "Calibri", fontSize: 36, bold: true, color: c.white, align: "left", valign: "middle" });
};

// SLIDE 1: TITLE SLIDE
let slide1 = pptx.addSlide();
slide1.background = { color: c.navyBlue };
slide1.addText("TensPilot+", { x: 0.5, y: 2.0, w: 9, h: 1, fontFace: "Calibri", fontSize: 54, bold: true, color: c.mintGreen, align: "center" });
slide1.addText("Design of a Dual-Mode TENS Device", { x: 1, y: 3.1, w: 8, h: 0.5, fontFace: "Calibri", fontSize: 28, color: c.white, align: "center" });
slide1.addText("with Companion Web Application", { x: 1, y: 3.65, w: 8, h: 0.5, fontFace: "Calibri", fontSize: 20, italic: true, color: c.mintGreen, align: "center" });

// SLIDE 2: PRESENTATION OUTLINE
let slide2 = pptx.addSlide({ masterName: "CONTENT_MASTER" });
addContentTitle(slide2, "Presentation Outline");
// Column 1
slide2.addShape(pptx.ShapeType.rect, { x: 0.4, y: 1.2, w: 2.8, h: 5.3, fill: { color: c.lightGray }, line: { color: c.secondaryTeal, width: 2 } });
slide2.addText("Hardware", { x: 0.4, y: 1.35, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 16, bold: true, color: c.secondaryTeal, align: "center" });
slide2.addText("• The Problem\n\n• Device Design\n\n• Two Modes\n\n• Testing & Results", { x: 0.5, y: 1.95, w: 2.6, h: 3, fontFace: "Calibri", fontSize: 11, color: c.darkText, lineSpacing: 20 });
// Column 2
slide2.addShape(pptx.ShapeType.rect, { x: 3.5, y: 1.2, w: 2.8, h: 5.3, fill: { color: c.lightGray }, line: { color: c.secondaryTeal, width: 2 } });
slide2.addText("Software", { x: 3.5, y: 1.35, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 16, bold: true, color: c.secondaryTeal, align: "center" });
slide2.addText("• Patient App\n\n• Dashboard\n\n• How They Work\n\n• Key Features", { x: 3.6, y: 1.95, w: 2.6, h: 3, fontFace: "Calibri", fontSize: 11, color: c.darkText, lineSpacing: 20 });
// Column 3
slide2.addShape(pptx.ShapeType.rect, { x: 6.6, y: 1.2, w: 2.8, h: 5.3, fill: { color: c.lightGray }, line: { color: c.secondaryTeal, width: 2 } });
slide2.addText("Impact", { x: 6.6, y: 1.35, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 16, bold: true, color: c.secondaryTeal, align: "center" });
slide2.addText("• Why It Matters\n\n• Accessibility\n\n• Innovation\n\n• Thank You", { x: 6.7, y: 1.95, w: 2.6, h: 3, fontFace: "Calibri", fontSize: 11, color: c.darkText, lineSpacing: 20 });

// SLIDE 3: THE PROBLEM
let slide3 = pptx.addSlide({ masterName: "CONTENT_MASTER" });
addContentTitle(slide3, "The Problem");
slide3.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 4.0, h: 4.8, fill: { color: c.lightGray }, line: { color: c.orange, width: 3, dashType: "dash" } });
slide3.addText("Traditional TENS Device\n(isolated, no tracking)", { x: 0.5, y: 3.0, w: 4.0, h: 1, fontFace: "Calibri", fontSize: 14, bold: true, color: c.orange, align: "center", valign: "middle" });
slide3.addText("Issues:", { x: 4.8, y: 1.2, w: 4, h: 0.5, fontFace: "Calibri", fontSize: 16, bold: true, color: c.orange });
slide3.addText("❌ No session recording\n\n❌ No compliance tracking\n\n❌ No feedback to patient\n\n❌ Parameters unknown\n\n❌ No progress tracking\n\n❌ Difficult to use", { x: 4.9, y: 1.65, w: 4.5, h: 3.5, fontFace: "Calibri", fontSize: 12, color: c.darkText, lineSpacing: 18 });

// SLIDE 4: HARDWARE DESIGN
let slide4 = pptx.addSlide({ masterName: "CONTENT_MASTER" });
addContentTitle(slide4, "Hardware Design");
slide4.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 4.5, h: 4.5, fill: { color: c.lightBlue }, line: { color: c.secondaryTeal, width: 3, dashType: "dash" } });
slide4.addText("HARDWARE\nPHOTO\n\n(Device showing\nLCD display,\ncontrols & layout)", { x: 0.5, y: 1.1, w: 4.5, h: 4.5, fontFace: "Calibri", fontSize: 13, bold: true, color: c.secondaryTeal, align: "center", valign: "middle" });
slide4.addText("Specifications", { x: 5.2, y: 1.2, w: 4, h: 0.5, fontFace: "Calibri", fontSize: 14, bold: true, color: c.darkTeal });
slide4.addText("▪ Arduino Uno (ATmega328P)\n\n▪ L298N H-Bridge driver\n\n▪ XL6009 Boost converter\n\n▪ 20x4 LCD display with I2C\n\n▪ 5V Power Bank\n\n▪ Size: 150×100×56 mm\n\n▪ Weight: ~350g\n\n▪ Battery: 4+ hours", { x: 5.3, y: 1.65, w: 4.5, h: 3.8, fontFace: "Calibri", fontSize: 10, color: c.darkText, lineSpacing: 12 });

// SLIDE 5: TWO THERAPY MODES
let slide5 = pptx.addSlide({ masterName: "CONTENT_MASTER" });
addContentTitle(slide5, "Two Therapy Modes");
// Left
slide5.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 4.3, h: 4.8, fill: { color: c.lightGray }, line: { color: c.orange, width: 3 } });
slide5.addText("CONVENTIONAL", { x: 0.5, y: 1.25, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 18, bold: true, color: c.orange, align: "center" });
slide5.addText("20–120 Hz", { x: 0.5, y: 1.75, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 16, bold: true, color: c.darkTeal, align: "center" });
slide5.addText("Fast pain relief\n\n(10–20 minutes)\n\n\n\nFor acute pain &\n\nmuscle soreness\n\n\n\nSmooth tingling\n\nsensation", { x: 0.5, y: 2.25, w: 4.3, h: 3.0, fontFace: "Calibri", fontSize: 11, color: c.darkText, align: "center", lineSpacing: 8 });
// Right
slide5.addShape(pptx.ShapeType.rect, { x: 5.2, y: 1.1, w: 4.3, h: 4.8, fill: { color: c.lightGray }, line: { color: c.mintGreen, width: 3 } });
slide5.addText("ACUPUNCTURE-LIKE", { x: 5.2, y: 1.25, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 18, bold: true, color: c.mintGreen, align: "center" });
slide5.addText("1–10 Hz", { x: 5.2, y: 1.75, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 16, bold: true, color: c.darkTeal, align: "center" });
slide5.addText("Longer relief\n\n(90–180 minutes)\n\n\n\nFor chronic &\n\nneuropathic pain\n\n\n\nRhythmic tapping\n\nwith contractions", { x: 5.2, y: 2.25, w: 4.3, h: 3.0, fontFace: "Calibri", fontSize: 11, color: c.darkText, align: "center", lineSpacing: 8 });

// SLIDE 6: PATIENT APP
let slide6 = pptx.addSlide({ masterName: "CONTENT_MASTER" });
addContentTitle(slide6, "Patient App: TensPilot+");
let appScreens = [
  { x: 0.4, title: "Home & Setup" },
  { x: 3.5, title: "Active Session" },
  { x: 6.6, title: "Pain Tracking" }
];
appScreens.forEach(s => {
    slide6.addShape(pptx.ShapeType.rect, { x: s.x, y: 1.1, w: 2.8, h: 4.8, fill: { color: c.lightBlue }, line: { color: c.secondaryTeal, width: 2, dashType: "dash" } });
    slide6.addText(s.title, { x: s.x, y: 1.25, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 11, bold: true, color: c.secondaryTeal, align: "center" });
    slide6.addText("APP\nSCREEN\nSHOT", { x: s.x, y: 2.8, w: 2.8, h: 1.0, fontFace: "Calibri", fontSize: 12, bold: true, color: c.secondaryTeal, align: "center", valign: "middle" });
});
slide6.addText("Features: Session setup • Real-time countdown • Pain logging • Session history", { x: 0.5, y: 6.1, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 11, italic: true, color: c.darkText, align: "center" });

// SLIDE 7: DASHBOARD
let slide7 = pptx.addSlide({ masterName: "CONTENT_MASTER" });
addContentTitle(slide7, "Dashboard: Progress Tracking & Analytics");
let dashScreens = [
  { x: 0.4, title: "Overview Stats" },
  { x: 3.5, title: "Pain Charts" },
  { x: 6.6, title: "Session History" }
];
dashScreens.forEach(s => {
    slide7.addShape(pptx.ShapeType.rect, { x: s.x, y: 1.1, w: 2.8, h: 4.8, fill: { color: c.lightBlue }, line: { color: c.secondaryTeal, width: 2, dashType: "dash" } });
    slide7.addText(s.title, { x: s.x, y: 1.25, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 11, bold: true, color: c.secondaryTeal, align: "center" });
    slide7.addText("DASH-\nBOARD\nSCREEN\nSHOT", { x: s.x, y: 2.6, w: 2.8, h: 1.0, fontFace: "Calibri", fontSize: 11, bold: true, color: c.secondaryTeal, align: "center", valign: "middle" });
});
slide7.addText("Features: Total sessions • Average relief % • Pain reduction trends • Milestones & achievements", { x: 0.5, y: 6.1, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 11, italic: true, color: c.darkText, align: "center" });

// SLIDE 8: HOW IT WORKS
let slide8 = pptx.addSlide({ masterName: "CONTENT_MASTER" });
addContentTitle(slide8, "How Hardware & Software Work Together");
slide8.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 3.8, h: 2.8, fill: { color: c.lightGray }, line: { color: c.secondaryTeal, width: 2 } });
slide8.addText("TENS\nDEVICE", { x: 0.5, y: 1.8, w: 3.8, h: 1.0, fontFace: "Calibri", fontSize: 18, bold: true, color: c.secondaryTeal, align: "center", valign: "middle" });
slide8.addShape(pptx.ShapeType.rightArrow, { x: 4.5, y: 2.0, w: 0.8, h: 0.35, fill: { color: c.mintGreen } });
slide8.addShape(pptx.ShapeType.rect, { x: 5.7, y: 1.1, w: 3.8, h: 2.8, fill: { color: c.lightGray }, line: { color: c.secondaryTeal, width: 2 } });
slide8.addText("COMPANION\nAPP", { x: 5.7, y: 1.8, w: 3.8, h: 1.0, fontFace: "Calibri", fontSize: 18, bold: true, color: c.secondaryTeal, align: "center", valign: "middle" });
slide8.addText("Patient Workflow:", { x: 0.5, y: 4.2, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 13, bold: true, color: c.darkTeal });
slide8.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.6, w: 9.0, h: 1.4, fill: { color: c.lightGray }, line: { color: c.secondaryTeal, width: 1 } });
slide8.addText("1. Open app → Set up session  •  2. Turn on device & adjust frequency/intensity  •  3. Place electrodes  •  4. Run therapy (app timer + device pulses)  •  5. Log pain relief in app  •  6. View results in dashboard", { x: 0.5, y: 4.6, w: 9.0, h: 1.4, fontFace: "Calibri", fontSize: 10, color: c.darkText, align: "center", valign: "middle" });

// SLIDE 9: TESTING
let slide9 = pptx.addSlide({ masterName: "CONTENT_MASTER" });
addContentTitle(slide9, "Testing & Results");
slide9.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 4.3, h: 4.8, fill: { color: c.lightBlue }, line: { color: c.secondaryTeal, width: 3, dashType: "dash" } });
slide9.addText("VOLUNTEER\nTESTING\nPHOTO\n\n(Device on\nforearm, electrodes\nplaced)", { x: 0.5, y: 1.1, w: 4.3, h: 4.8, fontFace: "Calibri", fontSize: 12, bold: true, color: c.secondaryTeal, align: "center", valign: "middle" });
slide9.addText("Results from 12 Volunteers", { x: 5.1, y: 1.2, w: 4, h: 0.5, fontFace: "Calibri", fontSize: 15, bold: true, color: c.darkGreen });
slide9.addText("✓ Signal accuracy: ±2%\n\n✓ Charge balance: >98%\n\n✓ Frequency range: 1–120 Hz stable\n\n✓ Battery life: 4+ hours continuous\n\n✓ Conventional mode: smooth tingling\n\n✓ Acupuncture mode: rhythmic tapping\n\n✓ No adverse effects reported\n\n✓ Safe electrical parameters", { x: 5.2, y: 1.7, w: 4.5, h: 4, fontFace: "Calibri", fontSize: 10, color: c.darkText, lineSpacing: 12 });

// SLIDE 10: INNOVATION
let slide10 = pptx.addSlide({ masterName: "CONTENT_MASTER" });
addContentTitle(slide10, "Innovation & Key Features");

slide10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 2.8, h: 4.8, fill: { color: c.lightGray }, line: { color: c.orange, width: 2 } });
slide10.addText("Hardware", { x: 0.5, y: 1.3, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 14, bold: true, color: c.orange, align: "center" });
slide10.addText("• Dual-mode capability\n\n• Arduino-based\n\n• Open-source design\n\n• 20–30% cheaper", { x: 0.6, y: 1.85, w: 2.6, h: 3, fontFace: "Calibri", fontSize: 10, color: c.darkText, lineSpacing: 16 });

slide10.addShape(pptx.ShapeType.rect, { x: 3.5, y: 1.1, w: 2.8, h: 4.8, fill: { color: c.lightGray }, line: { color: c.secondaryTeal, width: 2 } });
slide10.addText("Software", { x: 3.5, y: 1.3, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 14, bold: true, color: c.secondaryTeal, align: "center" });
slide10.addText("• Progressive Web App\n\n• Offline-first (no internet)\n\n• Local data storage\n\n• Privacy-focused", { x: 3.6, y: 1.85, w: 2.6, h: 3, fontFace: "Calibri", fontSize: 10, color: c.darkText, lineSpacing: 16 });

slide10.addShape(pptx.ShapeType.rect, { x: 6.5, y: 1.1, w: 2.8, h: 4.8, fill: { color: c.lightGray }, line: { color: c.mintGreen, width: 2 } });
slide10.addText("Integration", { x: 6.5, y: 1.3, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 14, bold: true, color: c.mintGreen, align: "center" });
slide10.addText("• Manual data entry (current)\n\n• Session tracking\n\n• Progress analytics\n\n• Future: Bluetooth", { x: 6.6, y: 1.85, w: 2.6, h: 3, fontFace: "Calibri", fontSize: 10, color: c.darkText, lineSpacing: 16 });

// SLIDE 11: WHY THIS MATTERS
let slide11 = pptx.addSlide({ masterName: "CONTENT_MASTER" });
addContentTitle(slide11, "Why This Matters");

slide11.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 2.8, h: 4.8, fill: { color: c.lightGray }, line: { color: c.mintGreen, width: 2 } });
slide11.addText("👤", { x: 1.4, y: 1.25, w: 1, h: 0.5, fontFace: "Calibri", fontSize: 28, align: "center" });
slide11.addText("For Patients", { x: 0.5, y: 1.75, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 13, bold: true, color: c.mintGreen, align: "center" });
slide11.addText("• Know how to use\n\n• Track progress\n\n• See results\n\n• Get guidance", { x: 0.5, y: 2.25, w: 2.8, h: 3, fontFace: "Calibri", fontSize: 9.5, color: c.darkText, align: "center", lineSpacing: 14 });

slide11.addShape(pptx.ShapeType.rect, { x: 3.5, y: 1.1, w: 2.8, h: 4.8, fill: { color: c.lightGray }, line: { color: c.secondaryTeal, width: 2 } });
slide11.addText("⚕️", { x: 4.4, y: 1.25, w: 1, h: 0.5, fontFace: "Calibri", fontSize: 28, align: "center" });
slide11.addText("For Providers", { x: 3.5, y: 1.75, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 13, bold: true, color: c.secondaryTeal, align: "center" });
slide11.addText("• Monitor compliance\n\n• Track outcomes\n\n• Make decisions\n\n• Evidence-based", { x: 3.5, y: 2.25, w: 2.8, h: 3, fontFace: "Calibri", fontSize: 9.5, color: c.darkText, align: "center", lineSpacing: 14 });

slide11.addShape(pptx.ShapeType.rect, { x: 6.5, y: 1.1, w: 2.8, h: 4.8, fill: { color: c.lightGray }, line: { color: c.orange, width: 2 } });
slide11.addText("🌍", { x: 7.4, y: 1.25, w: 1, h: 0.5, fontFace: "Calibri", fontSize: 28, align: "center" });
slide11.addText("Accessibility", { x: 6.5, y: 1.75, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 13, bold: true, color: c.orange, align: "center" });
slide11.addText("• ₦77,020 cost\n\n• 20-30% cheaper\n\n• Open-source\n\n• Resource-limited", { x: 6.5, y: 2.25, w: 2.8, h: 3, fontFace: "Calibri", fontSize: 9.5, color: c.darkText, align: "center", lineSpacing: 14 });

// SLIDE 12: THANK YOU
let slide12 = pptx.addSlide();
slide12.background = { color: c.navyBlue };
slide12.addText("Thank You", { x: 0.5, y: 2.2, w: 9, h: 1, fontFace: "Calibri", fontSize: 52, bold: true, color: c.mintGreen, align: "center" });
slide12.addText("TensPilot+", { x: 0.5, y: 3.05, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 26, color: c.white, align: "center" });
slide12.addText("Making Pain Management Accessible & Evidence-Based", { x: 0.5, y: 3.5, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 16, italic: true, color: c.mintGreen, align: "center" });
slide12.addText("Questions?", { x: 0.5, y: 5.5, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 20, color: c.mintGreen, align: "center" });

pptx.writeFile({ fileName: "TensPilot_12Slides.pptx" }).then(() => {
    console.log("PPTX created successfully.");
});
