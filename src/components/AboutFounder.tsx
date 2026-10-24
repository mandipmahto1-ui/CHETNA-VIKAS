import React, { useState } from 'react';
import {
  Award,
  Briefcase,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Globe,
  Languages,
  Mail,
  MapPin,
  Phone,
  Send,
  Terminal,
  UserCheck,
  Users,
} from 'lucide-react';
import { triggerConfetti } from '../utils/pdfHelpers';

interface AboutFounderProps {
  onBackToHome: () => void;
}

export const AboutFounder: React.FC<AboutFounderProps> = ({ onBackToHome }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const founderPhone = '+919162979357';
  const founderPhoneDisplay = '+91 9162979357';
  const founderEmail = 'mandipmahto1@gmail.com';
  const misToolUrl = 'https://gramjyoti.netlify.app';

  const copyEmail = () => {
    navigator.clipboard.writeText(founderEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(founderPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setFormSubmitted(true);
    triggerConfetti();
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 4500);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group"
        >
          <span className="p-1.5 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
            ←
          </span>
          Back to PDF Studio & Tools
        </button>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Professional Profile & Documentation</span>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-xl shadow-indigo-100/40 p-6 sm:p-10 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-pink-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-cyan-200/30 via-emerald-200/20 to-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
          {/* Avatar Container with Gradient Border */}
          <div className="relative shrink-0">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl p-1.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-purple-200">
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-100 relative group">
                <img
                  src="/founder.jpg"
                  alt="Mandip Kumar Mahto"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              </div>
            </div>
            {/* Verified Badge */}
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md border-2 border-white">
              <UserCheck className="w-3.5 h-3.5" />
              Verified Profile
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold">
                <Terminal className="w-3.5 h-3.5" />
                Technical & Documentation Officer | Web Developer
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                MANDIP KUMAR MAHTO
              </h1>
              <p className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Technical & Documentation Officer | Web Developer | MIS & Data Systems
              </p>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
              Computer Science diploma holder with hands-on experience in web development, MIS and data systems, graphic design, and technical documentation in the NGO sector. Skilled at building responsive websites, automating reporting workflows in Excel, and managing government portal data with full compliance. Seeking a role where technical skills and a detail-oriented, results-driven approach can support organisational growth.
            </p>

            {/* Quick Contact & Location Pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
              {/* Phone Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/80">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                <a href={`tel:${founderPhone}`} className="hover:text-indigo-600">
                  {founderPhoneDisplay}
                </a>
                <button
                  onClick={copyPhone}
                  className="ml-1 p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
                  title="Copy Phone"
                >
                  {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Email Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/80">
                <Mail className="w-3.5 h-3.5 text-rose-500" />
                <a href={`mailto:${founderEmail}`} className="hover:text-rose-600">
                  {founderEmail}
                </a>
                <button
                  onClick={copyEmail}
                  className="ml-1 p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
                  title="Copy Email"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Thakurgangti, Godda, Jharkhand</span>
              </div>

              {/* MIS Tool Pill */}
              <a
                href={misToolUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>MIS Tool: gramjyoti.netlify.app</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Experience Section */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-xl shadow-slate-100 p-6 sm:p-10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">
                Work Experience
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Technical & Documentation Officer
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              Gram Jyoti NGO | Jharkhand
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Jan 2026 – Present
            </span>
          </div>
        </div>

        {/* Experience Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Responsive NGO Websites',
              desc: 'Designed, developed, and deployed responsive NGO websites using HTML, CSS, and modern UI/UX principles, significantly improving online outreach.',
            },
            {
              title: 'Government Portal Operations (Rakshak Portal)',
              desc: 'Managed end-to-end data operations on the Rakshak Government Portal, ensuring 100% compliance with reporting requirements.',
            },
            {
              title: 'Excel Workflow Automation',
              desc: 'Engineered advanced Excel automation systems for organisational reporting, reducing manual data entry time by over 40%.',
            },
            {
              title: 'Graphic & Visual Communication',
              desc: 'Created high-impact visual communication materials (banners, brochures, infographics) using CorelDraw and other design tools.',
            },
            {
              title: 'Social Media Management',
              desc: 'Managed and grew official social media platforms, driving digital engagement for social advocacy campaigns.',
            },
            {
              title: 'Documentation & Correspondence',
              desc: 'Maintained official documentation, records, and administrative correspondence for the organisation with high accuracy.',
            },
            {
              title: 'Staff Digital Training',
              desc: 'Provided technical training and hands-on support to staff on computer applications, data entry, and modern digital tools.',
            },
            {
              title: 'Web Suite Development',
              desc: 'Pioneered custom client-side web utilities such as Chetna Vikas PDF Studio for privacy-first, zero-server document handling.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-200/70 transition-all flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                ✓
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Projects Section */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-xl shadow-slate-100 p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
              Flagship Implementations
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Key Projects
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project 1: Gram Jyoti MIS Tool */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-white border border-emerald-200/80 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                  Azim Premji Foundation Programme
                </span>
                <span className="text-xs font-semibold text-emerald-700">Netlify Cloud</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Gram Jyoti - Azim Premji Foundation MIS Tool
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designed, developed, and deployed a web-based Management Information System (MIS) for Gram Jyoti's programme supported by Azim Premji Foundation, hosted on Netlify.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Digitised programme data collection, monitoring, and reporting, replacing manual registers and scattered spreadsheets with a single accessible platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Enabled programme staff to record activities, track progress, and prepare reports quickly and accurately across field locations.</span>
                </li>
              </ul>
            </div>

            <a
              href="https://gramjyoti.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm shadow-emerald-200"
            >
              <span>Visit Live MIS Tool (gramjyoti.netlify.app)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Project 2: Chetna Vikas PDF Studio */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-white border border-indigo-200/80 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-600 text-white shadow-xs">
                  All-in-One PDF Suite
                </span>
                <span className="text-xs font-semibold text-indigo-700">100% Client-Side</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Chetna Vikas Online PDF Studio
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A browser-native productivity suite combining the features of iLovePDF and Sejda. Engineered with zero-server architecture so that documents never leave user devices.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Interactive tools for Merge, Split, Image-to-PDF, Watermark, Rotation, Metadata Editor, and Document Compression.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Zero server upload latency, military-grade client memory isolation, and 100% free accessibility without paywalls.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onBackToHome}
              className="mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm shadow-indigo-200"
            >
              <span>Explore PDF Studio Tools</span>
              <Globe className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Technical Skills & Soft Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Technical Skills */}
        <div className="lg:col-span-2 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-xl shadow-slate-100 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Technical Skills & Competencies</h2>
              <p className="text-xs text-slate-500">Programming, Web Stack, Portals & Data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Programming */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                Programming Languages
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['C', 'C++', 'Python'].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-indigo-100/70 text-indigo-800 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Web Development */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                Web Development & UI/UX
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Responsive UI/UX',
                  'Front-End Development',
                  'HTML',
                  'CSS',
                  'Website Deployment (Netlify)',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-purple-100/70 text-purple-800 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Software & Tools */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                Software & Graphic Tools
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['MS Word', 'MS Excel', 'PowerPoint', 'CorelDraw', 'Video Editing'].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-800 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Data & Portals */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                Data, MIS & Government Portals
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'MIS & Data Management',
                  'Excel Automation',
                  'Rakshak Govt Portal',
                  'Computer Networking',
                  'IT Infrastructure',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-amber-100/70 text-amber-800 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Soft Skills & Languages */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-xl shadow-slate-100 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Soft Skills & Languages</h2>
              <p className="text-xs text-slate-500">Communication & Teamwork</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Core Soft Skills
              </span>
              <div className="space-y-2 text-xs font-medium text-slate-700">
                {[
                  'Professional Communication',
                  'Presentation & Training',
                  'Technical Documentation',
                  'Staff Training & Capacity Building',
                  'Team Collaboration & Leadership',
                ].map((s) => (
                  <div key={s} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-pink-500 font-bold">✓</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <Languages className="w-3.5 h-3.5 text-indigo-600" />
                <span>Languages</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">English</span>
                  <span className="text-slate-500 font-medium">Read, Write</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">Hindi</span>
                  <span className="text-slate-500 font-medium">Read, Write, Speak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Education & Academic Excellence */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-xl shadow-slate-100 p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
              Academic Background
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Education & Qualifications
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* B.Tech */}
          <div className="p-6 rounded-3xl bg-slate-50/80 hover:bg-purple-50/40 border border-slate-200/80 transition-all space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-extrabold text-xs">
                  Pursuing
                </span>
                <span className="text-xs font-semibold text-slate-400">2025 – 2028</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                B.Tech in Computer Science & Engineering
              </h3>
              <p className="text-xs font-semibold text-purple-700">
                Dumka Engineering College | Jharkhand University of Technology
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Advanced undergraduate engineering studies in computer science, system architectures, algorithms, and software development.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-purple-700">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              Current Degree
            </div>
          </div>

          {/* Diploma */}
          <div className="p-6 rounded-3xl bg-slate-50/80 hover:bg-amber-50/40 border border-slate-200/80 transition-all space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
                  93.00% Score
                </span>
                <span className="text-xs font-semibold text-slate-400">2022 – 2025</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Diploma in Computer Science & Engineering
              </h3>
              <p className="text-xs font-semibold text-indigo-700">
                BITT Polytechnic | Jharkhand University of Technology
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Extensive technical coursework in programming, data structures, web systems, operating systems, and computer hardware & networking.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <span>✓ Completed with Honors</span>
            </div>
          </div>

          {/* 10th */}
          <div className="p-6 rounded-3xl bg-slate-50/80 hover:bg-indigo-50/40 border border-slate-200/80 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 font-extrabold text-xs">
                  84.40% Score
                </span>
                <span className="text-xs font-semibold text-slate-400">2021 – 2022</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Matriculation (10th)
              </h3>
              <p className="text-xs font-semibold text-indigo-700">
                High School Kharkhodia | JAC Jharkhand
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Foundational secondary education with distinction across Mathematics, Science, and Social Studies.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <span>✓ Distinction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Message Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-xl shadow-slate-100 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                Reach Out Directly
              </span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Get in Touch with Mandip
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Available for web development roles, MIS system consultations, technical documentation, or NGO data automation projects.
              </p>
            </div>

            <div className="space-y-3">
              {/* Phone */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase block">
                      Direct Mobile
                    </span>
                    <a
                      href={`tel:${founderPhone}`}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {founderPhoneDisplay}
                    </a>
                  </div>
                </div>
                <button
                  onClick={copyPhone}
                  className="px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  {copiedPhone ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Email */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-700 uppercase block">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${founderEmail}`}
                      className="text-sm font-bold text-slate-900 hover:text-rose-600 transition-colors"
                    >
                      {founderEmail}
                    </a>
                  </div>
                </div>
                <button
                  onClick={copyEmail}
                  className="px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  {copiedEmail ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Location */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">
                    Location & Base
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    Thakurgangti, Godda, Jharkhand
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
            📍 <strong>Ready to Support:</strong> Seeking roles where technical skills, automation in Excel, and results-driven MIS management support organizational impact.
          </div>
        </div>

        {/* Quick Contact Form */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-xl shadow-slate-100 p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
              Send a Message
            </span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Contact Mandip Kumar Mahto
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Leave your inquiry or opportunity note below.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-emerald-900">Message Received!</h4>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                Thank you for reaching out! Mandip Kumar Mahto has received your note and will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="mt-2 text-xs font-semibold text-emerald-700 underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Topic / Purpose
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="Job Opportunity">Job Opportunity / Hiring</option>
                  <option value="Web Development Project">Website / Front-End Project</option>
                  <option value="MIS & Excel Automation">MIS & Excel Automation Consultation</option>
                  <option value="PDF Studio Feature">Chetna Vikas PDF Tool Suggestion</option>
                  <option value="General Inquiry">General Connect / Collaboration</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding your requirement or opportunity..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Send Message to Mandip
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
