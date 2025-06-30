import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import type { Price } from '@shared/schema';

interface PriceChartProps {
  data: Price[];
}

export function PriceChart({ data }: PriceChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Group data by provider
    const providerData = data.reduce((acc, price) => {
      const key = `Provider ${price.providerId}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(price);
      return acc;
    }, {} as Record<string, Price[]>);

    // Sort data by timestamp
    Object.keys(providerData).forEach(key => {
      providerData[key].sort((a, b) => 
        new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime()
      );
    });

    const colors = [
      '#2563EB', // blue
      '#059669', // green
      '#DC2626', // red
      '#7C2D12', // orange
      '#581C87', // purple
    ];

    const datasets = Object.keys(providerData).slice(0, 5).map((provider, index) => ({
      label: provider,
      data: providerData[provider].map(price => ({
        x: new Date(price.timestamp!).toLocaleDateString(),
        y: parseFloat(price.finalPrice),
      })),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      tension: 0.4,
      fill: false,
    }));

    const config: ChartConfiguration = {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Price ($)'
            },
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return '$' + (value as number).toFixed(2);
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data]);

  if (!data.length) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-2">📊</div>
          <p>No price history available</p>
        </div>
      </div>
    );
  }

  return <canvas ref={chartRef} className="w-full h-full" />;
}
