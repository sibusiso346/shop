import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent, PaymentResult } from './payment.component';

@Component({
  selector: 'app-payment-test',
  standalone: true,
  imports: [CommonModule, PaymentComponent],
  template: `
    <div class="test-container">
      <h1>Payment Component Test</h1>
      <p>This is a test page for the payment component.</p>
      
      <app-payment
        [amount]="testAmount"
        [currency]="testCurrency"
        [description]="testDescription"
        [customerInfo]="testCustomerInfo"
        (paymentComplete)="onPaymentComplete($event)"
        (paymentCancel)="onPaymentCancel()"
      ></app-payment>
      
      <div class="test-info">
        <h3>Test Information:</h3>
        <p><strong>Amount:</strong> {{ testCurrency }} {{ testAmount }}</p>
        <p><strong>Description:</strong> {{ testDescription }}</p>
        <p><strong>Customer:</strong> {{ testCustomerInfo.name }} ({{ testCustomerInfo.email }})</p>
        
        @if (lastPaymentResult) {
          <div class="payment-result" [class.success]="lastPaymentResult.success" [class.error]="!lastPaymentResult.success">
            <h4>Last Payment Result:</h4>
            <p><strong>Status:</strong> {{ lastPaymentResult.success ? 'Success' : 'Failed' }}</p>
            @if (lastPaymentResult.transactionId) {
              <p><strong>Transaction ID:</strong> {{ lastPaymentResult.transactionId }}</p>
            }
            @if (lastPaymentResult.processingTime) {
              <p><strong>Processing Time:</strong> {{ lastPaymentResult.processingTime }}ms</p>
            }
            @if (lastPaymentResult.errorMessage) {
              <p><strong>Error:</strong> {{ lastPaymentResult.errorMessage }}</p>
            }
          </div>
        }
        
        @if (paymentCancelled) {
          <div class="payment-cancelled">
            <h4>Payment Cancelled</h4>
            <p>The payment was cancelled by the user.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .test-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .test-info {
      margin-top: 2rem;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 8px;
    }
    
    .test-info h3 {
      margin-top: 0;
    }
    
    .payment-result {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 6px;
      border: 2px solid;
    }
    
    .payment-result.success {
      background: #d1fae5;
      border-color: #10b981;
      color: #065f46;
    }
    
    .payment-result.error {
      background: #fee2e2;
      border-color: #ef4444;
      color: #991b1b;
    }
    
    .payment-cancelled {
      margin-top: 1rem;
      padding: 1rem;
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 6px;
      color: #92400e;
    }
    
    .payment-cancelled h4 {
      margin-top: 0;
    }
  `]
})
export class PaymentTestComponent {
  testAmount = 15000.00;
  testCurrency = 'USD';
  testDescription = 'Vehicle Purchase - 2020 Honda Civic';
  testCustomerInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  };
  
  lastPaymentResult: PaymentResult | null = null;
  paymentCancelled = false;

  onPaymentComplete(result: PaymentResult) {
    this.lastPaymentResult = result;
    this.paymentCancelled = false;
    console.log('Payment completed:', result);
  }

  onPaymentCancel() {
    this.paymentCancelled = true;
    this.lastPaymentResult = null;
    console.log('Payment cancelled');
  }
}
