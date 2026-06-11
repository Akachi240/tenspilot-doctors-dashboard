const pptxgen = require('pptxgenjs');
let pptx = new pptxgen();

pptx.layout = 'LAYOUT_16x9';

// Define a highly visual Master Slide
pptx.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: "0B1120" }, // Deeper slate/black
  objects: [
    // Top gradient-like bars
    { rect: { x: 0, y: 0, w: "100%", h: 0.15, fill: { color: "2563EB" } } },
    { rect: { x: 0, y: 0.15, w: "100%", h: 0.05, fill: { color: "10B981" } } },
    // Footer branding
    { text: { text: "TENSPILOT+ SMART TELEMETRY", options: { x: 0.5, y: 5.2, w: 5, h: 0.5, color: "334155", fontSize: 10, bold: true } } },
    { text: { text: "Hardware & Software Ecosystem", options: { x: 7.0, y: 5.2, w: 3.0, h: 0.5, color: "334155", fontSize: 10, align: "right" } } }
  ]
});

// 1. Title Slide
let slide1 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide1.addShape(pptx.ShapeType.rect, { x: 1, y: 1.2, w: 8, h: 3, fill: { color: "1E293B" }, rectRadius: 0.2 });
slide1.addText("TensPilot+", { x: 1, y: 1.6, w: 8, h: 1, fontSize: 60, bold: true, color: "3B82F6", align: "center", shadow: { type: "outer", color: "000000", blur: 5, offset: 3, angle: 45 } });
slide1.addText("Smart TENS Device & Monitoring Ecosystem", { x: 1, y: 2.5, w: 8, h: 0.6, fontSize: 24, color: "F8FAFC", align: "center" });
slide1.addText("Fusing physical electrotherapy hardware with AI-driven software telemetry.", { x: 1, y: 3.1, w: 8, h: 0.5, fontSize: 14, color: "94A3B8", align: "center", italic: true });

// 2. Problem Slide
let slide2 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide2.addText("1. Problem & Motivation", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });

slide2.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 4.3, h: 3.2, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide2.addText("The Core Problem", { x: 0.7, y: 1.7, w: 4, h: 0.5, fontSize: 20, bold: true, color: "EF4444" });
slide2.addText("• Standard TENS machines are \"dumb\" hardware.\n\n• Doctors have no visibility into home usage.\n\n• Patients guess settings and feel unsupported.", { x: 0.7, y: 2.3, w: 4, h: 2, fontSize: 15, color: "CBD5E1" });

slide2.addShape(pptx.ShapeType.rect, { x: 5.2, y: 1.5, w: 4.3, h: 3.2, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide2.addText("Our Motivation", { x: 5.4, y: 1.7, w: 4, h: 0.5, fontSize: 20, bold: true, color: "3B82F6" });
slide2.addText("To build a highly effective physical TENS device and augment it with an innovative software ecosystem that bridges the gap between clinic and home.", { x: 5.4, y: 2.3, w: 3.9, h: 2, fontSize: 16, color: "CBD5E1" });

// 3. Hardware + Software Approach Slide
let slide3 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide3.addText("2. Approach & Uniqueness", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });

slide3.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.5, w: 2.8, h: 3, fill: { color: "0F172A" }, line: { color: "3B82F6", width: 2 }, rectRadius: 0.2 });
slide3.addText("1. Hardware", { x: 0.5, y: 1.7, w: 2.8, h: 0.5, fontSize: 22, bold: true, color: "3B82F6", align: "center" });
slide3.addText("Physical TensPilot+ unit delivers safe, effective electrical impulses to nerves.", { x: 0.7, y: 2.3, w: 2.4, h: 2, fontSize: 14, color: "94A3B8", align: "center" });

slide3.addShape(pptx.ShapeType.rightArrow, { x: 3.4, y: 2.8, w: 0.5, h: 0.3, fill: { color: "10B981" } });

slide3.addShape(pptx.ShapeType.roundRect, { x: 4.0, y: 1.5, w: 5.0, h: 3, fill: { color: "0F172A" }, line: { color: "10B981", width: 2 }, rectRadius: 0.2 });
slide3.addText("2. Software Brain", { x: 4.0, y: 1.7, w: 5.0, h: 0.5, fontSize: 22, bold: true, color: "10B981", align: "center" });
slide3.addText("• \"Software-Guided Telemetry\": Calculates exact parameters.\n\n• AI Integration: Gemini acts as a 24/7 virtual assistant.\n\n• Real-Time Syncing: Doctors monitor usage via Firebase.", { x: 4.2, y: 2.3, w: 4.6, h: 2, fontSize: 15, color: "F8FAFC" });

// 4. SCREENSHOT SLIDE - Patient App
let slide4 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide4.addText("Patient Companion App (PWA)", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, bold: true, color: "3B82F6" });
slide4.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 4, h: 3.5, fill: { color: "1E293B" }, line: { color: "64748B", width: 2, dashType: "dash" } });
slide4.addText("[ PASTE PATIENT APP SCREENSHOT HERE ]\n\n(Take a screenshot of the app on your phone and paste it over this box)", { x: 0.5, y: 1.5, w: 4, h: 3.5, fontSize: 14, color: "94A3B8", align: "center" });
slide4.addText("Features to Highlight:", { x: 5, y: 1.5, w: 4, h: 0.5, fontSize: 20, bold: true, color: "F8FAFC" });
slide4.addText("• Live Session Telemetry\n\n• Gemini AI Medical Assistant\n\n• Pain Reduction Algorithms\n\n• Cloud Sync functionality", { x: 5, y: 2.2, w: 4, h: 2, fontSize: 16, color: "CBD5E1" });

// 5. SCREENSHOT SLIDE - Doctor Dashboard
let slide5 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide5.addText("Clinical Doctor Dashboard", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });
slide5.addShape(pptx.ShapeType.rect, { x: 4.5, y: 1.5, w: 5, h: 3.5, fill: { color: "1E293B" }, line: { color: "64748B", width: 2, dashType: "dash" } });
slide5.addText("[ PASTE DOCTOR DASHBOARD SCREENSHOT HERE ]\n\n(Take a screenshot of the dashboard on your PC and paste it over this box)", { x: 4.5, y: 1.5, w: 5, h: 3.5, fontSize: 14, color: "94A3B8", align: "center" });
slide5.addText("Features to Highlight:", { x: 0.5, y: 1.5, w: 3.5, h: 0.5, fontSize: 20, bold: true, color: "F8FAFC" });
slide5.addText("• Global Compliance Rates\n\n• Average Relief Tracking\n\n• Secure Link Code Generation\n\n• Real-Time Session Logs", { x: 0.5, y: 2.2, w: 3.5, h: 2, fontSize: 16, color: "CBD5E1" });

// 6. Significance of Contribution
let slide6 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide6.addText("Significance of Contribution", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });
slide6.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 9, h: 3, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide6.addText("A Massive Leap for Electrotherapy", { x: 1, y: 1.8, w: 8, h: 0.5, bold: true, color: "F8FAFC", fontSize: 24 });
slide6.addText("• Turns Dumb Hardware Smart: Gives patients a premium, monitored experience without the premium price tag.\n\n• For Doctors: Transforms subjective feedback into objective hardware usage data.\n\n• For Patients: Democratizes access to expert guidance via the Gemini AI.", { x: 1, y: 2.5, w: 8, h: 2, fontSize: 16, color: "CBD5E1", bullet: false });

pptx.writeFile({ fileName: "TensPilot_Visual_Presentation.pptx" }).then(() => {
    console.log("PPTX created successfully.");
});
