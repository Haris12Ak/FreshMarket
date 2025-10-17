import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../services/dashboard.service';
import { CompanyInfo } from '../../model/CompanyInfo';
import { CompanyService } from '../../services/company.service';
import { AdminDashboardDto } from '../../model/AdminDashboardDto';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import { ProgressBarMode, MatProgressBarModule } from '@angular/material/progress-bar';
import { MonthlyPurchaseDto } from '../../model/MonthlyPurchaseDto';
import { PurchasedProductsDto } from '../../model/PurchasedProductsDto';
import { PaymentTypeDto } from '../../model/PaymentTypeDto';
import { TopClientsDto } from '../../model/TopClientsDto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [provideCharts(withDefaultRegisterables())],
  imports: [MatProgressSpinnerModule, CommonModule, BaseChartDirective, MatProgressBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  data: AdminDashboardDto | null = null;
  monthlyPurchase: MonthlyPurchaseDto[] = [];
  purchasedProducts: PurchasedProductsDto[] = [];
  paymentType: PaymentTypeDto[] = [];
  topClients: TopClientsDto[] = [];
  progress: number = 0;
  loading: boolean = true;
  company: CompanyInfo | null = null;

  public lineChartMonthlyData!: ChartConfiguration<'line'>['data'];
  public lineChartMonthlyOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        position: 'top',
        align: 'start',
        display: true,
        text: 'Monthly Purchases Overview',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#706f6fff',
        padding: {
          bottom: 30
        }
      }
    }
  };

  public lineChartProductsData!: ChartConfiguration<'line'>['data'];
  public lineChartProductsOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        position: 'top',
        align: 'start',
        display: true,
        text: 'Top Products',
        padding: {
          bottom: 30
        },
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#706f6fff',
      }
    }
  }

  public lineChartClientsData!: ChartConfiguration<'line'>['data'];
  public lineChartClientsOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        position: 'top',
        align: 'start',
        display: true,
        text: 'Top Clients',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#706f6fff',
        padding: {
          bottom: 30
        }
      }
    }
  };

  public pieChartPaymentsData!: ChartConfiguration<'pie'>['data'];
  public pieChartPaymentsOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      },
      title: {
        position: 'top',
        align: 'start',
        display: true,
        text: 'Payment by Type',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#706f6fff',
        padding: {
          bottom: 30
        }
      },
    },
  };

  constructor(private dashboardService: DashboardService, private companyService: CompanyService) { }

  ngOnInit(): void {
    this.companyService.companyInfo$.subscribe(data => {
      this.company = data;
    });

    this.loadData();
  }

  loadData() {
    this.dashboardService.adminDashboardView('admin-dashboard', this.company!.companyId)
      .subscribe((data: AdminDashboardDto) => {
        this.data = data;
        this.purchasedProducts = data.purchasedProducts;
        this.monthlyPurchase = data.monthlyPurchase;
        this.topClients = data.topClients;
        this.paymentType = data.paymentType;

        const total = data.totalPaid + data.totalDebt;
        this.progress = total > 0 ? (data.totalPaid / total) * 100 : 0;

        this.monthlyPurchasesChart()
        this.topProductsChart();
        this.topClientsChart();
        this.paymentTypeChart()

        this.loading = false;
      });
  }

  private monthlyPurchasesChart() {
    const labels = this.monthlyPurchase.map(m => `${m.month}/${m.year}`);
    const quantities = this.monthlyPurchase.map(m => m.totalQuantity);
    const profits = this.monthlyPurchase.map(m => m.totalProfit);

    this.lineChartMonthlyData = {
      labels: labels,
      datasets: [
        {
          data: quantities,
          label: 'Total Quantity',
          borderColor: 'blue',
          backgroundColor: '#64B7FA',
          fill: true
        },
        {
          data: profits,
          label: 'Total Profit',
          borderColor: 'green',
          backgroundColor: '#6FF77B',
          fill: true
        }
      ]
    };
  }

  private topProductsChart() {
    const labels = this.purchasedProducts.map(p => p.productName);
    const quantities = this.purchasedProducts.map(p => p.quantity);

    this.lineChartProductsData = {
      labels: labels,
      datasets: [
        {
          data: quantities,
          label: 'Quantity',
          borderColor: 'blue',
          backgroundColor: '#64B7FA',
          fill: true
        }
      ]
    };
  }

  private topClientsChart() {
    const labels = this.topClients.map(c => c.fullName);
    const quantities = this.topClients.map(c => c.totalQuantity);
    const profits = this.topClients.map(c => c.totalProfit);

    this.lineChartClientsData = {
      labels: labels,
      datasets: [
        {
          data: quantities,
          label: 'Quantity',
          borderColor: 'blue',
          backgroundColor: '#64B7FA',
          fill: true
        },
        {
          data: profits,
          label: 'Total Profit',
          borderColor: 'green',
          backgroundColor: '#6FF77B',
          fill: true
        }
      ]
    };
  }

  private paymentTypeChart() {
    const labels = this.paymentType.map(p => p.paymentType);
    const totalAmount = this.paymentType.map(p => p.totalAmount);
    const count = this.paymentType.map(p => p.count);

    this.pieChartPaymentsData = {
      labels: labels,
      datasets: [
        {
          data: totalAmount,
          label: 'Total amount',
          backgroundColor: [
            '#64B7FA',
            '#FF7D7D',
            '#FFBE6E',
          ],
          borderColor: '#fff',
          borderWidth: 1,
        },
      ],
    };
  }
}
