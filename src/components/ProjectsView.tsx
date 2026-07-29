import React from 'react';
import { Building2, ShieldCheck, Calendar, MapPin, Download, CheckCircle2, ChevronRight } from 'lucide-react';
import { BuilderProject } from '../types';

interface ProjectsViewProps {
  projects: BuilderProject[];
  onOpenInquiryModal: (title: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onOpenInquiryModal }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Banner Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <span className="text-blue-600 font-extrabold text-xs tracking-wider uppercase">
            RERA Approved Developer Projects
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            New Launch Builder Projects
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Explore exclusive township developments, high-rise luxury towers, and gated villa communities directly from premier developers.
          </p>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
            {/* Image Banner */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={proj.coverImage}
                alt={proj.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

              {/* RERA Tag */}
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                RERA: {proj.reraNumber}
              </div>

              {/* Bottom Details Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold text-blue-400">{proj.builderName}</p>
                <h3 className="text-2xl font-extrabold tracking-tight">{proj.name}</h3>
                <p className="text-xs text-slate-200 flex items-center mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-blue-400" />
                  {proj.locality}, {proj.city}
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {proj.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Price Starting</span>
                  <span className="font-black text-sm text-blue-600">{proj.startingPriceFormatted}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Possession</span>
                  <span className="text-slate-900 font-bold">{proj.possessionDate}</span>
                </div>
              </div>

              {/* Configurations */}
              <div className="flex flex-wrap gap-1.5">
                {proj.configurations.map((cfg) => (
                  <span key={cfg} className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    {cfg}
                  </span>
                ))}
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => onOpenInquiryModal(proj.name)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Inquire Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert(`Downloading Brochure for ${proj.name}`)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">Brochure</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
