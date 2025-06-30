import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Download, 
  Upload, 
  CheckCircle, 
  Clock, 
  Edit 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useCreateProductMutation,
  useCreatePriceMutation,
  useGetProvidersQuery,
  useTriggerScrapeMutation,
} from '@/store/productsSlice';
import { 
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from '@/store/categoriesSlice';
import { insertProductSchema, insertPriceSchema } from '@shared/schema';
import { z } from 'zod';

const productFormSchema = insertProductSchema.extend({
  categoryId: z.coerce.number(),
  subcategoryId: z.coerce.number(),
});

const priceFormSchema = insertPriceSchema.extend({
  productId: z.coerce.number(),
  providerId: z.coerce.number(),
  variantId: z.coerce.number().optional(),
  originalPrice: z.coerce.number(),
  discount: z.coerce.number().optional(),
  finalPrice: z.coerce.number(),
});

type ProductFormData = z.infer<typeof productFormSchema>;
type PriceFormData = z.infer<typeof priceFormSchema>;

export function AdminPanel() {
  const { toast } = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const [selectedProductId, setSelectedProductId] = useState<number>();

  const { data: categories } = useGetCategoriesQuery();
  const { data: subcategories } = useGetSubcategoriesQuery(selectedCategoryId);
  const { data: providers } = useGetProvidersQuery();

  const [createProduct, { isLoading: isCreatingProduct }] = useCreateProductMutation();
  const [createPrice, { isLoading: isCreatingPrice }] = useCreatePriceMutation();
  const [triggerScrape, { isLoading: isScraping }] = useTriggerScrapeMutation();

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      brand: '',
    },
  });

  const priceForm = useForm<PriceFormData>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      originalPrice: 0,
      discount: 0,
      finalPrice: 0,
      skuId: '',
    },
  });

  const onSubmitProduct = async (data: ProductFormData) => {
    try {
      await createProduct(data).unwrap();
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      productForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  const onSubmitPrice = async (data: PriceFormData) => {
    try {
      await createPrice(data).unwrap();
      toast({
        title: "Success", 
        description: "Price entry added successfully",
      });
      priceForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add price entry",
        variant: "destructive",
      });
    }
  };

  const handleScrapeData = async () => {
    if (!selectedProductId) {
      toast({
        title: "Error",
        description: "Please select a product to scrape",
        variant: "destructive",
      });
      return;
    }

    try {
      await triggerScrape(selectedProductId).unwrap();
      toast({
        title: "Success",
        description: "Scraping task queued successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start scraping",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In production, this would upload to a file storage service
      // For now, we'll just use a placeholder
      productForm.setValue('image', 'https://via.placeholder.com/400x300');
      toast({
        title: "Image uploaded",
        description: "Image uploaded successfully (placeholder)",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-slate-800">Admin Panel</CardTitle>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleScrapeData}
                disabled={isScraping || !selectedProductId}
              >
                <Download className="mr-2" size={16} />
                {isScraping ? 'Scraping...' : 'Scrape Data'}
              </Button>
              <Button>
                <Plus className="mr-2" size={16} />
                Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Product Form */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Product</h3>
              <Form {...productForm}>
                <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4">
                  <FormField
                    control={productForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={productForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedCategoryId(parseInt(value));
                            }}
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={productForm.control}
                      name="subcategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategory</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            value={field.value?.toString()}
                            disabled={!selectedCategoryId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Subcategory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subcategories?.map((subcategory) => (
                                <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                  {subcategory.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={productForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Product description"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={productForm.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Product brand" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Label>Product Image</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-slate-400 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="mx-auto mb-2 text-slate-400" size={24} />
                        <p className="text-slate-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                      </label>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isCreatingProduct}>
                    {isCreatingProduct ? 'Creating...' : 'Create Product'}
                  </Button>
                </form>
              </Form>
            </div>
            
            {/* Manual Price Entry */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Manual Price Entry</h3>
              <Form {...priceForm}>
                <form onSubmit={priceForm.handleSubmit(onSubmitPrice)} className="space-y-4">
                  <FormField
                    control={priceForm.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Product</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedProductId(parseInt(value));
                          }}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Sample Product 1</SelectItem>
                            <SelectItem value="2">Sample Product 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={priceForm.control}
                    name="providerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {providers?.map((provider) => (
                              <SelectItem key={provider.id} value={provider.id.toString()}>
                                {provider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={priceForm.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Original Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                              <Input 
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-8"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={priceForm.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={priceForm.control}
                    name="finalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Final Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                            <Input 
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={priceForm.control}
                    name="skuId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SKU identifier" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    disabled={isCreatingPrice}
                  >
                    {isCreatingPrice ? 'Adding...' : 'Add Price Entry'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          
          {/* Recent Activities */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activities</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Plus className="text-blue-600" size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800">System initialized - Ready for product creation</p>
                  <p className="text-xs text-slate-500">Just now</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="text-green-600" size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800">Database schema created successfully</p>
                  <p className="text-xs text-slate-500">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <Clock className="text-amber-600" size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800">Admin panel loaded and ready for use</p>
                  <p className="text-xs text-slate-500">5 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
