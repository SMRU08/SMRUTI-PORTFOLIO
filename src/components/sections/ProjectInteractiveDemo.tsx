"use client";

import { Layers, ArrowRight } from "lucide-react";

interface ProjectArchitectureProps {
  index: number;
}

export function ProjectArchitectureXRay({ index }: ProjectArchitectureProps) {
  const PIPELINES = [
    // 0: SafeSync Architecture
    {
      title: "SafeSync End-to-End Safety Pipeline",
      latency: "28ms End-to-End",
      steps: [
        { label: "RTSP Video Stream", detail: "1080p 30 FPS Industrial CCTV Camera Feed acquisition" },
        { label: "OpenCV Preprocessing", detail: "Frame slicing, color space normalization & resolution downsampling" },
        { label: "YOLOv8 & Deep CNN", detail: "Dual-head inference for hardhats, vests & hazard coordinates" },
        { label: "FastAPI Async Engine", detail: "Confidence thresholding (>92%) & breach verification" },
        { label: "WebSocket & UI", detail: "Sub-50ms hazard broadcast & audio alert dispatch" },
      ],
    },
    // 1: JANBHASHA Architecture
    {
      title: "JANBHASHA 100% Offline Edge Pipeline",
      latency: "18ms Edge Latency",
      steps: [
        { label: "Student Input", detail: "Voice speech recording or digital textbook text input" },
        { label: "Local Byte Tokenizer", detail: "Zero-cloud text normalization and token slicing" },
        { label: "Quantized ONNX Model", detail: "<15MB compressed neural translation weights on device" },
        { label: "Kotlin / React Native", detail: "Asynchronous multi-threaded native hardware acceleration" },
        { label: "Vernacular Audio/UI", detail: "Odia, Hindi & regional dialect voice synthesis" },
      ],
    },
    // 2: Face Recognition Architecture
    {
      title: "Biometric Attendance Pipeline",
      latency: "30 FPS Real-Time",
      steps: [
        { label: "Camera Input", detail: "Live classroom or entryway surveillance stream" },
        { label: "MTCNN Localization", detail: "Multi-face bounding box extraction in real time" },
        { label: "FaceNet 128-D", detail: "Deep facial feature embedding generation" },
        { label: "Cosine Classifier", detail: "Instant Euclidean distance matching against student roster" },
        { label: "Automated Logging", detail: "Time-stamped biometric ledger entry creation" },
      ],
    },
    // 3: Emotion Detection Architecture
    {
      title: "Real-Time Emotion Inference Pipeline",
      latency: "22ms Per Frame",
      steps: [
        { label: "Video Frame Buffer", detail: "60 FPS raw sensor stream acquisition" },
        { label: "Face Alignment", detail: "Facial landmark normalization & histogram equalization" },
        { label: "Mini-Xception CNN", detail: "Depthwise separable convolution for 7 emotion classes" },
        { label: "Softmax Distribution", detail: "Class probability vector calculation in 22ms" },
        { label: "HUD Visualization", detail: "Dynamic bounding box & micro-expression indicator" },
      ],
    },
  ];

  const currentPipeline = PIPELINES[index] ?? PIPELINES[0]!;

  return (
    <div className="space-y-3 pt-3 text-xs">
      <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-black/40 px-3.5 py-2 font-mono text-[11px] text-cyan-400">
        <div className="flex items-center gap-2">
          <Layers size={14} className="shrink-0" />
          <span>SYSTEM ARCHITECTURE // {currentPipeline.title}</span>
        </div>
        <span className="text-violet-300 font-mono text-[10px]">{currentPipeline.latency}</span>
      </div>

      <div className="space-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
        {currentPipeline.steps.map((step, idx) => (
          <div key={step.label} className="flex items-start gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 font-mono text-[10px] font-bold text-violet-300">
              {idx + 1}
            </span>
            <div className="flex-1 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold text-xs">{step.label}</span>
                {idx < currentPipeline.steps.length - 1 && (
                  <ArrowRight size={10} className="text-slate-600" />
                )}
              </div>
              <span className="text-slate-400 text-[11px] block mt-0.5">{step.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
