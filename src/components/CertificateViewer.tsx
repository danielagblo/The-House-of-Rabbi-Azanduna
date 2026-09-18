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
    <div className="flex flex-col items-center">
      {/* Interactive Certificate Card Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative group cursor-pointer max-w-[280px] sm:max-w-[320px] bg-white p-2.5 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 text-left outline-hidden focus-visible:ring-2 focus-visible:ring-black"
        title="Click to view full Certificate of Incorporation"
      >
        <img
          src={imageSrc}
          alt="Official Certificate of Incorporation - The House of Rabbi Azanduna Ltd"
          className="w-full h-auto rounded-xl object-contain shadow-xs block"
        />
        {/* Hover / Touch Overlay */}
        <div className="absolute inset-0 bg-black/45 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-4 text-center backdrop-blur-2xs pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-md">
            <ZoomIn size={22} className="text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">
            Click to Expand Certificate
          </span>
          <span className="text-[10px] text-gray-200">
            View high-resolution official document
          </span>
        </div>
      </button>

      {/* Subtitle helper link */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-[11px] text-gray-500 hover:text-black mt-3 font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
      >
        <ZoomIn size={13} /> Click to expand high-resolution certificate
      </button>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[92vh] bg-white rounded-2xl p-3 sm:p-5 shadow-2xl flex flex-col items-center cursor-default animate-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 -right-3 bg-black text-white hover:bg-[#ff2d3b] rounded-full p-2.5 shadow-xl cursor-pointer transition-colors z-10"
              aria-label="Close certificate modal"
            >
              <X size={20} />
            </button>

            {/* Certificate High-Res Image */}
            <div className="overflow-auto max-h-[82vh] rounded-xl flex items-center justify-center">
              <img
                src={imageSrc}
                alt="Certificate of Incorporation - The House of Rabbi Azanduna Ltd"
                className="max-h-[82vh] w-auto rounded-lg object-contain shadow-md"
              />
            </div>

            <div className="mt-2 text-center text-[11px] text-gray-500 font-medium">
              The House of Rabbi Azanduna Ltd • Registered under Companies Act, 2019 (Act 992)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
