export type VehicleCategory = 'Cars' | 'Bikes' | 'Leisure' | 'Commercial';

export interface Vehicle {
  id: string;
  category: VehicleCategory;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
  imageUrl: string;
  images?: string[]; // Array of additional images
  sellerName: string;
  sellerContact: string;
  location: string;
  datePosted: Date;
  isForSale: boolean;
  
  // Category-specific fields
  // For Cars
  doors?: number;
  seats?: number;
  
  // For Bikes
  engineSize?: number; // in CC
  bikeType?: 'Sport' | 'Cruiser' | 'Touring' | 'Dirt' | 'Scooter' | 'Standard';
  
  // For Leisure (RVs, Boats, etc.)
  leisureType?: 'RV' | 'Boat' | 'ATV' | 'Jet Ski' | 'Trailer' | 'Motorhome';
  length?: number; // in feet
  capacity?: number; // passenger capacity
  
  // For Commercial
  commercialType?: 'Truck' | 'Van' | 'Bus' | 'Construction' | 'Delivery';
  payload?: number; // in tons
  licenseType?: 'C' | 'B' | 'A' | 'CDL';
}

// Keep Car interface for backward compatibility
export interface Car extends Vehicle {
  category: 'Cars';
  doors: number;
  seats: number;
}
