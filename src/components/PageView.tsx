import React, { useState } from 'react';
import { 
  Building2, 
  ChevronRight, 
  HelpCircle, 
  Play, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Star,
  ChevronDown,
  Layers
} from 'lucide-react';
import { WebsitePage, PageSection, Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface PageViewProps {
  page: WebsitePage;
  properties: Property[];
  savedIds: string[];
  comparedIds: string[];
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onContactClick: (property: Property, type: 'call' | 'whatsapp') => void;
  onNavigatePage?: (url: string) => void;
}

export const PageView: React.FC<PageViewProps> = ({
  page,
  properties,
  savedIds,
  comparedIds,
  onToggleSave,
  onToggleCompare,
  onSelectProperty,
  onContactClick,
  onNavigatePage
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Helper for dynamic property filtering
  const getFilteredProperties = (filter?: string) => {
    switch (filter) {
      case 'rent':
        return properties.filter(p => p.purpose === 'rent');
      case 'sale':
        return properties.filter(p => p.purpose === 'sale');
      case 'commercial':
        return properties.filter(p => p.category === 'commercial');
      case 'residential':
        return properties.filter(p => p.category === 'residential');
      case 'featured':
        return properties.filter(p => p.featured);
      case 'latest':
        return [...properties].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return properties;
    }
  };

  const renderSection = (section: PageSection) => {
    // Styling values with fallback defaults
    const bg = section.backgroundColor || '#ffffff';
    const textColor = section.textColor || (bg === '#ffffff' || bg === '#f8fafc' ? '#0f172a' : '#ffffff');
    const overlayColor = section.overlayColor || '#000000';
    const overlayOpacity = (section.overlayOpacity ?? 50) / 100;
    const align = section.textAlign || 'center';
    
    const alignClass = align === 'left' ? 'text-left items-start' : align === 'right' ? 'text-right items-end' : 'text-center items-center';
    const paddingYClass = section.paddingY === 'compact' ? 'py-8' : section.paddingY === 'spacious' ? 'py-24' : 'py-16';

    const titleSizeClass = 
      section.headingSize === 'small' ? 'text-xl sm:text-2xl' :
      section.headingSize === 'huge' ? 'text-4xl sm:text-6xl' :
      section.headingSize === 'large' ? 'text-3xl sm:text-5xl' :
      'text-2xl sm:text-4xl';

    switch (section.type) {
      // 1. FULL WIDTH IMAGE BANNER
      case 'full_width_image_banner':
        return (
          <section
            key={section.id}
            className={`relative min-h-[480px] flex items-center justify-center overflow-hidden ${paddingYClass}`}
            style={{ backgroundColor: bg }}
          >
            {section.imageUrl && (
              <img
                src={section.imageUrl}
                alt={section.title || 'Banner'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {/* Custom Overlay */}
            <div
              className="absolute inset-0 transition-opacity"
              style={{
                backgroundColor: overlayColor,
                opacity: overlayOpacity
              }}
            />

            <div className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${alignClass} space-y-6 text-white`}>
              {section.overlayText && (
                <span className="bg-amber-500 text-slate-950 font-black text-xs uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                  {section.overlayText}
                </span>
              )}

              {section.title && (
                <h1 className={`${titleSizeClass} font-extrabold tracking-tight leading-tight`} style={{ color: section.textColor || '#ffffff' }}>
                  {section.title}
                </h1>
              )}

              {section.subtitle && (
                <p className="text-base sm:text-xl font-medium max-w-3xl opacity-90 leading-relaxed" style={{ color: section.textColor || '#e2e8f0' }}>
                  {section.subtitle}
                </p>
              )}

              {section.content && (
                <div className="text-sm sm:text-base opacity-80 max-w-2xl" style={{ color: section.textColor || '#cbd5e1' }}>
                  {section.content}
                </div>
              )}

              {section.buttonText && (
                <button
                  onClick={() => onNavigatePage && onNavigatePage(section.buttonUrl || '/search')}
                  className="px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center space-x-2"
                  style={{
                    backgroundColor: section.buttonColor || '#2563eb',
                    color: section.buttonTextColor || '#ffffff'
                  }}
                >
                  <span>{section.buttonText}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </section>
        );

      // 2. FULL WIDTH VIDEO BANNER
      case 'full_width_video_banner':
        return (
          <section
            key={section.id}
            className={`relative min-h-[500px] flex items-center justify-center overflow-hidden ${paddingYClass}`}
            style={{ backgroundColor: bg }}
          >
            {section.videoUrl && (
              <video
                src={section.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: overlayColor,
                opacity: overlayOpacity
              }}
            />

            <div className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${alignClass} space-y-6 text-white`}>
              {section.overlayText && (
                <span className="bg-blue-500 text-white font-extrabold text-xs uppercase px-3 py-1 rounded-full shadow-md">
                  {section.overlayText}
                </span>
              )}

              {section.title && (
                <h2 className={`${titleSizeClass} font-extrabold tracking-tight`} style={{ color: section.textColor || '#ffffff' }}>
                  {section.title}
                </h2>
              )}

              {section.subtitle && (
                <p className="text-base sm:text-lg opacity-90 max-w-2xl" style={{ color: section.textColor || '#e2e8f0' }}>
                  {section.subtitle}
                </p>
              )}

              {section.buttonText && (
                <button
                  onClick={() => onNavigatePage && onNavigatePage(section.buttonUrl || '/search')}
                  className="px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center space-x-2"
                  style={{
                    backgroundColor: section.buttonColor || '#ffffff',
                    color: section.buttonTextColor || '#0f172a'
                  }}
                >
                  <Play className="w-4 h-4 fill-current mr-1" />
                  <span>{section.buttonText}</span>
                </button>
              )}
            </div>
          </section>
        );

      // 3. IMAGE SLIDESHOW
      case 'image_slideshow':
        const slides = section.slideshowImages && section.slideshowImages.length > 0 
          ? section.slideshowImages 
          : [section.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop'];

        return (
          <section key={section.id} className={`relative ${paddingYClass}`} style={{ backgroundColor: bg }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className={`flex flex-col ${alignClass} space-y-2`}>
                {section.title && (
                  <h2 className={`${titleSizeClass} font-extrabold`} style={{ color: textColor }}>
                    {section.title}
                  </h2>
                )}
                {section.subtitle && (
                  <p className="text-sm sm:text-base opacity-80" style={{ color: textColor }}>
                    {section.subtitle}
                  </p>
                )}
              </div>

              <div className="relative h-96 sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl group border border-slate-200">
                <img
                  src={slides[activeSlide % slides.length]}
                  alt="Slideshow"
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Slideshow Controls */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                  <span className="font-mono text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                    Slide {activeSlide + 1} of {slides.length}
                  </span>
                  <div className="flex space-x-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                          i === activeSlide ? 'bg-amber-400 w-8' : 'bg-white/50 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      // 4. IMAGE WITH TEXT
      case 'image_with_text':
        return (
          <section key={section.id} className={`${paddingYClass}`} style={{ backgroundColor: bg }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
                  <img
                    src={section.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop'}
                    alt={section.title || 'Feature'}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {section.overlayText && (
                    <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-amber-400 font-extrabold text-xs px-3.5 py-1.5 rounded-xl border border-amber-500/30">
                      {section.overlayText}
                    </div>
                  )}
                </div>

                <div className={`space-y-6 ${alignClass}`}>
                  {section.subtitle && (
                    <span className="text-amber-600 font-extrabold text-xs tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full">
                      {section.subtitle}
                    </span>
                  )}

                  {section.title && (
                    <h2 className={`${titleSizeClass} font-extrabold leading-tight`} style={{ color: textColor }}>
                      {section.title}
                    </h2>
                  )}

                  {section.content && (
                    <p className="text-sm sm:text-base leading-relaxed opacity-90" style={{ color: textColor }}>
                      {section.content}
                    </p>
                  )}

                  {section.buttonText && (
                    <button
                      onClick={() => onNavigatePage && onNavigatePage(section.buttonUrl || '/search')}
                      className="px-6 py-3 rounded-2xl font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2"
                      style={{
                        backgroundColor: section.buttonColor || '#2563eb',
                        color: section.buttonTextColor || '#ffffff'
                      }}
                    >
                      <span>{section.buttonText}</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      // 5. TEXT COLUMNS
      case 'text_columns':
        const cols = section.columns && section.columns.length > 0 ? section.columns : [
          { title: 'RERA Compliance', description: 'Every builder listing is verified against state RERA records.', icon: 'ShieldCheck' },
          { title: 'Direct Owner Listings', description: 'Save on brokerage with 100% direct owner homes.', icon: 'Home' },
          { title: 'Transparent Valuation', description: 'Get market-matched price guidance before offering.', icon: 'TrendingUp' }
        ];

        return (
          <section key={section.id} className={`${paddingYClass}`} style={{ backgroundColor: bg }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className={`flex flex-col ${alignClass} space-y-3`}>
                {section.title && (
                  <h2 className={`${titleSizeClass} font-extrabold`} style={{ color: textColor }}>
                    {section.title}
                  </h2>
                )}
                {section.subtitle && (
                  <p className="text-sm sm:text-base max-w-2xl opacity-80" style={{ color: textColor }}>
                    {section.subtitle}
                  </p>
                )}
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-${section.columnsCount || 3} gap-8`}>
                {cols.map((col, idx) => (
                  <div key={idx} className="bg-slate-50/80 border border-slate-200/80 p-6 rounded-3xl space-y-3 shadow-xs hover:border-blue-400 transition-all">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">{col.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{col.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      // 6. RICH TEXT
      case 'rich_text':
        return (
          <section key={section.id} className={`${paddingYClass}`} style={{ backgroundColor: bg }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {section.title && (
                <h2 className={`${titleSizeClass} font-extrabold`} style={{ color: textColor }}>
                  {section.title}
                </h2>
              )}
              {section.subtitle && (
                <p className="text-base font-semibold text-amber-600">{section.subtitle}</p>
              )}
              {section.content && (
                <div className="text-sm sm:text-base leading-relaxed space-y-4 font-normal" style={{ color: textColor }}>
                  {section.content.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      // 7. FAQS ACCORDION
      case 'faqs':
        const faqsList = section.faqs && section.faqs.length > 0 ? section.faqs : [
          { question: 'What documents are required for property booking?', answer: 'PAN Card, Aadhaar Card, Passport-size photographs, and initial token draft.' },
          { question: 'Is home loan assistance provided?', answer: 'Yes, our team connects you directly with top national banks for pre-approved loans.' }
        ];

        return (
          <section key={section.id} className={`${paddingYClass}`} style={{ backgroundColor: bg }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className={`flex flex-col ${alignClass} space-y-2`}>
                {section.title && (
                  <h2 className={`${titleSizeClass} font-extrabold`} style={{ color: textColor }}>
                    {section.title}
                  </h2>
                )}
                {section.subtitle && (
                  <p className="text-xs sm:text-sm opacity-80" style={{ color: textColor }}>
                    {section.subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {faqsList.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full px-6 py-4 text-left font-extrabold text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="flex items-center space-x-2">
                          <HelpCircle className="w-4 h-4 text-blue-600" />
                          <span>{faq.question}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      // 8. DYNAMIC PROPERTIES FEED
      case 'dynamic_properties':
        const filteredProps = getFilteredProperties(section.dynamicFilter);

        return (
          <section key={section.id} className={`${paddingYClass}`} style={{ backgroundColor: bg }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                <div>
                  {section.subtitle && (
                    <span className="text-amber-600 font-extrabold text-xs uppercase tracking-wider">
                      {section.subtitle}
                    </span>
                  )}
                  <h2 className={`${titleSizeClass} font-extrabold text-slate-900 mt-0.5`}>
                    {section.title || 'Listings'}
                  </h2>
                </div>
                {section.buttonText && (
                  <button
                    onClick={() => onNavigatePage && onNavigatePage(section.buttonUrl || '/search')}
                    className="text-blue-600 hover:text-blue-700 font-extrabold text-xs flex items-center cursor-pointer"
                  >
                    <span>{section.buttonText}</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProps.slice(0, 6).map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isSaved={savedIds.includes(prop.id)}
                    isCompared={comparedIds.includes(prop.id)}
                    onToggleSave={onToggleSave}
                    onToggleCompare={onToggleCompare}
                    onSelectProperty={onSelectProperty}
                    onContactClick={onContactClick}
                  />
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {page.sections && page.sections.length > 0 ? (
        page.sections.map(sec => renderSection(sec))
      ) : (
        <div className="max-w-3xl mx-auto py-24 text-center space-y-4 px-4">
          <Layers className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-2xl font-extrabold text-slate-900">{page.title}</h2>
          <p className="text-sm text-slate-500">
            This page has no customizable sections added yet. Go to Admin Dashboard &gt; Pages to customize layout!
          </p>
        </div>
      )}
    </div>
  );
};
