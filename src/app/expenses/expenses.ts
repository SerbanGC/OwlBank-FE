import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-expenses',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses implements OnInit, OnDestroy {
  chartInstance?: Chart;
  Data = { Year: "", ExpenseEntry: [] as any[] };
  private readonly API_URL = 'http://localhost:3000/AnnualExpenses';

  // Define standard labels to show even when data is missing
  private readonly defaultMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getExpenses();
  }

  onDateChange(event: any) {
    if (event.value) {
      this.getExpenses(event.value.getTime().toString());
    }
  }

  getExpenses(query?: string) {
    const url = query ? `${this.API_URL}?Year=${query}` : this.API_URL;

    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        // Always destroy the old instance before a re-render
        this.chartInstance?.destroy();
        this.chartInstance = undefined;

        if (res?.length > 0) {
          this.Data = res[0];
        } else {
          // If no data, reset entries but keep the year for the header
          this.Data = { Year: query || "", ExpenseEntry: [] };
        }

        this.cdr.detectChanges();
        // We ALWAYS call createChart now, even if entries are empty
        setTimeout(() => this.createChart(), 0);
      },
      error: (err) => console.error('Data fetch failed', err)
    });
  }

  private createChart() {
    const hasData = this.Data.ExpenseEntry.length > 0;
    const entries = this.Data.ExpenseEntry;

    // Use actual months if data exists, otherwise show default labels
    const labels = hasData ? entries.map(x => x.Month) : this.defaultMonths;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: hasData ? [
          { label: 'Entertainment', data: entries.map(x => x.Entertainment), backgroundColor: '#90caf9' },
          { label: 'Food', data: entries.map(x => x.Food), backgroundColor: '#f48fb1' },
          { label: 'Groceries', data: entries.map(x => x.Groceries), backgroundColor: '#ffcc80' },
          { label: 'DrugStore', data: entries.map(x => x.DrugStore), backgroundColor: '#ffe082' }
        ].map(ds => ({ ...ds, borderRadius: 4 })) : [] // Empty array if no data
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: hasData, position: 'top', align: 'end' }, // Hide legend if empty
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            callbacks: {
              // This part adds 'RON' to the tooltip value
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  // Formats the number with RON and commas
                  label += context.parsed.y.toLocaleString() + " RON";
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            max: hasData ? undefined : 5000, // Set a ghost scale if empty
            ticks: {
              callback: (value) => {
                return value.toLocaleString() + " RON"; // Turns 7000 into RON 7,000
              },
              padding: 10, // Adds breathing room between the text and the chart line
              font: {
                size: 12
              }
            }
          }
        }
      },
      plugins: [{
        id: 'emptyChartText', // Unique ID for the plugin
        afterDraw: (chart) => {
          if (chart.data.datasets.length === 0) {
            const { ctx, width, height } = chart;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '16px sans-serif';
            ctx.fillStyle = '#9e9e9e';
            ctx.fillText('No data available', width / 2, height / 2);
            ctx.restore();
          }
        }
      }]
    };

    this.chartInstance = new Chart('myChart', config);
  }

  ngOnDestroy() {
    this.chartInstance?.destroy();
  }
}