import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/car.service';
import { AuthService } from '../../services/auth.service';
import { Vehicle, VehicleCategory } from '../../models/car.model';
import { VehiclePhotosComponent, PhotoUpload } from '../vehicle-photos/vehicle-photos.component';

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, FormsModule, VehiclePhotosComponent],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css'
})
export class SellComponent implements OnInit {
  vehicle: Partial<Vehicle> = {
    category: 'Cars',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    color: '',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    condition: 'Good',
    description: '',
    imageUrl: '',
    sellerName: '',
    sellerContact: '',
    location: '',
    isForSale: true
  };

  categories: VehicleCategory[] = ['Cars', 'Bikes', 'Leisure', 'Commercial'];
  makes = ['Toyota', 'Honda', 'Tesla', 'BMW', 'Ford', 'Mercedes', 'Audi', 'Nissan', 'Harley-Davidson', 'Winnebago', 'Sea Ray', 'Peterbilt'];
  fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
  transmissions = ['Manual', 'Automatic'];
  conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
  years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  
  // Category-specific options
  bikeTypes = ['Sport', 'Cruiser', 'Touring', 'Dirt', 'Scooter', 'Standard'];
  leisureTypes = ['RV', 'Boat', 'ATV', 'Jet Ski', 'Trailer', 'Motorhome'];
  commercialTypes = ['Truck', 'Van', 'Bus', 'Construction', 'Delivery'];
  licenseTypes = ['C', 'B', 'A', 'CDL'];

  // Form state
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  
  // Photo management
  vehiclePhotos: string[] = [];
  photoUploads: PhotoUpload[] = [];

  constructor(
    private vehicleService: VehicleService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check for category query parameter
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        const categoryMap: { [key: string]: VehicleCategory } = {
          'cars': 'Cars',
          'bikes': 'Bikes',
          'leisure': 'Leisure',
          'commercial': 'Commercial'
        };
        if (categoryMap[params['category']]) {
          this.vehicle.category = categoryMap[params['category']];
        }
      }
    });

    // Pre-fill seller information from logged-in user
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.vehicle.sellerName = `${currentUser.firstName} ${currentUser.lastName}`;
      this.vehicle.sellerContact = currentUser.email;
      if (currentUser.location) {
        this.vehicle.location = currentUser.location;
      }
    }
  }

  onSubmit() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Basic validation
    if (!this.vehicle.make || !this.vehicle.model || !this.vehicle.sellerName || !this.vehicle.sellerContact) {
      this.errorMessage = 'Please fill in all required fields';
      this.isSubmitting = false;
      return;
    }

    if (this.vehicle.price! <= 0) {
      this.errorMessage = 'Price must be greater than 0';
      this.isSubmitting = false;
      return;
    }

    if (this.vehicle.mileage! < 0) {
      this.errorMessage = 'Mileage cannot be negative';
      this.isSubmitting = false;
      return;
    }

    // Add photos to vehicle data
    this.vehicle.images = this.vehiclePhotos;

    // Add the vehicle
    this.vehicleService.addVehicle(this.vehicle as Omit<Vehicle, 'id' | 'datePosted'>);
    
    this.successMessage = 'Vehicle listed successfully!';
    this.isSubmitting = false;

    // Reset form after a delay
    setTimeout(() => {
      this.resetForm();
    }, 2000);
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  onCategoryChange() {
    // Clear category-specific fields when category changes
    this.vehicle.doors = undefined;
    this.vehicle.seats = undefined;
    this.vehicle.engineSize = undefined;
    this.vehicle.bikeType = undefined;
    this.vehicle.leisureType = undefined;
    this.vehicle.length = undefined;
    this.vehicle.capacity = undefined;
    this.vehicle.commercialType = undefined;
    this.vehicle.payload = undefined;
    this.vehicle.licenseType = undefined;
  }

  onPhotosChange(photos: string[]) {
    this.vehiclePhotos = photos;
  }

  onPhotosAdded(uploads: PhotoUpload[]) {
    this.photoUploads = uploads;
  }

  private resetForm() {
    this.vehicle = {
      category: 'Cars',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      color: '',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      condition: 'Good',
      description: '',
      imageUrl: '',
      sellerName: '',
      sellerContact: '',
      location: '',
      isForSale: true
    };

    // Reset photos
    this.vehiclePhotos = [];
    this.photoUploads = [];

    // Re-fill seller information
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.vehicle.sellerName = `${currentUser.firstName} ${currentUser.lastName}`;
      this.vehicle.sellerContact = currentUser.email;
      if (currentUser.location) {
        this.vehicle.location = currentUser.location;
      }
    }
  }
}
