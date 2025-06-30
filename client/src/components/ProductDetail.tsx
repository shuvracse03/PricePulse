import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { ArrowLeft, Heart, Store } from 'lucide-react';
import { PriceChart } from './PriceChart';
import { 
  useGetProductQuery,
  useGetProductVariantsQuery,
  useGetProductPricesQuery,
  useGetPriceHistoryQuery,
  useGetProvidersQuery,
} from '@/store/productsSlice';
import { setSelectedVariant } from '@/store/productsSlice';
import { useAuth } from '@/hooks/useAuth';
import type { RootState } from '@/store';

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
}

export function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>();
  const [timePeriod, setTimePeriod] = useState('7');

  const { data: product, isLoading: productLoading } = useGetProductQuery(productId);
  const { data: variants } = useGetProductVariantsQuery(productId);
  const { data: prices } = useGetProductPricesQuery({ 
    productId, 
    variantId: selectedVariantId 
  });
  const { data: priceHistory } = useGetPriceHistoryQuery({ 
    productId, 
    days: parseInt(timePeriod) 
  });
  const { data: providers } = useGetProvidersQuery();

  const handleVariantSelect = (variantId: string) => {
    const variant = variants?.find(v => v.id.toString() === variantId);
    setSelectedVariantId(variant?.id);
    dispatch(setSelectedVariant(variant || null));
  };

  const handleAddToWatchlist = () => {
    // TODO: Implement add to watchlist
    console.log('Add to watchlist:', productId);
  };

  if (productLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-6 bg-slate-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="w-full h-64 bg-slate-200 rounded-xl mb-4"></div>
              <div className="h-6 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded mb-4"></div>
            </div>
            <div>
              <div className="h-64 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-slate-500">Product not found.</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="mr-2" size={16} />
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft size={16} />
          </Button>
          <h2 className="text-2xl font-bold text-slate-800">Product Details</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Info */}
          <div>
            <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 flex items-center justify-center">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-8xl text-slate-300">📦</div>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h3>
            <p className="text-slate-600 mb-4">
              {product.description || 'No description available for this product.'}
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="text-slate-800">Category {product.categoryId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Brand:</span>
                <span className="text-slate-800">{product.brand || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Product ID:</span>
                <span className="text-slate-800">#{product.id}</span>
              </div>
            </div>
            
            {/* Variants */}
            {variants && variants.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-slate-800 mb-2">Available Variants</h4>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariantId === variant.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVariantSelect(variant.id.toString())}
                    >
                      {variant.description || `${variant.quantity} ${variant.unit}`}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleAddToWatchlist} className="w-full">
              <Heart className="mr-2" size={16} />
              Add to Watchlist
            </Button>
          </div>
          
          {/* Price Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-800">Price History</h4>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="h-64 mb-4">
              <PriceChart data={priceHistory || []} />
            </div>
            
            {/* Current Prices */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800">Current Prices</h4>
              {prices && prices.length > 0 ? (
                prices.slice(0, 5).map((price) => {
                  const provider = providers?.find(p => p.id === price.providerId);
                  return (
                    <div key={price.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                          <Store className="text-slate-600" size={14} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {provider?.name || 'Unknown Provider'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {provider?.providerType || 'Store'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">${price.finalPrice}</p>
                        {price.discount && parseFloat(price.discount) > 0 && (
                          <p className="text-xs text-green-600">
                            -{price.discount}% discount
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Store className="mx-auto mb-2" size={24} />
                  <p>No price data available for this product.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
