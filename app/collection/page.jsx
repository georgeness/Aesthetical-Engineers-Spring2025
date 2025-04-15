"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { HeartIcon } from "@heroicons/react/24/outline";
import { 
  HeartIcon as HeartIconSolid, 
  SunIcon, 
  MoonIcon, 
  ViewColumnsIcon, 
  ListBulletIcon, 
  ArrowsPointingOutIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  Square2StackIcon,
  CameraIcon,
  ArrowsRightLeftIcon,
  ShareIcon
} from "@heroicons/react/24/solid";

const PaintingLibrary = () => {
  // State for UI controls
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // "grid", "list", or "wall"
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("museumDarkMode");
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [filterMedium, setFilterMedium] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [wallBackground, setWallBackground] = useState(darkMode ? "dark" : "light");
  const [isARMode, setIsARMode] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonPaintings, setComparisonPaintings] = useState([]);
  const [paintings, setPaintings] = useState([]);
  
  // Refs
  const modalImageRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const imagePosition = useRef({ x: 0, y: 0 });
  const dragItem = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load favorites on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      
      // Fetch paintings from API
      const fetchPaintings = async () => {
        try {
          const response = await fetch('/api/paintings');
          if (!response.ok) {
            throw new Error('Failed to fetch paintings');
          }
          const data = await response.json();
          
          // If no paintings are returned from API, use sample data
          if (data && data.length > 0) {
            setPaintings(data);
          }
        } catch (error) {
          console.error('Error fetching paintings:', error);
        }
      };
      
      fetchPaintings();
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("museumDarkMode", JSON.stringify(darkMode));
    }
    // Update wall background when dark mode changes
    setWallBackground(darkMode ? "dark" : "light");
  }, [darkMode]);

  // Handle AR mode
  useEffect(() => {
    if (isARMode && videoRef.current && canvasRef.current) {
      // Request access to the webcam
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          })
          .catch(err => {
            console.error("Error accessing the camera:", err);
            setIsARMode(false);
          });
      } else {
        console.error("getUserMedia not supported");
        setIsARMode(false);
      }
      
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [isARMode]);

  // Toggle AR mode
  const toggleARMode = () => {
    if (selectedPainting) {
      setIsARMode(!isARMode);
    }
  };

  // Add or remove painting from comparison
  const toggleComparisonPainting = (painting) => {
    const exists = comparisonPaintings.some(p => p.id === painting.id);
    
    if (exists) {
      setComparisonPaintings(prev => prev.filter(p => p.id !== painting.id));
    } else {
      // Only allow up to 3 paintings for comparison
      if (comparisonPaintings.length < 3) {
        setComparisonPaintings(prev => [...prev, painting]);
      }
    }
  };

  // Check if painting is in comparison
  const isInComparison = (id) => comparisonPaintings.some(p => p.id === id);

  // Clear all comparison paintings
  const clearComparison = () => {
    setComparisonPaintings([]);
    setComparisonMode(false);
  };

  // Toggle comparison mode
  const toggleComparisonMode = () => {
    if (comparisonPaintings.length > 1) {
      setComparisonMode(!comparisonMode);
      if (!comparisonMode) {
        setSelectedPainting(null);
      }
    }
  };

  // Share painting
  const sharePainting = (painting) => {
    if (navigator.share) {
      navigator.share({
        title: painting.title,
        text: `Check out this beautiful painting: ${painting.title} - ${painting.medium}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback copy to clipboard
      const shareText = `${painting.title} - ${painting.medium} - ${painting.price}`;
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Painting details copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err));
    }
  };

  // Extract unique medium types
  const mediumTypes = ["all", ...new Set(paintings.map(p => p.medium))];

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Function to toggle favorites
  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Check if painting is favorite
  const isFavorite = (id) => favorites.includes(id);

  // Function to open modal with selected painting
  const openModal = (index) => {
    setCurrentIndex(index);
    setSelectedPainting(paintings[index]);
    setZoomLevel(1);
    imagePosition.current = { x: 0, y: 0 };
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedPainting(null);
    setZoomLevel(1);
  };

  // Function to navigate to previous painting
  const prevPainting = () => {
    const newIndex = currentIndex === 0 ? paintings.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedPainting(paintings[newIndex]);
    setZoomLevel(1);
    imagePosition.current = { x: 0, y: 0 };
  };

  // Function to navigate to next painting
  const nextPainting = () => {
    const newIndex = currentIndex === paintings.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedPainting(paintings[newIndex]);
    setZoomLevel(1);
    imagePosition.current = { x: 0, y: 0 };
  };

  // Handle mouse down for image pan
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      startPos.current = {
        x: e.clientX - imagePosition.current.x,
        y: e.clientY - imagePosition.current.y
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  // Handle mouse move for image pan
  const handleMouseMove = (e) => {
    if (modalImageRef.current) {
      imagePosition.current = {
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y
      };
      
      modalImageRef.current.style.transform = `translate(${imagePosition.current.x}px, ${imagePosition.current.y}px) scale(${zoomLevel})`;
    }
  };

  // Handle mouse up for image pan
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Handle zoom in/out
  const handleZoom = (factor) => {
    setZoomLevel(prev => {
      const newZoom = prev * factor;
      // Limit zoom level between 1 and 4
      return Math.max(1, Math.min(4, newZoom));
    });
    
    if (modalImageRef.current) {
      modalImageRef.current.style.transform = `translate(${imagePosition.current.x}px, ${imagePosition.current.y}px) scale(${zoomLevel * factor})`;
    }
  };

  // Reset zoom level
  const resetZoom = () => {
    setZoomLevel(1);
    imagePosition.current = { x: 0, y: 0 };
    if (modalImageRef.current) {
      modalImageRef.current.style.transform = 'translate(0px, 0px) scale(1)';
    }
  };

  // Filter and sort paintings
  const getFilteredAndSortedPaintings = () => {
    let result = [...paintings];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medium.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply medium filter
    if (filterMedium !== "all") {
      result = result.filter(p => p.medium === filterMedium);
    }
    
    // Apply favorites filter
    if (showOnlyFavorites) {
      result = result.filter(p => favorites.includes(p.id));
    }
    
    // Apply sorting
    switch (sortOption) {
      case "priceAsc":
        result.sort((a, b) => parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, '')));
        break;
      case "priceDesc":
        result.sort((a, b) => parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, '')));
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Use default order
        break;
    }
    
    return result;
  };

  // Get display theme classes
  const getThemeClasses = () => {
    return {
      bg: darkMode ? "bg-gray-900" : "bg-gray-50",
      text: darkMode ? "text-white" : "text-gray-900",
      card: darkMode ? "bg-gray-800" : "bg-white",
      cardHover: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
      secondary: darkMode ? "text-gray-300" : "text-gray-600",
      accent: darkMode ? "bg-indigo-600" : "bg-orange-500",
      button: darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-orange-500 hover:bg-orange-600",
      modal: darkMode ? "bg-gray-800" : "bg-white",
      border: darkMode ? "border-gray-700" : "border-gray-200"
    };
  };

  const theme = getThemeClasses();
  const filteredPaintings = getFilteredAndSortedPaintings();

  // Toggle view mode between grid, list and wall
  const toggleViewMode = () => {
    setViewMode(prev => {
      if (prev === "grid") return "list";
      if (prev === "list") return "wall";
      return "grid";
    });
  };

  // Return icon based on current view mode
  const getViewModeIcon = () => {
    switch (viewMode) {
      case "grid": return <ListBulletIcon className="w-5 h-5" />;
      case "list": return <Square2StackIcon className="w-5 h-5" />;
      case "wall": return <ViewColumnsIcon className="w-5 h-5" />;
    }
  };

  // Get view mode title for button tooltip
  const getViewModeTitle = () => {
    switch (viewMode) {
      case "grid": return "Switch to List View";
      case "list": return "Switch to Wall View";
      case "wall": return "Switch to Grid View";
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center py-4 transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      {/* Header with controls */}
      <div className="w-full max-w-7xl px-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">Painting Collection</h1>
          
          <div className="flex items-center space-x-2">
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
            
            <motion.button
              onClick={toggleViewMode}
              className="p-2 rounded-full bg-black bg-opacity-40 text-white hover:bg-opacity-60 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={getViewModeTitle()}
            >
              {getViewModeIcon()}
            </motion.button>
            
            <motion.button
              onClick={toggleComparisonMode}
              className={`p-2 rounded-full ${
                comparisonPaintings.length > 1
                  ? comparisonMode
                    ? "bg-indigo-600 text-white"
                    : "bg-black bg-opacity-40 text-white" 
                  : "bg-black bg-opacity-20 text-gray-400 cursor-not-allowed"
              } hover:bg-opacity-60 transition-all relative`}
              whileHover={comparisonPaintings.length > 1 ? { scale: 1.1 } : {}}
              whileTap={comparisonPaintings.length > 1 ? { scale: 0.9 } : {}}
              title={
                comparisonPaintings.length > 1
                  ? comparisonMode
                    ? "Exit Compare View"
                    : "Compare Selected Paintings"
                  : "Select 2-3 paintings to compare"
              }
              disabled={comparisonPaintings.length < 2}
            >
              <ArrowsRightLeftIcon className="w-5 h-5" />
              {comparisonPaintings.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {comparisonPaintings.length}
                </span>
              )}
            </motion.button>
            
            <motion.button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="p-2 rounded-full bg-black bg-opacity-40 text-white hover:bg-opacity-60 transition-all relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Filters & Sort"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              {(filterMedium !== "all" || sortOption !== "default" || showOnlyFavorites) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Search input */}
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search paintings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-3 pl-10 rounded-lg ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Comparison selection info */}
        {comparisonPaintings.length > 0 && !comparisonMode && (
          <div className={`mt-4 p-3 rounded-lg ${theme.card} border ${theme.border} flex items-center justify-between`}>
            <div className="flex items-center">
              <ArrowsRightLeftIcon className="w-5 h-5 mr-2" />
              <span>
                {comparisonPaintings.length === 1 
                  ? "Select 1-2 more paintings to compare" 
                  : comparisonPaintings.length === 2
                  ? "You can now compare these paintings or add 1 more"
                  : "Ready to compare 3 paintings"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleComparisonMode}
                className={`px-3 py-1 text-sm ${
                  comparisonPaintings.length > 1 
                    ? `${theme.button} text-white` 
                    : `bg-gray-500 text-gray-200 opacity-50 cursor-not-allowed`
                } rounded-md`}
                disabled={comparisonPaintings.length < 2}
              >
                Compare
              </button>
              <button 
                onClick={clearComparison}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md"
              >
                Clear
              </button>
            </div>
          </div>
        )}
        
        {/* Filters panel */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-4 p-4 rounded-lg ${theme.card} shadow-lg overflow-hidden`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Medium filter */}
                <div>
                  <label className="block mb-2 font-medium">Filter by Medium</label>
                  <select
                    value={filterMedium}
                    onChange={(e) => setFilterMedium(e.target.value)}
                    className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border`}
                  >
                    {mediumTypes.map(medium => (
                      <option key={medium} value={medium}>
                        {medium === "all" ? "All Mediums" : medium}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Sort options */}
                <div>
                  <label className="block mb-2 font-medium">Sort by</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border`}
                  >
                    <option value="default">Default</option>
                    <option value="priceAsc">Price (Low to High)</option>
                    <option value="priceDesc">Price (High to Low)</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                </div>
                
                {/* Favorites toggle */}
                <div className="flex items-center">
                  <button
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                      showOnlyFavorites 
                        ? 'bg-red-500 text-white' 
                        : `${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`
                    }`}
                  >
                    {showOnlyFavorites ? (
                      <>
                        <HeartIconSolid className="w-5 h-5" />
                        <span>Showing Favorites</span>
                      </>
                    ) : (
                      <>
                        <HeartIcon className="w-5 h-5" />
                        <span>Show All</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Results count and clear filters */}
              <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-600">
                <p className="text-sm">{filteredPaintings.length} paintings found</p>
                {(filterMedium !== "all" || sortOption !== "default" || showOnlyFavorites || searchTerm) && (
                  <button
                    onClick={() => {
                      setFilterMedium("all");
                      setSortOption("default");
                      setShowOnlyFavorites(false);
                      setSearchTerm("");
                    }}
                    className="text-sm underline hover:no-underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* No results message */}
      {filteredPaintings.length === 0 && !comparisonMode && (
        <div className="w-full max-w-7xl px-4 py-8 text-center">
          <h2 className="text-xl mb-2">No paintings found</h2>
          <p className={theme.secondary}>Try adjusting your filters or search terms</p>
        </div>
      )}
      
      {/* Comparison View */}
      {comparisonMode && (
        <div className="w-full max-w-7xl px-4">
          <div className={`p-4 rounded-lg ${theme.card} shadow-xl mb-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Comparing {comparisonPaintings.length} Paintings</h2>
              <button 
                onClick={clearComparison}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md"
              >
                Exit Comparison
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparisonPaintings.map((painting) => (
                <div key={painting.id} className={`relative rounded-lg overflow-hidden border ${theme.border}`}>
                  <img 
                    src={painting.image} 
                    alt={painting.title} 
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleComparisonPainting(painting)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  <div className="p-3">
                    <h3 className="font-bold">{painting.title}</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                      <div className="col-span-2 font-semibold">{painting.price}</div>
                      <div className="text-sm">
                        <strong>Medium:</strong> {painting.medium}
                      </div>
                      <div className="text-sm">
                        <strong>Size:</strong> {painting.dimensions}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: 3 - comparisonPaintings.length }).map((_, i) => (
                <div 
                  key={`empty-${i}`} 
                  className={`flex items-center justify-center rounded-lg border ${theme.border} border-dashed p-10 h-full`}
                >
                  <p className={`text-center ${theme.secondary}`}>
                    Add another painting<br/>to compare
                  </p>
                </div>
              ))}
            </div>
            
            {/* Comparison table */}
            <div className={`mt-6 rounded-lg border ${theme.border} overflow-hidden`}>
              <table className="w-full">
                <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                  <tr>
                    <th className="p-3 text-left">Feature</th>
                    {comparisonPaintings.map(painting => (
                      <th key={painting.id} className="p-3 text-left">{painting.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className={darkMode ? "border-t border-gray-600" : "border-t border-gray-200"}>
                    <td className="p-3"><strong>Medium</strong></td>
                    {comparisonPaintings.map(painting => (
                      <td key={painting.id} className="p-3">{painting.medium}</td>
                    ))}
                  </tr>
                  <tr className={darkMode ? "border-t border-gray-600" : "border-t border-gray-200"}>
                    <td className="p-3"><strong>Dimensions</strong></td>
                    {comparisonPaintings.map(painting => (
                      <td key={painting.id} className="p-3">{painting.dimensions}</td>
                    ))}
                  </tr>
                  <tr className={darkMode ? "border-t border-gray-600" : "border-t border-gray-200"}>
                    <td className="p-3"><strong>Price</strong></td>
                    {comparisonPaintings.map(painting => (
                      <td key={painting.id} className="p-3">{painting.price}</td>
                    ))}
                  </tr>
                  <tr className={darkMode ? "border-t border-gray-600" : "border-t border-gray-200"}>
                    <td className="p-3"><strong>Notes</strong></td>
                    {comparisonPaintings.map(painting => (
                      <td key={painting.id} className="p-3">{painting.notes}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Wall View */}
      {viewMode === "wall" && filteredPaintings.length > 0 && !comparisonMode && (
        <div className="w-full max-w-7xl px-0 sm:px-4">
          <div 
            className={`relative w-full h-[80vh] rounded-lg overflow-hidden ${
              wallBackground === "dark" ? "bg-gray-800" : 
              wallBackground === "light" ? "bg-gray-100" : 
              wallBackground === "wood" ? "bg-amber-900" : 
              "bg-slate-600"
            } p-8`}
            style={{ 
              backgroundImage: wallBackground === "wood" ? "url('/images/wall-texture.jpg')" : "",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Wall Background Controls */}
            <div className="absolute top-4 right-4 z-10 flex bg-black bg-opacity-30 rounded-lg p-1">
              <button 
                onClick={() => setWallBackground("light")}
                className={`p-2 rounded-md ${wallBackground === "light" ? "bg-white bg-opacity-20" : ""}`}
                title="Light Wall"
              >
                <div className="w-4 h-4 bg-gray-100 rounded-sm"></div>
              </button>
              <button 
                onClick={() => setWallBackground("dark")}
                className={`p-2 rounded-md ${wallBackground === "dark" ? "bg-white bg-opacity-20" : ""}`}
                title="Dark Wall"
              >
                <div className="w-4 h-4 bg-gray-800 rounded-sm"></div>
              </button>
              <button 
                onClick={() => setWallBackground("wood")}
                className={`p-2 rounded-md ${wallBackground === "wood" ? "bg-white bg-opacity-20" : ""}`}
                title="Wood Wall"
              >
                <div className="w-4 h-4 bg-amber-900 rounded-sm"></div>
              </button>
            </div>
            
            {/* Interactive Wall of Paintings */}
            <div className="flex flex-wrap gap-4 justify-center items-center h-full overflow-auto p-4">
              {filteredPaintings.map((painting, index) => {
                // Calculate varied sizes - larger for featured works
                const isFeatured = isFavorite(painting.id) || index % 5 === 0;
                const width = isFeatured ? `${Math.max(220, Math.min(320, 240 + (index % 4) * 20))}px` : `${180 + (index % 3) * 15}px`;
                const angle = Math.random() * 4 - 2; // Random slight tilt -2 to 2 degrees
                
                return (
                  <motion.div
                    key={painting.id}
                    className="relative group cursor-pointer"
                    style={{ 
                      width,
                      perspective: '1000px',
                      transformStyle: 'preserve-3d',
                      zIndex: selectedPainting?.id === painting.id ? 50 : 1,
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      zIndex: 10,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                    }}
                    initial={{ opacity: 0, y: 20, rotateY: -10, rotateZ: angle }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      rotateY: 0,
                      rotateZ: angle,
                      transition: { delay: index * 0.04, duration: 0.5 }
                    }}
                    onClick={() => openModal(paintings.findIndex(p => p.id === painting.id))}
                  >
                    {/* Frame and matting effect */}
                    <div 
                      className={`relative rounded-sm overflow-hidden ${
                        wallBackground !== "dark" ? "shadow-2xl" : "shadow-[0_0_25px_rgba(0,0,0,0.7)]"
                      }`}
                      style={{ 
                        padding: '12px', 
                        backgroundColor: wallBackground === "dark" ? "#222" : "#fff",
                        borderRadius: '2px',
                        boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)`,
                      }}
                    >
                      {/* Artwork */}
                      <div className={`relative overflow-hidden ${wallBackground === "dark" ? "border border-gray-700" : "border border-gray-200"}`}>
                        <img
                          src={painting.image}
                          alt={painting.title}
                          className="w-full h-auto object-cover"
                          style={{
                            transition: "all 0.5s ease",
                          }}
                          loading="lazy"
                        />
                        
                        {/* Nameplate */}
                        <div className={`absolute bottom-0 left-0 right-0 ${
                          wallBackground === "dark" ? "bg-black bg-opacity-70" : "bg-white bg-opacity-80"
                        } p-2 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300`}>
                          <p className={`text-xs font-medium ${wallBackground === "dark" ? "text-white" : "text-black"}`}>
                            {painting.title}
                          </p>
                          <p className={`text-xs ${wallBackground === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            {painting.medium}
                          </p>
                        </div>
                      </div>
                      
                      {/* Favorite indicator */}
                      {isFavorite(painting.id) && (
                        <div className="absolute top-2 right-2 z-10">
                          <HeartIconSolid className="w-4 h-4 text-red-500" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 w-full max-w-7xl px-4">
          {filteredPaintings.map((painting, index) => (
            <motion.div
              key={painting.id}
              className={`${theme.card} p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="relative group">
            <img
              src={painting.image}
              alt={painting.title}
                  className="w-full h-auto mb-4 rounded cursor-pointer transform transition duration-300 group-hover:brightness-90"
                  onClick={() => openModal(paintings.findIndex(p => p.id === painting.id))}
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(painting.id); }}
                    className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500 transition-all duration-200 shadow-md transform hover:scale-110"
                  >
                    {isFavorite(painting.id) ? (
                      <HeartIconSolid className="w-5 h-5" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleComparisonPainting(painting); }}
                    className={`p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 shadow-md transform hover:scale-110 ${
                      isInComparison(painting.id) ? "text-indigo-600" : "text-gray-600"
                    }`}
                  >
                    <ArrowsRightLeftIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            <h2 className="text-lg md:text-xl font-bold mb-2">{painting.title}</h2>
              <p className={`text-sm ${theme.secondary} mb-1`}>
                <strong>Medium:</strong> {painting.medium}
              </p>
              <p className={`text-sm ${theme.secondary} mb-1`}>
              <strong>Dimensions:</strong> {painting.dimensions}
            </p>
              <p className="text-sm font-semibold mt-2">
                <strong>Price:</strong> {painting.price}
              </p>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* List View */}
      {viewMode === "list" && (
        <div className="w-full max-w-7xl px-4">
          {filteredPaintings.map((painting, index) => (
            <motion.div
              key={painting.id}
              className={`${theme.card} p-4 mb-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-40 h-40 flex-shrink-0">
                  <img
                    src={painting.image}
                    alt={painting.title}
                    className="w-full h-full object-cover rounded cursor-pointer"
                    onClick={() => openModal(paintings.findIndex(p => p.id === painting.id))}
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(painting.id); }}
                      className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500 transition-all duration-200 shadow-md transform hover:scale-110"
                    >
                      {isFavorite(painting.id) ? (
                        <HeartIconSolid className="w-5 h-5" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleComparisonPainting(painting); }}
                      className={`p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 shadow-md transform hover:scale-110 ${
                        isInComparison(painting.id) ? "text-indigo-600" : "text-gray-600"
                      }`}
                    >
                      <ArrowsRightLeftIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-lg md:text-xl font-bold mb-1">{painting.title}</h2>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <p className={`text-sm ${theme.secondary}`}>
              <strong>Medium:</strong> {painting.medium}
            </p>
                    <p className={`text-sm ${theme.secondary}`}>
                      <strong>Dimensions:</strong> {painting.dimensions}
                    </p>
                  </div>
                  <p className={`text-sm ${theme.secondary} mb-2`}>
              <strong>Notes:</strong> {painting.notes}
            </p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">
              <strong>Price:</strong> {painting.price}
            </p>
                    <button 
                      onClick={() => openModal(paintings.findIndex(p => p.id === painting.id))}
                      className={`px-3 py-1 ${theme.button} text-white rounded-md text-sm`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
          </div>
            </motion.div>
        ))}
      </div>
      )}

      {/* Modal (Popup View) */}
      <AnimatePresence>
      {selectedPainting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50 px-4"
              onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative ${theme.modal} p-6 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className={`absolute top-4 right-4 z-30 p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} hover:bg-opacity-80`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Image with zoom controls or AR View */}
                <div className="relative w-full md:w-2/3 overflow-hidden">
                  {!isARMode ? (
                    <>
                      {/* Zoom controls */}
                      <div className="absolute top-4 left-4 z-20 flex space-x-2">
                        <button
                          onClick={() => handleZoom(1.25)}
                          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} text-gray-700 shadow-md`}
                          disabled={zoomLevel >= 4}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleZoom(0.8)}
                          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} text-gray-700 shadow-md`}
                          disabled={zoomLevel <= 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
              <button
                          onClick={resetZoom}
                          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} text-gray-700 shadow-md`}
              >
                          <ArrowsPointingOutIcon className="h-5 w-5" />
              </button>

                        {/* AR View Toggle */}
                        <button
                          onClick={toggleARMode}
                          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} text-gray-700 shadow-md`}
                          title="Try on your wall with AR"
                        >
                          <CameraIcon className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Image navigation */}
                      <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 z-20">
                        <button
                          onClick={(e) => { e.stopPropagation(); prevPainting(); }}
                          className={`p-3 rounded-full ${theme.button} text-white shadow-lg opacity-80 hover:opacity-100`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); nextPainting(); }}
                          className={`p-3 rounded-full ${theme.button} text-white shadow-lg opacity-80 hover:opacity-100`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Zoomable image */}
                      <div 
                        className="relative h-[40vh] md:h-[60vh] flex items-center justify-center bg-black bg-opacity-20 rounded-lg overflow-hidden"
                        onMouseDown={handleMouseDown}
                      >
                        <img
                          ref={modalImageRef}
                          src={selectedPainting.image}
                          alt={selectedPainting.title}
                          className="max-w-full max-h-full transition-transform duration-100"
                          style={{ transform: `scale(${zoomLevel})` }}
                          draggable="false"
                        />
                        {zoomLevel === 1 ? (
                          <div className="absolute bottom-3 right-3 text-xs bg-black bg-opacity-50 text-white py-1 px-2 rounded">
                            Click and drag to pan when zoomed
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    /* AR View */
                    <div className="relative h-[40vh] md:h-[60vh] bg-black rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <video 
                          ref={videoRef}
                          className="absolute inset-0 w-full h-full object-cover"
                          playsInline
                          muted
                        />
                        <canvas 
                          ref={canvasRef}
                          className="absolute inset-0 w-full h-full"
                        />
                        
                        {/* AR Controls */}
                        <div className="absolute top-4 left-4 flex space-x-2">
                          <button
                            onClick={toggleARMode}
                            className={`p-2 rounded-full bg-white text-red-500 shadow-md`}
                            title="Exit AR View"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                        
                        {/* AR Painting Image */}
              <img
                src={selectedPainting.image}
                alt={selectedPainting.title}
                          className="max-w-[80%] max-h-[80%] z-10 border-8 border-white shadow-2xl"
                          style={{ 
                            transform: 'perspective(1000px) rotateY(-5deg)',
                            transformOrigin: 'center' 
                          }}
                          draggable="false"
                        />
                        
                        {/* AR Instructions */}
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                          <div className="bg-black bg-opacity-70 text-white py-2 px-4 rounded-lg mx-auto inline-block">
                            <p>Move your device to place the artwork on your wall</p>
                            <p className="text-sm text-gray-300 mt-1">Drag the artwork to resize and position</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
            </div>

            {/* Painting Details */}
                <div className={`w-full md:w-1/3 flex flex-col ${theme.secondary} overflow-y-auto`}>
                  <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>{selectedPainting.title}</h2>
                  
                  <div className="space-y-3 mb-6">
                    <p>
                      <strong className="font-semibold">Medium:</strong> {selectedPainting.medium}
                    </p>
                    <p>
                      <strong className="font-semibold">Dimensions:</strong> {selectedPainting.dimensions}
                    </p>
                    <p>
                      <strong className="font-semibold">Notes:</strong> {selectedPainting.notes}
                    </p>
                    <p className={`text-xl font-semibold mt-4 ${theme.text}`}>
                <strong>Price:</strong> {selectedPainting.price}
              </p>
            </div>
                  
                  <div className="mt-auto space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => toggleFavorite(selectedPainting.id)}
                        className={`py-3 rounded-lg flex items-center justify-center gap-2 transition ${
                          isFavorite(selectedPainting.id)
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : darkMode 
                              ? "bg-gray-700 text-white hover:bg-gray-600" 
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        {isFavorite(selectedPainting.id) ? (
                          <>
                            <HeartIconSolid className="w-5 h-5" />
                            <span>Remove</span>
                          </>
                        ) : (
                          <>
                            <HeartIcon className="w-5 h-5" />
                            <span>Favorite</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => toggleComparisonPainting(selectedPainting)}
                        className={`py-3 rounded-lg flex items-center justify-center gap-2 transition ${
                          isInComparison(selectedPainting.id)
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : darkMode 
                              ? "bg-gray-700 text-white hover:bg-gray-600" 
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        <ArrowsRightLeftIcon className="w-5 h-5" />
                        <span>{isInComparison(selectedPainting.id) ? "Remove" : "Compare"}</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => sharePainting(selectedPainting)}
                        className={`py-3 rounded-lg flex items-center justify-center gap-2 ${
                          darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        <ShareIcon className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                      
                      <button
                        onClick={!isARMode ? toggleARMode : null}
                        className={`py-3 rounded-lg flex items-center justify-center gap-2 ${
                          isARMode 
                            ? "bg-gray-500 text-gray-300 cursor-not-allowed" 
                            : `${theme.button} text-white`
                        }`}
                        disabled={isARMode}
                      >
                        <CameraIcon className="w-5 h-5" />
                        <span>Try on Wall</span>
                      </button>
                    </div>
                    
                    <Link href="/contact" className="block w-full">
                      <button className={`w-full py-3 ${theme.button} text-white rounded-lg transition`}>
                        Inquire About This Piece
                      </button>
                    </Link>
                    
                    <button 
                      onClick={() => {
                        closeModal();
                        setViewMode("wall");
                      }}
                      className={`w-full py-3 ${darkMode ? 'bg-indigo-900 hover:bg-indigo-800' : 'bg-amber-600 hover:bg-amber-700'} text-white rounded-lg transition flex items-center justify-center gap-2`}
                    >
                      <span>See on Interactive Wall</span>
                    </button>
            </div>
          </div>
        </div>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default PaintingLibrary;
