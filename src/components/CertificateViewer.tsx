import React, { useState, useEffect } from 'react';
import { ZoomIn, X } from 'lucide-react';

interface CertificateViewerProps {
  imageSrc: string;
}

export const CertificateViewer: React.FC<CertificateViewerProps> = ({ imageSrc }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Interactive Certificate Card Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative group cursor-pointer w-full max-w-[340px] sm:max-w-[400px] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-left outline-hidden overflow-hidden block border border-gray-200/60"
        title="Click to view full Certificate of Incorporation"
      >
        <img
          src={imageSrc}
          alt="Official Certificate of Incorporation - The House of Rabbi Azanduna Ltd"
          className="w-full h-auto rounded-2xl object-contain block group-hover:scale-[1.02] transition-transform duration-300"
        />
        {/* Hover / Touch Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 text-white p-4 text-center backdrop-blur-2xs pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center shadow-lg">
            <ZoomIn size={26} className="text-white" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider">
            Click to Expand Certificate
          </span>
          <span className="text-xs text-gray-200">
            View full-size high-resolution document
          </span>
        </div>
      </button>

      {/* Subtitle helper link */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-xs text-gray-600 hover:text-black mt-3.5 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
      >
        <ZoomIn size={14} className="text-[#ff2d3b]" /> Click to open large full-screen certificate
      </button>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[96vh] flex flex-col items-center justify-center cursor-default animate-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 sm:-top-4 sm:-right-4 md:-right-8 bg-black/80 hover:bg-[#ff2d3b] text-white rounded-full p-2.5 sm:p-3 shadow-2xl cursor-pointer transition-colors z-20 border border-white/30 backdrop-blur-md"
              aria-label="Close certificate modal"
            >
              <X size={22} />
            </button>

            {/* Certificate High-Res Image - Extra Large */}
            <div className="overflow-auto max-h-[94vh] max-w-full rounded-2xl flex items-center justify-center p-1">
              <img
                src={imageSrc}
                alt="Certificate of Incorporation - The House of Rabbi Azanduna Ltd"
                className="max-h-[92vh] w-auto max-w-[92vw] sm:max-w-[85vw] md:max-w-3xl rounded-xl object-contain shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
