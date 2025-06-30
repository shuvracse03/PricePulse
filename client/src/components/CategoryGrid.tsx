import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useGetCategoriesQuery } from '@/store/categoriesSlice';
import { setSelectedCategory } from '@/store/categoriesSlice';
import { useAuth } from '@/hooks/useAuth';
import type { RootState } from '@/store';

interface CategoryGridProps {
  onAddProduct?: () => void;
}

export function CategoryGrid({ onAddProduct }: CategoryGridProps) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  const handleCategoryClick = (category: any) => {
    dispatch(setSelectedCategory(category));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="w-full h-32 bg-slate-200 rounded-t-xl"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Failed to load categories. Please try again later.</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No categories available.</p>
        {user?.role === 'ADMIN' && (
          <Button className="mt-4" onClick={onAddProduct}>
            <Plus className="mr-2" size={16} />
            Add First Category
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Browse Categories</h2>
        {user?.role === 'ADMIN' && onAddProduct && (
          <div className="ml-auto">
            <Button onClick={onAddProduct}>
              <Plus className="mr-2" size={16} />
              Add Product
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.id}`}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow border border-slate-200">
              <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-xl flex items-center justify-center">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                ) : (
                  <div className="text-4xl text-slate-400">📦</div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1">{category.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  View Products
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
