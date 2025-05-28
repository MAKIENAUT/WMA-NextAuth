// app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";

interface DashboardStats {
  totalPosts: number;
  totalApplications: number;
  pendingApplications: number;
  recentActivity: number;
  recentPosts: number;
  recentApplications: number;
}

interface GrowthData {
  posts: {
    current: number;
    previous: number;
    percentage: string;
    trend: 'up' | 'down';
  };
  applications: {
    current: number;
    previous: number;
    percentage: string;
    trend: 'up' | 'down';
  };
}

interface ActivityItem {
  type: 'post' | 'application';
  id: string;
  title: string;
  description: string;
  createdAt: string;
  link: string;
}

interface DashboardData {
  stats: DashboardStats;
  growth: GrowthData;
  breakdown: {
    postsByCategory: Array<{ category: string; count: number }>;
    applicationsByStatus: Array<{ status: string; count: number }>;
  };
  recentActivity: ActivityItem[];
}

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/dashboard");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setDashboardData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? '↗️' : '↘️';
  };

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Dashboard</h2>
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>No dashboard data available</p>
      </div>
    );
  }

  const { stats, growth, breakdown, recentActivity } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <span className={`text-xs ${getTrendColor(growth.posts.trend)}`}>
              {getTrendIcon(growth.posts.trend)} {growth.posts.percentage}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-gray-500">
              {stats.recentPosts} new this week
            </p>
            <Button 
              variant="link" 
              className="p-0 text-blue-600" 
              onClick={() => router.push("/dashboard/posts")}
            >
              View All
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <span className={`text-xs ${getTrendColor(growth.applications.trend)}`}>
              {getTrendIcon(growth.applications.trend)} {growth.applications.percentage}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-gray-500">
              {stats.recentApplications} new this week
            </p>
            <Button 
              variant="link" 
              className="p-0 text-blue-600" 
              onClick={() => router.push("/dashboard/forms")}
            >
              View All
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-gray-500">
              Requires attention
            </p>
            <Button 
              variant="link" 
              className="p-0 text-orange-600" 
              onClick={() => router.push("/dashboard/forms?status=pending")}
            >
              Review Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-gray-500">
              Recent actions
            </p>
            <Button variant="link" className="p-0 text-blue-600">
              View Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Content Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Posts by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {breakdown.postsByCategory.length > 0 ? (
                breakdown.postsByCategory.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{item.category}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No posts found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Applications by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {breakdown.applicationsByStatus.length > 0 ? (
                breakdown.applicationsByStatus.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{item.status}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No applications found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => router.push("/dashboard/create-post")}
            >
              Create New Post
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push("/dashboard/posts")}
            >
              Manage Posts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full"
              onClick={() => router.push("/dashboard/forms")}
            >
              View All Applications
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push("/dashboard/forms?status=pending")}
            >
              Pending Review ({stats.pendingApplications})
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.type === 'post' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {activity.type}
                      </span>
                      <span className="font-medium text-sm">{activity.title}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => router.push(activity.link)}
                  >
                    View
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-4 border rounded-lg">
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/posts" className="hover:underline text-blue-600">
          Blog Posts Management
        </Link>
        <Link href="/dashboard/forms" className="hover:underline text-blue-600">
          J1 Visa Applications
        </Link>
        <Link href="/settings" className="hover:underline text-blue-600">
          Site Settings
        </Link>
      </div>
    </div>
  );
}