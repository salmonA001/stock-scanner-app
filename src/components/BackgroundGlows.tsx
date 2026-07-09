import React from 'react';

export const BackgroundGlows: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Glow Blob 1: Cyan/Blue - Top Left */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[130px] animate-blob" />
      
      {/* Glow Blob 2: Indigo/Purple - Middle Right */}
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[150px] animate-blob-delayed" />
      
      {/* Glow Blob 3: Pink/Rose - Bottom Left */}
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[130px] animate-blob-slow" />
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  );
};
