import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ProductCard } from "../components/ProductCard";
import { getAllProducts } from "../lib/api";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { CustomizePrint } from "../components/CustomizePrint";
import { ModelingServices } from "../components/ModelingServices";
import { Testimonials } from "../components/Testimonials";
import { PaymentMethods } from "../components/PaymentMethods";

export function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  // Show up to 8 latest products
  const featuredProducts = [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 8);

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
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl">Latest Products</h2>
            <Link to="/browse">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No products yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* New sections */}
      <WhyChooseUs />
      <CustomizePrint />
      <ModelingServices />
      <Testimonials />
      <PaymentMethods />
    </div>
  );
}
