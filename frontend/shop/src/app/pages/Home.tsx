import { Link } from "react-router";
import { ProductCard } from "../components/ProductCard";
import { products, categories } from "../data/mockData";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";

export function Home() {
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
              Discover Unique 3D Printed Items
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              From custom miniatures to functional prototypes. Buy and sell quality 3D prints from makers around the world.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/browse">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Shopping
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                Become a Seller
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/browse?category=${category.id}`}
              className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-medium">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl">Featured Items</h2>
            <Link to="/browse">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl mb-12 text-center">Why Choose PrintBay?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛡️</span>
            </div>
            <h3 className="text-xl mb-2">Buyer Protection</h3>
            <p className="text-gray-600">Safe and secure transactions with full buyer protection on every purchase.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⭐</span>
            </div>
            <h3 className="text-xl mb-2">Quality Verified</h3>
            <p className="text-gray-600">All sellers are rated and reviewed by the community for quality assurance.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚚</span>
            </div>
            <h3 className="text-xl mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Quick turnaround times with trackable shipping on all orders.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
