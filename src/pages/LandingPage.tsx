import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { api } from '../../convex/_generated/api';
import { useQuery } from 'convex/react';
import { useClerk } from '@clerk/clerk-react';
import PropertyFeaturesSection from '../components/landing/ImmersivePropertySection';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [activeSection, setActiveSection] = useState('home');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { openSignIn } = useClerk();

  const navigate = useNavigate();

  const propertyData = {
    name: "The Rustic Ridge",
    tagline: "Escape to tranquility in the clouds",
    description: "Perched among the majestic hills of mukteshwar, our guest house offers panoramic views, luxurious comfort, and an unforgettable experience close to nature.",
    features: [
      "Panoramic mountain views from every room",
      "Spacious suites with private balconies",
      "Farm-to-table dining experience",
      "Guided nature trails and hiking",
      "Evening bonfires under the stars"
    ],
    surroundings: [
      "Serene Mukteshwar Temple amid forests",
      "Golden light of the Sunrise",
      "Roads laden with snow"
    ]
  };

  const videoFileStorageIDs = [
    import.meta.env.VITE_CONVEX_VIDEO1,
    import.meta.env.VITE_CONVEX_VIDEO2
  ];

  const imageFileStorageIDs = [
    import.meta.env.VITE_CONVEX_IMAGE1,
    import.meta.env.VITE_CONVEX_IMAGE2,
    import.meta.env.VITE_CONVEX_IMAGE3,
    import.meta.env.VITE_CONVEX_IMAGE4,
    import.meta.env.VITE_CONVEX_IMAGE5,
    import.meta.env.VITE_CONVEX_IMAGE6,
    import.meta.env.VITE_CONVEX_IMAGE7,
    import.meta.env.VITE_CONVEX_IMAGE8,
    import.meta.env.VITE_CONVEX_IMAGE9,
    import.meta.env.VITE_CONVEX_IMAGE10
  ];

  const sorroundingImageStorageIDs = [
    import.meta.env.VITE_CONVEX_IMAGE1,
    import.meta.env.VITE_CONVEX_IMAGE9,
    import.meta.env.VITE_CONVEX_IMAGE10,
    import.meta.env.VITE_CONVEX_IMAGE7,
  ];

  const videoUrls = useQuery(api.files.getBatchFileUrls, { storageIds: videoFileStorageIDs });
  const imageUrls = useQuery(api.files.getBatchFileUrls, { storageIds: imageFileStorageIDs });
  const sorroundingImageUrls = useQuery(api.files.getBatchFileUrls, { storageIds: sorroundingImageStorageIDs });

  const isLoaded = videoUrls && imageUrls && sorroundingImageUrls;

  useEffect(() => {
    const element = document.getElementById(activeSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  // ----------------------------
  // Snowfall Animation Setup
  // ----------------------------
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions once per resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Limit snowflake density for performance
    const flakeCount = Math.floor(window.innerWidth / 5);
    const snowflakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      speedY: Math.random() * 0.5 + 0.5,
      speedX: Math.random() * 0.5 - 0.25,
      wiggle: Math.random() * 0.5,
      wiggleSpeed: Math.random() * 0.01,
    }));

    let angle = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();

        flake.y += flake.speedY;
        flake.x += flake.speedX + Math.sin(angle) * flake.wiggle;
        angle += flake.wiggleSpeed;

        if (flake.y > canvas.height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = canvas.width;
        }
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // ----------------------------
  // Three.js Immersive Background
  // ----------------------------
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    if (mountRef?.current && !mountRef?.current.querySelector('canvas')) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/api/placeholder/1920/1080');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    scene.fog = new THREE.FogExp2(0xb3e5fc, 0.002);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const directionalLight = new THREE.DirectionalLight(0xffc107, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.set(0, 0, 0.1);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.rotateSpeed = 0.3;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    let autoRotate = true;
    const threeAnimate = () => {
      requestAnimationFrame(threeAnimate);
      if (autoRotate) {
        sphere.rotation.y += 0.0005;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    threeAnimate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const pauseRotation = () => {
      autoRotate = false;
      setTimeout(() => {
        autoRotate = true;
      }, 5000);
    };
    renderer.domElement.addEventListener('pointerdown', pauseRotation);

    const currenMountRef = mountRef?.current;

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', pauseRotation);
      if (currenMountRef && currenMountRef != undefined) {
        const canvas = currenMountRef?.querySelector('canvas');
        if (canvas) {
          currenMountRef?.removeChild(canvas);
        }
      }
      renderer.dispose();
    };
  }, []);

  // ----------------------------
  // Throttled Scroll Handler
  // ----------------------------
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollPosition(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans text-white">
      {/* Snowfall Animation */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-30 pointer-events-none"
        style={{ opacity: 0.7 }}
      />

      {/* Three.js Background */}
      <div
        ref={mountRef}
        className="fixed inset-0 z-0"
        style={{ opacity: 0.7 }}
      />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-10 bg-gradient-to-b from-sky-400/30 via-teal-500/40 to-amber-700/70" />

      {/* Navigation */}
      {isLoaded &&
      <>
      <header className="fixed top-0 w-full z-50">
        <nav className="px-6 py-4 backdrop-blur-sm bg-stone-900/80">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold tracking-wider">
              {propertyData.name}
            </div>
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveSection('home')}
                className={`transition-all ${activeSection === 'home' ? 'font-bold' : 'hover:text-gray-300'}`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveSection('property')}
                className={`transition-all ${activeSection === 'property' ? 'font-bold' : 'hover:text-gray-300'}`}
              >
                Your Stay
              </button>
              <button
                onClick={() => setActiveSection('explore')}
                className={`transition-all ${activeSection === 'surroundings' ? 'font-bold' : 'hover:text-gray-300'}`}
              >
                Explore
              </button>
              <button
                onClick={() => openSignIn()}
                className="px-4 py-2 bg-amber-500 text-black rounded-md transition-all hover:bg-amber-400">
                Book Now
              </button>
            </div>
            <button
              className="md:hidden text-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-stone-900/90 py-4 px-6 flex flex-col space-y-4">
              <button onClick={() => { setActiveSection('home'); setMobileMenuOpen(false); }}
                className="py-2 border-b border-stone-800">Home</button>
              <button onClick={() => { setActiveSection('property'); setMobileMenuOpen(false); }}
                className="py-2 border-b border-stone-800">Your Stay</button>
              <button onClick={() => { setActiveSection('explore'); setMobileMenuOpen(false); }}
                className="py-2 border-b border-stone-800">Explore</button>
              <button onClick={() => openSignIn()}
                className="mt-4 px-4 py-2 bg-amber-500 text-black rounded-md">
                Book Now
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-20">
        {/* Hero Section */}
        <section
            id='home'
          className="min-h-screen flex flex-col justify-center items-center px-6 text-center"
          style={{
            transform: `translateY(${scrollPosition * 0.3}px)`,
            opacity: 1 - (scrollPosition * 0.001)
          }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-shadow">
            {propertyData.name}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            {propertyData.tagline}
          </p>
          <button className="px-8 py-3 bg-amber-500 text-black text-lg rounded-md hover:bg-amber-400 transition-all shadow-lg"
          onClick={() => navigate('/rooms')}
          >
            Discover Our Haven
          </button>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* Video Showcase */}
        <section className="min-h-screen relative flex flex-col justify-center items-center px-6">
          <div
            className="max-w-5xl w-full rounded-lg overflow-hidden shadow-2xl transition-all transform"
            style={{
              opacity: Math.min(1, (scrollPosition - 300) * 0.005),
              transform: `scale(${Math.min(1, 0.8 + (scrollPosition - 300) * 0.0005)})`
            }}
          >
            <div className="relative pb-[56.25%] h-0">
              {videoUrls && videoUrls[1] && (
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  autoPlay muted loop playsInline onLoadedData={handleVideoLoad}
                  poster="/api/placeholder/1920/1080"
                >
                  <source src={videoUrls[1].url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {!videoLoaded && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/50">
                  <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
          <div
            className="max-w-3xl mx-auto text-center mt-12"
            style={{
              opacity: Math.min(1, (scrollPosition - 500) * 0.005),
              transform: `translateY(${Math.max(0, 50 - (scrollPosition - 500) * 0.1)}px)`
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Tranquility</h2>
            <p className="text-lg mb-8">{propertyData.description}</p>
          </div>
        </section>
            <PropertyFeaturesSection 
      propertyData={propertyData} 
      imageUrls={imageUrls} 
    />


        {/* Surroundings */}
        <section id="explore" className="py-24 px-6 bg-sky-400/40">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center"
              style={{ opacity: Math.min(1, (scrollPosition - 1800) * 0.005) }}
            >
              Explore The Surroundings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sorroundingImageUrls &&
                propertyData.surroundings.map((item, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg h-64 shadow-xl"
                    style={{
                      opacity: Math.min(1, (scrollPosition - 1800 - index * 100) * 0.005),
                      transform: `translateY(${Math.max(0, 50 - (scrollPosition - 1800 - index * 100) * 0.1)}px)`
                    }}
                  >
                    <img src={sorroundingImageUrls[index].url} alt={`Surrounding ${index + 1}`}
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-600/80 to-transparent flex items-end">
                      <p className="p-6 text-lg">{item}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-16 max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl"
              style={{ opacity: Math.min(1, (scrollPosition - 2000) * 0.003) }}
            >
              <div className="relative pb-[56.25%] h-0">
                {videoUrls && (
                  <video className="absolute top-0 left-0 w-full h-full object-cover"
                    autoPlay muted loop playsInline poster="/api/placeholder/1920/1080"
                  >
                    <source src={videoUrls[0].url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto"
            style={{
              opacity: Math.min(1, (scrollPosition - 2400) * 0.003),
              transform: `scale(${Math.min(1, 0.9 + (scrollPosition - 2400) * 0.0002)})`
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready For Your Mountain Escape?</h2>
            <p className="text-xl mb-8">Book your stay now and immerse yourself in the tranquility of the mountains.</p>
            <button className="px-8 py-4 bg-amber-500 text-black text-lg rounded-md hover:bg-amber-400 transition-all shadow-lg"
            onClick={() => openSignIn()}>
              Book Your Stay
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto relative z-20 bg-stone-900/80 py-12 px-6 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{propertyData.name}</h3>
            <p className="mb-4">Nestled in the heart of the mukteshwar, our retreat offers the perfect escape from the hustle and bustle of everyday life.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="mb-2">Email: info@rusticridge.com</p>
            <p className="mb-2">Phone: +1 (555) 123-4567</p>
            <p>Address: the rustic ridge, Mukteshwar</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">Instagram</a>
              <a href="#" className="hover:text-gray-300">Facebook</a>
              <a href="#" className="hover:text-gray-300">Twitter</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-stone-800 text-center text-sm text-gray-300">
          <p>© {new Date().getFullYear()} The Rustic Ridge. All rights reserved.</p>
        </div>
      </footer>
      </>
}
    </div>
  );
};

export default LandingPage;