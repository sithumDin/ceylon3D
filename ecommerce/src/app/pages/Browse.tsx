import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { ProductCard } from "../components/ProductCard";
import { products, categories } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

export function Browse() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const queryParam = searchParams.get("q");

  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search query
    if (queryParam) {
      const query = queryParam.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by price
    filtered = filtered.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [queryParam, selectedCategories, priceRange, minRating, sortBy]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={category.id} className="cursor-pointer">
                {category.icon} {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            min={0}
            max={100}
            step={5}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 0].map(rating => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={() => setMinRating(rating)}
              />
              <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                {rating > 0 ? `${rating}+ stars` : "All ratings"}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange([0, 100]);
          setMinRating(0);
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl mb-2">
              {queryParam
                ? `Search results for "${queryParam}"`
                : categoryParam
                ? categories.find(c => c.id === categoryParam)?.name
                : "All Items"}
            </h1>
            <p className="text-gray-600">{filteredProducts.length} items found</p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="sm:hidden">
                  <SlidersHorizontal className="size-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border rounded-md px-4 py-2 flex-1 sm:flex-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden sm:block w-64 flex-shrink-0">
            <div className="bg-white border rounded-lg p-6 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">No items found</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 100]);
                    setMinRating(0);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
