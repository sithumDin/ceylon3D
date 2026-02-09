import { Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/5 backdrop-blur-md backdrop-saturate-150 border-b border-white/10 shadow-sm' : 'bg-transparent backdrop-blur-sm hover:bg-white/3 hover:backdrop-blur-md backdrop-saturate-150'}`}
      style={{ transform: scrolled ? 'translateY(-6px) rotateX(2deg)' : 'none', transformOrigin: 'center', backfaceVisibility: 'hidden' }}
    >
      <div className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute -left-24 top-0 w-80 h-40 bg-gradient-to-r from-pink-500/30 via-purple-500/20 to-blue-500/20 blur-3xl transform -translate-y-2"></div>
      </div>

      {/* 3D Glass Surface */}
      <div className={`absolute left-1/2 top-2 -z-5 -translate-x-1/2 w-[94%] rounded-xl pointer-events-none transition-all duration-500 ${scrolled ? 'opacity-100 shadow-[0_10px_30px_rgba(2,6,23,0.6)]' : 'opacity-60'}`} style={{ backdropFilter: 'blur(14px) saturate(140%)', WebkitBackdropFilter: 'blur(14px) saturate(140%)' }}>
        <div className="absolute inset-0 rounded-xl border border-white/10 bg-white/4"></div>
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute -left-40 top-0 h-full w-44 bg-gradient-to-r from-white/40 via-transparent to-white/10 opacity-30 transform rotate-12 animate-sheen"></div>
          <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-8px_24px_rgba(2,6,23,0.6)]"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 transform rotate-45 rounded-lg"></div>
            <span className="font-bold text-xl text-white">Ceylone 3D</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            <button onClick={() => scrollToSection('services')} className="text-white/80 hover:text-white transition-colors">
              Solutions
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="text-white/80 hover:text-white transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollToSection('about')} className="text-white/80 hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className="bg-white text-[#1a1a2e] px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:shadow-white/20">
              Sign up
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden border-t border-white/10 ${scrolled ? 'bg-white/4 backdrop-blur-md' : 'bg-[#1a1a2e]'}`}>
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 text-white/80 hover:text-white transition-colors">
              Solutions
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="block w-full text-left py-2 text-white/80 hover:text-white transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-white/80 hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-center bg-white text-[#1a1a2e] px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-white/20">
              Sign up
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sheen {
          0% { transform: translateX(-120%) rotate(12deg); opacity: 0; }
          40% { opacity: 0.35; }
          100% { transform: translateX(120%) rotate(12deg); opacity: 0; }
        }

        .animate-sheen {
          animation: sheen 4s linear infinite;
        }
      `}</style>
    </nav>
  );
}
