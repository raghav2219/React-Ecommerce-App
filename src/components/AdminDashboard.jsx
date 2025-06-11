import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setStats(response.data.stats || {});
                setError(null);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setError(error.response?.data?.message || 'Failed to load dashboard data');
                toast.error(error.response?.data?.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/" className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-arrow-left me-1"></i> Back to Home
                </Link>
                <h1 className="mb-0">Admin Dashboard</h1>
                <div style={{ width: '120px' }}></div> {/* Spacer for alignment */}
            </div>
            
            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-muted">Total Users</h5>
                            <h2 className="text-primary">{stats.totalUsers}</h2>
                            <Link to="/admin/users" className="btn btn-sm btn-outline-primary mt-2">
                                View All
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-muted">Total Orders</h5>
                            <h2 className="text-success">{stats.totalOrders || 0}</h2>
                            <Link to="/admin/orders" className="btn btn-sm btn-outline-success mt-2">
                                View All
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-muted">Total Revenue</h5>
                            <h2 className="text-info">${(stats.totalRevenue || 0).toFixed(2)}</h2>
                            <Link to="/admin/orders" className="btn btn-sm btn-outline-info mt-2">
                                View Reports
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-muted">Admin Actions</h5>
                            <div className="d-grid gap-2">
                                <Link to="/admin/users/new" className="btn btn-primary btn-sm">
                                    Add New User
                                </Link>
                                <Link to="/admin/products" className="btn btn-outline-secondary btn-sm">
                                    Manage Products
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Recent Orders</h5>
                        {!stats.recentOrders && (
                            <span className="badge bg-warning text-dark">Order tracking not fully set up</span>
                        )}
                    </div>
                </div>
                <div className="card-body">
                    {error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : !stats.recentOrders || stats.recentOrders.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-muted">No recent orders found</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td>#{order._id?.slice(-6).toUpperCase() || 'N/A'}</td>
                                            <td>{order.user?.name || 'Guest'}</td>
                                            <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                                            <td>${order.totalAmount?.toFixed(2) || '0.00'}</td>
                                            <td>
                                                <span className={`badge bg-${order.status === 'completed' ? 'success' : 'warning'}`}>
                                                    {order.status || 'pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-outline-primary">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
