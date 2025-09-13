import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../services/car.service';
import { Vehicle } from '../../models/car.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  // About section data
  stats = [
    { number: '10,000+', label: 'Vehicles Sold' },
    { number: '5,000+', label: 'Happy Customers' },
    { number: '15+', label: 'Years Experience' },
    { number: '4.8/5', label: 'Customer Rating' }
  ];

  values = [
    {
      icon: '🚗',
      title: 'Quality First',
      description: 'We ensure every vehicle meets our high standards for quality and reliability.'
    },
    {
      icon: '🤝',
      title: 'Trust & Transparency',
      description: 'Complete transparency in pricing, vehicle history, and transaction processes.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Leveraging technology to make buying and selling vehicles easier than ever.'
    },
    {
      icon: '❤️',
      title: 'Customer Care',
      description: 'Your satisfaction is our priority, with dedicated support throughout your journey.'
    }
  ];

  // Reviews data
  reviews = [
    {
      id: 1,
      customerName: 'John Smith',
      customerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      date: '2024-01-15',
      vehicle: '2020 Toyota Camry',
      review: 'Excellent experience! Found my dream car within a week. The seller was honest about the condition and the transaction was smooth.',
      verified: true
    },
    {
      id: 2,
      customerName: 'Sarah Johnson',
      customerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      date: '2024-01-10',
      vehicle: '2019 Honda Civic',
      review: 'Great platform for selling my car. Got multiple offers within days and sold it for a fair price. The process was straightforward.',
      verified: true
    },
    {
      id: 3,
      customerName: 'Mike Chen',
      customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4,
      date: '2024-01-08',
      vehicle: '2021 Tesla Model 3',
      review: 'Love the search filters and detailed vehicle information. Made it easy to find exactly what I was looking for.',
      verified: true
    }
  ];

  reviewStats = {
    totalReviews: 1247,
    averageRating: 4.8
  };

  constructor(private vehicleService: VehicleService) {}

  get recentVehicles(): Vehicle[] {
    return this.vehicleService.getRecentVehicles(6);
  }

  get mostSearchedVehicles(): Vehicle[] {
    return this.vehicleService.getMostSearchedVehicles(6);
  }

  get perfectConditionVehicles(): Vehicle[] {
    return this.vehicleService.getPerfectConditionVehicles(3);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatMileage(mileage: number): string {
    return new Intl.NumberFormat('en-US').format(mileage);
  }

  getCategorySpecificDetails(vehicle: Vehicle): string {
    switch (vehicle.category) {
      case 'Cars':
        return `${vehicle.doors} doors, ${vehicle.seats} seats`;
      case 'Bikes':
        return `${vehicle.engineSize}cc, ${vehicle.bikeType}`;
      case 'Leisure':
        return `${vehicle.leisureType}, ${vehicle.length}ft`;
      case 'Commercial':
        return `${vehicle.commercialType}, ${vehicle.payload} tons`;
      default:
        return '';
    }
  }


  // Review methods
  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getFloorRating(rating: number): number {
    return Math.floor(rating);
  }
}
