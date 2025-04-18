"use client";
import React, { Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PointerLockControls, Text, Html, Plane, Box, Sphere, 
  useHelper, Stats, Environment,
  PerspectiveCamera, useTexture, SpotLight, Preload
} from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid, SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { create } from 'zustand';

// --- Paintings Store ---
const usePaintingsStore = create((set) => ({
  paintings: [
    {
      id: 1,
      title: "Matrix 125",
      dimensions: "24x36 inches",
      medium: "Oil on canvas",
      notes: "A vibrant play of colors.",
      price: "$2000",
      image: "/images/Matrix 125.jpg",
      size: [2.4, 3.6] // Approx size in meters for 3D scene
    },
    {
      id: 2,
      title: "Matrix 141",
      dimensions: "30x40 inches",
      medium: "Acrylic",
      notes: "Abstract and modern.",
      price: "$2500",
      image: "/images/Matrix 141.jpg",
      size: [3.0, 3.8]
    },
    {
      id: 3,
      title: "Matrix 127a",
      dimensions: "20x30 inches",
      medium: "Mixed Media",
      notes: "Intriguing abstract work.",
      price: "$2200",
      image: "/images/Matrix 127a.jpg",
      size: [2.0, 3.0]
    },
    {
      id: 4,
      title: "Matrix 128",
      dimensions: "18x24 inches",
      medium: "Oil on canvas",
      notes: "Bold and colorful composition.",
      price: "$1800",
      image: "/images/Matrix 128.jpg",
      size: [1.8, 2.4]
    },
    {
      id: 5,
      title: "Matrix 135",
      dimensions: "36x48 inches",
      medium: "Acrylic",
      notes: "Large scale abstract work.",
      price: "$3000",
      image: "/images/Matrix 135.jpg",
      size: [3.6, 4.8]
    },
    {
      id: 6,
      title: "Matrix 143",
      dimensions: "24x36 inches",
      medium: "Oil",
      notes: "Deep emotions captured on canvas.",
      price: "$2500",
      image: "/images/Matrix 143.jpg",
      size: [2.4, 3.6]
    },
    {
      id: 7,
      title: "Matrix 145",
      dimensions: "30x40 inches",
      medium: "Acrylic",
      notes: "Vibrant brush strokes create an energetic feel.",
      price: "$2700",
      image: "/images/Matrix 145.jpg",
      size: [3.0, 4.0]
    },
    {
      id: 8,
      title: "Matrix 146",
      dimensions: "20x30 inches",
      medium: "Watercolor",
      notes: "Subtle hues and gentle textures.",
      price: "$2100",
      image: "/images/Matrix 146.jpg",
      size: [2.0, 3.0]
    },
    {
      id: 9,
      title: "Matrix 148",
      dimensions: "24x36 inches",
      medium: "Oil on canvas",
      notes: "Intricate details and rich textures.",
      price: "$2600",
      image: "/images/Matrix 148.jpg",
      size: [2.4, 3.6]
    },
    {
      id: 10,
      title: "Matrix Flag",
      dimensions: "18x24 inches",
      medium: "Acrylic",
      notes: "An iconic symbol reinterpreted in art.",
      price: "$2300",
      image: "/images/Matrix Flag.jpg",
      size: [1.8, 2.4]
    },
    {
      id: 11,
      title: "Pythagoras 44",
      dimensions: "30x30 inches",
      medium: "Mixed Media",
      notes: "Mathematical beauty meets artistic expression.",
      price: "$2900",
      image: "/images/Pythagoras 44.jpg",
      size: [3.0, 3.0]
    },
    {
      id: 12,
      title: "Red Richard",
      dimensions: "36x48 inches",
      medium: "Oil",
      notes: "Striking composition with bold colors.",
      price: "$3200",
      image: "/images/Red Richard.jpg",
      size: [3.6, 4.8]
    },
  ],
  selectedPainting: null,
  setSelectedPainting: (painting) => set({ selectedPainting: painting }),
  favorites: [],
  loadFavorites: () => {
    if (typeof window === 'undefined') return;
    const favs = localStorage.getItem('favorites');
    set({ favorites: favs ? JSON.parse(favs) : [] });
  },
  toggleFavorite: (paintingId) => set(state => {
    const newFavorites = state.favorites.includes(paintingId)
      ? state.favorites.filter(id => id !== paintingId)
      : [...state.favorites, paintingId];
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
    return { favorites: newFavorites };
  }),
  isFavorite: (paintingId) => {
    const state = usePaintingsStore.getState();
    return state.favorites.includes(paintingId);
  }
}));

// --- 3D Components ---

// Signature image on back wall
function SignatureImage() {
  const texture = useTexture('/images/other/signature.png');
  const size = [2.8, 1.6]; // Smaller size to avoid touching paintings
  
  // Use anisotropic filtering for better quality at angles
  useEffect(() => {
    if (texture) {
      texture.anisotropy = 16; // Max anisotropy for sharper texture at angles
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
    }
  }, [texture]);
  
  return (
    <group position={[0.5, 5.0, -15.75]}>
      <Plane 
        args={size} 
        position={[0, 0, 0]}
      >
        <meshBasicMaterial 
          map={texture} 
          transparent={true}
          opacity={0.85}
          side={THREE.DoubleSide}
          depthWrite={false} // Prevents z-fighting
        />
      </Plane>
    </group>
  );
}

function PaintingDetails({ painting, visible, position }) {
  const [hovered, setHovered] = useState(false);
  
  return visible ? (
    <group position={position}>
      <Html
        transform
        distanceFactor={2}
        position={[0, 0, 0.1]}
        style={{
          width: '300px',
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0.8,
          transition: 'all 0.3s'
        }}
      >
        <div className="bg-black bg-opacity-80 p-4 rounded-lg text-white transform -translate-x-1/2 -translate-y-1/2">
          <h3 className="text-lg font-bold mb-2">{painting.title}</h3>
          <p className="text-sm mb-1">{painting.medium}</p>
          <p className="text-sm mb-2">{painting.dimensions}</p>
          <p className="text-lg font-semibold">{painting.price}</p>
        </div>
      </Html>
    </group>
  ) : null;
}

function Painting({ painting, position, rotationY }) {
  const { setSelectedPainting } = usePaintingsStore();
  const texture = useTexture(painting.image);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const ref = useRef();
  const frameRef = useRef();
  const spotlightRef = useRef();
  
  // Optional spotlight helper (uncomment for development)
  // useHelper(spotlightRef, THREE.SpotLightHelper, "red");

  // Show details after slight delay on hover
  useEffect(() => {
    let timer;
    if (hovered) {
      timer = setTimeout(() => {
        setShowDetails(true);
      }, 500);
    } else {
      setShowDetails(false);
    }
    return () => clearTimeout(timer);
  }, [hovered]);

  useFrame(() => {
    if (ref.current) {
      // Hover animation
      ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, hovered ? 1.05 : 1, 0.1);
      ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, hovered ? 1.05 : 1, 0.1);
    }
  });

  return (
    <group position={position} rotation-y={rotationY}>
      {/* Canvas with standard material (no distortion effect) */}
      <Plane
        ref={ref}
        args={[painting.size[0], painting.size[1]]}
        onClick={(e) => { 
          e.stopPropagation(); 
          setSelectedPainting(painting); 
          setActive(!active); 
        }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { setHovered(false); }}
        position={[0, painting.size[1] / 2 + 0.5, 0.05]}
      >
        <meshStandardMaterial 
          map={texture} 
          side={THREE.DoubleSide} 
          metalness={0.1} 
          roughness={0.8}
          color="#FFFFFF"
        />
      </Plane>
      
      {/* Frame with static appearance */}
      <Box 
        ref={frameRef}
        args={[painting.size[0] + 0.1, painting.size[1] + 0.1, 0.05]} 
        position={[0, painting.size[1] / 2 + 0.5, 0.02]}
      >
        <meshStandardMaterial color={hovered ? "#444444" : "#222222"} metalness={0.5} roughness={0.2} />
      </Box>
      
      {/* Title Plaque with static appearance */}
      <Text
        position={[0, 0.15, 0.1]}
        color={hovered ? "#FFFFFF" : "#EEEEEE"}
        fontSize={0.15}
        maxWidth={painting.size[0] * 0.8}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#333333"
      >
        {painting.title}
      </Text>
      
      {/* Popup details card */}
      <PaintingDetails 
        painting={painting} 
        visible={showDetails} 
        position={[0, painting.size[1] + 0.7, 0.2]}
      />
      
      {/* Spotlight for painting with color change on hover */}
      <SpotLight
        ref={spotlightRef}
        position={[0, painting.size[1] * 1.2 + 0.6, 1.2]}
        angle={0.5}
        penumbra={0.8}
        intensity={hovered ? 5 : 2}
        distance={8}
        castShadow
        color={hovered ? "#FFF5E0" : "#FFFAF0"}
        target-position={[0, painting.size[1] / 2 + 0.5, 0.05]}
      />
    </group>
  );
}

// Chair component for the tables
function Chair({ position, rotation = [0, 0, 0], color = "#111111" }) {
  // Chair dimensions
  const seatWidth = 0.45;
  const seatHeight = 0.45;
  const seatDepth = 0.45;
  const legThickness = 0.05;
  const backHeight = 0.5;
  
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <Box 
        args={[seatWidth, 0.05, seatDepth]} 
        position={[0, seatHeight, 0]} 
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.1} 
          roughness={0.3}
          clearcoat={0.5}
          clearcoatRoughness={0.15}
          reflectivity={0.2}
        />
      </Box>
      
      {/* Chair back */}
      <Box 
        args={[seatWidth, backHeight, 0.05]} 
        position={[0, seatHeight + backHeight/2, -seatDepth/2 + 0.025]} 
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.1} 
          roughness={0.3}
          clearcoat={0.5}
          clearcoatRoughness={0.15}
          reflectivity={0.2}
        />
      </Box>
      
      {/* Chair legs */}
      {[
        [-seatWidth/2 + legThickness/2, 0, -seatDepth/2 + legThickness/2],
        [seatWidth/2 - legThickness/2, 0, -seatDepth/2 + legThickness/2],
        [seatWidth/2 - legThickness/2, 0, seatDepth/2 - legThickness/2],
        [-seatWidth/2 + legThickness/2, 0, seatDepth/2 - legThickness/2]
      ].map((legPos, i) => (
        <Box
          key={i}
          args={[legThickness, seatHeight, legThickness]}
          position={[legPos[0], seatHeight/2, legPos[2]]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial 
            color="#444444" 
            metalness={0.6} 
            roughness={0.2}
            clearcoat={0.3}
            reflectivity={0.7}
          />
        </Box>
      ))}
    </group>
  );
}

// Table with chairs component
function DiningSet({ position = [0, 0, 0], rotation = [0, Math.PI / 4, 0], scale = 1, chairColor = "#111111" }) {
  // Try to load texture, but fallback gracefully if it fails
  const tableTexture = useTexture('/images/textures/8.jpg', 
    (texture) => {
      console.log('Table texture loaded');
    },
    (error) => {
      console.error('Error loading table texture:', error);
    }
  );
  
  // Set up texture parameters
  useEffect(() => {
    if (tableTexture) {
      try {
        tableTexture.wrapS = THREE.RepeatWrapping;
        tableTexture.wrapT = THREE.RepeatWrapping;
        tableTexture.repeat.set(1, 1);
      } catch (err) {
        console.error('Error setting up table texture:', err);
      }
    }
  }, [tableTexture]);
  
  // Table dimensions - simulating a square table
  const tableWidth = 2 * scale;
  const tableHeight = 0.8 * scale;
  const tableDepth = 2 * scale;
  const legThickness = 0.1 * scale;
  
  // Chair positions around table
  const chairPositions = [
    [0, 0, -tableDepth/2 - 0.3*scale], // North
    [0, 0, tableDepth/2 + 0.3*scale],  // South
    [-tableWidth/2 - 0.3*scale, 0, 0], // West
    [tableWidth/2 + 0.3*scale, 0, 0],  // East
    [-tableWidth/2 - 0.15*scale, 0, -tableDepth/2 - 0.15*scale], // Northwest
    [tableWidth/2 + 0.15*scale, 0, -tableDepth/2 - 0.15*scale],  // Northeast
    [-tableWidth/2 - 0.15*scale, 0, tableDepth/2 + 0.15*scale],  // Southwest
    [tableWidth/2 + 0.15*scale, 0, tableDepth/2 + 0.15*scale]    // Southeast
  ];
  
  // Chair rotations (facing the table)
  const chairRotations = [
    [0, 0, 0],           // North - facing south
    [0, Math.PI, 0],     // South - facing north
    [0, Math.PI/2, 0],   // West - facing east
    [0, -Math.PI/2, 0],  // East - facing west
    [0, Math.PI/4, 0],   // Northwest
    [0, -Math.PI/4, 0],  // Northeast
    [0, 3*Math.PI/4, 0], // Southwest
    [0, -3*Math.PI/4, 0] // Southeast
  ];
  
  return (
    <group position={position} rotation={rotation}>
      {/* Table */}
      <group>
        {/* Table top */}
        <Box 
          args={[tableWidth, 0.1 * scale, tableDepth]} 
          position={[0, tableHeight, 0]} 
          castShadow 
          receiveShadow
        >
          <meshPhysicalMaterial 
            map={tableTexture} 
            color="#FCFCFC" 
            metalness={0.1} 
            roughness={0.2}
            clearcoat={0.5}
            clearcoatRoughness={0.15}
            reflectivity={0.5}
            envMapIntensity={1.0}
            onUpdate={(material) => {
              // Provide fallback if texture is missing
              if (!material.map) {
                material.color = new THREE.Color("#FCFCFC");
              }
            }}
          />
        </Box>
        
        {/* Table legs */}
        {[
          [-tableWidth/2 + legThickness/2, 0, -tableDepth/2 + legThickness/2],
          [tableWidth/2 - legThickness/2, 0, -tableDepth/2 + legThickness/2],
          [tableWidth/2 - legThickness/2, 0, tableDepth/2 - legThickness/2],
          [-tableWidth/2 + legThickness/2, 0, tableDepth/2 - legThickness/2]
        ].map((legPos, i) => (
          <Box
            key={i}
            args={[legThickness, tableHeight, legThickness]}
            position={[legPos[0], tableHeight/2, legPos[2]]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial 
              color="#F8F8F8" 
              metalness={0.1} 
              roughness={0.3}
              clearcoat={0.3}
              reflectivity={0.5}
            />
          </Box>
        ))}
        
        {/* Table frame */}
        <Box 
          args={[tableWidth, 0.05 * scale, legThickness]} 
          position={[0, tableHeight - 0.1 * scale, -tableDepth/2 + legThickness/2]} 
          castShadow
        >
          <meshPhysicalMaterial 
            color="#F8F8F8" 
            metalness={0.1} 
            roughness={0.3}
            clearcoat={0.3}
            reflectivity={0.5}
          />
        </Box>
        
        <Box 
          args={[tableWidth, 0.05 * scale, legThickness]} 
          position={[0, tableHeight - 0.1 * scale, tableDepth/2 - legThickness/2]} 
          castShadow
        >
          <meshPhysicalMaterial 
            color="#F8F8F8" 
            metalness={0.1} 
            roughness={0.3}
            clearcoat={0.3}
            reflectivity={0.5}
          />
        </Box>
        
        <Box 
          args={[legThickness, 0.05 * scale, tableDepth]} 
          position={[-tableWidth/2 + legThickness/2, tableHeight - 0.1 * scale, 0]} 
          castShadow
        >
          <meshPhysicalMaterial 
            color="#F8F8F8" 
            metalness={0.1} 
            roughness={0.3}
            clearcoat={0.3}
            reflectivity={0.5}
          />
        </Box>
        
        <Box 
          args={[legThickness, 0.05 * scale, tableDepth]} 
          position={[tableWidth/2 - legThickness/2, tableHeight - 0.1 * scale, 0]} 
          castShadow
        >
          <meshPhysicalMaterial 
            color="#F8F8F8" 
            metalness={0.1} 
            roughness={0.3}
            clearcoat={0.3}
            reflectivity={0.5}
          />
        </Box>
      </group>
      
      {/* Chairs */}
      {chairPositions.map((pos, i) => (
        <Chair 
          key={i} 
          position={pos} 
          rotation={chairRotations[i]} 
          color={chairColor} 
        />
      ))}
      
      {/* Decorative item on the table */}
      <Sphere 
        args={[0.1 * scale, 32, 32]} 
        position={[0, tableHeight + 0.15 * scale, 0]}
      >
        <meshPhysicalMaterial 
          color="#E0E0E0" 
          metalness={0.9} 
          roughness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={1.0}
          envMapIntensity={2.0}
        />
      </Sphere>
    </group>
  );
}

// Optimized museum environment
function MuseumEnvironment() {
  const floorMaterial = useRef();
  const wallMaterial = useRef();
  const floorTexture = useTexture('/images/textures/8.jpg');
  
  const wallHeight = 6;
  const galleryWidth = 22;
  const galleryDepth = 32;
  
  // Create basic materials with better properties
  useEffect(() => {
    if (floorMaterial.current && floorTexture) {
      try {
        floorMaterial.current.map = floorTexture;
        floorMaterial.current.map.wrapS = THREE.RepeatWrapping;
        floorMaterial.current.map.wrapT = THREE.RepeatWrapping;
        floorMaterial.current.map.repeat.set(12, 12); // More repeats for more detailed marble
        floorMaterial.current.needsUpdate = true;
        
        // Crystal quartz marble-like properties
        floorMaterial.current.metalness = 0.6; // High metalness for crystal-like shine
        floorMaterial.current.roughness = 0.2; // Very low roughness for polished look
        floorMaterial.current.envMapIntensity = 1.5; // Enhance reflections
        floorMaterial.current.clearcoat = 0.8; // Add clearcoat for polished marble look
        floorMaterial.current.clearcoatRoughness = 0.1; // Make the clearcoat slightly rough for realism
        
        // Add a subtle blue/white tint to simulate crystal quartz
        floorMaterial.current.color = new THREE.Color("#E8EEFF");
      } catch (err) {
        console.error('Error applying texture:', err);
        // Fallback to solid color if texture fails
        if (floorMaterial.current) {
          floorMaterial.current.color = new THREE.Color("#E8EEFF");
          floorMaterial.current.metalness = 0.6;
          floorMaterial.current.roughness = 0.2;
        }
      }
    } else if (floorMaterial.current) {
      // Fallback if texture didn't load
      floorMaterial.current.color = new THREE.Color("#E8EEFF");
      floorMaterial.current.metalness = 0.6;
      floorMaterial.current.roughness = 0.2;
    }
    
    if (wallMaterial.current) {
      wallMaterial.current.color = new THREE.Color("#F0F0F5");
      wallMaterial.current.metalness = 0.1;
      wallMaterial.current.roughness = 0.9;
    }
  }, [floorTexture]);

  return (
    <group>
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* Floor */}
      <Plane 
        args={[galleryWidth, galleryDepth]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <meshPhysicalMaterial ref={floorMaterial} color="#FFFFFF" />
      </Plane>
      
      {/* Walls */}
      <Box 
        args={[galleryWidth, wallHeight, 0.2]} 
        position={[0, wallHeight / 2, -galleryDepth / 2]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial ref={wallMaterial} color="#F0F0F5" />
      </Box>
      
      <Box 
        args={[galleryWidth, wallHeight, 0.2]} 
        position={[0, wallHeight / 2, galleryDepth / 2]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial ref={wallMaterial} color="#F0F0F5" />
      </Box>
      
      <Box 
        args={[galleryDepth, wallHeight, 0.2]} 
        position={[-galleryWidth / 2, wallHeight / 2, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial ref={wallMaterial} color="#F0F0F5" />
      </Box>
      
      <Box 
        args={[galleryDepth, wallHeight, 0.2]} 
        position={[galleryWidth / 2, wallHeight / 2, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial ref={wallMaterial} color="#F0F0F5" />
      </Box>
      
      {/* Ceiling */}
      <Plane
        args={[galleryWidth, galleryDepth]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, wallHeight, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#E8E8E8" side={THREE.DoubleSide} />
      </Plane>
      
      {/* Signature on the back wall */}
      <SignatureImage />
      
      {/* Add only one dining set to the museum (removed the center one) */}
      <DiningSet 
        position={[8, 0, -11]} 
        rotation={[0, Math.PI / 6, 0]} 
        scale={1} 
        chairColor="#F5F5F5"
      />
      
      {/* Ambient Light Fixtures */}
      {[-galleryWidth/4, galleryWidth/4].map((x, i) => (
        <group key={i} position={[x, wallHeight - 0.1, 0]}>
          <Sphere args={[0.2, 16, 16]}>
            <meshBasicMaterial color="#FFFAF0" />
          </Sphere>
          <pointLight 
            position={[0, -0.2, 0]} 
            intensity={1.2} 
            distance={galleryWidth/2} 
            decay={1.5} 
            color="#FFFAF0" 
          />
        </group>
      ))}
      
      {/* Floor Spotlights for crystal effect */}
      {[
        [-galleryWidth/3, 0], [0, 0], [galleryWidth/3, 0],
        [-galleryWidth/4, galleryDepth/3], [galleryWidth/4, galleryDepth/3],
        [-galleryWidth/4, -galleryDepth/3], [galleryWidth/4, -galleryDepth/3]
      ].map((pos, i) => (
        <SpotLight
          key={i}
          position={[pos[0], wallHeight - 0.5, pos[1]]}
          angle={0.5}
          distance={wallHeight * 2}
          intensity={0.8}
          penumbra={0.8}
          color="#FFFFFF"
          castShadow={false}
          target-position={[pos[0], 0, pos[1]]}
        />
      ))}
    </group>
  );
}

// Advanced player controller with physics
function Player() {
  const speed = 6;
  const jumpForce = 5;
  const controls = useRef();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const jumping = useRef(false);
  const height = useRef(1.7); // Player height
  
  // Advanced movement control
  const keys = useRef({
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
    Space: false,
    ShiftLeft: false
  });

  // Event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (keys.current[e.code] !== undefined) keys.current[e.code] = true;
    };
    
    const handleKeyUp = (e) => {
      if (keys.current[e.code] !== undefined) keys.current[e.code] = false;
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop for physics
  useFrame((state, delta) => {
    if (!controls.current?.isLocked) {
      velocity.current.set(0, 0, 0);
      return;
    }

    // Calculate movement speed (sprint if shift is held)
    const currentSpeed = keys.current.ShiftLeft ? speed * 1.8 : speed;
    const moveSpeed = currentSpeed * delta;

    // Get movement direction
    direction.current.z = Number(keys.current.KeyW) - Number(keys.current.KeyS);
    direction.current.x = Number(keys.current.KeyD) - Number(keys.current.KeyA);
    direction.current.normalize();

    // Apply movement
    if (keys.current.KeyW || keys.current.KeyS) {
      velocity.current.z = direction.current.z * moveSpeed;
    }
    
    if (keys.current.KeyA || keys.current.KeyD) {
      velocity.current.x = direction.current.x * moveSpeed;
    }

    // Apply physics (friction)
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;
    
    // Move player
    controls.current.moveRight(velocity.current.x);
    controls.current.moveForward(velocity.current.z);

    // Collision detection
    const playerPos = controls.current.getObject().position;
    const galleryWidth = 21;  // Slightly smaller than environment
    const galleryDepth = 31;
    
    playerPos.x = Math.max(-galleryWidth / 2, Math.min(galleryWidth / 2, playerPos.x));
    playerPos.z = Math.max(-galleryDepth / 2, Math.min(galleryDepth / 2, playerPos.z));
    playerPos.y = height.current; // Keep height constant
  });

  return <PointerLockControls ref={controls} selector="#canvas-container" />;
}

// -- Sound Manager --
function SoundManager() {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const ambientSound = useRef(null);
  
  useEffect(() => {
    // Create ambient sound only once audio context is allowed
    const initializeAudio = () => {
      if (audioInitialized) return;
      
      try {
        const audio = new Audio('/audio/museum_ambience.mp3');
        audio.loop = true;
        audio.volume = 0.2;
        ambientSound.current = audio;
        
        // Play ambient sound
        ambientSound.current.play().catch(e => console.log('Audio play prevented until user interaction'));
        setAudioInitialized(true);
      } catch (err) {
        console.error('Audio initialization failed:', err);
      }
    };
    
    // Add click listener to initialize audio
    const handleClick = () => {
      initializeAudio();
      document.removeEventListener('click', handleClick);
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
      if (ambientSound.current) {
        ambientSound.current.pause();
        ambientSound.current = null;
      }
    };
  }, [audioInitialized]);
  
  return null;
}

// Paint Drop component for click effects
function PaintDrop({ position, color, lifespan = 8000 }) {
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(0.8);
  
  useEffect(() => {
    // Gradually decrease opacity and increase scale
    const opacityInterval = setInterval(() => {
      setOpacity(prev => Math.max(0, prev - 0.01));
      setScale(prev => Math.min(prev + 0.02, 1.5));
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
  
  const dropStyle = {
    position: 'absolute',
    left: position.x + 'px',
    top: position.y + 'px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color,
    opacity: opacity,
    transform: `translate(-50%, -50%) scale(${scale})`,
    transition: 'transform 0.5s ease-out',
    pointerEvents: 'none',
    zIndex: 1000
  };
  
  return <div style={dropStyle} />;
}

// Paint Manager Component
function PaintManager() {
  const [drops, setDrops] = useState([]);
  
  // Handle mouse clicks to create paint drops
  useEffect(() => {
    const colors = ['#e63946', '#2a9d8f', '#e9c46a', '#264653', '#f4a261'];
    
    const handleClick = (e) => {
      // Only add drops in the canvas area
      if (e.target.id === 'canvas-container' || e.target.closest('#canvas-container')) {
        const newDrop = {
          id: Date.now(),
          position: { x: e.clientX, y: e.clientY },
          color: colors[Math.floor(Math.random() * colors.length)]
        };
        
        setDrops(prev => [...prev, newDrop]);
        
        // Remove drop after lifespan to avoid memory issues
        setTimeout(() => {
          setDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
        }, 8000);
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  
  return (
    <div className="paint-drops">
      {drops.map(drop => (
        <PaintDrop 
          key={drop.id} 
          position={drop.position} 
          color={drop.color} 
        />
      ))}
    </div>
  );
}

// --- Main Museum Component ---
const InteractiveMuseum = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('museumDarkMode');
      return saved ? JSON.parse(saved) : true; // Default to true (dark mode)
    }
    return true;
  });
  const controls = useRef();
  const containerRef = useRef();
  const { paintings, selectedPainting, setSelectedPainting, favorites, loadFavorites, toggleFavorite, isFavorite } = usePaintingsStore();

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
    
    // Add event listeners for controls
    const handleLock = () => setIsLocked(true);
    const handleUnlock = () => setIsLocked(false);
    
    // Update key handlers
    const handleKeyDown = (e) => {
      if (e.code === 'KeyP') setShowStats(prev => !prev);
      // Change H key to navigate home
      if (e.code === 'KeyH') {
        // Navigate to home page
        window.location.href = '/';
      }
      if (e.code === 'KeyF') toggleFullscreen();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Need slight delay for controls ref to be available
    const timer = setTimeout(() => {
      if (controls.current) {
        controls.current.addEventListener('lock', handleLock);
        controls.current.addEventListener('unlock', handleUnlock);
      }
    }, 100);

    // Fullscreen change detection
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controls.current) {
        controls.current.removeEventListener('lock', handleLock);
        controls.current.removeEventListener('unlock', handleUnlock);
      }
    };
  }, [loadFavorites]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('museumDarkMode', JSON.stringify(darkMode));
    }
  }, [darkMode]);

  // Toggle fullscreen function
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Enter gallery directly
  const enterGallery = () => {
    setShowWelcome(false);
    // Slight delay to ensure welcome screen is hidden before requesting pointer lock
    setTimeout(() => {
      document.getElementById("canvas-container").click();
    }, 50);
  };

  // Define wall segments for painting placement
  const wallSegments = useMemo(() => [
    // Back Wall (split into segments)
    { pos: [-5, 0, -15.9], rot: 0, width: 10 }, 
    { pos: [5, 0, -15.9], rot: 0, width: 10 },
    // Right Wall
    { pos: [10.9, 0, -8], rot: -Math.PI / 2, width: 15 },
    { pos: [10.9, 0, 8], rot: -Math.PI / 2, width: 15 },
    // Left Wall
    { pos: [-10.9, 0, -8], rot: Math.PI / 2, width: 15 },
    { pos: [-10.9, 0, 8], rot: Math.PI / 2, width: 15 },
  ], []);

  // Distribute paintings evenly on walls
  const distributePaintings = useCallback(() => {
    const paintingsPerSegment = Math.ceil(paintings.length / wallSegments.length);
    let paintingCursor = 0;
    const paintingElements = [];
    
    wallSegments.forEach((segment, segmentIndex) => {
      const segmentPaintings = paintings.slice(
        paintingCursor,
        paintingCursor + paintingsPerSegment
      );
      paintingCursor += segmentPaintings.length;
      
      // Layout paintings on this segment
      const spacing = 1.8;
      const totalWidth = segmentPaintings.reduce((sum, p) => sum + p.size[0] + spacing, -spacing);
      let currentOffset = -totalWidth / 2 + (segmentPaintings[0]?.size[0] / 2 || 0);
      
      segmentPaintings.forEach((painting, index) => {
        // Calculate position
        const positionVector = new THREE.Vector3(currentOffset, 0, 0);
        
        // Apply wall rotation
        const wallRotation = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0), 
          segment.rot
        );
        positionVector.applyQuaternion(wallRotation);
        
        // Add wall position offset
        positionVector.add(new THREE.Vector3(...segment.pos));
        
        // Add painting to elements
        paintingElements.push(
          <Painting
            key={painting.id}
            painting={painting}
            position={positionVector}
            rotationY={segment.rot}
          />
        );
        
        // Update offset for next painting
        const halfWidth = painting.size[0] / 2;
        const nextPainting = segmentPaintings[index + 1];
        const nextHalfWidth = nextPainting ? nextPainting.size[0] / 2 : 0;
        currentOffset += halfWidth + spacing + nextHalfWidth;
      });
    });
    
    return paintingElements;
  }, [paintings, wallSegments]);

  // Get background color based on dark mode
  const getBgClass = () => {
    return darkMode 
      ? "bg-gray-900" // Dark mode
      : "bg-gray-100"; // Light mode
  };

  // Get text color based on dark mode
  const getTextClass = () => {
    return darkMode 
      ? "text-white" // Dark mode
      : "text-gray-900"; // Light mode
  };

  return (
    <div 
      id="canvas-container" 
      ref={containerRef}
      className={`relative w-full h-screen ${getBgClass()} overflow-hidden rounded-xl`}
    >
      {/* Paint drop effects layer */}
      <PaintManager />
      
      {/* Performance Stats (Toggle with 'P' key) */}
      {showStats && <Stats className="absolute top-0 left-0" />}
      
      {/* Controls UI */}
      <div className="absolute top-4 right-4 z-20 flex space-x-2">
        {/* Fullscreen Toggle */}
        <motion.button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-black bg-opacity-40 text-white hover:bg-opacity-60 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            {isFullscreen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            )}
          </svg>
        </motion.button>
        
        {/* Dark Mode Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-black bg-opacity-40 text-white hover:bg-opacity-60 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </motion.button>
        
        {/* Help Button */}
        <motion.button
          onClick={() => setShowHelp(prev => !prev)}
          className="p-2 rounded-full bg-black bg-opacity-40 text-white hover:bg-opacity-60 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Help (H)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </motion.button>
      </div>
      
      {/* Help menu (Toggle with 'H' key) */}
      {showHelp && (
        <div className="absolute top-20 left-5 bg-black bg-opacity-70 text-white p-4 rounded-lg text-sm">
          <h3 className="font-bold mb-2">Controls:</h3>
          <ul className="space-y-1">
            <li>WASD - Move around</li>
            <li>Mouse - Look around</li>
            <li>Shift - Sprint</li>
            <li>ESC - Release mouse</li>
            <li>P - Toggle FPS stats</li>
            <li>H - Exit to home page</li>
            <li>F - Toggle fullscreen</li>
            <li>Click paintings - View details</li>
          </ul>
        </div>
      )}
      
      {/* Welcome Screen - Updated to use showWelcome state */}
      <AnimatePresence>
        {showWelcome && !selectedPainting && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className={`absolute inset-0 flex flex-col items-center justify-center ${darkMode ? 'bg-black bg-opacity-80' : 'bg-white bg-opacity-80'} z-10 ${getTextClass()} p-4`}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 bg-clip-text text-transparent">
              3D Interactive Art Museum
            </h1>
            <p className={`mb-6 text-lg text-center max-w-2xl ${getTextClass()}`}>
              Explore the gallery in immersive 3D! Move around and inspect paintings up close.
            </p>
            <div className={`${darkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-gray-200 bg-opacity-70'} p-4 rounded-xl mb-6 max-w-md`}>
              <h2 className="font-bold mb-2 text-center">Controls:</h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <span className={`${darkMode ? 'bg-gray-700' : 'bg-gray-300'} px-2 py-1 rounded`}>WASD</span> 
                  <span>Move around</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`${darkMode ? 'bg-gray-700' : 'bg-gray-300'} px-2 py-1 rounded`}>Mouse</span> 
                  <span>Look around</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`${darkMode ? 'bg-gray-700' : 'bg-gray-300'} px-2 py-1 rounded`}>Shift</span> 
                  <span>Sprint</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`${darkMode ? 'bg-gray-700' : 'bg-gray-300'} px-2 py-1 rounded`}>ESC</span> 
                  <span>Release mouse</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`${darkMode ? 'bg-gray-700' : 'bg-gray-300'} px-2 py-1 rounded`}>F</span> 
                  <span>Fullscreen</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`${darkMode ? 'bg-gray-700' : 'bg-gray-300'} px-2 py-1 rounded`}>H</span> 
                  <span>Exit to home</span>
                </li>
              </ul>
            </div>
            <motion.button 
              className="mt-4 px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full shadow-lg text-lg font-medium"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }} 
              whileTap={{ scale: 0.95 }}
              onClick={enterGallery}
            >
              Enter Gallery
            </motion.button>
            <Link href="/collection" className="mt-6">
              <motion.button 
                className="px-6 py-2 bg-gray-700 text-gray-200 rounded-full hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                Back to 2D Collection
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 3D Canvas */}
      <Canvas 
        shadows 
        dpr={[1, 2]} // Responsive pixel ratio
        camera={{ position: [0, 1.7, 10], fov: 70, near: 0.1, far: 100 }}
        gl={{ 
          antialias: true,
          alpha: false,
          stencil: false,
          depth: true,
          powerPreference: "high-performance"
        }}
      >
        {/* Global environment and postprocessing */}
        <fog attach="fog" args={[darkMode ? '#1a1a1a' : '#e5e5e5', 15, 40]} />
        
        {/* Scene content */}
        <Suspense fallback={
          <Html center>
            <div className="bg-black bg-opacity-70 p-4 rounded-lg text-white text-xl font-semibold animate-pulse">
              Loading Museum...
            </div>
          </Html>
        }>
          {/* Lights */}
          <ambientLight intensity={darkMode ? 0.4 : 0.6} color={darkMode ? "#FFFAF0" : "#FFFFFF"} />
          <directionalLight 
            position={[10, 15, 10]} 
            intensity={darkMode ? 0.7 : 0.9} 
            castShadow 
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          
          {/* Scene elements */}
          <MuseumEnvironment darkMode={darkMode} />
          {distributePaintings()}
          
          {/* Player systems - Removed Minimap */}
          <Player />
          <PointerLockControls ref={controls} selector="#canvas-container" />
          
          {/* Ensure optimal rendering */}
          <Preload all />
        </Suspense>
      </Canvas>
      
      {/* Sound system */}
      <SoundManager />
      
      {/* Painting Detail Overlay */}
      <AnimatePresence>
        {selectedPainting && (
          <motion.div
            key="detail-modal"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }} 
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-20 p-4"
            onClick={() => setSelectedPainting(null)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`relative ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl p-5 md:p-6 max-w-xl w-full max-h-[85vh] flex flex-col md:flex-row gap-5 overflow-hidden shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className={`absolute top-2 right-2 md:top-3 md:right-3 p-1.5 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'} hover:text-gray-800 transition-all z-10`}
                onClick={() => setSelectedPainting(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Image */}
              <div className="w-full md:w-1/2 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={selectedPainting.image} 
                  alt={selectedPainting.title} 
                  className="w-full h-auto object-contain max-h-[75vh] md:max-h-full"
                />
              </div>
              
              {/* Details */}
              <div className="w-full md:w-1/2 flex flex-col justify-between overflow-y-auto">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-3">{selectedPainting.title}</h2>
                  <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm md:text-base`}>
                    <p><strong>Dimensions:</strong> {selectedPainting.dimensions}</p>
                    <p><strong>Medium:</strong> {selectedPainting.medium}</p>
                    <p><strong>Notes:</strong> {selectedPainting.notes}</p>
                    <p className="text-lg md:text-xl font-semibold mt-3">{selectedPainting.price}</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className={`mt-6 space-y-3 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <motion.button
                    onClick={() => toggleFavorite(selectedPainting.id)}
                    className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium ${
                      isFavorite(selectedPainting.id)
                        ? darkMode ? "bg-red-900 text-red-200 hover:bg-red-800" : "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }}
                  >
                    {isFavorite(selectedPainting.id) ? (
                      <> <HeartIconSolid className="w-5 h-5" /> Remove from Favorites </>
                    ) : (
                      <> <HeartIcon className="w-5 h-5" /> Add to Favorites </>
                    )}
                  </motion.button>
                  
                  <Link href="/contact" className="block w-full">
                    <motion.button
                      className={`w-full py-3 px-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-900'} text-white rounded-lg transition-colors text-sm font-medium`}
                      whileHover={{ scale: 1.03 }} 
                      whileTap={{ scale: 0.97 }}
                    >
                      Inquire About This Piece
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveMuseum;