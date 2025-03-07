import React, { useEffect, useRef } from 'react';

export const Squares = ({ 
  children, 
  speed = 0.5, 
  squareSize = 40, 
  direction = 'diagonal', 
  borderColor = 'white', 
  hoverFillColor = '#222' 
}) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let squares = [];
    let mouseX = 0;
    let mouseY = 0;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initialize squares
    const initSquares = () => {
      squares = [];
      const cols = Math.ceil(canvas.width / squareSize);
      const rows = Math.ceil(canvas.height / squareSize);
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          squares.push({
            x: i * squareSize,
            y: j * squareSize,
            size: squareSize,
           
            hovered: false
          });
        }
      }
    };
    
    // Handle mouse movement
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    // Draw squares
    const drawSquares = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      squares.forEach(square => {
        // Check if square is near mouse
        const dx = mouseX - (square.x + square.size / 2);
        const dy = mouseY - (square.y + square.size / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        square.hovered = distance < squareSize * 3;
        
        // Move squares based on direction
        if (direction === 'diagonal' || direction === 'up') {
          square.y -= speed;
        }
        if (direction === 'diagonal' || direction === 'right') {
          square.x += speed;
        }
        if (direction === 'down') {
          square.y += speed;
        }
        if (direction === 'left') {
          square.x -= speed;
        }
        
        // Reset position if out of bounds
        if (square.x > canvas.width) square.x = -squareSize;
        if (square.y < -squareSize) square.y = canvas.height;
        if (square.x < -squareSize) square.x = canvas.width;
        if (square.y > canvas.height) square.y = -squareSize;
        
        // Draw square with white border
        ctx.beginPath();
        ctx.rect(square.x, square.y, square.size, square.size);
        
        if (square.hovered) {
          // Fill with hover color when hovered
          ctx.fillStyle = hoverFillColor;
          ctx.fill();
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1.5; // Thicker border when hovered
          ctx.stroke();
        } else {
          // Just white border when not hovered
          ctx.strokeStyle = borderColor;
          ctx.globalAlpha = square.opacity;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    };
    
    // Animation loop
    const animate = () => {
      drawSquares();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initialize
    setCanvasDimensions();
    initSquares();
    window.addEventListener('resize', () => {
      setCanvasDimensions();
      initSquares();
    });
    window.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [speed, squareSize, direction, borderColor, hoverFillColor]);
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
