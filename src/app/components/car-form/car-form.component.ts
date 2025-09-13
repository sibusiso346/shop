import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/car.service';
import { AuthService } from '../../services/auth.service';
import { Vehicle, VehicleCategory } from '../../models/car.model';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.css'
})
export class CarFormComponent implements OnInit {
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
    const vehicleData = this.vehicle;
    
    // Basic validation
    if (!vehicleData.make || !vehicleData.model || !vehicleData.sellerName || !vehicleData.sellerContact) {
      alert('Please fill in all required fields');
      return;
    }

    if (vehicleData.price! <= 0) {
      alert('Price must be greater than 0');
      return;
    }

    if (vehicleData.mileage! < 0) {
      alert('Mileage cannot be negative');
      return;
    }

    // Add the vehicle
    this.vehicleService.addVehicle(vehicleData as Omit<Vehicle, 'id' | 'datePosted'>);
    
    // Reset form
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

    // Navigate to vehicle list
    this.router.navigate(['/']);
    
    alert('Vehicle added successfully!');
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

  onCancel() {
    this.router.navigate(['/']);
  }
}
