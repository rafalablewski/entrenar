"use client";

import { useEffect, useRef, useState } from "react";

interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  weight?: string;
  duration?: string;
}

interface StoryData {
  title: string;
  date: string;
  planTitle: string;
  exercises: Exercise[];
  notes?: string;
  status: string;
}

interface ShareableStoryProps {
  data: StoryData;
  onClose: () => void;
}

// Calculate stats from exercises
function calcStats(exercises: Exercise[]) {
  let totalVolume = 0;
  let totalSets = 0;
  let totalReps = 0;
  let maxWeight = 0;
  let exerciseCount = exercises.length;

  for (const ex of exercises) {
    const sets = ex.sets || 0;
    const reps = parseFloat(ex.reps || "0") || 0;
    const weight = parseFloat((ex.weight || "0").replace(/[^0-9.]/g, "")) || 0;
    totalSets += sets;
    totalReps += sets * reps;
    totalVolume += sets * reps * weight;
    if (weight > maxWeight) maxWeight = weight;
  }

  return { totalVolume, totalSets, totalReps, maxWeight, exerciseCount };
}

function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1).replace(/\.0$/, "")} tons`;
  return `${Math.round(kg)} kg`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

// ─────────── TEMPLATE 1: NEON CYBERPUNK ───────────
function drawNeonCyberpunk(ctx: CanvasRenderingContext2D, w: number, h: number, data: StoryData, stats: ReturnType<typeof calcStats>) {
  // Background: deep black with subtle grid
  ctx.fillStyle = "#050510";
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  // Top accent bar
  const grd = ctx.createLinearGradient(0, 0, w, 0);
  grd.addColorStop(0, "#00F0FF");
  grd.addColorStop(0.5, "#A855F7");
  grd.addColorStop(1, "#FF2D92");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, 6);

  // ENTRENAR logo
  ctx.font = "bold 28px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "#00F0FF";
  ctx.textAlign = "left";
  ctx.fillText("ENTRENAR", 60, 100);

  // Date
  ctx.font = "500 22px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText(formatDate(data.date), 60, 140);

  // Session title - large neon text
  ctx.font = "bold 52px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  wrapText(ctx, data.title.toUpperCase(), 60, 240, w - 120, 58);

  // Big volume number - the hero stat
  const volText = formatWeight(stats.totalVolume);
  ctx.font = "bold 120px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  const volGrd = ctx.createLinearGradient(0, 420, 0, 580);
  volGrd.addColorStop(0, "#00F0FF");
  volGrd.addColorStop(1, "#A855F7");
  ctx.fillStyle = volGrd;
  ctx.textAlign = "center";
  ctx.fillText(volText, w / 2, 560);

  // "TOTAL VOLUME LIFTED" label
  ctx.font = "600 24px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillText("TOTAL VOLUME LIFTED", w / 2, 610);

  // Neon glow line
  ctx.strokeStyle = "#00F0FF";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#00F0FF";
  ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.moveTo(60, 660); ctx.lineTo(w - 60, 660); ctx.stroke();
  ctx.shadowBlur = 0;

  // Stats grid - 3 columns
  const statY = 730;
  const stats3 = [
    { label: "EXERCISES", value: `${stats.exerciseCount}` },
    { label: "TOTAL SETS", value: `${stats.totalSets}` },
    { label: "MAX WEIGHT", value: stats.maxWeight > 0 ? `${stats.maxWeight} kg` : "—" },
  ];
  stats3.forEach((st, i) => {
    const x = 60 + (i * (w - 120) / 3) + ((w - 120) / 3) / 2;
    ctx.font = "bold 48px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(st.value, x, statY);
    ctx.font = "600 16px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillText(st.label, x, statY + 35);
  });

  // Exercise list
  let yPos = 860;
  ctx.textAlign = "left";
  data.exercises.slice(0, 8).forEach((ex) => {
    // Dot
    ctx.fillStyle = "#00F0FF";
    ctx.beginPath(); ctx.arc(80, yPos - 5, 4, 0, Math.PI * 2); ctx.fill();
    // Name
    ctx.font = "500 24px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText(ex.name, 100, yPos);
    // Details
    const detail = [ex.sets ? `${ex.sets}s` : "", ex.reps ? `${ex.reps}r` : "", ex.weight || ex.duration || ""].filter(Boolean).join(" × ");
    if (detail) {
      ctx.font = "500 20px 'SF Pro Display', 'Inter', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.textAlign = "right";
      ctx.fillText(detail, w - 60, yPos);
      ctx.textAlign = "left";
    }
    yPos += 52;
  });

  // Bottom gradient fade
  const btmGrd = ctx.createLinearGradient(0, h - 200, 0, h);
  btmGrd.addColorStop(0, "transparent");
  btmGrd.addColorStop(1, "rgba(0,240,255,0.05)");
  ctx.fillStyle = btmGrd;
  ctx.fillRect(0, h - 200, w, 200);

  // Bottom bar
  ctx.fillStyle = grd;
  ctx.fillRect(0, h - 6, w, 6);
}

// ─────────── TEMPLATE 2: FIRE & ENERGY ───────────
function drawFireEnergy(ctx: CanvasRenderingContext2D, w: number, h: number, data: StoryData, stats: ReturnType<typeof calcStats>) {
  // Dark warm background
  ctx.fillStyle = "#0A0505";
  ctx.fillRect(0, 0, w, h);

  // Warm gradient overlay from bottom
  const warmGrd = ctx.createLinearGradient(0, h, 0, 0);
  warmGrd.addColorStop(0, "rgba(255, 60, 20, 0.12)");
  warmGrd.addColorStop(0.4, "rgba(255, 107, 53, 0.05)");
  warmGrd.addColorStop(1, "transparent");
  ctx.fillStyle = warmGrd;
  ctx.fillRect(0, 0, w, h);

  // Diagonal accent stripes
  ctx.save();
  ctx.globalAlpha = 0.03;
  for (let i = -w; i < w + h; i += 60) {
    ctx.strokeStyle = "#FF6B35";
    ctx.lineWidth = 30;
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke();
  }
  ctx.restore();

  // Top flame accent
  const flameGrd = ctx.createLinearGradient(0, 0, w, 0);
  flameGrd.addColorStop(0, "#FF2D00");
  flameGrd.addColorStop(0.5, "#FF6B35");
  flameGrd.addColorStop(1, "#FFAB00");
  ctx.fillStyle = flameGrd;
  ctx.fillRect(0, 0, w, 5);

  // Logo
  ctx.font = "bold 26px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "#FF6B35";
  ctx.textAlign = "left";
  ctx.fillText("ENTRENAR", 60, 90);

  // "WORKOUT COMPLETE" stamp
  ctx.font = "bold 18px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,107,53,0.5)";
  ctx.textAlign = "right";
  ctx.fillText("WORKOUT COMPLETE", w - 60, 90);

  // Date
  ctx.font = "500 20px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.textAlign = "left";
  ctx.fillText(formatDate(data.date), 60, 130);

  // Session title
  ctx.font = "bold 48px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "white";
  wrapText(ctx, data.title.toUpperCase(), 60, 220, w - 120, 54);

  // Fire emoji-style decoration  — large number
  ctx.textAlign = "center";
  ctx.font = "bold 160px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  const fireGrd = ctx.createLinearGradient(w / 2 - 200, 380, w / 2 + 200, 600);
  fireGrd.addColorStop(0, "#FFAB00");
  fireGrd.addColorStop(0.5, "#FF6B35");
  fireGrd.addColorStop(1, "#FF2D00");
  ctx.fillStyle = fireGrd;
  ctx.fillText(formatWeight(stats.totalVolume), w / 2, 550);

  // Label
  ctx.font = "bold 22px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("CRUSHED IT", w / 2, 600);

  // Stats in rounded boxes
  const boxY = 660;
  const boxH = 110;
  const boxW = (w - 160) / 3;
  const statsArr = [
    { val: `${stats.exerciseCount}`, lbl: "Exercises" },
    { val: `${stats.totalSets}`, lbl: "Sets" },
    { val: `${stats.totalReps}`, lbl: "Reps" },
  ];

  statsArr.forEach((st, i) => {
    const bx = 60 + i * (boxW + 20);
    roundRect(ctx, bx, boxY, boxW, boxH, 16, "rgba(255,107,53,0.08)", "rgba(255,107,53,0.15)");
    ctx.font = "bold 42px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "#FF6B35";
    ctx.textAlign = "center";
    ctx.fillText(st.val, bx + boxW / 2, boxY + 50);
    ctx.font = "600 14px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillText(st.lbl, bx + boxW / 2, boxY + 80);
  });

  // Exercise bars
  let yPos = 830;
  ctx.textAlign = "left";
  data.exercises.slice(0, 7).forEach((ex, i) => {
    const exVol = (ex.sets || 0) * (parseFloat(ex.reps || "0") || 0) * (parseFloat((ex.weight || "0").replace(/[^0-9.]/g, "")) || 0);
    const pct = stats.totalVolume > 0 ? exVol / stats.totalVolume : 0;

    // Bar background
    roundRect(ctx, 60, yPos - 20, w - 120, 44, 10, "rgba(255,255,255,0.02)", "rgba(255,255,255,0.04)");
    // Fill bar
    if (pct > 0) {
      const barGrd = ctx.createLinearGradient(60, 0, 60 + (w - 120) * pct, 0);
      barGrd.addColorStop(0, "rgba(255,107,53,0.25)");
      barGrd.addColorStop(1, "rgba(255,107,53,0.05)");
      roundRect(ctx, 60, yPos - 20, Math.max((w - 120) * pct, 40), 44, 10, barGrd);
    }

    ctx.font = "600 20px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(ex.name, 80, yPos + 6);

    if (exVol > 0) {
      ctx.font = "500 18px 'SF Pro Display', 'Inter', system-ui, sans-serif";
      ctx.fillStyle = "#FF6B35";
      ctx.textAlign = "right";
      ctx.fillText(formatWeight(exVol), w - 80, yPos + 6);
      ctx.textAlign = "left";
    }

    yPos += 58;
  });

  // Bottom flame
  ctx.fillStyle = flameGrd;
  ctx.fillRect(0, h - 5, w, 5);
}

// ─────────── TEMPLATE 3: MINIMAL CLEAN ───────────
function drawMinimalClean(ctx: CanvasRenderingContext2D, w: number, h: number, data: StoryData, stats: ReturnType<typeof calcStats>) {
  // Pure white/light background
  ctx.fillStyle = "#FAFAFA";
  ctx.fillRect(0, 0, w, h);

  // Subtle top accent
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, w, 4);

  // Logo
  ctx.font = "bold 22px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "#111";
  ctx.textAlign = "left";
  ctx.fillText("ENTRENAR", 60, 90);

  // Thin line
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60, 120); ctx.lineTo(w - 60, 120); ctx.stroke();

  // Date
  ctx.font = "400 18px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "#999";
  ctx.fillText(formatDate(data.date), 60, 160);

  // Title
  ctx.font = "bold 44px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "#111";
  wrapText(ctx, data.title, 60, 240, w - 120, 52);

  // Giant volume number
  ctx.textAlign = "center";
  ctx.font = "200 140px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "#111";
  ctx.fillText(formatWeight(stats.totalVolume), w / 2, 520);

  ctx.font = "500 20px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "#999";
  ctx.fillText("total volume", w / 2, 560);

  // Line
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath(); ctx.moveTo(60, 610); ctx.lineTo(w - 60, 610); ctx.stroke();

  // Stats row
  const statsArr = [
    { val: `${stats.exerciseCount}`, lbl: "exercises" },
    { val: `${stats.totalSets}`, lbl: "sets" },
    { val: `${stats.totalReps}`, lbl: "reps" },
    { val: stats.maxWeight > 0 ? `${stats.maxWeight}kg` : "—", lbl: "max" },
  ];
  statsArr.forEach((st, i) => {
    const x = 60 + (i * (w - 120) / 4) + ((w - 120) / 4) / 2;
    ctx.font = "bold 36px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "#111";
    ctx.textAlign = "center";
    ctx.fillText(st.val, x, 680);
    ctx.font = "400 14px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "#AAA";
    ctx.fillText(st.lbl, x, 710);
  });

  // Exercise list - clean
  let yPos = 790;
  ctx.textAlign = "left";
  data.exercises.slice(0, 8).forEach((ex, i) => {
    ctx.font = "500 22px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "#333";
    ctx.fillText(ex.name, 80, yPos);

    const detail = [ex.sets ? `${ex.sets} sets` : "", ex.reps ? `${ex.reps} reps` : "", ex.weight || ex.duration || ""].filter(Boolean).join("  ·  ");
    ctx.font = "400 18px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "#BBB";
    ctx.textAlign = "right";
    ctx.fillText(detail, w - 60, yPos);
    ctx.textAlign = "left";

    // Separator
    if (i < data.exercises.length - 1) {
      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      ctx.beginPath(); ctx.moveTo(80, yPos + 20); ctx.lineTo(w - 60, yPos + 20); ctx.stroke();
    }
    yPos += 52;
  });

  // Bottom
  ctx.fillStyle = "#111";
  ctx.fillRect(0, h - 4, w, 4);
}

// ─────────── TEMPLATE 4: AURORA GRADIENT ───────────
function drawAuroraGradient(ctx: CanvasRenderingContext2D, w: number, h: number, data: StoryData, stats: ReturnType<typeof calcStats>) {
  // Deep dark base
  ctx.fillStyle = "#050515";
  ctx.fillRect(0, 0, w, h);

  // Aurora gradient blobs
  const g1 = ctx.createRadialGradient(200, 300, 50, 200, 300, 500);
  g1.addColorStop(0, "rgba(0, 255, 136, 0.12)");
  g1.addColorStop(1, "transparent");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, w, h);

  const g2 = ctx.createRadialGradient(w - 150, 700, 50, w - 150, 700, 600);
  g2.addColorStop(0, "rgba(168, 85, 247, 0.1)");
  g2.addColorStop(1, "transparent");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, w, h);

  const g3 = ctx.createRadialGradient(w / 2, h - 300, 50, w / 2, h - 300, 500);
  g3.addColorStop(0, "rgba(0, 240, 255, 0.08)");
  g3.addColorStop(1, "transparent");
  ctx.fillStyle = g3;
  ctx.fillRect(0, 0, w, h);

  // Logo
  ctx.font = "bold 26px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  const logoGrd = ctx.createLinearGradient(60, 0, 250, 0);
  logoGrd.addColorStop(0, "#00FF88");
  logoGrd.addColorStop(1, "#00F0FF");
  ctx.fillStyle = logoGrd;
  ctx.textAlign = "left";
  ctx.fillText("ENTRENAR", 60, 90);

  // Date
  ctx.font = "500 20px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillText(formatDate(data.date), 60, 130);

  // Title
  ctx.font = "bold 50px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  wrapText(ctx, data.title, 60, 230, w - 120, 56);

  // Big volume - aurora colored
  ctx.textAlign = "center";
  ctx.font = "bold 130px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  const auroraGrd = ctx.createLinearGradient(w / 2 - 300, 400, w / 2 + 300, 600);
  auroraGrd.addColorStop(0, "#00FF88");
  auroraGrd.addColorStop(0.5, "#00F0FF");
  auroraGrd.addColorStop(1, "#A855F7");
  ctx.fillStyle = auroraGrd;
  ctx.fillText(formatWeight(stats.totalVolume), w / 2, 530);

  ctx.font = "600 22px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText("VOLUME MOVED", w / 2, 580);

  // Glowing divider
  ctx.strokeStyle = "rgba(0,255,136,0.2)";
  ctx.lineWidth = 1;
  ctx.shadowColor = "#00FF88";
  ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.moveTo(100, 630); ctx.lineTo(w - 100, 630); ctx.stroke();
  ctx.shadowBlur = 0;

  // Circular stat badges
  const circY = 730;
  const statsArr = [
    { val: `${stats.exerciseCount}`, lbl: "EXERCISES", color: "#00FF88" },
    { val: `${stats.totalSets}`, lbl: "SETS", color: "#00F0FF" },
    { val: `${stats.totalReps}`, lbl: "REPS", color: "#A855F7" },
  ];
  statsArr.forEach((st, i) => {
    const cx = w / 2 + (i - 1) * 200;
    // Ring
    ctx.strokeStyle = st.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.arc(cx, circY, 55, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
    // Value
    ctx.font = "bold 40px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = st.color;
    ctx.textAlign = "center";
    ctx.fillText(st.val, cx, circY + 12);
    // Label
    ctx.font = "600 12px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillText(st.lbl, cx, circY + 80);
  });

  // Exercise list with colored dots
  let yPos = 880;
  const dotColors = ["#00FF88", "#00F0FF", "#A855F7", "#FF2D92", "#FFAB00", "#00FF88", "#00F0FF", "#A855F7"];
  ctx.textAlign = "left";
  data.exercises.slice(0, 7).forEach((ex, i) => {
    ctx.fillStyle = dotColors[i % dotColors.length];
    ctx.beginPath(); ctx.arc(80, yPos - 5, 5, 0, Math.PI * 2); ctx.fill();

    ctx.font = "500 22px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText(ex.name, 100, yPos);

    const vol = (ex.sets || 0) * (parseFloat(ex.reps || "0") || 0) * (parseFloat((ex.weight || "0").replace(/[^0-9.]/g, "")) || 0);
    if (vol > 0) {
      ctx.font = "500 18px 'SF Pro Display', 'Inter', system-ui, sans-serif";
      ctx.fillStyle = dotColors[i % dotColors.length];
      ctx.globalAlpha = 0.6;
      ctx.textAlign = "right";
      ctx.fillText(formatWeight(vol), w - 60, yPos);
      ctx.textAlign = "left";
      ctx.globalAlpha = 1;
    }
    yPos += 50;
  });
}

// ─────────── TEMPLATE 5: BRUTALIST BOLD ───────────
function drawBrutalistBold(ctx: CanvasRenderingContext2D, w: number, h: number, data: StoryData, stats: ReturnType<typeof calcStats>) {
  // Black background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  // Giant white block for the volume
  ctx.fillStyle = "white";
  ctx.fillRect(0, 200, w, 380);

  // Logo on black
  ctx.font = "bold 30px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText("ENTRENAR", 60, 80);

  // Date on black
  ctx.font = "400 20px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillText(formatDate(data.date), 60, 120);

  // Title on black
  ctx.font = "bold 38px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "white";
  wrapText(ctx, data.title.toUpperCase(), 60, 175, w - 120, 44);

  // Volume on white block - giant black text
  ctx.textAlign = "center";
  ctx.font = "900 160px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "#000";
  ctx.fillText(formatWeight(stats.totalVolume), w / 2, 420);

  ctx.font = "700 28px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillText("LIFTED", w / 2, 470);

  // Stats on black below
  const sy = 650;
  ctx.textAlign = "left";

  // Big stat numbers in a row
  const brutStats = [
    { val: stats.exerciseCount.toString(), lbl: "EX" },
    { val: stats.totalSets.toString(), lbl: "SETS" },
    { val: stats.totalReps.toString(), lbl: "REPS" },
  ];

  brutStats.forEach((st, i) => {
    const x = 60 + i * ((w - 120) / 3);
    ctx.font = "900 64px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(st.val, x + (w - 120) / 6, sy);
    ctx.font = "700 16px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillText(st.lbl, x + (w - 120) / 6, sy + 30);
  });

  // Exercises in monospace style
  let yPos = 760;
  ctx.textAlign = "left";
  ctx.font = "600 22px 'Courier New', monospace";
  data.exercises.slice(0, 8).forEach((ex, i) => {
    const num = `${(i + 1).toString().padStart(2, "0")}`;
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillText(num, 60, yPos);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(ex.name.toUpperCase(), 120, yPos);

    const detail = [ex.sets ? `${ex.sets}×` : "", ex.reps || "", ex.weight || ""].filter(Boolean).join(" ");
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "right";
    ctx.fillText(detail, w - 60, yPos);
    ctx.textAlign = "left";
    yPos += 46;
  });

  // Bottom white line
  ctx.fillStyle = "white";
  ctx.fillRect(60, h - 60, w - 120, 3);

  // Tagline
  ctx.font = "700 14px 'SF Pro Display', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.textAlign = "center";
  ctx.fillText("TRAIN HARDER. TRACK SMARTER.", w / 2, h - 25);
}

// ─────────── HELPERS ───────────
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let yOffset = 0;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, y + yOffset);
      line = word + " ";
      yOffset += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, y + yOffset);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient, stroke?: string) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

const TEMPLATES = [
  { name: "Neon Cyberpunk", draw: drawNeonCyberpunk, accent: "#00F0FF" },
  { name: "Fire & Energy", draw: drawFireEnergy, accent: "#FF6B35" },
  { name: "Minimal Clean", draw: drawMinimalClean, accent: "#111" },
  { name: "Aurora Gradient", draw: drawAuroraGradient, accent: "#00FF88" },
  { name: "Brutalist Bold", draw: drawBrutalistBold, accent: "#FFF" },
];

export default function ShareableStory({ data, onClose }: ShareableStoryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [templateIdx, setTemplateIdx] = useState(0);
  const stats = calcStats(data.exercises);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;

    ctx.clearRect(0, 0, 1080, 1920);
    TEMPLATES[templateIdx].draw(ctx, 1080, 1920, data, stats);
  }, [templateIdx, data, stats]);

  function downloadImage() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `entrenar-${data.title.toLowerCase().replace(/\s+/g, "-")}-${TEMPLATES[templateIdx].name.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function shareImage() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      if (navigator.share) {
        const file = new File([blob], "workout-summary.png", { type: "image/png" });
        try {
          await navigator.share({ files: [file], title: data.title, text: `${data.title} - ${formatWeight(stats.totalVolume)} lifted!` });
        } catch {
          downloadImage();
        }
      } else {
        downloadImage();
      }
    }, "image/png");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}>
      <div className="flex flex-col items-center max-h-[95vh] overflow-y-auto p-4">
        {/* Close */}
        <div className="w-full max-w-[700px] flex justify-between items-center mb-4">
          <h2 className="text-[20px] font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>Share Your Workout</h2>
          <button onClick={onClose} className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B5C")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
            Close
          </button>
        </div>

        {/* Template selector */}
        <div className="flex gap-2 mb-4 flex-wrap justify-center">
          {TEMPLATES.map((t, i) => (
            <button key={i} onClick={() => setTemplateIdx(i)}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
              style={{
                background: templateIdx === i ? `${t.accent}15` : "rgba(255,255,255,0.03)",
                border: templateIdx === i ? `2px solid ${t.accent}60` : "1px solid rgba(255,255,255,0.08)",
                color: templateIdx === i ? t.accent : "rgba(255,255,255,0.4)",
              }}>
              {t.name}
            </button>
          ))}
        </div>

        {/* Volume callout */}
        <div className="mb-3 text-center">
          <span className="text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
            Total Volume: <span style={{ color: TEMPLATES[templateIdx].accent }}>{formatWeight(stats.totalVolume)}</span>
            {stats.totalVolume >= 1000 && <span style={{ color: "#FFAB00" }}> — {(stats.totalVolume / 1000).toFixed(1)} tons moved!</span>}
          </span>
        </div>

        {/* Canvas preview */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <canvas ref={canvasRef} style={{ width: 360, height: 640, display: "block" }} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button onClick={shareImage}
            className="px-6 py-3 rounded-xl text-[14px] font-semibold transition-all"
            style={{ background: "linear-gradient(135deg, #A855F7, #7C3AED)", color: "white" }}>
            Share
          </button>
          <button onClick={downloadImage}
            className="px-6 py-3 rounded-xl text-[14px] font-semibold transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
