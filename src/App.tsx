/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import content from './content.json';

// Define the Project interface locally
interface Project {
  id: number;
  title: string;
  image: string;
  vibeColor: string;
  size: 'small' | 'medium' | 'large';
  description?: string;
  year?: string;
  role?: string;
  tags?: string[];
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVibe, setActiveVibe] = useState('#f3f4f6'); // Default light gray
  const [cursorVariant, setCursorVariant] = useState('default');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Mouse position for custom cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for cursor
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  // Load data from imported JSON
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Simulating network delay for "CMS" feel
        await new Promise(resolve => setTimeout(resolve, 800));
        // Use the imported content directly
        setProjects(content as Project[]);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load content:", error);
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Offset by half the cursor size (32px / 2 = 16)
      mouseX.set(e.clientX - 24);
      mouseY.set(e.clientY - 24);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [mouseX, mouseY]);

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] cursor-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen transition-colors duration-700 ease-in-out overflow-hidden font-sans selection:bg-black selection:text-white cursor-none"
      style={{ backgroundColor: activeVibe }}
      animate={{ backgroundColor: activeVibe }}
    >
      {/* Cute Custom Cursor - Smiling Star */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-50 mix-blend-difference text-[#FFF500]"
        style={{ x: cursorX, y: cursorY }}
        variants={{
          default: { scale: 1, rotate: 0 },
          hover: { scale: 1.5, rotate: 180 }
        }}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-lg">
          {/* Star Shape */}
          <path d="M50 0L61.2257 34.5492H97.5528L68.1636 55.9017L79.3893 90.4509L50 69.0983L20.6107 90.4509L31.8364 55.9017L2.44717 34.5492H38.7743L50 0Z" />
          {/* Cute Face (using mix-blend-difference, these holes will appear as the background color) */}
          <circle cx="35" cy="45" r="5" fill="black" />
          <circle cx="65" cy="45" r="5" fill="black" />
          <path d="M35 60 Q50 70 65 60" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-40 mix-blend-difference text-white">
        <div className="text-xl font-bold tracking-tighter">RRW</div>
        <div className="text-sm font-mono">EST. 2024</div>
      </nav>

      {/* Hero Section */}
      <motion.header 
        className="h-screen flex flex-col justify-center items-center relative overflow-hidden"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        <div className="w-full overflow-hidden whitespace-nowrap py-4">
          <motion.h1 
            className="text-[15vw] font-black leading-none tracking-tighter text-black uppercase"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 10 }}
          >
            RIZKY RIFAY WORLD — RIZKY RIFAY WORLD —
          </motion.h1>
        </div>
        <div className="w-full overflow-hidden whitespace-nowrap py-4 absolute bottom-20 rotate-2 opacity-50">
           <motion.h1 
            className="text-[8vw] font-bold leading-none tracking-tighter text-transparent stroke-black uppercase"
            style={{ WebkitTextStroke: "2px black" }}
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
          >
            CREATIVE — DEVELOPER — DESIGNER — ARTIST —
          </motion.h1>
        </div>
      </motion.header>

      {/* Gallery Section */}
      <section className="px-4 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              setActiveVibe={setActiveVibe}
              setCursorVariant={setCursorVariant}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center mix-blend-difference text-white">
        <p className="font-mono text-sm">RIZKY RIFAY</p>
      </footer>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedProject(null)}
            />
            
            {/* Modal Content */}
            <motion.div 
              className="bg-white rounded-3xl overflow-hidden w-full max-w-5xl max-h-[90vh] relative z-10 flex flex-col md:flex-row shadow-2xl cursor-auto"
              layoutId={`project-${selectedProject.id}`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 bg-white/50 hover:bg-white p-2 rounded-full backdrop-blur-sm transition-colors cursor-none"
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 rounded-full border border-black/10 text-xs font-mono uppercase tracking-wider">
                      {selectedProject.year}
                    </span>
                    <span className="px-3 py-1 rounded-full border border-black/10 text-xs font-mono uppercase tracking-wider">
                      {selectedProject.role}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight uppercase leading-none">
                    {selectedProject.title}
                  </h2>
                  
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                    {selectedProject.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-10">
                    {selectedProject.tags?.map((tag, i) => (
                      <span key={i} className="text-sm font-bold text-gray-400">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button 
                    className="group flex items-center gap-2 text-xl font-bold hover:gap-4 transition-all cursor-none"
                    onMouseEnter={() => setCursorVariant("hover")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    VIEW LIVE PROJECT <ArrowUpRight className="w-6 h-6" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProjectCard({ project, index, setActiveVibe, setCursorVariant, onClick }: any) {
  // Determine grid span based on size
  const spanClass = {
    small: "md:col-span-1 md:row-span-1",
    medium: "md:col-span-2 md:row-span-1",
    large: "md:col-span-2 md:row-span-2",
  }[project.size as 'small' | 'medium' | 'large'];

  return (
    <motion.div
      className={`relative rounded-3xl overflow-hidden cursor-none group ${spanClass}`}
      layoutId={`project-${project.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring", 
        bounce: 0.4, 
        duration: 0.8, 
        delay: index * 0.1 
      }}
      whileHover={{ 
        scale: 0.98, 
        rotate: Math.random() * 2 - 1,
        transition: { duration: 0.2 }
      }}
      onMouseEnter={() => {
        setActiveVibe(project.vibeColor);
        setCursorVariant("hover");
      }}
      onMouseLeave={() => {
        setActiveVibe('#f3f4f6');
        setCursorVariant("default");
      }}
    >
      <img 
        src={project.image} 
        alt={project.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
        <div className="flex justify-end">
          <div className="bg-white/90 p-3 rounded-full backdrop-blur-sm">
            <ArrowUpRight className="w-6 h-6 text-black" />
          </div>
        </div>
        <div>
          <h3 className="text-white text-3xl font-bold tracking-tight">{project.title}</h3>
          <p className="text-white/80 font-mono text-sm mt-2">EXPLORE PROJECT</p>
        </div>
      </div>
    </motion.div>
  );
}

