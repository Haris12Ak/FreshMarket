import { Component } from '@angular/core';
import { ClientDashboardDto } from '../../model/ClientDashboardDto';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MonthlyPurchaseDto } from '../../model/MonthlyPurchaseDto';
import { PurchasedProductsDto } from '../../model/PurchasedProductsDto';
import { TopProductsDto } from '../../model/TopProductsDto';
import { CompanyInfo } from '../../model/CompanyInfo';
import { DashboardService } from '../../services/dashboard.service';
import { CompanyService } from '../../services/company.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-client-view',
  standalone: true,
  providers: [provideCharts(withDefaultRegisterables())],
  imports: [MatProgressSpinnerModule, CommonModule, BaseChartDirective, MatProgressBarModule],
  templateUrl: './dashboard-client-view.component.html',
  styleUrl: './dashboard-client-view.component.css'
})
export class DashboardClientViewComponent {
  data: ClientDashboardDto | null = null;
  monthlyPurchase: MonthlyPurchaseDto[] = [];
  purchasedProducts: PurchasedProductsDto[] = [];
  topProducts: TopProductsDto[] = [];
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
  };

  constructor(private dashboardService: DashboardService, private companyService: CompanyService) { }

  ngOnInit(): void {
    this.companyService.companyInfo$.subscribe(data => {
      this.company = data;
    });

    this.loadData();
  }

  loadData() {
    this.dashboardService.clientDashboardView('client-dashboard', this.company!.companyId)
      .subscribe((data: ClientDashboardDto) => {
        this.data = data;
        this.monthlyPurchase = data.monthlyPurchase;
        this.purchasedProducts = data.purchasedProducts;
        this.topProducts = data.topProducts;

        const total = data.totalPaid + data.totalDebt;
        this.progress = total > 0 ? (data.totalPaid / total) * 100 : 0;

        this.monthlyPurchasesChart();
        this.topProductsChart();

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
    const labels = this.topProducts.map(p => p.productName);
    const quantities = this.topProducts.map(p => p.totalQuantity);

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
}
