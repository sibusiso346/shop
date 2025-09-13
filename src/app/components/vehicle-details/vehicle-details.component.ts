import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../services/car.service';
import { Vehicle } from '../../models/car.model';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css'
})
export class VehicleDetailsComponent implements OnInit {
  vehicle = signal<Vehicle | null>(null);
  isLoading = signal(true);
  currentImageIndex = signal(0);
  showContactForm = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const vehicle = this.vehicleService.getVehicleById(id);
      if (vehicle) {
        this.vehicle.set(vehicle);
      } else {
        this.router.navigate(['/vehicles']);
      }
    }
    this.isLoading.set(false);
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

  nextImage() {
    const vehicle = this.vehicle();
    if (vehicle && vehicle.images && vehicle.images.length > 1) {
      const nextIndex = (this.currentImageIndex() + 1) % vehicle.images.length;
      this.currentImageIndex.set(nextIndex);
    }
  }

  prevImage() {
    const vehicle = this.vehicle();
    if (vehicle && vehicle.images && vehicle.images.length > 1) {
      const prevIndex = this.currentImageIndex() === 0 
        ? vehicle.images.length - 1 
        : this.currentImageIndex() - 1;
      this.currentImageIndex.set(prevIndex);
    }
  }

  toggleContactForm() {
    this.showContactForm.set(!this.showContactForm());
  }

  goBack() {
    this.router.navigate(['/vehicles']);
  }
}
