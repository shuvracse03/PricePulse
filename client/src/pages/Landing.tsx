import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChartLine, 
  TrendingDown, 
  Bell, 
  Search, 
  Shield, 
  Zap 
} from 'lucide-react';

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                <ChartLine className="text-primary mr-2" size={24} />
                PriceTracker
              </h1>
            </div>
            <Button onClick={handleLogin}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Compare Prices • Save Money • Track Trends
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Smart Price Comparison
            <span className="block text-primary">Across Multiple Providers</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Track product prices from different providers, get real-time updates, and never miss a deal. 
            Make informed purchasing decisions with comprehensive price history and analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleLogin}>
              Start Comparing Prices
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Smart Search</h3>
              <p className="text-slate-600">
                Find products across multiple categories and compare prices instantly 
                from various providers in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Price Tracking</h3>
              <p className="text-slate-600">
                Monitor price changes over time with detailed charts and analytics 
                to identify the best buying opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bell className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Price Alerts</h3>
              <p className="text-slate-600">
                Set up watchlists and get notified when prices drop for your 
                favorite products across different stores.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-2">10,000+</div>
            <div className="text-slate-600">Products Tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-2">50+</div>
            <div className="text-slate-600">Providers Connected</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-2">25%</div>
            <div className="text-slate-600">Average Savings</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Browse Categories</h3>
              <p className="text-slate-600">
                Explore products organized by categories and subcategories to find exactly what you need.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Compare Prices</h3>
              <p className="text-slate-600">
                View real-time prices from multiple providers and see historical price trends.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Save & Track</h3>
              <p className="text-slate-600">
                Add products to your watchlist and get notified when prices drop.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of smart shoppers who use PriceTracker to make better purchasing decisions.
          </p>
          <Button size="lg" onClick={handleLogin}>
            Get Started for Free
          </Button>
        </div>
      </div>
    </div>
  );
}
