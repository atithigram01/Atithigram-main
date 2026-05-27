import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { MapPin, Leaf, Building2, Landmark, Info, Search, Navigation, AlertTriangle, Crosshair, Home, Palette, Compass } from 'lucide-react';
import { getPlaces, getHomestays, getProducts, getAdventures } from '../services/api';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons based on category
const createIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11]
  });
};

const categoryToColor = {
  Eco: '#16a34a',       // green-600
  Heritage: '#d97706',  // amber-600
  Cultural: '#9333ea',  // purple-600
  Homestays: '#3b82f6', // blue-500
  Handicrafts: '#ec4899',// pink-500
  Adventure: '#0ea5e9',  // sky-500
  Default: '#64748b'    // slate-500
};

const categoryColors = {
  Eco: { dot: 'bg-green-500', badge: 'bg-green-100 text-green-700', icon: <Leaf size={14} /> },
  Heritage: { dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', icon: <Landmark size={14} /> },
  Cultural: { dot: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700', icon: <Building2 size={14} /> },
  Homestays: { dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700', icon: <Home size={14} /> },
  Handicrafts: { dot: 'bg-pink-500', badge: 'bg-pink-100 text-pink-700', icon: <Palette size={14} /> },
  Adventure: { dot: 'bg-sky-500', badge: 'bg-sky-100 text-sky-700', icon: <Compass size={14} /> },
  Default: { dot: 'bg-slate-500', badge: 'bg-slate-100 text-slate-700', icon: <MapPin size={14} /> },
};

// Default center (Jharkhand)
const DEFAULT_CENTER = [23.6102, 85.2799];

const STATIC_PLACES = [
  { _id: '1', name: 'Hundru Falls', category: 'Eco', type: 'place', description: 'A stunning 98m waterfall near Ranchi, surrounded by lush green forests.', images: ['/hundru-falls.jpg'], coordinates: { lat: 23.41, lng: 85.67 } },
  { _id: '2', name: 'Betla National Park', category: 'Eco', type: 'place', description: 'First national park in Jharkhand, home to tigers, elephants, and leopards.', images: ['/betla-national-park.jpg'], coordinates: { lat: 23.92, lng: 84.13 } },
  { _id: '3', name: 'Baidyanath Temple', category: 'Heritage', type: 'place', description: 'One of the 12 Jyotirlingas of Shiva, a major pilgrimage site in Deoghar.', images: ['/baidyanath-temple.jpg'], coordinates: { lat: 24.49, lng: 86.70 } },
  { _id: '4', name: 'Ranchi Lake', category: 'Eco', type: 'place', description: 'A serene man-made lake at the heart of the capital city, perfect for boating.', images: ['/ranchi-lake.jpg'], coordinates: { lat: 23.36, lng: 85.33 } },
  { _id: '5', name: 'Jagannath Temple Ranchi', category: 'Heritage', type: 'place', description: 'A miniature version of the famous Puri Jagannath Temple, built in 1691.', images: ['/jagannath-temple-ranchi.jpg'], coordinates: { lat: 23.37, lng: 85.32 } },
  { _id: '7', name: 'Dasam Falls', category: 'Eco', type: 'place', description: 'Scenic 44m waterfall on the Subarnarekha River.', images: ['https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800'], coordinates: { lat: 22.97, lng: 85.58 } },
  { _id: '8', name: 'Jonha Falls', category: 'Eco', type: 'place', description: 'A majestic waterfall named after the nearest village, Jonha.', images: ['https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=800'], coordinates: { lat: 23.29, lng: 85.61 } },
  { _id: '9', name: 'Maa Dewri Mandir (Deori Temple)', category: 'Heritage', type: 'place', description: 'An ancient 700-year-old temple in Diuri village, Tamar, dedicated to the 16-armed deity Maa Dewri. Renowned for its unique construction of interlocking stones without binding materials.', images: ['/deuri-mandir.jpg'], coordinates: { lat: 23.0461, lng: 85.6828 } }
];

const ADVENTURE_COORDINATES = {
  'Wild Waadi Water Park Bokaro': { lat: 23.6385, lng: 86.1360 },
  'WILD WAADI WATER PARK BOKARO': { lat: 23.6385, lng: 86.1360 },
  'Wild Waadi Water Park, Ranchi': { lat: 23.2428, lng: 85.3402 },
  'Wild Waadi Water Park Ranchi': { lat: 23.2428, lng: 85.3402 },
  'Funmagica Waterpark & Resort': { lat: 23.6152, lng: 86.1855 },
  'Funmagica Waterpark & Resort Bokaro': { lat: 23.6152, lng: 86.1855 },
  'SNOWLAND RANCHI': { lat: 23.2840, lng: 85.3120 }
};

const getAdventureCoordinates = (name) => {
  const match = Object.keys(ADVENTURE_COORDINATES).find(key => 
    name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())
  );
  return match ? ADVENTURE_COORDINATES[match] : { lat: 23.6102, lng: 85.2799 };
};

const STATIC_ADVENTURES = [
  {
    _id: 'adv1',
    name: 'WILD WAADI WATER PARK BOKARO',
    activityType: 'Water Park',
    category: 'Adventure',
    type: 'adventure',
    location: 'Village Kashiridih, post, Ulgara, Jharkhand 827013',
    description: "Bokaro's premier aquatic recreational hub, featuring thrilling water slides, dynamic wave pools, and dedicated children's splash zones.",
    images: ['/wild-waadi-bokaro.jpg'],
    coordinates: { lat: 23.6385, lng: 86.1360 }
  },
  {
    _id: 'adv2',
    name: 'Wild Waadi Water Park, Ranchi',
    activityType: 'Water Park',
    category: 'Adventure',
    type: 'adventure',
    location: 'Plot 311, Dasmile Chowk, Road, near Taurian World School Devi Mandap, Ranchi, Hajam, Jharkhand 835221',
    description: 'A spectacular water park in Ranchi providing a complete retreat with international standard rides and beautiful lush surroundings.',
    images: ['/wild-waadi-ranchi-1.jpg', '/wild-waadi-ranchi-2.jpg'],
    coordinates: { lat: 23.2428, lng: 85.3402 }
  },
  {
    _id: 'adv3',
    name: 'Funmagica Waterpark & Resort',
    activityType: 'Water Park',
    category: 'Adventure',
    type: 'adventure',
    location: ' Purulia Rd, near gurukul public school, Chas, chas, Kashi Jharia, Bokaro Steel City, Jharkhand 827013',
    description: 'Enjoy a magical blend of aquatic slides, swimming zones, and high-end resort amenities. Features rain dancing and an open-air cafeteria.',
    images: ['/fun-magica-1.webp', '/fun-magica-2.webp'],
    coordinates: { lat: 23.6152, lng: 86.1855 }
  },
  {
    _id: 'adv4',
    name: 'SNOWLAND RANCHI',
    activityType: 'Snow Park',
    category: 'Adventure',
    type: 'adventure',
    location: ' NEAR TONKO BRIDGE, RING ROAD TUPUDANA,, Ranchi, Jharkhand 834003',
    description: 'Experience the thrill of a snowy winter wonderland in the heart of Ranchi! Snowland offers dynamic indoor snow slides, sub-zero ice gaming arenas, real snow showers, and beautifully crafted ice sculptures.',
    images: ['/snowland-ranchi.jpg'],
    coordinates: { lat: 23.2840, lng: 85.3120 }
  }
];

// Helper to calculate distance in KM using Haversine
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if(!lat1 || !lon1 || !lat2 || !lon2) return null;
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a)); 
};

export default function MapPage() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState(STATIC_PLACES);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [routingDest, setRoutingDest] = useState(null);
  const [pendingRouteDest, setPendingRouteDest] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [locating, setLocating] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const routeControlRef = useRef(null);

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstance.current) return;
    
    mapInstance.current = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: 7,
      zoomControl: false
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance.current);
    
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

    return () => {
      mapInstance.current.remove();
      mapInstance.current = null;
    };
  }, []);

  // Handle auto-routing once location is loaded
  useEffect(() => {
    if (userLocation && pendingRouteDest) {
      setRoutingDest(pendingRouteDest);
      setPendingRouteDest(null);
    }
  }, [userLocation, pendingRouteDest]);

  // Fetch places
  useEffect(() => {
    Promise.all([
      getPlaces().catch(() => ({ data: [] })),
      getAdventures().catch(() => ({ data: [] }))
    ]).then(([placesRes, adventuresRes]) => {
      let combined = [];

      // Format Places
      if (placesRes.data?.length > 0) {
        const pData = placesRes.data.map(p => {
          const s = STATIC_PLACES.find(sp => sp.name === p.name);
          return { ...p, type: 'place', images: p.images?.length > 0 && !p.images[0]?.includes('wikipedia') ? p.images : (s?.images || []), coordinates: p.coordinates || s?.coordinates };
        });
        combined = [...combined, ...pData];
      }

      // Format Adventures
      if (adventuresRes.data?.length > 0) {
        const advData = adventuresRes.data.map(adv => {
          const coords = getAdventureCoordinates(adv.name);
          const s = STATIC_ADVENTURES.find(sa => sa.name.toLowerCase() === adv.name.toLowerCase());
          return {
            ...adv,
            type: 'adventure',
            category: 'Adventure',
            coordinates: coords,
            images: adv.images?.length > 0 ? adv.images : (s?.images || [])
          };
        });
        combined = [...combined, ...advData];
      }

      const validPlaces = combined.filter(p => p.coordinates?.lat && p.coordinates?.lng);
      STATIC_PLACES.forEach(sp => {
         if (!validPlaces.find(vp => vp.name === sp.name)) {
            validPlaces.push(sp);
         }
      });
      STATIC_ADVENTURES.forEach(sa => {
         if (!validPlaces.find(vp => vp.name.toLowerCase() === sa.name.toLowerCase())) {
            validPlaces.push(sa);
         }
      });
      setPlaces(validPlaces);
    });
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setToastMsg("Geolocation is not supported by your browser");
      showToast();
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setSearchFocusedLocation({ lat: latitude, lng: longitude });
        setToastMsg("Location found!");
        showToast();
      },
      (error) => {
        setLocating(false);
        setToastMsg("Could not retrieve location. Permission denied.");
        showToast();
      }
    );
  };

  const showToast = () => {
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAddToItinerary = (place) => {
    setToastMsg(`${place.name} added to your itinerary!`);
    showToast();
  };

  const handleRouteTo = (place) => {
    if(!userLocation) {
      setToastMsg("Please allow location access to get directions.");
      showToast();
      setPendingRouteDest(place.coordinates);
      handleLocateMe();
      return;
    }
    setRoutingDest(place.coordinates);
    setToastMsg(`Calculating route to ${place.name}...`);
    showToast();
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if(val.length > 2) {
      const match = places.find(p => p.name.toLowerCase().includes(val.toLowerCase()));
      if(match && match.coordinates) {
        setSelectedPlace(match); // highlight in sidebar list
        if (mapInstance.current) {
          mapInstance.current.flyTo([match.coordinates.lat, match.coordinates.lng], 13, { duration: 1.5 });
        }
        setTimeout(() => {
           const el = document.getElementById(`place-item-${match._id}`);
           if(el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    } else if (val.length === 0) {
      if (mapInstance.current) {
        mapInstance.current.flyTo(DEFAULT_CENTER, 7, { duration: 1 });
      }
      setSelectedPlace(null);
    }
  };

  const handleViewDetails = (place) => {
    if(place.type === 'homestay') navigate('/homestays');
    else if(place.type === 'handicraft') navigate('/handicrafts');
    else if(place.type === 'adventure') navigate('/adventure');
    else navigate('/places'); // Fallback to general places index if separate ID zoom isn't implemented
  };

  const filteredPlaces = places.filter(p => {
    if (filter === 'Homestays' && p.category !== 'Homestays') return false;
    if (filter === 'Handicrafts' && p.category !== 'Handicrafts') return false;
    if (filter === 'Adventure' && p.category !== 'Adventure') return false;
    if (filter === 'Places' && ['Homestays', 'Handicrafts', 'Adventure'].includes(p.category)) return false;
    if (filter === 'Eco' && p.category !== 'Eco') return false;
    if (filter === 'Heritage' && p.category !== 'Heritage') return false;
    if (filter === 'Cultural' && p.category !== 'Cultural') return false;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  // Manage Markers
  useEffect(() => {
    if (!mapInstance.current) return;
    
    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredPlaces.forEach(place => {
      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon: createIcon(categoryToColor[place.category] || categoryToColor.Default)
      }).addTo(mapInstance.current);

      // Create a popup node to render React into
      const popupDiv = document.createElement('div');
      
      const PopupComponent = () => {
        const distanceStr = userLocation ? ` • ${calculateDistance(userLocation.lat, userLocation.lng, place.coordinates.lat, place.coordinates.lng).toFixed(1)} km away` : '';
        return (
          <div className="custom-popup p-0 m-0 w-[260px]">
            <img src={place.images?.[0] || 'https://via.placeholder.com/260x130'} alt={place.name} className="w-full h-32 object-cover rounded-t-xl" />
            <div className="p-4 pt-3 pb-3">
               <div className="flex justify-between items-center mb-1">
                 <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${categoryColors[place.category]?.badge || 'bg-gray-100 text-gray-700'}`}>{place.category}</span>
                 <span className="text-xs text-blue-600 font-semibold">{distanceStr}</span>
               </div>
               <h3 className="font-bold text-lg m-0 leading-tight text-gray-800">{place.name}</h3>
               <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-snug">{place.description}</p>
               <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={(e) => { e.stopPropagation(); handleViewDetails(place); }} className="flex-1 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                    View Details
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleRouteTo(place); }} className="px-3 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded-lg text-sm font-semibold flex items-center justify-center cursor-pointer transition-colors" title="Get Directions">
                    <Navigation size={16} />
                  </button>
               </div>
            </div>
          </div>
        );
      };

      const root = createRoot(popupDiv);
      root.render(<PopupComponent />);

      marker.bindPopup(popupDiv, { minWidth: 260, className: 'custom-leaflet-popup-wrapper' });

      marker.on('click', () => {
        setSelectedPlace(place);
        mapInstance.current.flyTo([place.coordinates.lat, place.coordinates.lng], 13, { duration: 1.5 });
        const el = document.getElementById(`place-item-${place._id}`);
        if(el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });

      // Cleanup root on removal
      marker.on('remove', () => {
         setTimeout(() => root.unmount(), 0);
      });

      markersRef.current.push(marker);
    });
  }, [filteredPlaces, filter, search]);

  // Manage User Location Marker
  useEffect(() => {
    if (!mapInstance.current || !userLocation) return;
    
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: new L.DivIcon({
        className: 'user-location-icon',
        html: `<div style="background-color: #3b82f6; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px rgba(59, 130, 246, 0.9);"></div>`,
        iconSize: [18, 18]
      })
    }).addTo(mapInstance.current);
    
    mapInstance.current.flyTo([userLocation.lat, userLocation.lng], 13);
  }, [userLocation]);

  // Manage Routing
  useEffect(() => {
    if (!mapInstance.current || !userLocation || !routingDest) return;
    
    if (routeControlRef.current) {
      mapInstance.current.removeControl(routeControlRef.current);
    }
    
    routeControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(routingDest.lat, routingDest.lng)
      ],
      lineOptions: { styles: [{ color: '#16a34a', opacity: 0.8, weight: 6 }] },
      createMarker: () => null,
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
    }).addTo(mapInstance.current);
    
  }, [routingDest, userLocation]);

  // Parse URL query parameters to auto-select and auto-route
  useEffect(() => {
    if (places.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const selectName = params.get('select');
    const directRoute = params.get('route');

    if (selectName) {
      const decodedName = decodeURIComponent(selectName).toLowerCase();
      const match = places.find(p => p.name.toLowerCase().includes(decodedName) || decodedName.includes(p.name.toLowerCase()));
      if (match && match.coordinates) {
        setSelectedPlace(match);
        setFilter('All'); // Ensure it is visible in the list

        if (mapInstance.current) {
          mapInstance.current.flyTo([match.coordinates.lat, match.coordinates.lng], 13, { duration: 1.5 });
        }

        if (directRoute === 'true') {
          handleRouteTo(match);
        }

        // Scroll sidebar item into view
        setTimeout(() => {
          const el = document.getElementById(`place-item-${match._id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
      }
    }
  }, [places]);

  return (
    <div className="min-h-screen bg-light flex flex-col relative overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, x: '-50%' }} 
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[1000] bg-green-900 text-white px-5 py-3 rounded-full shadow-2xl font-medium flex items-center gap-2"
          >
            <Info size={18} />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-green-600 text-white py-12 px-4 text-center shrink-0 flex flex-col items-center justify-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-3 leading-none flex flex-col items-center justify-center"
        >
          <span className="font-script text-white text-4xl md:text-5xl block mb-2 font-normal tracking-wide">
            Interactive
          </span>
          <span className="font-playfair text-accent text-5xl md:text-6xl font-black tracking-widest uppercase block drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            Jharkhand Map
          </span>
        </motion.h1>
        <p className="text-green-100 text-lg">Explore all tourist spots, eco-zones, and heritage sites across Jharkhand.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-grow flex flex-col min-h-0">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex gap-2 flex-wrap justify-center max-w-2xl">
            {['All', 'Places', 'Adventure', 'Eco', 'Heritage', 'Cultural'].map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 text-sm rounded-full font-medium transition-all ${filter === cat ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'}`}>
                {cat === 'Places' && '📍 '}
                {cat === 'Adventure' && '🧭 '}
                {cat === 'Eco' && '🌿 '}
                {cat === 'Heritage' && '🛕 '}
                {cat === 'Cultural' && '🎭 '}
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={handleSearch} placeholder="Search places..."
                className="w-full pl-10 pr-4 py-2.5 md:py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
            </div>
            <button onClick={handleLocateMe} disabled={locating}
              className="px-5 py-2.5 md:py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm whitespace-nowrap text-dark font-medium cursor-pointer w-full sm:w-auto">
              <Crosshair size={18} className={locating ? 'animate-pulse text-blue-500' : 'text-primary'} />
              <span>{locating ? 'Locating...' : 'Locate Me'}</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 flex-grow min-h-[500px]">
          {/* Map Section */}
          <div className="lg:col-span-2 relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden z-10 flex flex-col h-[500px] lg:h-auto">
            <div 
              ref={mapContainerRef} 
              style={{ width: '100%', height: '100%', flexGrow: 1 }}
              className="z-0"
            />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5 lg:max-h-full">
            {/* Context Card */}
            {selectedPlace ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 shrink-0 flex flex-col shadow-green-900/5 ring-1 ring-green-600/10">
                <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-md mb-3 w-max ${categoryColors[selectedPlace.category]?.badge}`}>
                  {categoryColors[selectedPlace.category]?.icon} {selectedPlace.category}
                </div>
                <h2 className="text-2xl font-bold text-dark leading-tight">{selectedPlace.name}</h2>
                <div className="h-40 overflow-hidden rounded-xl mt-3 mb-3 shrink-0 bg-gray-100">
                   <img src={selectedPlace.images?.[0] || 'https://via.placeholder.com/300x150'} alt={selectedPlace.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{selectedPlace.description}</p>
                <div className="mt-auto flex gap-3 pt-4 border-t border-gray-50">
                   <button onClick={() => handleViewDetails(selectedPlace)} className="flex-1 text-center py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-green-700 hover:shadow-md transition">View Details</button>
                   <button onClick={() => handleRouteTo(selectedPlace)} title="Directions" className="px-4 py-2.5 border-2 border-gray-100 rounded-xl shrink-0 text-gray-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 flex items-center transition cursor-pointer">
                     <Navigation size={18} />
                   </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center text-gray-400 shrink-0 h-[380px]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <MapPin size={28} className="text-gray-300" />
                </div>
                <p className="font-bold text-gray-700 text-lg">No Location Selected</p>
                <p className="text-sm mx-4 mt-2 leading-relaxed max-w-xs">Click a marker on the interactive map or select a place from the list below to view details and get directions.</p>
              </div>
            )}

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-grow min-h-[300px]">
              <div className="px-5 py-4 border-b border-gray-100 font-bold text-dark flex justify-between items-center bg-gray-50/50 shrink-0">
                <span>Available Locations</span>
                <span className="bg-white border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full text-xs shadow-sm">{filteredPlaces.length}</span>
              </div>
              <div className="overflow-y-auto flex-grow p-2">
                {filteredPlaces.length > 0 ? filteredPlaces.map((place) => {
                  const dist = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, place.coordinates.lat, place.coordinates.lng) : null;
                  return (
                  <div key={place._id} id={`place-item-${place._id}`} onClick={() => { 
                    setSelectedPlace(place); 
                    if(mapInstance.current) {
                      mapInstance.current.flyTo([place.coordinates.lat, place.coordinates.lng], 13);
                    }
                  }}
                    className={`flex items-start gap-4 p-3 rounded-xl mb-1 cursor-pointer transition-all ${selectedPlace?._id === place._id ? 'bg-green-50 ring-1 ring-green-600/20' : 'hover:bg-gray-50 border border-transparent'}`}>
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 shadow-inner">
                      <img src={place.images?.[0] || 'https://via.placeholder.com/100x100'} alt={place.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0 pt-0.5">
                      <p className={`text-sm font-bold truncate ${selectedPlace?._id === place._id ? 'text-primary' : 'text-gray-800'}`}>{place.name}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{place.category} {dist ? `• ${dist.toFixed(1)}km` : ''}</p>
                    </div>
                    {selectedPlace?._id === place._id && <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0 shadow-sm shadow-primary/40" />}
                  </div>
                )}) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                    <AlertTriangle size={24} className="mb-3 opacity-40 text-amber-500" />
                    <p className="text-sm font-medium text-gray-600">No matches found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Overriding Leaflet default styles to ensure proper rendering */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container {
          font-family: inherit;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          width: 260px !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
        }
        .leaflet-routing-container {
          background-color: white !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          border: 1px solid #e5e7eb !important;
          padding: 8px !important;
          font-family: inherit !important;
          max-height: 250px !important;
          overflow-y: auto !important;
        }
        .leaflet-routing-alt h2 {
          font-size: 14px !important;
          color: #16a34a !important;
        }
        .leaflet-routing-alt table {
          font-size: 12px !important;
        }
      `}} />
    </div>
  );
}
