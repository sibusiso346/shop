import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../services/car.service';
import { Vehicle, VehicleCategory } from '../../models/car.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css'
})
export class CarListComponent {
  searchQuery = signal('');
  selectedCategory = signal<VehicleCategory | ''>('');
  selectedMake = signal('');
  maxPrice = signal<number | null>(null);
  selectedFuelType = signal('');
  selectedTransmission = signal('');

  categories: VehicleCategory[] = ['Cars', 'Bikes', 'Leisure', 'Commercial'];
  makes = ['Toyota', 'Honda', 'Tesla', 'BMW', 'Ford', 'Mercedes', 'Audi', 'Nissan', 'Harley-Davidson', 'Winnebago', 'Sea Ray', 'Peterbilt'];
  fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
  transmissions = ['Manual', 'Automatic'];

  constructor(private vehicleService: VehicleService) {}

  get vehicles() {
    return this.vehicleService.getVehicles();
  }

  get filteredVehicles() {
    let filtered = this.vehicles();

    // Apply search filter
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.color.toLowerCase().includes(query) ||
        vehicle.location.toLowerCase().includes(query)
      );
    }

    // Apply other filters
    if (this.selectedCategory()) {
      filtered = filtered.filter(vehicle => vehicle.category === this.selectedCategory());
    }

    if (this.selectedMake()) {
      filtered = filtered.filter(vehicle => vehicle.make === this.selectedMake());
    }

    if (this.maxPrice()) {
      filtered = filtered.filter(vehicle => vehicle.price <= this.maxPrice()!);
    }

    if (this.selectedFuelType()) {
      filtered = filtered.filter(vehicle => vehicle.fuelType === this.selectedFuelType());
    }

    if (this.selectedTransmission()) {
      filtered = filtered.filter(vehicle => vehicle.transmission === this.selectedTransmission());
    }

    return filtered;
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedMake.set('');
    this.maxPrice.set(null);
    this.selectedFuelType.set('');
    this.selectedTransmission.set('');
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
        return `${vehicle.leisureType}, ${vehicle.length}ft, ${vehicle.capacity} capacity`;
      case 'Commercial':
        return `${vehicle.commercialType}, ${vehicle.payload} tons payload`;
      default:
        return '';
    }
  }
}
