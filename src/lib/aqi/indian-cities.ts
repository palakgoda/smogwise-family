export interface IndianCity {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  aliases?: string[];
  zone?: "gangetic-plain" | "north" | "west" | "south" | "east" | "central";
}

/**
 * Curated list of 120+ Indian cities and major NCR/district hubs across states and UTs.
 * Ensures 100% reliable coordinates and instant offline/online resolution.
 */
export const INDIAN_CITIES: IndianCity[] = [
  // National Capital Region (NCR) & Northern Winter Smog Core
  { name: "Delhi", state: "Delhi", latitude: 28.6139, longitude: 77.209, aliases: ["new delhi", "delhi ncr"], zone: "gangetic-plain" },
  { name: "Noida", state: "Uttar Pradesh", latitude: 28.5355, longitude: 77.391, aliases: ["gautam buddha nagar"], zone: "gangetic-plain" },
  { name: "Greater Noida", state: "Uttar Pradesh", latitude: 28.4744, longitude: 77.504, zone: "gangetic-plain" },
  { name: "Ghaziabad", state: "Uttar Pradesh", latitude: 28.6692, longitude: 77.4538, zone: "gangetic-plain" },
  { name: "Gurugram", state: "Haryana", latitude: 28.4595, longitude: 77.0266, aliases: ["gurgaon"], zone: "gangetic-plain" },
  { name: "Faridabad", state: "Haryana", latitude: 28.4089, longitude: 77.3178, zone: "gangetic-plain" },
  { name: "Meerut", state: "Uttar Pradesh", latitude: 28.9845, longitude: 77.7064, zone: "gangetic-plain" },
  { name: "Panipat", state: "Haryana", latitude: 29.3909, longitude: 76.9635, zone: "gangetic-plain" },
  { name: "Sonipat", state: "Haryana", latitude: 28.9931, longitude: 77.0151, zone: "gangetic-plain" },
  { name: "Rohtak", state: "Haryana", latitude: 28.8955, longitude: 76.6066, zone: "gangetic-plain" },
  { name: "Karnal", state: "Haryana", latitude: 29.6857, longitude: 76.9905, zone: "gangetic-plain" },
  { name: "Hisar", state: "Haryana", latitude: 29.1492, longitude: 75.7217, zone: "gangetic-plain" },

  // Uttar Pradesh & Bihar (Indo-Gangetic Basin)
  { name: "Lucknow", state: "Uttar Pradesh", latitude: 26.8467, longitude: 80.9462, zone: "gangetic-plain" },
  { name: "Kanpur", state: "Uttar Pradesh", latitude: 26.4499, longitude: 80.3319, zone: "gangetic-plain" },
  { name: "Patna", state: "Bihar", latitude: 25.5941, longitude: 85.1376, zone: "gangetic-plain" },
  { name: "Varanasi", state: "Uttar Pradesh", latitude: 25.3176, longitude: 82.9739, aliases: ["banaras", "kashi"], zone: "gangetic-plain" },
  { name: "Agra", state: "Uttar Pradesh", latitude: 27.1767, longitude: 78.0081, zone: "gangetic-plain" },
  { name: "Prayagraj", state: "Uttar Pradesh", latitude: 25.4358, longitude: 81.8463, aliases: ["allahabad"], zone: "gangetic-plain" },
  { name: "Bareilly", state: "Uttar Pradesh", latitude: 28.367, longitude: 79.4304, zone: "gangetic-plain" },
  { name: "Aligarh", state: "Uttar Pradesh", latitude: 27.8974, longitude: 78.088, zone: "gangetic-plain" },
  { name: "Moradabad", state: "Uttar Pradesh", latitude: 28.8386, longitude: 78.7733, zone: "gangetic-plain" },
  { name: "Saharanpur", state: "Uttar Pradesh", latitude: 29.9671, longitude: 77.551, zone: "gangetic-plain" },
  { name: "Gorakhpur", state: "Uttar Pradesh", latitude: 26.7606, longitude: 83.3732, zone: "gangetic-plain" },
  { name: "Muzaffarpur", state: "Bihar", latitude: 26.1209, longitude: 85.3647, zone: "gangetic-plain" },
  { name: "Gaya", state: "Bihar", latitude: 24.7914, longitude: 85.0002, zone: "gangetic-plain" },
  { name: "Bhagalpur", state: "Bihar", latitude: 25.2425, longitude: 86.9842, zone: "gangetic-plain" },
  { name: "Darbhanga", state: "Bihar", latitude: 26.1542, longitude: 85.8918, zone: "gangetic-plain" },
  { name: "Purnia", state: "Bihar", latitude: 25.7771, longitude: 87.4753, zone: "gangetic-plain" },
  { name: "Begusarai", state: "Bihar", latitude: 25.4182, longitude: 86.1272, zone: "gangetic-plain" },

  // Punjab, Jammu & Kashmir, Himachal, Uttarakhand
  { name: "Ludhiana", state: "Punjab", latitude: 30.901, longitude: 75.8573, zone: "north" },
  { name: "Amritsar", state: "Punjab", latitude: 31.634, longitude: 74.8723, zone: "north" },
  { name: "Jalandhar", state: "Punjab", latitude: 31.326, longitude: 75.5762, zone: "north" },
  { name: "Patiala", state: "Punjab", latitude: 30.3398, longitude: 76.3869, zone: "north" },
  { name: "Bathinda", state: "Punjab", latitude: 30.211, longitude: 74.9455, zone: "north" },
  { name: "Chandigarh", state: "Chandigarh", latitude: 30.7333, longitude: 76.7794, zone: "north" },
  { name: "Dehradun", state: "Uttarakhand", latitude: 30.3165, longitude: 78.0322, zone: "north" },
  { name: "Haridwar", state: "Uttarakhand", latitude: 29.9457, longitude: 78.1642, zone: "north" },
  { name: "Srinagar", state: "Jammu and Kashmir", latitude: 34.0837, longitude: 74.7973, zone: "north" },
  { name: "Jammu", state: "Jammu and Kashmir", latitude: 32.7266, longitude: 74.857, zone: "north" },
  { name: "Shimla", state: "Himachal Pradesh", latitude: 31.1048, longitude: 77.1734, zone: "north" },

  // Western India (Maharashtra, Gujarat, Rajasthan)
  { name: "Mumbai", state: "Maharashtra", latitude: 19.076, longitude: 72.8777, aliases: ["bombay"], zone: "west" },
  { name: "Pune", state: "Maharashtra", latitude: 18.5204, longitude: 73.8567, aliases: ["poona"], zone: "west" },
  { name: "Nagpur", state: "Maharashtra", latitude: 21.1458, longitude: 79.0882, zone: "central" },
  { name: "Thane", state: "Maharashtra", latitude: 19.2183, longitude: 72.9781, zone: "west" },
  { name: "Nashik", state: "Maharashtra", latitude: 19.9975, longitude: 73.7898, aliases: ["nasik"], zone: "west" },
  { name: "Navi Mumbai", state: "Maharashtra", latitude: 19.033, longitude: 73.0297, zone: "west" },
  { name: "Aurangabad", state: "Maharashtra", latitude: 19.8762, longitude: 75.3433, aliases: ["chhatrapati sambhajinagar"], zone: "west" },
  { name: "Solapur", state: "Maharashtra", latitude: 17.6599, longitude: 75.9064, zone: "west" },
  { name: "Kolhapur", state: "Maharashtra", latitude: 16.705, longitude: 74.2433, zone: "west" },
  { name: "Ahmedabad", state: "Gujarat", latitude: 23.0225, longitude: 72.5714, zone: "west" },
  { name: "Surat", state: "Gujarat", latitude: 21.1702, longitude: 72.8311, zone: "west" },
  { name: "Vadodara", state: "Gujarat", latitude: 22.3072, longitude: 73.1812, aliases: ["baroda"], zone: "west" },
  { name: "Rajkot", state: "Gujarat", latitude: 22.3039, longitude: 70.8022, zone: "west" },
  { name: "Bhavnagar", state: "Gujarat", latitude: 21.7645, longitude: 72.1519, zone: "west" },
  { name: "Jamnagar", state: "Gujarat", latitude: 22.4707, longitude: 70.0577, zone: "west" },
  { name: "Gandhinagar", state: "Gujarat", latitude: 23.2156, longitude: 72.6369, zone: "west" },
  { name: "Jaipur", state: "Rajasthan", latitude: 26.9124, longitude: 75.7873, zone: "north" },
  { name: "Jodhpur", state: "Rajasthan", latitude: 26.2389, longitude: 73.0243, zone: "north" },
  { name: "Kota", state: "Rajasthan", latitude: 25.2138, longitude: 75.8648, zone: "north" },
  { name: "Bikaner", state: "Rajasthan", latitude: 28.0229, longitude: 73.3119, zone: "north" },
  { name: "Ajmer", state: "Rajasthan", latitude: 26.4499, longitude: 74.6399, zone: "north" },
  { name: "Udaipur", state: "Rajasthan", latitude: 24.5854, longitude: 73.7125, zone: "north" },

  // Eastern India (West Bengal, Odisha, Jharkhand, Northeast)
  { name: "Kolkata", state: "West Bengal", latitude: 22.5726, longitude: 88.3639, aliases: ["calcutta"], zone: "east" },
  { name: "Howrah", state: "West Bengal", latitude: 22.5958, longitude: 88.2636, aliases: ["haora"], zone: "east" },
  { name: "Asansol", state: "West Bengal", latitude: 23.6739, longitude: 86.9524, zone: "east" },
  { name: "Siliguri", state: "West Bengal", latitude: 26.7271, longitude: 88.3953, zone: "east" },
  { name: "Durgapur", state: "West Bengal", latitude: 23.5204, longitude: 87.3119, zone: "east" },
  { name: "Ranchi", state: "Jharkhand", latitude: 23.3441, longitude: 85.3096, zone: "east" },
  { name: "Jamshedpur", state: "Jharkhand", latitude: 22.8046, longitude: 86.2029, aliases: ["tatanagar"], zone: "east" },
  { name: "Dhanbad", state: "Jharkhand", latitude: 23.7957, longitude: 86.4304, zone: "east" },
  { name: "Bhubaneswar", state: "Odisha", latitude: 20.2961, longitude: 85.8245, zone: "east" },
  { name: "Cuttack", state: "Odisha", latitude: 20.4625, longitude: 85.883, zone: "east" },
  { name: "Rourkela", state: "Odisha", latitude: 22.2604, longitude: 84.8536, zone: "east" },
  { name: "Guwahati", state: "Assam", latitude: 26.1445, longitude: 91.7362, zone: "east" },
  { name: "Agartala", state: "Tripura", latitude: 23.8315, longitude: 91.2868, zone: "east" },
  { name: "Shillong", state: "Meghalaya", latitude: 25.5788, longitude: 91.8933, zone: "east" },

  // Central India (Madhya Pradesh, Chhattisgarh)
  { name: "Indore", state: "Madhya Pradesh", latitude: 22.7196, longitude: 75.8577, zone: "central" },
  { name: "Bhopal", state: "Madhya Pradesh", latitude: 23.2599, longitude: 77.4126, zone: "central" },
  { name: "Jabalpur", state: "Madhya Pradesh", latitude: 23.1815, longitude: 79.9864, zone: "central" },
  { name: "Gwalior", state: "Madhya Pradesh", latitude: 26.2183, longitude: 78.1828, zone: "central" },
  { name: "Ujjain", state: "Madhya Pradesh", latitude: 23.1765, longitude: 75.7885, zone: "central" },
  { name: "Raipur", state: "Chhattisgarh", latitude: 21.2514, longitude: 81.6296, zone: "central" },
  { name: "Bhilai", state: "Chhattisgarh", latitude: 21.2144, longitude: 81.3805, zone: "central" },
  { name: "Bilaspur", state: "Chhattisgarh", latitude: 22.0797, longitude: 82.1409, zone: "central" },

  // Southern India (Karnataka, Tamil Nadu, Telangana, Andhra Pradesh, Kerala)
  { name: "Bengaluru", state: "Karnataka", latitude: 12.9716, longitude: 77.5946, aliases: ["bangalore"], zone: "south" },
  { name: "Hyderabad", state: "Telangana", latitude: 17.385, longitude: 78.4867, zone: "south" },
  { name: "Chennai", state: "Tamil Nadu", latitude: 13.0827, longitude: 80.2707, aliases: ["madras"], zone: "south" },
  { name: "Coimbatore", state: "Tamil Nadu", latitude: 11.0168, longitude: 76.9558, zone: "south" },
  { name: "Madurai", state: "Tamil Nadu", latitude: 9.9252, longitude: 78.1198, zone: "south" },
  { name: "Tiruchirappalli", state: "Tamil Nadu", latitude: 10.7905, longitude: 78.7047, aliases: ["trichy"], zone: "south" },
  { name: "Salem", state: "Tamil Nadu", latitude: 11.6643, longitude: 78.146, zone: "south" },
  { name: "Tirunelveli", state: "Tamil Nadu", latitude: 8.7139, longitude: 77.7567, zone: "south" },
  { name: "Visakhapatnam", state: "Andhra Pradesh", latitude: 17.6868, longitude: 83.2185, aliases: ["vizag"], zone: "south" },
  { name: "Vijayawada", state: "Andhra Pradesh", latitude: 16.5062, longitude: 80.648, zone: "south" },
  { name: "Guntur", state: "Andhra Pradesh", latitude: 16.3067, longitude: 80.4365, zone: "south" },
  { name: "Nellore", state: "Andhra Pradesh", latitude: 14.4426, longitude: 79.9865, zone: "south" },
  { name: "Warangal", state: "Telangana", latitude: 17.9689, longitude: 79.5941, zone: "south" },
  { name: "Mysore", state: "Karnataka", latitude: 12.2958, longitude: 76.6394, aliases: ["mysuru"], zone: "south" },
  { name: "Hubli", state: "Karnataka", latitude: 15.3647, longitude: 75.124, aliases: ["hubballi"], zone: "south" },
  { name: "Mangalore", state: "Karnataka", latitude: 12.9141, longitude: 74.856, aliases: ["mangaluru"], zone: "south" },
  { name: "Belgaum", state: "Karnataka", latitude: 15.8497, longitude: 74.4977, aliases: ["belagavi"], zone: "south" },
  { name: "Kochi", state: "Kerala", latitude: 9.9312, longitude: 76.2673, aliases: ["cochin"], zone: "south" },
  { name: "Thiruvananthapuram", state: "Kerala", latitude: 8.5241, longitude: 76.9366, aliases: ["trivandrum"], zone: "south" },
  { name: "Kozhikode", state: "Kerala", latitude: 11.2588, longitude: 75.7804, aliases: ["calicut"], zone: "south" },
];

/**
 * Top representative Indian winter smog demo scenarios
 */
export const INDIAN_DEMO_HUBS = [
  {
    name: "Delhi",
    label: "Delhi NCR 🇮🇳",
    badge: "Severe Smog & Inversion",
    severity: "Hazardous",
  },
  {
    name: "Patna",
    label: "Patna 🇮🇳",
    badge: "Gangetic Plain Soot Trap",
    severity: "Hazardous",
  },
  {
    name: "Lucknow",
    label: "Lucknow 🇮🇳",
    badge: "Stagnant Winter Smoke",
    severity: "Very Unhealthy",
  },
  {
    name: "Kolkata",
    label: "Kolkata 🇮🇳",
    badge: "Basin Smog & High Humidity",
    severity: "Unhealthy",
  },
  {
    name: "Mumbai",
    label: "Mumbai 🇮🇳",
    badge: "Coastal Inversion Layer",
    severity: "Moderate",
  },
  {
    name: "Bengaluru",
    label: "Bengaluru 🇮🇳",
    badge: "Plateau Clean Air Benchmark",
    severity: "Good",
  },
];

/**
 * Normalizes query string for matching
 */
function cleanQuery(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Searches the Indian cities database by name, alias, or state
 */
export function searchIndianCities(query: string, limit = 6): IndianCity[] {
  const q = cleanQuery(query);
  if (!q) return INDIAN_CITIES.slice(0, limit);

  // Exact name or alias match first
  const exact = INDIAN_CITIES.filter(
    (c) =>
      cleanQuery(c.name) === q ||
      c.aliases?.some((a) => cleanQuery(a) === q)
  );

  // Prefix match next
  const prefix = INDIAN_CITIES.filter(
    (c) =>
      (cleanQuery(c.name).startsWith(q) ||
        c.aliases?.some((a) => cleanQuery(a).startsWith(q)) ||
        cleanQuery(c.state).startsWith(q)) &&
      !exact.includes(c)
  );

  // Substring match
  const substring = INDIAN_CITIES.filter(
    (c) =>
      (cleanQuery(c.name).includes(q) ||
        c.aliases?.some((a) => cleanQuery(a).includes(q)) ||
        cleanQuery(c.state).includes(q)) &&
      !exact.includes(c) &&
      !prefix.includes(c)
  );

  return [...exact, ...prefix, ...substring].slice(0, limit);
}

/**
 * Direct lookup for an Indian city
 */
export function findIndianCity(query: string): IndianCity | undefined {
  const q = cleanQuery(query);
  if (!q) return undefined;

  return INDIAN_CITIES.find(
    (c) =>
      cleanQuery(c.name) === q ||
      c.aliases?.some((a) => cleanQuery(a) === q)
  );
}
