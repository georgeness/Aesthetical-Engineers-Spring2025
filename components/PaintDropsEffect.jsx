"use client";
import React, { useState, useEffect, useRef } from 'react';

// Paint Drop Component
function PaintDrop({ id, position, color, lifespan = 12000 }) {
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(0.4);
  const [pos, setPos] = useState(position);
  
  useEffect(() => {
    // Gradually decrease opacity and increase scale for a realistic paint spread effect
    const opacityInterval = setInterval(() => {
      setOpacity(prev => Math.max(0, prev - 0.005)); // Slower fade
      setScale(prev => Math.min(prev + 0.005, 1.1)); // Slower spread
      
      // Simulate slow dripping with slight downward movement
      if (Math.random() > 0.7) { // Only move sometimes for a more natural effect
        setPos(prev => ({
          x: prev.x + (Math.random() * 0.6 - 0.3), // Slight horizontal movement -0.3 to +0.3
          y: prev.y + (Math.random() * 0.5)        // Slow downward drip
        }));
      }
    }, 100);
    
    // Remove after lifespan
    const cleanup = setTimeout(() => {
      clearInterval(opacityInterval);
    }, lifespan);
    
    return () => {
      clearInterval(opacityInterval);
      clearTimeout(cleanup);
    };
  }, [lifespan]);
  
  // Don't render if fully transparent
  if (opacity <= 0) return null;
  
  return (
    <div 
      className={`paint-drop ${color}`} 
      style={{
        left: pos.x + 'px',
        top: pos.y + 'px',
        opacity: opacity,
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: `${4 + Math.random() * 3}px`, // Varied size for more realism
        height: `${4 + Math.random() * 3}px`,
        boxShadow: `0 0 ${Math.round(scale * 2)}px rgba(0,0,0,0.2)` // Subtle shadow effect
      }}
    />
  );
}

// Error Boundary Class Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PaintDropsEffect error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Render nothing if there's an error
    }

    return this.props.children;
  }
}

// Global Paint Manager Component
function PaintManager() {
  const [drops, setDrops] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentColorRef = useRef('red');
  const lastPosRef = useRef({ x: 0, y: 0 });
  const drawingThrottleRef = useRef(0);
  
  // Create paint drops at the given position
  const createPaintDrop = (x, y, isDrawing = false) => {
    try {
      // For drawing mode, throttle the creation of drops
      if (isDrawing) {
        const now = Date.now();
        if (now - drawingThrottleRef.current < 30) {
          return; // Skip if we're creating drops too quickly while drawing
        }
        drawingThrottleRef.current = now;
      }
      
      const colors = ['red', 'blue', 'yellow'];
      // When drawing, maintain the same color unless it's a new click
      const color = isDrawing ? currentColorRef.current : colors[Math.floor(Math.random() * colors.length)];
      
      if (!isDrawing) {
        // Store the new color for drawing
        currentColorRef.current = color;
      }
      
      // Get a random number of drops (1-2)
      const numDrops = isDrawing ? 1 : Math.floor(Math.random() * 2) + 1;
      
      // Create multiple drops with slight position variations
      for (let i = 0; i < numDrops; i++) {
        const offset = {
          x: Math.random() * 4 - 2, // -2 to +2 pixels
          y: Math.random() * 4 - 2  // -2 to +2 pixels
        };
        
        const newDrop = {
          id: Date.now() + i,
          position: { 
            x: x + offset.x, 
            y: y + offset.y 
          },
          color: color
        };
        
        setDrops(prev => [...prev, newDrop]);
        
        // Remove drop after lifespan to avoid memory issues
        setTimeout(() => {
          setDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
        }, 12000); // Longer lifespan for slower fade
      }
    } catch (err) {
      console.error("Error creating paint drops:", err);
    }
  };
  
  // Handle mouse events
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    // Handle regular click (not part of drawing)
    const handleClick = (e) => {
      if (!isDrawing) {
        createPaintDrop(e.clientX, e.clientY);
      }
    };
    
    // Start drawing on mouse down
    const handleMouseDown = (e) => {
      setIsDrawing(true);
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      createPaintDrop(e.clientX, e.clientY);
    };
    
    // Draw as mouse moves
    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      
      // Calculate distance from last point
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If distance is significant, draw points along the path
      if (distance >= 6) {
        // Create intermediary points for a smoother line
        const steps = Math.floor(distance / 4);
        for (let i = 0; i <= steps; i++) {
          const ratio = i / steps;
          const x = lastPosRef.current.x + dx * ratio;
          const y = lastPosRef.current.y + dy * ratio;
          createPaintDrop(x, y, true);
        }
        
        // Update the last position
        lastPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };
    
    // Stop drawing
    const handleMouseUp = () => {
      setIsDrawing(false);
    };
    
    // Touch events for mobile
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        setIsDrawing(true);
        lastPosRef.current = { x: touch.clientX, y: touch.clientY };
        createPaintDrop(touch.clientX, touch.clientY);
        e.preventDefault(); // Prevent scrolling while drawing
      }
    };
    
    const handleTouchMove = (e) => {
      if (!isDrawing || e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const dx = touch.clientX - lastPosRef.current.x;
      const dy = touch.clientY - lastPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance >= 6) {
        const steps = Math.floor(distance / 4);
        for (let i = 0; i <= steps; i++) {
          const ratio = i / steps;
          const x = lastPosRef.current.x + dx * ratio;
          const y = lastPosRef.current.y + dy * ratio;
          createPaintDrop(x, y, true);
        }
        
        lastPosRef.current = { x: touch.clientX, y: touch.clientY };
      }
      
      e.preventDefault(); // Prevent scrolling while drawing
    };
    
    const handleTouchEnd = () => {
      setIsDrawing(false);
    };
    
    // Register all event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
    
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
      
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDrawing]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {drops.map(drop => (
        <PaintDrop 
          key={drop.id} 
          id={drop.id}
          position={drop.position} 
          color={drop.color} 
        />
      ))}
    </div>
  );
}

// Wrapped export with error boundary
export default function PaintDropsEffect() {
  return (
    <ErrorBoundary>
      <PaintManager />
    </ErrorBoundary>
  );
} 