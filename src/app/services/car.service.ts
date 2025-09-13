import { Injectable, signal } from '@angular/core';
import { Vehicle, Car, VehicleCategory } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehicles = signal<Vehicle[]>([
    // Cars
    {
      id: '1',
      category: 'Cars',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      price: 25000,
      mileage: 35000,
      color: 'Silver',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      condition: 'Excellent',
      description: 'Well-maintained Toyota Camry with low mileage. Single owner, no accidents.',
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
      sellerName: 'John Smith',
      sellerContact: 'john@email.com',
      location: 'New York, NY',
      datePosted: new Date('2024-01-15'),
      isForSale: true,
      doors: 4,
      seats: 5
    },
    {
      id: '2',
      category: 'Cars',
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      price: 22000,
      mileage: 42000,
      color: 'Blue',
      fuelType: 'Gasoline',
      transmission: 'Manual',
      condition: 'Good',
      description: 'Reliable Honda Civic with great fuel economy. Regular maintenance records available.',
      imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
      sellerName: 'Sarah Johnson',
      sellerContact: 'sarah@email.com',
      location: 'Los Angeles, CA',
      datePosted: new Date('2024-01-20'),
      isForSale: true,
      doors: 4,
      seats: 5
    },
    {
      id: '3',
      category: 'Cars',
      make: 'Tesla',
      model: 'Model 3',
      year: 2021,
      price: 45000,
      mileage: 15000,
      color: 'White',
      fuelType: 'Electric',
      transmission: 'Automatic',
      condition: 'Excellent',
      description: 'Tesla Model 3 with autopilot. Supercharger network access included.',
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
      sellerName: 'Mike Chen',
      sellerContact: 'mike@email.com',
      location: 'San Francisco, CA',
      datePosted: new Date('2024-01-25'),
      isForSale: true,
      doors: 4,
      seats: 5
    },
    // Bikes
    {
      id: '4',
      category: 'Bikes',
      make: 'Honda',
      model: 'CBR600RR',
      year: 2022,
      price: 12000,
      mileage: 5000,
      color: 'Red',
      fuelType: 'Gasoline',
      transmission: 'Manual',
      condition: 'Excellent',
      description: 'Sport bike in perfect condition. Low mileage, garage kept.',
      imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      sellerName: 'Alex Rodriguez',
      sellerContact: 'alex@email.com',
      location: 'Miami, FL',
      datePosted: new Date('2024-01-28'),
      isForSale: true,
      engineSize: 600,
      bikeType: 'Sport'
    },
    {
      id: '5',
      category: 'Bikes',
      make: 'Harley-Davidson',
      model: 'Street Glide',
      year: 2020,
      price: 18000,
      mileage: 12000,
      color: 'Black',
      fuelType: 'Gasoline',
      transmission: 'Manual',
      condition: 'Good',
      description: 'Classic Harley cruiser with custom exhaust and saddlebags.',
      imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      sellerName: 'Tom Wilson',
      sellerContact: 'tom@email.com',
      location: 'Austin, TX',
      datePosted: new Date('2024-02-01'),
      isForSale: true,
      engineSize: 1800,
      bikeType: 'Cruiser'
    },
    // Leisure
    {
      id: '6',
      category: 'Leisure',
      make: 'Winnebago',
      model: 'Vista',
      year: 2019,
      price: 85000,
      mileage: 25000,
      color: 'White',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      condition: 'Good',
      description: 'Class A motorhome with full amenities. Perfect for family adventures.',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      sellerName: 'Linda Davis',
      sellerContact: 'linda@email.com',
      location: 'Denver, CO',
      datePosted: new Date('2024-02-05'),
      isForSale: true,
      leisureType: 'Motorhome',
      length: 35,
      capacity: 6
    },
    {
      id: '7',
      category: 'Leisure',
      make: 'Sea Ray',
      model: 'Sundancer',
      year: 2021,
      price: 95000,
      mileage: 150,
      color: 'Blue',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      condition: 'Excellent',
      description: 'Beautiful boat perfect for weekend getaways. Well maintained.',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      sellerName: 'Mark Thompson',
      sellerContact: 'mark@email.com',
      location: 'Seattle, WA',
      datePosted: new Date('2024-02-08'),
      isForSale: true,
      leisureType: 'Boat',
      length: 28,
      capacity: 8
    },
    // Commercial
    {
      id: '8',
      category: 'Commercial',
      make: 'Ford',
      model: 'Transit',
      year: 2020,
      price: 35000,
      mileage: 45000,
      color: 'White',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      condition: 'Good',
      description: 'Commercial van perfect for delivery business. Well maintained.',
      imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400',
      sellerName: 'Business Solutions Inc',
      sellerContact: 'business@email.com',
      location: 'Phoenix, AZ',
      datePosted: new Date('2024-02-10'),
      isForSale: true,
      commercialType: 'Van',
      payload: 1.5,
      licenseType: 'B'
    },
    {
      id: '9',
      category: 'Commercial',
      make: 'Peterbilt',
      model: '579',
      year: 2018,
      price: 125000,
      mileage: 180000,
      color: 'Red',
      fuelType: 'Diesel',
      transmission: 'Manual',
      condition: 'Good',
      description: 'Heavy-duty truck for long-haul operations. Recent engine overhaul.',
      imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400',
      sellerName: 'Trucking Solutions',
      sellerContact: 'trucking@email.com',
      location: 'Dallas, TX',
      datePosted: new Date('2024-02-12'),
      isForSale: true,
      commercialType: 'Truck',
      payload: 26,
      licenseType: 'CDL'
    }
  ]);

  getVehicles() {
    return this.vehicles.asReadonly();
  }

  getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles().find(vehicle => vehicle.id === id);
  }

  addVehicle(vehicle: Omit<Vehicle, 'id' | 'datePosted'>): void {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: this.generateId(),
      datePosted: new Date()
    };
    this.vehicles.update(vehicles => [...vehicles, newVehicle]);
  }

  updateVehicle(id: string, updatedVehicle: Partial<Vehicle>): void {
    this.vehicles.update(vehicles => 
      vehicles.map(vehicle => 
        vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
      )
    );
  }

  deleteVehicle(id: string): void {
    this.vehicles.update(vehicles => vehicles.filter(vehicle => vehicle.id !== id));
  }

  searchVehicles(query: string): Vehicle[] {
    const lowercaseQuery = query.toLowerCase();
    return this.vehicles().filter(vehicle => 
      vehicle.make.toLowerCase().includes(lowercaseQuery) ||
      vehicle.model.toLowerCase().includes(lowercaseQuery) ||
      vehicle.color.toLowerCase().includes(lowercaseQuery) ||
      vehicle.location.toLowerCase().includes(lowercaseQuery)
    );
  }

  filterVehicles(filters: {
    category?: VehicleCategory;
    make?: string;
    maxPrice?: number;
    minYear?: number;
    fuelType?: string;
    transmission?: string;
  }): Vehicle[] {
    return this.vehicles().filter(vehicle => {
      if (filters.category && vehicle.category !== filters.category) return false;
      if (filters.make && vehicle.make !== filters.make) return false;
      if (filters.maxPrice && vehicle.price > filters.maxPrice) return false;
      if (filters.minYear && vehicle.year < filters.minYear) return false;
      if (filters.fuelType && vehicle.fuelType !== filters.fuelType) return false;
      if (filters.transmission && vehicle.transmission !== filters.transmission) return false;
      return true;
    });
  }

  getVehiclesByCategory(category: VehicleCategory): Vehicle[] {
    return this.vehicles().filter(vehicle => vehicle.category === category);
  }

  getRecentVehicles(limit: number = 6): Vehicle[] {
    return this.vehicles()
      .sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())
      .slice(0, limit);
  }

  getMostSearchedVehicles(limit: number = 6): Vehicle[] {
    // For demo purposes, we'll simulate most searched by using popular makes and models
    const popularVehicles = this.vehicles().filter(vehicle => 
      ['Toyota', 'Honda', 'BMW', 'Tesla', 'Ford', 'Harley-Davidson'].includes(vehicle.make)
    );
    return popularVehicles.slice(0, limit);
  }

  getPerfectConditionVehicles(limit: number = 3): Vehicle[] {
    return this.vehicles()
      .filter(vehicle => vehicle.condition === 'Excellent')
      .sort((a, b) => b.price - a.price) // Sort by price descending for premium feel
      .slice(0, limit);
  }

  // Keep backward compatibility methods
  getCars() {
    return this.getVehiclesByCategory('Cars');
  }

  addCar(car: Omit<Car, 'id' | 'datePosted'>): void {
    this.addVehicle(car);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
