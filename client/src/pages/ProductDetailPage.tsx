import { useParams } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { ProductDetail } from '@/components/ProductDetail';
import { useLocation } from 'wouter';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const productId = parseInt(id || '0');

  const handleBack = () => {
    setLocation('/');
  };

  if (!productId) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h1>
            <p className="text-slate-600 mb-8">The product you're looking for doesn't exist.</p>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail productId={productId} onBack={handleBack} />
      </main>
    </div>
  );
}
