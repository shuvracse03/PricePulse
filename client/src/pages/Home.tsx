import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductGrid } from '@/components/ProductGrid';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export default function Home() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const selectedCategory = useSelector((state: RootState) => state.categories.selectedCategory);
  const selectedSubcategory = useSelector((state: RootState) => state.categories.selectedSubcategory);

  const handleAddProduct = () => {
    setShowAdminPanel(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCategory ? (
          <CategoryGrid onAddProduct={handleAddProduct} />
        ) : (
          <ProductGrid
            categoryId={selectedCategory.id}
            subcategoryId={selectedSubcategory?.id}
            title={`${selectedCategory.name}${selectedSubcategory ? ` > ${selectedSubcategory.name}` : ''}`}
            description="Compare prices from multiple providers"
          />
        )}
      </main>
    </div>
  );
}
