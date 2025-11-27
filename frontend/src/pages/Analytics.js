import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Activity } from 'lucide-react';

function Analytics() {
  const [growthData, setGrowthData] = useState([]);
  const [utilizationData, setUtilizationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const [growth, utilization] = await Promise.all([
        analyticsAPI.getPersonnelGrowth({ period }),
        analyticsAPI.getUtilization()
      ]);
      
      setGrowthData(growth.data);
      setUtilizationData(utilization.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Analytics Dashboard</h2>
        <p>Insights into team growth and utilization</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.25rem' }}>
              <TrendingUp size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Personnel Growth Over Time
            </h3>
            <p style={{ color: '#718096', fontSize: '0.875rem' }}>Track team expansion and hiring trends</p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={period === 'daily' ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setPeriod('daily')}
            >
              Daily
            </button>
            <button 
              className={period === 'monthly' ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setPeriod('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={period === 'daily' ? 'date' : 'month'}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#8884d8" 
              name="New Additions"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="cumulative" 
              stroke="#82ca9d" 
              name="Total Personnel"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '8px' }}>
            <Users size={32} color="#3b82f6" />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {growthData[growthData.length - 1]?.cumulative || 0}
            </div>
            <div style={{ color: '#718096', fontSize: '0.875rem' }}>Total Personnel</div>
          </div>
          
          <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px' }}>
            <TrendingUp size={32} color="#10b981" />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {growthData.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div style={{ color: '#718096', fontSize: '0.875rem' }}>Total Additions</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.25rem' }}>
            <Activity size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Personnel Utilization
          </h3>
          <p style={{ color: '#718096', fontSize: '0.875rem' }}>Current workload across team members</p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={utilizationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_allocation" fill="#8884d8" name="Total Allocation %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;