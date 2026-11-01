import type { Photo } from '../types';

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: 'photo-1',
    title: 'Neon Cyber City at Night',
    description: 'Bustling metropolis illuminated by neon lights and futuristic architecture during a clear summer evening.',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    category: 'Cyberpunk',
    tags: ['Neon', 'Cityscape', 'Night', 'Futuristic', 'Tokyo'],
    author: {
      name: 'Elena Rostova',
      username: '@elena_photos',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Shinjuku, Tokyo, Japan',
    exif: {
      makeModel: 'Sony A7R IV',
      lens: 'FE 24-70mm F2.8 GM',
      focalLength: '35mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/60s',
      iso: 800
    },
    likes: 1420,
    views: 8930,
    downloads: 412,
    date: '2026-07-15',
    dimensions: '6000 x 4000',
    aspectRatio: 'landscape'
  },
  {
    id: 'photo-2',
    title: 'Majestic Mountain Summit',
    description: 'Golden hour reflection on snow-capped peaks surrounding a crystal clear alpine lake.',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    category: 'Landscape',
    tags: ['Mountains', 'Sunset', 'Alpine', 'Reflections', 'Nature'],
    author: {
      name: 'Marcus Vance',
      username: '@marcus_vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Banff National Park, Canada',
    exif: {
      makeModel: 'Canon EOS R5',
      lens: 'RF 15-35mm F2.8L',
      focalLength: '16mm',
      aperture: 'f/8.0',
      shutterSpeed: '1/250s',
      iso: 100
    },
    likes: 2180,
    views: 14200,
    downloads: 980,
    date: '2026-06-20',
    dimensions: '8192 x 5464',
    aspectRatio: 'landscape'
  },
  {
    id: 'photo-3',
    title: 'Geometrical Spiral Staircase',
    description: 'Minimalist architecture capturing sweeping curves and dramatic shadows in a modern gallery building.',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    category: 'Architecture',
    tags: ['Spiral', 'Minimalism', 'Interior', 'Shadows', 'Modern'],
    author: {
      name: 'Sofia Chen',
      username: '@sofia_arch',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Berlin, Germany',
    exif: {
      makeModel: 'Fujifilm X-T4',
      lens: 'XF 10-24mm F4 R OIS',
      focalLength: '10mm',
      aperture: 'f/5.6',
      shutterSpeed: '1/125s',
      iso: 400
    },
    likes: 890,
    views: 5410,
    downloads: 230,
    date: '2026-05-11',
    dimensions: '6240 x 4160',
    aspectRatio: 'square'
  },
  {
    id: 'photo-4',
    title: 'Solitary Red Fox in Snow',
    description: 'A sharp focus shot of a wild red fox standing calmly in a quiet winter pine forest.',
    url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80',
    category: 'Wildlife',
    tags: ['Fox', 'Snow', 'Winter', 'Wildlife', 'Forest'],
    author: {
      name: 'Erik Lindqvist',
      username: '@erik_wildlife',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Lapland, Finland',
    exif: {
      makeModel: 'Nikon Z9',
      lens: 'NIKKOR Z 400mm f/2.8 TC VR S',
      focalLength: '400mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/1000s',
      iso: 200
    },
    likes: 3120,
    views: 19800,
    downloads: 1450,
    date: '2026-04-03',
    dimensions: '8256 x 5504',
    aspectRatio: 'portrait'
  },
  {
    id: 'photo-5',
    title: 'Rainy Umbrella Street Walk',
    description: 'Atmospheric street view capturing yellow reflections on wet cobblestones as commuters cross under umbrellas.',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80',
    category: 'Street',
    tags: ['Rain', 'Umbrella', 'Reflections', 'Urban', 'Mood'],
    author: {
      name: 'Chloe Dupont',
      username: '@chloe_street',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Paris, France',
    exif: {
      makeModel: 'Leica Q2',
      lens: 'Summilux 28mm f/1.7 ASPH',
      focalLength: '28mm',
      aperture: 'f/1.7',
      shutterSpeed: '1/250s',
      iso: 640
    },
    likes: 1650,
    views: 9230,
    downloads: 510,
    date: '2026-07-28',
    dimensions: '5050 x 3367',
    aspectRatio: 'landscape'
  },
  {
    id: 'photo-6',
    title: 'Prism Light Waves Abstract',
    description: 'Dynamic light refraction through triangular crystal glass forming vivid spectral gradients.',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    category: 'Abstract',
    tags: ['Prism', 'Rainbow', 'Light', 'Abstract', 'Gradients'],
    author: {
      name: 'Aria Sterling',
      username: '@aria_abstract',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Studio 4, London, UK',
    exif: {
      makeModel: 'Sony A7 IV',
      lens: '90mm Macro F2.8 G',
      focalLength: '90mm',
      aperture: 'f/11',
      shutterSpeed: '1/4s',
      iso: 100
    },
    likes: 740,
    views: 4320,
    downloads: 195,
    date: '2026-03-19',
    dimensions: '7000 x 4667',
    aspectRatio: 'square'
  },
  {
    id: 'photo-7',
    title: 'Golden Sunset Coastline',
    description: 'Waves crashing softly against dramatic cliff rocks during an intense orange and violet sunset.',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: 'Landscape',
    tags: ['Ocean', 'Sunset', 'Beach', 'Waves', 'Seascape'],
    author: {
      name: 'Marcus Vance',
      username: '@marcus_vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Big Sur, California, USA',
    exif: {
      makeModel: 'Canon EOS R5',
      lens: 'RF 24-70mm F2.8L',
      focalLength: '24mm',
      aperture: 'f/11',
      shutterSpeed: '2.5s',
      iso: 100
    },
    likes: 2950,
    views: 18400,
    downloads: 1120,
    date: '2026-08-01',
    dimensions: '8192 x 5464',
    aspectRatio: 'landscape'
  },
  {
    id: 'photo-8',
    title: 'Thoughtful Portrait in Natural Light',
    description: 'Expressive close-up portrait illuminated by soft window lighting against a neutral dark backdrop.',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    category: 'Portrait',
    tags: ['Portrait', 'NaturalLight', 'Expression', 'People', 'Studio'],
    author: {
      name: 'Elena Rostova',
      username: '@elena_photos',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Milan, Italy',
    exif: {
      makeModel: 'Sony A7R IV',
      lens: 'FE 85mm F1.4 GM',
      focalLength: '85mm',
      aperture: 'f/1.4',
      shutterSpeed: '1/500s',
      iso: 100
    },
    likes: 1890,
    views: 11300,
    downloads: 720,
    date: '2026-07-04',
    dimensions: '6000 x 4000',
    aspectRatio: 'portrait'
  },
  {
    id: 'photo-9',
    title: 'Glass Skyscraper Skyward Angle',
    description: 'Looking directly up at towering glass skyscrapers mirroring drifting cloud formations in high contrast.',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    category: 'Architecture',
    tags: ['Skyscraper', 'Glass', 'Reflection', 'City', 'Modern'],
    author: {
      name: 'Sofia Chen',
      username: '@sofia_arch',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Financial District, New York, USA',
    exif: {
      makeModel: 'Fujifilm X-T4',
      lens: 'XF 8-16mm F2.8 R LM WR',
      focalLength: '8mm',
      aperture: 'f/8.0',
      shutterSpeed: '1/320s',
      iso: 160
    },
    likes: 1240,
    views: 7890,
    downloads: 340,
    date: '2026-06-14',
    dimensions: '6240 x 4160',
    aspectRatio: 'portrait'
  },
  {
    id: 'photo-10',
    title: 'Hummingbird Hovering Near Blossom',
    description: 'High shutter speed capturing crisp wing motion of a ruby-throated hummingbird feeding on wild orchids.',
    url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&q=80',
    category: 'Wildlife',
    tags: ['Hummingbird', 'Bird', 'Flora', 'HighSpeed', 'Nature'],
    author: {
      name: 'Erik Lindqvist',
      username: '@erik_wildlife',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Monteverde Cloud Forest, Costa Rica',
    exif: {
      makeModel: 'Nikon Z9',
      lens: 'NIKKOR Z 100-400mm f/4.5-5.6 VR S',
      focalLength: '300mm',
      aperture: 'f/5.6',
      shutterSpeed: '1/4000s',
      iso: 1600
    },
    likes: 2430,
    views: 15600,
    downloads: 870,
    date: '2026-05-29',
    dimensions: '8256 x 5504',
    aspectRatio: 'square'
  },
  {
    id: 'photo-11',
    title: 'Fluorescent Alley Alleyway',
    description: 'Vibrant pink and cyan neon sign glows casting cinematic reflections on rain-soaked asphalt.',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    category: 'Cyberpunk',
    tags: ['Neon', 'Alleyway', 'Cyan', 'Pink', 'Cyberpunk'],
    author: {
      name: 'Elena Rostova',
      username: '@elena_photos',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Hong Kong Island',
    exif: {
      makeModel: 'Sony A7R IV',
      lens: 'FE 35mm F1.4 GM',
      focalLength: '35mm',
      aperture: 'f/1.4',
      shutterSpeed: '1/125s',
      iso: 400
    },
    likes: 1980,
    views: 12400,
    downloads: 640,
    date: '2026-07-22',
    dimensions: '6000 x 4000',
    aspectRatio: 'landscape'
  },
  {
    id: 'photo-12',
    title: 'Fluid Acrylic Swirl Abstract',
    description: 'Swirling metallic gold and deep indigo acrylic paints creating fluid macro textures.',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    category: 'Abstract',
    tags: ['Paint', 'Gold', 'Indigo', 'Macro', 'Texture'],
    author: {
      name: 'Aria Sterling',
      username: '@aria_abstract',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
    },
    location: 'Studio 4, London, UK',
    exif: {
      makeModel: 'Sony A7 IV',
      lens: '90mm Macro F2.8 G',
      focalLength: '90mm',
      aperture: 'f/16',
      shutterSpeed: '1/2s',
      iso: 100
    },
    likes: 1110,
    views: 6780,
    downloads: 310,
    date: '2026-02-18',
    dimensions: '7000 x 4667',
    aspectRatio: 'landscape'
  }
];

export const CATEGORIES: { name: string; description: string }[] = [
  { name: 'All', description: 'Explore all stunning photos across categories' },
  { name: 'Landscape', description: 'Breathtaking mountains, seascapes, and natural wonders' },
  { name: 'Architecture', description: 'Modern skyscrapers, geometric interiors, and classic structural art' },
  { name: 'Wildlife', description: 'Wild animals, birds, and insects in their natural habitats' },
  { name: 'Street', description: 'Spontaneous candid moments and urban life perspectives' },
  { name: 'Portrait', description: 'Emotive portrait photography and human stories' },
  { name: 'Abstract', description: 'Light refractions, colors, macros, and conceptual patterns' },
  { name: 'Cyberpunk', description: 'Futuristic night scenes, neon glow, and high-tech aesthetics' },
];
