export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
  
  * {
    font-family: 'Outfit', sans-serif;
  }
  
  /* Custom Scrollbar for Suggestions */
  .max-h-80::-webkit-scrollbar {
    width: 6px;
  }
  
  .max-h-80::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .max-h-80::-webkit-scrollbar-thumb {
    background: #c7d2fe;
    border-radius: 10px;
  }
  
  .max-h-80::-webkit-scrollbar-thumb:hover {
    background: #a5b4fc;
  }
  
  .hero-card {
    background: linear-gradient(135deg, #A8B5E8 0%, #C5AADE 50%, #E8C5D8 100%);
    position: relative;
    overflow: hidden;
  }
  
  .hero-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(ellipse 800px 400px at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 50%),
      radial-gradient(circle 300px at 70% 60%, rgba(255,255,255,0.15) 0%, transparent 50%);
  }
  
  .mountain-layer-1 {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to bottom, transparent 0%, rgba(107, 114, 176, 0.3) 100%);
    clip-path: polygon(0% 100%, 0% 60%, 15% 55%, 30% 45%, 45% 50%, 60% 40%, 75% 55%, 85% 50%, 100% 60%, 100% 100%);
    filter: blur(1px);
  }
  
  .mountain-layer-2 {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 45%;
    background: linear-gradient(to bottom, rgba(91, 111, 184, 0.4) 0%, rgba(91, 111, 184, 0.6) 100%);
    clip-path: polygon(0% 100%, 0% 70%, 20% 55%, 35% 40%, 50% 50%, 65% 35%, 80% 50%, 95% 60%, 100% 70%, 100% 100%);
  }
  
  .grass-layer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
  }
  
  .grass-blade {
    position: absolute;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to top, rgba(75, 85, 150, 0.4), transparent);
    transform-origin: bottom;
  }
  
  .sun {
    position: absolute;
    top: 30%;
    right: 20%;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(255, 253, 240, 0.8) 0%, rgba(255, 240, 200, 0.3) 50%, transparent 70%);
    border-radius: 50%;
    filter: blur(2px);
  }
  
  .moon {
    position: absolute;
    top: 25%;
    right: 15%;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle at 30% 30%, #FFF9E6 0%, #E8E0D0 100%);
    border-radius: 50%;
    box-shadow: inset -20px -10px 0px rgba(200, 195, 180, 0.3);
  }
  
  .star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    animation: twinkle 3s ease-in-out infinite;
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  
  .stat-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
  
  .chart-tab {
    position: relative;
    padding: 8px 0;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #6B7280;
    font-weight: 500;
  }
  
  .chart-tab.active {
    color: #5B6FB8;
  }
  
  .chart-tab::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #5B6FB8;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  .chart-tab.active::after {
    transform: scaleX(1);
  }
`;