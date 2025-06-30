import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Heart, Grid, List, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useGetProductsQuery } from '@/store/productsSlice';
import { setSelectedProduct } from '@/store/productsSlice';
import { useAuth } from '@/hooks/useAuth';
import type { RootState } from '@/store';

interface ProductGridProps {
  categoryId?: number;
  subcategoryId?: number;
  title?: string;
  description?: string;
}

export function ProductGrid({ categoryId, subcategoryId, title, description }: ProductGridProps) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState('price');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: products, isLoading, error } = useGetProductsQuery({ 
    categoryId, 
    subcategoryId 
  });

  const handleProductClick = (product: any) => {
    dispatch(setSelectedProduct(product));
  };

  const handleAddToWatchlist = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement add to watchlist
    console.log('Add to watchlist:', productId);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="w-full h-48 bg-slate-200 rounded-t-xl"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded mb-3"></div>
              <div className="h-6 bg-slate-200 rounded mb-3"></div>
              <div className="h-3 bg-slate-200 rounded mb-3"></div>
              <div className="h-8 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {title || 'Products'}
          </h2>
          {description && (
            <p className="text-slate-600 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Sort by Price</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border border-slate-300 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-slate-100' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-2 border-l border-slate-300 ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow border border-slate-200">
              <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                ) : (
                  <div className="text-6xl text-slate-300">📦</div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-2">{product.name}</h3>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                  {product.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-slate-800">$0.00</span>
                    <span className="text-sm text-slate-500 ml-1">best price</span>
                  </div>
                  <div className="flex items-center">
                    <Minus className="text-slate-400 mr-1" size={14} />
                    <span className="text-sm text-slate-500 font-medium">N/A</span>
                  </div>
                </div>
                
                <div className="text-xs text-slate-500 mb-3">
                  <span>No providers yet</span> • 
                  <span className="ml-1">No recent updates</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => handleAddToWatchlist(e, product.id)}
                >
                  <Heart className="mr-2" size={14} />
                  Add to Watchlist
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
