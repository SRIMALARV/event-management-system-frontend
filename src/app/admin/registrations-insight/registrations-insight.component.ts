import { Component } from '@angular/core';
import { DataApiService } from '../data-api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Registration } from '../../model/regsitration.model';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-registrations-insight',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registrations-insight.component.html',
  styleUrl: './registrations-insight.component.css'
})
export class RegistrationsInsightComponent {
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  chart: any;
  totalRegistrations: number = 0;

  constructor(private registrationApi: DataApiService) {}

  ngOnInit(): void {
    this.generateYears();
    this.loadRegistrations();
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
      this.years.push(i);
    }
  }

  loadRegistrations() {
    this.registrationApi.getMonthlyRegistrations(this.selectedYear).subscribe(data => {
      this.createChart(data);
    });
  }

  createChart(registrationData: any[]) {
    const months = Array(12).fill(0); 

    registrationData.forEach(item => {
      months[item.month - 1] = item.count;
      this.totalRegistrations += item.count;
    });

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('registrationChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: `Registrations in ${this.selectedYear}`,
          data: months,
          borderColor: 'rgba(88, 11, 130, 0.6)',
          backgroundColor: 'rgba(89, 11, 130, 0.44)',
          tension: 0.4
        }]
      }
    });
  }


  onYearChange(): void {
    this.loadRegistrations();
  }
}
