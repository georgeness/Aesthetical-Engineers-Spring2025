"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const router = useRouter();
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('paintings');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPainting, setEditingPainting] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    dimensions: '',
    medium: '',
    notes: '',
    price: '',
    image: ''
  });
  
  // Image upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  // Add username state
  const [username, setUsername] = useState('George');
  
  // Check if user is logged in and get username
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login'); // redirect if not logged in
    } else {
      // Get stored username if available
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [router]);
  
  // Fetch paintings
  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/paintings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch paintings');
        }
        
        const data = await response.json();
        
        // If new paintings have no order, assign them increasing order values
        const withOrder = data.map((painting, index) => {
          if (painting.order === undefined || painting.order === null) {
            return { ...painting, order: index };
          }
          return painting;
        });
        
        setPaintings(withOrder);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaintings();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle file selection for upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    try {
      setUploading(true);
      setUploadError(null);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-is-logged-in': 'true'
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      // Update form with the image URL
      setFormData(prev => ({
        ...prev,
        image: data.url
      }));
      
      setSelectedFile(null);
      return data.url;
    } catch (err) {
      setUploadError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  // Handle form submission for adding/editing a painting
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;
      
      // Upload image if a file is selected
      if (selectedFile) {
        imageUrl = await handleImageUpload();
        if (!imageUrl) return; // Exit if upload failed
      }
      
      const paintingData = {
        ...formData,
        image: imageUrl
      };
      
      // Determine if we're adding or editing
      const url = editingPainting 
        ? `/api/paintings/${editingPainting._id}` 
        : '/api/paintings';
      
      const method = editingPainting ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paintingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save painting');
      }
      
      const savedPainting = await response.json();
      
      // Update the paintings list
      if (editingPainting) {
        setPaintings(paintings.map(p => 
          p._id === savedPainting._id ? savedPainting : p
        ));
      } else {
        setPaintings([savedPainting, ...paintings]);
      }
      
      // Reset form and state
      setFormData({
        title: '',
        dimensions: '',
        medium: '',
        notes: '',
        price: '',
        image: ''
      });
      setSelectedFile(null);
      setShowAddForm(false);
      setEditingPainting(null);
      
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Start editing a painting
  const handleEdit = (painting) => {
    setFormData({
      title: painting.title,
      dimensions: painting.dimensions,
      medium: painting.medium,
      notes: painting.notes || '',
      price: painting.price,
      image: painting.image
    });
    setEditingPainting(painting);
    setShowAddForm(true);
  };
  
  // Handle painting deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this painting? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/paintings/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete painting');
      }
      
      // Remove the painting from the list
      setPaintings(paintings.filter(p => p._id !== id));
      
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Logout function
  const handleLogout = () => {
    // Clear login state
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    
    // Notify other components of auth status change
    window.dispatchEvent(new Event('auth-change'));
    
    // Redirect to login page
    router.push('/login');
  };

  // Handle moving a painting up
  const handleMoveUp = async (index) => {
    if (index === 0) return; // Already at the top
    
    const updatedPaintings = [...paintings];
    // Swap the orders
    const currentOrder = updatedPaintings[index].order;
    const aboveOrder = updatedPaintings[index - 1].order;
    
    updatedPaintings[index].order = aboveOrder;
    updatedPaintings[index - 1].order = currentOrder;
    
    // Swap positions in the array
    [updatedPaintings[index], updatedPaintings[index - 1]] = 
      [updatedPaintings[index - 1], updatedPaintings[index]];
    
    setPaintings(updatedPaintings);
    
    // Update the orders in the database
    try {
      const orderUpdates = [
        { id: updatedPaintings[index - 1]._id, order: updatedPaintings[index - 1].order },
        { id: updatedPaintings[index]._id, order: updatedPaintings[index].order }
      ];
      
      const response = await fetch('/api/paintings/update-order', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderUpdates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update painting order');
      }
    } catch (err) {
      setError(err.message);
      // Revert the local change if API call fails
      setPaintings([...paintings]);
    }
  };
  
  // Handle moving a painting down
  const handleMoveDown = async (index) => {
    if (index === paintings.length - 1) return; // Already at the bottom
    
    const updatedPaintings = [...paintings];
    // Swap the orders
    const currentOrder = updatedPaintings[index].order;
    const belowOrder = updatedPaintings[index + 1].order;
    
    updatedPaintings[index].order = belowOrder;
    updatedPaintings[index + 1].order = currentOrder;
    
    // Swap positions in the array
    [updatedPaintings[index], updatedPaintings[index + 1]] = 
      [updatedPaintings[index + 1], updatedPaintings[index]];
    
    setPaintings(updatedPaintings);
    
    // Update the orders in the database
    try {
      const orderUpdates = [
        { id: updatedPaintings[index]._id, order: updatedPaintings[index].order },
        { id: updatedPaintings[index + 1]._id, order: updatedPaintings[index + 1].order }
      ];
      
      const response = await fetch('/api/paintings/update-order', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderUpdates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update painting order');
      }
    } catch (err) {
      setError(err.message);
      // Revert the local change if API call fails
      setPaintings([...paintings]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {username}! You can manage your paintings here.</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                View Site
              </Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 1a1 1 0 00-1 1v12a1 1 0 001 1h9c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1H3zm0 1h9v12H3V2zm13.854 4.854a.5.5 0 010 .707l-2.647 2.646 2.647 2.646a.5.5 0 11-.708.708l-3-3a.5.5 0 010-.707l3-3a.5.5 0 01.708 0z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b mb-6">
            <ul className="flex -mb-px">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('paintings')}
                  className={`inline-block py-2 px-4 border-b-2 ${
                    activeTab === 'paintings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  Paintings
                </button>
              </li>
            </ul>
          </div>
          
          {/* Error display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
              <button 
                className="float-right text-red-700" 
                onClick={() => setError(null)}
              >
                &times;
              </button>
            </div>
          )}
          
          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingPainting ? 'Edit Painting' : 'Add New Painting'}
                </h2>
                <button 
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingPainting(null);
                    setFormData({
                      title: '',
                      dimensions: '',
                      medium: '',
                      notes: '',
                      price: '',
                      image: ''
                    });
                  }}
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Dimensions</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                      placeholder="e.g. 24x36 inches"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Medium</label>
                    <input
                      type="text"
                      name="medium"
                      value={formData.medium}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                      placeholder="e.g. Oil on canvas"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Price</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                      placeholder="e.g. $2000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1">Notes/Description</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block mb-1">Image</label>
                  
                  {formData.image && (
                    <div className="mb-2">
                      <Image 
                        src={formData.image} 
                        alt="Painting preview" 
                        width={200}
                        height={150}
                        className="border rounded mb-2"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFileChange}
                      className="border p-2 rounded"
                    />
                    
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={!selectedFile || uploading}
                      className={`px-3 py-1 rounded ${
                        !selectedFile || uploading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  
                  <p className="text-gray-500 text-sm mt-1">
                    Supported formats: JPEG, JPG, PNG. Maximum size: 30MB
                  </p>
                  
                  {uploadError && (
                    <p className="text-red-500 text-sm mt-1">{uploadError}</p>
                  )}
                  
                  {!formData.image && !selectedFile && (
                    <p className="text-red-500 text-sm mt-1">
                      Please upload an image or provide an image URL
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={!formData.image && !selectedFile}
                  >
                    {editingPainting ? 'Update Painting' : 'Add Painting'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Paintings management */}
          {activeTab === 'paintings' && (
            <div>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Manage Paintings</h2>
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    setEditingPainting(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add New Painting
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-4">
                  <p>Loading paintings...</p>
                </div>
              ) : paintings.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded">
                  <p>No paintings found. Add your first painting using the button above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Image</th>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Medium</th>
                        <th className="px-4 py-2 text-left">Dimensions</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-center">Order</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paintings.map((painting, index) => (
                        <tr key={painting._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <Image 
                              src={painting.image} 
                              alt={painting.title}
                              width={80}
                              height={60}
                              className="rounded border"
                            />
                          </td>
                          <td className="px-4 py-2">{painting.title}</td>
                          <td className="px-4 py-2">{painting.medium}</td>
                          <td className="px-4 py-2">{painting.dimensions}</td>
                          <td className="px-4 py-2">{painting.price}</td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex flex-col items-center">
                              <button
                                onClick={() => handleMoveUp(index)}
                                disabled={index === 0}
                                className={`p-1 mb-1 rounded ${
                                  index === 0 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-blue-600 hover:bg-blue-100'
                                }`}
                                title="Move Up"
                              >
                                <ChevronUpIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleMoveDown(index)}
                                disabled={index === paintings.length - 1}
                                className={`p-1 rounded ${
                                  index === paintings.length - 1 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-blue-600 hover:bg-blue-100'
                                }`}
                                title="Move Down"
                              >
                                <ChevronDownIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleEdit(painting)}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(painting._id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
