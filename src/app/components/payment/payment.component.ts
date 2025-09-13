import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'digital' | 'crypto';
  icon: string;
  description: string;
  fees?: number;
  processingTime: string;
  isAvailable: boolean;
}

export interface PaymentDetails {
  method: string;
  amount: number;
  currency: string;
  description: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  cardDetails?: {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    nameOnCard: string;
  };
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
  };
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
  processingTime?: number;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  @Input() amount: number = 0;
  @Input() currency: string = 'USD';
  @Input() description: string = '';
  @Input() customerInfo: any = null;
  @Output() paymentComplete = new EventEmitter<PaymentResult>();
  @Output() paymentCancel = new EventEmitter<void>();

  selectedMethod: string = '';
  isProcessing = false;
  showCardForm = false;
  showBankForm = false;
  showDigitalForm = false;
  showCryptoForm = false;
  
  paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: 'credit-card',
      description: 'Visa, Mastercard, American Express',
      fees: 2.9,
      processingTime: 'Instant',
      isAvailable: true
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      type: 'bank',
      icon: 'bank',
      description: 'Direct bank transfer',
      fees: 1.5,
      processingTime: '1-3 business days',
      isAvailable: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'digital',
      icon: 'paypal',
      description: 'Pay with your PayPal account',
      fees: 3.4,
      processingTime: 'Instant',
      isAvailable: true
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      type: 'digital',
      icon: 'apple-pay',
      description: 'Pay with Apple Pay',
      fees: 2.9,
      processingTime: 'Instant',
      isAvailable: true
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      type: 'digital',
      icon: 'google-pay',
      description: 'Pay with Google Pay',
      fees: 2.9,
      processingTime: 'Instant',
      isAvailable: true
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      type: 'crypto',
      icon: 'bitcoin',
      description: 'Pay with Bitcoin',
      fees: 0.5,
      processingTime: '10-30 minutes',
      isAvailable: true
    }
  ];

  paymentDetails: PaymentDetails = {
    method: '',
    amount: 0,
    currency: 'USD',
    description: '',
    customerInfo: {
      name: '',
      email: '',
      phone: ''
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    cardDetails: {
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      nameOnCard: ''
    },
    bankDetails: {
      accountNumber: '',
      routingNumber: '',
      accountHolderName: ''
    }
  };

  constructor() {}

  ngOnInit() {
    this.paymentDetails.amount = this.amount;
    this.paymentDetails.currency = this.currency;
    this.paymentDetails.description = this.description;
    
    if (this.customerInfo) {
      this.paymentDetails.customerInfo = { ...this.customerInfo };
    }
  }

  selectPaymentMethod(methodId: string) {
    this.selectedMethod = methodId;
    this.resetFormVisibility();
    
    const method = this.paymentMethods.find(m => m.id === methodId);
    if (method) {
      this.paymentDetails.method = methodId;
      
      switch (method.type) {
        case 'card':
          this.showCardForm = true;
          break;
        case 'bank':
          this.showBankForm = true;
          break;
        case 'digital':
          this.showDigitalForm = true;
          break;
        case 'crypto':
          this.showCryptoForm = true;
          break;
      }
    }
  }

  private resetFormVisibility() {
    this.showCardForm = false;
    this.showBankForm = false;
    this.showDigitalForm = false;
    this.showCryptoForm = false;
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substr(0, 19);
    }
    event.target.value = formattedValue;
    this.paymentDetails.cardDetails!.number = formattedValue;
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    
    if (value.length === 5) {
      const [month, year] = value.split('/');
      this.paymentDetails.cardDetails!.expiryMonth = month;
      this.paymentDetails.cardDetails!.expiryYear = '20' + year;
    }
  }

  formatCVV(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    event.target.value = value;
    this.paymentDetails.cardDetails!.cvv = value;
  }

  formatAccountNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 12) {
      value = value.substring(0, 12);
    }
    event.target.value = value;
    this.paymentDetails.bankDetails!.accountNumber = value;
  }

  formatRoutingNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    event.target.value = value;
    this.paymentDetails.bankDetails!.routingNumber = value;
  }

  validateForm(): boolean {
    if (!this.selectedMethod) {
      alert('Please select a payment method');
      return false;
    }

    const method = this.paymentMethods.find(m => m.id === this.selectedMethod);
    if (!method) return false;

    // Validate customer info
    if (!this.paymentDetails.customerInfo.name || 
        !this.paymentDetails.customerInfo.email || 
        !this.paymentDetails.customerInfo.phone) {
      alert('Please fill in all customer information');
      return false;
    }

    // Validate billing address
    if (!this.paymentDetails.billingAddress.street || 
        !this.paymentDetails.billingAddress.city || 
        !this.paymentDetails.billingAddress.state || 
        !this.paymentDetails.billingAddress.zipCode) {
      alert('Please fill in all billing address fields');
      return false;
    }

    // Validate payment method specific fields
    if (method.type === 'card') {
      if (!this.paymentDetails.cardDetails?.number || 
          !this.paymentDetails.cardDetails?.expiryMonth || 
          !this.paymentDetails.cardDetails?.expiryYear || 
          !this.paymentDetails.cardDetails?.cvv || 
          !this.paymentDetails.cardDetails?.nameOnCard) {
        alert('Please fill in all card details');
        return false;
      }
    } else if (method.type === 'bank') {
      if (!this.paymentDetails.bankDetails?.accountNumber || 
          !this.paymentDetails.bankDetails?.routingNumber || 
          !this.paymentDetails.bankDetails?.accountHolderName) {
        alert('Please fill in all bank details');
        return false;
      }
    }

    return true;
  }

  async processPayment() {
    if (!this.validateForm()) return;

    this.isProcessing = true;
    
    try {
      // Simulate payment processing
      const result = await this.simulatePaymentProcessing();
      this.paymentComplete.emit(result);
    } catch (error) {
      this.paymentComplete.emit({
        success: false,
        errorMessage: 'Payment processing failed. Please try again.'
      });
    } finally {
      this.isProcessing = false;
    }
  }

  private async simulatePaymentProcessing(): Promise<PaymentResult> {
    return new Promise((resolve) => {
      const processingTime = Math.random() * 3000 + 1000; // 1-4 seconds
      
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        
        if (success) {
          resolve({
            success: true,
            transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            processingTime: Math.round(processingTime)
          });
        } else {
          resolve({
            success: false,
            errorMessage: 'Payment declined. Please check your payment information and try again.'
          });
        }
      }, processingTime);
    });
  }

  cancelPayment() {
    this.paymentCancel.emit();
  }

  getSelectedMethod(): PaymentMethod | undefined {
    return this.paymentMethods.find(m => m.id === this.selectedMethod);
  }

  getTotalAmount(): number {
    const method = this.getSelectedMethod();
    if (method && method.fees) {
      return this.amount + (this.amount * method.fees / 100);
    }
    return this.amount;
  }

  getProcessingFee(): number {
    const method = this.getSelectedMethod();
    if (method && method.fees) {
      return this.amount * method.fees / 100;
    }
    return 0;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // You could show a toast notification here
      console.log('Address copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
}
