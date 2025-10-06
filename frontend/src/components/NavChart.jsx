import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);
export default function NavChart({data,height=200}){ if(!data||!data.length) return <div>No NAV data</div>; const labels = data.map(d=>d.date).slice(-60); const values = data.map(d=>Number(d.nav)).slice(-60); const chartData = { labels, datasets:[{ label:'NAV', data: values, fill:false, tension:0.2 }] }; return <div className='bg-white p-3 rounded shadow-sm' style={{height}}><Line data={chartData} options={{ responsive:true, maintainAspectRatio:false }} /></div>; }
