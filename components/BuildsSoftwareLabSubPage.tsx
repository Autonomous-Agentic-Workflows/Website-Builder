/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  Terminal, 
  Hammer, 
  Cpu, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Sliders, 
  Layers, 
  CheckCircle2, 
  X,
  Code,
  Globe,
  Radio,
  Zap
} from 'lucide-react';
import { ServiceItem, DivisionType } from '../types';
import { SERVICES_DATA, AI_STUDIO_APP_URL, AI_STUDIO_APP_ID } from '../data/servicesData';
import ArtistCard from './ArtistCard';
import EnterpriseAICorePlaybook from './EnterpriseAICorePlaybook';

interface BuildsSoftwareLabSubPageProps {
  onBackToHome: () => void;
  onNavigateEstimate: () => void;
}

export const BuildsSoftwareLabSubPage: React.FC<BuildsSoftwareLabSubPageProps> = ({
  onBackToHome,
  onNavigateEstimate
}) => {
  const [activeDivision, setActiveDivision] = useState<DivisionType>('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [copiedAppUrl, setCopiedAppUrl] = useState(false);

  const filteredServices = SERVICES_DATA.filter(item => {
    if (activeDivision === 'all') return true;
    if (activeDivision === 'contractor') return item.division === 'contractor' || item.division === 'hybrid';
    if (activeDivision === 'developer') return item.division === 'developer' || item.division === 'hybrid';
    return true;
  });

  const handleCopyAppUrl = () => {
    navigator.clipboard.writeText(AI_STUDIO_APP_URL).catch(() => {});
    setCopiedAppUrl(true);
    setTimeout(() => setCopiedAppUrl(false), 2500);
  };

  return (
    <div className="relative min-h-screen bg-[#040810] text-slate-100 pb-24 selection:bg-[#38bdf8] selection:text-black">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1e40af]/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#00ff66]/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#00F2FE]/10 rounded-full blur-[140px]" />
      </div>

      {/* TOP NAVIGATION / BREADCRUMB BAR */}
      <header className="sticky top-0 z-40 bg-[#060e18]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumbs & Back Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold tracking-wider uppercase border border-slate-700 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
              title="Return to 208 Fence & Gate Home"
            >
              <ArrowLeft className="w-4 h-4 text-[#38bdf8]" />
              <span>Back to Home</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>/</span>
              <span className="text-slate-400">Disciplines & Offerings</span>
              <span>/</span>
              <span className="text-[#38bdf8] font-bold">BUILDS & SOFTWARE LAB</span>
            </div>
          </div>

          {/* Direct AI Studio App Launch CTA Header Button */}
          <div className="flex items-center gap-2.5">
            <a
              href={AI_STUDIO_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#0284c7] hover:from-[#2563eb] hover:to-[#0ea5e9] text-white text-xs font-mono font-bold tracking-wider uppercase border border-[#38bdf8]/40 shadow-lg shadow-blue-950/50 transition-all hover:scale-[1.03] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Launch AI Studio App ↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* SUB-PAGE MAIN CONTENT CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-14">
        
        {/* HERO PROMOTION BANNER: DIRECT TAKES-YOU-TO AI.STUDIO APP */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-6 md:p-10 mb-12 overflow-hidden border border-[#38bdf8]/40 shadow-2xl bg-gradient-to-br from-[#0c223d] via-[#071322] to-black"
        >
          {/* Subtle background circuit watermark */}
          <div className="absolute -top-12 -right-12 p-8 opacity-10 pointer-events-none">
            <Terminal className="w-80 h-80 text-[#38bdf8]" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#38bdf8] text-[11px] font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Interactive AI Studio Application</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00ff66]/15 border border-[#00ff66]/40 text-[#00ff66] text-[11px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-ping" />
                  <span>Live App Ready</span>
                </span>
              </div>

              <div className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest mb-1.5 font-bold flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Disciplines & Offerings Sub-Page</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight uppercase leading-[1.05]">
                BUILDS & SOFTWARE LAB
              </h1>

              <p className="text-sm md:text-base text-slate-300 mt-3 leading-relaxed font-normal">
                Disciplines & Offerings BUILDS & SOFTWARE LAB is nested as a dedicated sub-page and connects directly to the official <span className="text-[#38bdf8] font-bold">208 Fence & Gate AI Studio Application</span> (<a href={AI_STUDIO_APP_URL} target="_blank" rel="noopener noreferrer" className="text-[#00ff66] underline hover:text-white transition-colors">{AI_STUDIO_APP_URL}</a>). Access contractor CAD estimations, ESP32 access control firmware, and cloud API automation tools.
              </p>

              {/* Direct App Link Display */}
              <div className="mt-5 p-3.5 rounded-2xl bg-black/70 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2.5 truncate max-w-full">
                  <Globe className="w-4 h-4 text-[#38bdf8] shrink-0" />
                  <span className="text-slate-400 select-none">Target App:</span>
                  <a
                    href={AI_STUDIO_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#38bdf8] hover:text-white underline underline-offset-2 truncate font-semibold"
                  >
                    {AI_STUDIO_APP_URL}
                  </a>
                </div>

                <button
                  onClick={handleCopyAppUrl}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold uppercase tracking-wider border border-slate-700 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedAppUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                      <span className="text-[#00ff66]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Launch Action Card */}
            <div className="w-full lg:w-auto shrink-0 flex flex-col gap-3">
              <a
                href={AI_STUDIO_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full lg:w-72 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#00F2FE] via-[#38bdf8] to-[#00ff66] text-black font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-2xl shadow-cyan-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <span>Launch Software Lab App</span>
                <ArrowUpRight className="w-5 h-5 font-bold" />
              </a>

              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400">
                <span>App ID: {AI_STUDIO_APP_ID.slice(0, 10)}...</span>
                <span className="text-[#00ff66] font-semibold">GCP Hosted</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION HEADER: DISCIPLINES & OFFERINGS / BUILDS & SOFTWARE LAB */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="text-xs font-mono text-[#38bdf8] tracking-widest uppercase mb-2 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Disciplines & Offerings Catalog</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold uppercase leading-[0.95] text-white">
              BUILDS & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93c5fd] via-[#38bdf8] to-[#00ff66]">
                SOFTWARE LAB
              </span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 font-mono mt-3 max-w-2xl leading-relaxed">
              Every discipline is built to contractor standards. Select a category below to filter physical perimeter builds (Western Red Cedar, high-impact vinyl, ornamental iron, automated solar gates) versus cloud software offerings (FenceQuote OS, SmartGate IoT API).
            </p>
          </div>

          {/* Division Filter Chips */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {[
              { label: 'All Offerings (6)', value: 'all' },
              { label: 'Contractor (Builds)', value: 'contractor' },
              { label: 'Developer (Software & IoT)', value: 'developer' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveDivision(tab.value as DivisionType)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeDivision === tab.value
                    ? tab.value === 'developer'
                      ? 'bg-black text-[#00ff66] border border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                      : 'bg-[#1e40af] text-white border border-[#38bdf8]/50 shadow-lg shadow-blue-900/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SERVICES / OFFERINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="group relative rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 bg-slate-900/50 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between cursor-pointer"
            >
              {/* Image Banner */}
              <div className="h-56 relative overflow-hidden bg-slate-950">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1726] via-transparent to-transparent opacity-90" />
                
                {/* Division Badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${
                    service.division === 'developer'
                      ? 'bg-black/80 text-[#00ff66] border-[#00ff66]/50 shadow-[0_0_10px_rgba(0,255,102,0.2)]'
                      : service.division === 'hybrid'
                        ? 'bg-[#0b1e33]/90 text-[#38bdf8] border-[#38bdf8]/50'
                        : 'bg-slate-900/90 text-white border-slate-700'
                  }`}>
                    {service.day}
                  </span>
                </div>

                <div className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/60 text-white group-hover:bg-[#38bdf8] group-hover:text-black transition-colors">
                  <ArrowUpRight className="w-4 h-4 font-bold" />
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono font-semibold uppercase text-slate-400 mb-1">
                    {service.genre}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-[#38bdf8] transition-colors mb-2">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4 font-normal">
                    {service.description}
                  </p>
                </div>

                <div>
                  {service.pricingEstimate && (
                    <div className="text-xs font-mono font-bold text-[#38bdf8] mb-3">
                      {service.pricingEstimate}
                    </div>
                  )}

                  {service.metrics && (
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
                      {service.metrics.map((m, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-black/40 border border-slate-800">
                          <div className="text-[9px] font-mono uppercase text-slate-400">{m.label}</div>
                          <div className="text-xs font-bold text-white mt-0.5">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions for Software Lab items */}
                  {service.division === 'developer' && (
                    <a
                      href={AI_STUDIO_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-4 w-full py-2.5 rounded-xl bg-black hover:bg-slate-900 border border-[#00ff66]/50 text-[#00ff66] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,255,102,0.15)]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open in AI Studio App ↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NESTED REPO LANDING PAGE: ENTERPRISE AI CORE & MULTI-AGENT ORCHESTRATION PLAYBOOK */}
        <div id="repo-landing-page-section" className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00ff66] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
                <span>Nested Repo Landing Page (https://repo-landing-page.ai.studio/)</span>
              </span>
            </div>
            <a
              href="https://github.com/Autonomous-Agentic-Workflows"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[#38bdf8] hover:text-white flex items-center gap-1 transition-colors font-bold"
            >
              <span>Autonomous-Agentic-Workflows GitHub ↗</span>
            </a>
          </div>

          <EnterpriseAICorePlaybook isEmbedded={true} />
        </div>

        {/* COMPARISON ARCHITECTURE MATRIX: CONTRACTOR BUILDS VS SOFTWARE LAB */}
        <div className="rounded-3xl p-6 md:p-8 bg-[#071322] border border-slate-800 mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00ff66] font-bold">
                ENTERPRISE CAPABILITY MATRIX
              </span>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-white mt-0.5">
                Physical Construction Builds vs. Cloud Software Lab
              </h3>
            </div>
            <a
              href={AI_STUDIO_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[#38bdf8] hover:text-white flex items-center gap-1 font-bold"
            >
              <span>Explore AI Studio App (a6911d27) →</span>
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Capability Metric</th>
                  <th className="py-3 px-4 text-[#38bdf8]">Physical Contractor Builds</th>
                  <th className="py-3 px-4 text-[#00ff66]">Software & IoT Lab</th>
                  <th className="py-3 px-4 text-purple-400">Integrated Hybrid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Core Discipline</td>
                  <td className="py-3 px-4">Cedar, Vinyl, Ornamental Iron</td>
                  <td className="py-3 px-4">React, TypeScript, Python, ESP32</td>
                  <td className="py-3 px-4">Automated Driveway Gates & Smart Keypads</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Foundation / Host</td>
                  <td className="py-3 px-4">36" Idaho Frost-Depth Concrete</td>
                  <td className="py-3 px-4">Google Cloud Run & AI Studio Apps</td>
                  <td className="py-3 px-4">Reinforced Monolithic Concrete Pier</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Warranty & SLA</td>
                  <td className="py-3 px-4">5-Year Structural Workmanship</td>
                  <td className="py-3 px-4">99.9% Uptime Cloud API Guarantee</td>
                  <td className="py-3 px-4">5-Year Operator & Frame Warranty</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">External Link</td>
                  <td className="py-3 px-4">
                    <button onClick={onNavigateEstimate} className="text-[#38bdf8] hover:underline cursor-pointer">
                      Interactive Estimator Tool
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <a href={AI_STUDIO_APP_URL} target="_blank" rel="noopener noreferrer" className="text-[#00ff66] hover:underline">
                      ai.studio/apps/a6911d27... ↗
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <a href={AI_STUDIO_APP_URL} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                      IoT Gate Telemetry Portal ↗
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM ACTION CTA BANNER */}
        <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-r from-[#0c223d] via-[#081729] to-[#02140a] border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#38bdf8]">
              Ready to deploy or build?
            </span>
            <h3 className="text-2xl md:text-4xl font-heading font-black text-white mt-1">
              Connect With 208 Fence and Gate LLC
            </h3>
            <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-xl font-normal leading-relaxed">
              Whether you need residential fencing installed on your Treasure Valley property or need to run contractor software on AI Studio, our dual-division team is ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={AI_STUDIO_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#0284c7] hover:from-[#2563eb] hover:to-[#0ea5e9] text-white font-bold text-xs font-mono uppercase tracking-wider shadow-xl transition-all hover:scale-[1.03]"
            >
              <span>Open AI Studio App ↗</span>
            </a>

            <button
              onClick={onNavigateEstimate}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs font-mono uppercase tracking-wider border border-slate-700 transition-all cursor-pointer"
            >
              <span>Back to Estimate Calculator →</span>
            </button>
          </div>
        </div>

      </main>

      {/* DETAIL MODAL (WHEN A SERVICE CARD IS CLICKED) */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#081524] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-slate-950 shrink-0">
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081524] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono">
                    <span className={`px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      selectedService.division === 'developer'
                        ? 'bg-black text-[#00ff66] border-[#00ff66]/50'
                        : 'bg-[#0f2942] text-[#38bdf8] border-[#38bdf8]/40'
                    }`}>
                      {selectedService.day}
                    </span>
                    <span className="text-slate-400">{selectedService.genre}</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                    {selectedService.name}
                  </h3>

                  {selectedService.pricingEstimate && (
                    <div className="text-sm font-mono font-bold text-[#38bdf8] mb-4">
                      {selectedService.pricingEstimate}
                    </div>
                  )}

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {selectedService.description}
                  </p>

                  {selectedService.features && (
                    <div className="mb-6 space-y-1.5 font-mono text-xs text-slate-200">
                      {selectedService.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-800">
                  {selectedService.division === 'developer' ? (
                    <a
                      href={AI_STUDIO_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#00ff66] text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>Open In AI Studio App (a6911d27) ↗</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedService(null);
                        onNavigateEstimate();
                      }}
                      className="w-full py-3 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <span>Request Quote / On-Site Inspection</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedService(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono uppercase tracking-wider border border-slate-800 cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuildsSoftwareLabSubPage;
