import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getTotalRevenue } from '../../../Utils/config/axios.GetMethods';

const ApexChart: React.FC = () => {
  const [series, setSeries] = useState([
    {
      name: 'Monthly Revenue',
      data: [] as number[],
    }
  ]);

  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: 'area'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
    },
    yaxis: {
      title: {
        text: 'Revenue (Rupee)'
      }
    },
    tooltip: {
      x: {
        format: 'MMM'
      },
    },
  });

  const fetchTotalRevenue = async () => {
    try {
      const response= await getTotalRevenue();
      const { monthlyRevenue } = response.data;

      // Format data for the chart
      const formattedData = Array(12).fill(0);
      monthlyRevenue.forEach((item: { month: number, revenue: number }) => {
        formattedData[item.month - 1] = item.revenue;
      });

      setSeries([{
        name: 'Monthly Revenue',
        data: formattedData
      }]);
    } catch (error) {
      console.error('Failed to fetch total revenue', error);
    }
  };

  useEffect(() => {
    fetchTotalRevenue();
  }, []);

  return (
    <div>
      <div id="chart" className='h-4/5 p-10'>
        <ReactApexChart options={options} series={series} type="area" height={350} />
      </div>
    </div>
  );
};

export default ApexChart;
