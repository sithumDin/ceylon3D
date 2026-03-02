import { Link } from "react-router";
import { Star, TruckIcon } from "lucide-react";
import { Product } from "../data/mockData";
import { Card } from "./ui/card";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
          <p className="text-xl font-semibold mb-2">${product.price.toFixed(2)}</p>
          {product.shipping === "Free shipping" && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TruckIcon className="size-4" />
              <span>Free shipping</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
