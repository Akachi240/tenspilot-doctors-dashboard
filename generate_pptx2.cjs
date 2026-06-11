const pptxgen = require('pptxgenjs');
let pptx = new pptxgen();

// Master Slide for neat and sleek design
pptx.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: "0F172A" },
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.1, fill: { color: "3B82F6" } } },
    { rect: { x: 0, y: 0.1, w: "100%", h: 0.05, fill: { color: "10B981" } } },
    { text: { text: "TensPilot+ Smart Electrotherapy", options: { x: 0.5, y: 5.2, w: 5, h: 0.5, color: "475569", fontSize: 10 } } }
  ]
});

// Title Slide
let slide1 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide1.addText("TensPilot+", { x: 1, y: 1.5, w: 8, h: 1, fontSize: 54, bold: true, color: "3B82F6", align: "center" });
slide1.addText("Smart TENS Device & Monitoring Ecosystem", { x: 1, y: 2.5, w: 8, h: 1, fontSize: 24, color: "F8FAFC", align: "center" });
slide1.addText("Fusing physical electrotherapy hardware with AI-driven software telemetry.", { x: 1, y: 3.2, w: 8, h: 1, fontSize: 14, color: "94A3B8", align: "center", italic: true });

// Slide 2: Problem & Motivation
let slide2 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide2.addText("1. Problem & Motivation", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide2.addText([
  { text: "The Core Problem\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• Standard TENS machines are \"dumb\" hardware. They deliver therapy but collect zero data.\n" },
  { text: "• Doctors have no visibility into how the patient is using the device at home.\n" },
  { text: "• Patients often guess their settings and feel unsupported when dealing with pain.\n\n" },
  { text: "Our Motivation\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• To build a highly effective physical TENS device and augment it with an innovative software ecosystem that bridges the gap between clinic and home." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1", bullet: false });

// Slide 3: Background & Related Work
let slide3 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide3.addText("2. Background & Related Work", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide3.addText([
  { text: "Current Landscape\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• Most local clinics rely on completely isolated, analog hardware.\n" },
  { text: "• \"Smart\" TENS units exist abroad, but they are highly expensive and proprietary.\n\n" },
  { text: "The TensPilot+ Difference\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• We constructed a robust physical electrotherapy device.\n" },
  { text: "• We paired it with a universal, cloud-connected Software Companion that captures telemetry and guides the patient without requiring expensive bluetooth hardware." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

// Slide 4: Approach & Uniqueness
let slide4 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide4.addText("3. Approach & Uniqueness", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide4.addText([
  { text: "Hardware + Software Synergy\n", options: { bold: true, color: "F8FAFC" } },
  { text: "1. The Hardware: The physical TensPilot+ unit delivers safe, effective electrical impulses to the muscles/nerves.\n" },
  { text: "2. The Software Brain: A Patient App (for logging & AI guidance) + Doctor Dashboard (for remote monitoring).\n\n" },
  { text: "Why it's Unique\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• \"Software-Guided Telemetry\": The app calculates exact parameters for the hardware.\n" },
  { text: "• AI Integration: Google Gemini acts as a 24/7 virtual assistant for pad placement and safety.\n" },
  { text: "• Real-Time Syncing: Doctors see hardware usage data instantly via Firebase." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

// Slide 5: Local Content & Accessibility
let slide5 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide5.addText("4. Local Content & Accessibility", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide5.addText([
  { text: "Solving Local Healthcare Challenges\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• Cost-Effective Hardware: Built to be affordable and accessible for local physiotherapy patients.\n" },
  { text: "• Accessible Software: Built as a Progressive Web App (PWA). It runs on any low-cost smartphone, meaning patients don't need expensive iPhones to get \"smart\" features.\n" },
  { text: "• Remote Monitoring: Reduces the burden on overcrowded local clinics by allowing doctors to track physical therapy progress remotely." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

// Slide 6: Knowledge of Research Area
let slide6 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide6.addText("5. Knowledge of Research Area", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide6.addText([
  { text: "Clinical & Engineering Metrics Tracked\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• Hardware Parameters: Pulse Width (µs), Frequency (Hz), and Intensity (mA).\n" },
  { text: "• Efficacy Tracking: Calculates \"Pain Reduction Percentage\" using standard Visual Analog Scales (VAS).\n" },
  { text: "• Data Integrity: Session data from the hardware is siloed and protected using secure unique IDs via NoSQL document databases." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

// Slide 7: Significance of Contribution
let slide7 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide7.addText("6. Significance of Contribution", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide7.addText([
  { text: "A Massive Leap for Electrotherapy\n", options: { bold: true, color: "F8FAFC" } },
  { text: "• Turns Dumb Hardware Smart: Gives patients a premium, monitored experience without the premium price tag.\n" },
  { text: "• For Doctors: Transforms subjective feedback into objective hardware usage data (Compliance Rates, Avg Relief).\n" },
  { text: "• For Patients: Democratizes access to expert guidance via the Gemini AI, ensuring they apply the hardware correctly." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

// Slide 8: Live Practical Demonstration
let slide8 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide8.addText("7. Live Practical Demonstration", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide8.addText([
  { text: "Watch the Hardware & Software Synergy:\n", options: { bold: true, color: "F8FAFC" } },
  { text: "1. The Device: Demonstrating the physical TensPilot+ hardware.\n" },
  { text: "2. The Brain: The app calculates the exact settings the patient should input into the device.\n" },
  { text: "3. Telemetry: Logging the session on the phone and watching the Doctor Dashboard update instantly.\n" },
  { text: "4. AI Assistant: Asking the Gemini AI exactly where to place the physical pads for lower back pain." }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 16, color: "CBD5E1" });

pptx.writeFile({ fileName: "TensPilot_Presentation_Hardware_Focused.pptx" }).then(() => {
    console.log("PPTX created successfully.");
});
