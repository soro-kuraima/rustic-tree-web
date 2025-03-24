import React, { useRef, useEffect } from 'react';

const PageContainer = ({ children, showHeader = true, showFooter = true }) => {
  const canvasRef = useRef(null);

  // Snowfall animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const snowflakes = [];
    const createSnowflakes = () => {
      const flakeCount = Math.floor(window.innerWidth / 2.5);
      for (let i = 0; i < flakeCount; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          speedY: Math.random() * 1 + 0.9,
          speedX: Math.random() * 0.5 - 0.25,
          wiggle: Math.random() * 0.5,
          wiggleSpeed: Math.random() * 0.02,
        });
      }
    };
    createSnowflakes();

    let angle = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snowflakes.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();

        flake.y += flake.speedY;
        flake.x += flake.speedX + Math.sin(angle) * flake.wiggle;
        angle += flake.wiggleSpeed;

        if (flake.y > canvas.height) {
          flake.y = -10;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = canvas.width;
        }
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden font-sans text-white">
      {/* Snowfall animation canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-30 pointer-events-none"
        style={{ opacity: 0.7 }}
      />

      {/* Gradient overlay blending sky blue, teal, and amber */}
      <div className="fixed inset-0 z-10 bg-gradient-to-b from-sky-400/30 via-teal-500/40 to-amber-700/70" />

      {/* Header */}
      {showHeader && (
        <header className="fixed top-0 w-full z-50">
          <nav className="px-6 py-4 backdrop-blur-sm bg-stone-900/80">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold tracking-wider">
                Mountain Haven Retreat
              </div>
              {/* Add your navigation items here */}
            </div>
          </nav>
        </header>
      )}

      {/* Main page content */}
      <main className="relative z-20 flex-grow">
        {children}
      </main>

      {/* Footer that always sits at the bottom */}
      {showFooter && (
        <footer className="mt-auto relative z-20 bg-stone-900/80 py-12 px-6 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto text-center text-sm text-gray-300">
            <p>© {new Date().getFullYear()} Mountain Haven Retreat. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PageContainer;
