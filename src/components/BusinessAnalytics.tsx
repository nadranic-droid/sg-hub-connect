import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Eye, Star, Heart, MessageSquare, Users, Calendar } from "lucide-react";

interface BusinessAnalyticsProps {
  businessId: string;
  businessName: string;
}

// Mock data - in production, this would come from your analytics backend
const generateMockViewsData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    views: Math.floor(Math.random() * 100) + 20,
    clicks: Math.floor(Math.random() * 30) + 5,
  }));
};

const generateMockMonthlyData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month) => ({
    month,
    views: Math.floor(Math.random() * 500) + 100,
    reviews: Math.floor(Math.random() * 10) + 1,
    saves: Math.floor(Math.random() * 20) + 5,
  }));
};

const generateMockRatingDistribution = () => [
  { rating: "5 Stars", count: Math.floor(Math.random() * 50) + 30 },
  { rating: "4 Stars", count: Math.floor(Math.random() * 30) + 15 },
  { rating: "3 Stars", count: Math.floor(Math.random() * 15) + 5 },
  { rating: "2 Stars", count: Math.floor(Math.random() * 5) + 1 },
  { rating: "1 Star", count: Math.floor(Math.random() * 3) },
];

const COLORS = ["#10b981", "#22c55e", "#facc15", "#fb923c", "#ef4444"];

export function BusinessAnalytics({ businessId, businessName }: BusinessAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("week");

  // In production, these would be fetched from your analytics API
  const weeklyData = generateMockViewsData();
  const monthlyData = generateMockMonthlyData();
  const ratingDistribution = generateMockRatingDistribution();

  // Calculate totals
  const totalViews = weeklyData.reduce((acc, d) => acc + d.views, 0);
  const totalClicks = weeklyData.reduce((acc, d) => acc + d.clicks, 0);
  const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";

  // Mock stats
  const stats = {
    totalViews: 1234,
    viewsTrend: 12.5,
    totalReviews: 47,
    reviewsTrend: 8.3,
    avgRating: 4.6,
    ratingTrend: 0.2,
    totalSaves: 89,
    savesTrend: 15.2,
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${stats.viewsTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.viewsTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(stats.viewsTrend)}%
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Views</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${stats.ratingTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.ratingTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                +{stats.ratingTrend}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold">{stats.avgRating}</div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${stats.reviewsTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.reviewsTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(stats.reviewsTrend)}%
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <div className="text-xs text-muted-foreground">Reviews</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${stats.savesTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.savesTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(stats.savesTrend)}%
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold">{stats.totalSaves}</div>
              <div className="text-xs text-muted-foreground">Saved</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Views Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Views & Clicks</CardTitle>
                <CardDescription>Weekly performance overview</CardDescription>
              </div>
              <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
                <TabsList className="h-8">
                  <TabsTrigger value="week" className="text-xs h-7">Week</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs h-7">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorViews)"
                    name="Views"
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                    name="Clicks"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">Clicks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
            <CardDescription>Breakdown of customer ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="rating"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => [`${value} reviews`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
              {ratingDistribution.map((item, index) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-muted-foreground">{item.rating}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Trends</CardTitle>
          <CardDescription>Performance over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="views" fill="#3b82f6" name="Views" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saves" fill="#ec4899" name="Saves" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reviews" fill="#8b5cf6" name="Reviews" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-muted-foreground">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span className="text-muted-foreground">Saves</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-muted-foreground">Reviews</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-700 dark:text-green-400">Growth</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your views increased by 12.5% compared to last week. Keep it up!
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-700 dark:text-blue-400">Engagement</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Click-through rate is {clickRate}%. Featured businesses average 5-8%.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-700 dark:text-purple-400">Best Day</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Saturday sees the most traffic. Consider special weekend promotions!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
