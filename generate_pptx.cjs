const pptxgen = require('pptxgenjs');
let pptx = new pptxgen();

// Master Slide for neat and sleek design
pptx.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: "0F172A" },
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.1, fill: { color: "3B82F6" } } },
    { rect: { x: 0, y: 0.1, w: "100%", h: 0.05, fill: { color: "10B981" } } },
    { text: { text: "TensPilot+ Remote Therapy", options: { x: 0.5, y: 5.2, w: 5, h: 0.5, color: "475569", fontSize: 10 } } }
  ]
});

// Title Slide
let slide1 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide1.addText("TensPilot+", { x: 1, y: 1.5, w: 8, h: 1, fontSize: 54, bold: true, color: "3B82F6", align: "center" });
slide1.addText("Remote Therapy Monitoring System", { x: 1, y: 2.5, w: 8, h: 1, fontSize: 24, color: "F8FAFC", align: "center" });
slide1.addText("Bridging the gap between clinic and home pain management.", { x: 1, y: 3.2, w: 8, h: 1, fontSize: 14, color: "94A3B8", align: "center", italic: true });

// Slide 2: Problem & Motivation
let slide2 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide2.addText("1. Problem & Motivation", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide2.addText([
  { text: "The Core Problem\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• TENS is highly effective for pain, but used entirely \"in the dark\" at home.\n" },
  { text: "• Doctors have zero visibility into patient compliance or efficacy.\n" },
  { text: "• Patients often use incorrect parameters or feel unsupported.\n\n" },
  { text: "Our Motivation\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• To create a real-time, AI-assisted monitoring ecosystem that connects the patient's living room directly to the doctor's dashboard." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1", bullet: false });

// Slide 3: Background & Related Work
let slide3 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide3.addText("2. Background & Related Work", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide3.addText([
  { text: "Current Landscape\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• Reliance on subjective, easily lost paper \"pain diaries.\"\n" },
  { text: "• Existing smart TENS units are proprietary, offline, and prohibitively expensive.\n\n" },
  { text: "The TensPilot+ Difference\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• We built a universal software ecosystem.\n" },
  { text: "• Captures telemetry from ANY TENS session and pushes it securely to a clinical portal in real-time." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

// Slide 4: Approach & Uniqueness
let slide4 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide4.addText("3. Approach & Uniqueness", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide4.addText([
  { text: "Dual-Platform Architecture\n", options: { bold: true, color: "F8FAFC" } },
  { text: "1. Patient Companion App: A Progressive Web App (PWA) for logging sessions & AI guidance.\n" },
  { text: "2. Doctor Dashboard: A clinical portal for tracking compliance and generating secure access codes.\n\n" },
  { text: "Why it's Unique\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• Real-Time Telemetry: Powered by Firebase Firestore.\n" },
  { text: "• AI Virtual Assistant: Integrated Google Gemini API for 24/7 patient support.\n" },
  { text: "• Accessible: Runs on any low-cost smartphone browser." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

// Slide 5: Local Content & Accessibility
let slide5 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide5.addText("4. Local Content & Accessibility", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide5.addText([
  { text: "Solving Local Healthcare Challenges\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• Reduces the burden on overcrowded physiotherapy clinics and long hospital wait times.\n" },
  { text: "• Enables remote patient monitoring without requiring expensive proprietary hardware.\n" },
  { text: "• As a Progressive Web App (PWA), it bypasses app store restrictions and works on low-end devices, making advanced telehealth accessible to the local populace." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

// Slide 6: Knowledge of Research Area
let slide6 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide6.addText("5. Knowledge of Research Area", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide6.addText([
  { text: "Clinical Metrics Tracked\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• TENS Parameters: Pulse Width, Frequency (Hz), and Intensity (mA).\n" },
  { text: "• Pain Scales: Calculates \"Pain Reduction Percentage\" using standard Visual Analog Scales (VAS).\n" },
  { text: "• Security & Privacy: Patient data is siloed and protected using secure unique IDs and noSQL document databases." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

// Slide 7: Significance of Contribution
let slide7 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide7.addText("6. Significance of Contribution", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide7.addText([
  { text: "A Massive Leap for Telemedicine\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• For Doctors: Transforms subjective feedback into objective data (Compliance Rates, Avg Relief).\n" },
  { text: "• For Patients: Democratizes access to expert guidance via the Gemini AI, ensuring they are never \"alone.\"\n" },
  { text: "• For the Healthcare System: A scalable, low-cost model that can drastically reduce hospital outpatient visits for chronic pain sufferers." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

// Slide 8: Live Practical Demonstration
let slide8 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide8.addText("7. Live Practical Demonstration", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide8.addText([
  { text: "Watch the Ecosystem in Action:\n", options: { bold: true, color: "F8FAFC" } },
  { text: "1. Onboarding: Generating a secure 6-digit access code on the Doctor Dashboard.\n" },
  { text: "2. Linking: Connecting the Patient App to the Clinic.\n" },
  { text: "3. Real-Time Sync: Logging a session on the phone and watching the dashboard update instantly.\n" },
  { text: "4. AI Assistant: Asking the Gemini AI a medical question for real-time guidance." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

pptx.writeFile({ fileName: "TensPilot_Presentation.pptx" }).then(() => {
    console.log("PPTX created successfully.");
});
