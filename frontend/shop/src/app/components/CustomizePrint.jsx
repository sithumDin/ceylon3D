import { Palette, Zap, Grid3x3 } from 'lucide-react';

export function CustomizePrint() {
  return (
    <section id="customize" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl mb-6 text-gray-900">Customize your 3D Print</h2>
            <p className="text-xl text-gray-600 mb-8">
              You can choose the Material Color, Print Quality (Layer height), Infill percentage and other print settings. 
              Always we use the best and optimal settings suitable for your 3D model.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Material & Color</h3>
                  <p className="text-gray-600">Choose from a wide range of materials and colors to match your requirements</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Print Quality</h3>
                  <p className="text-gray-600">Adjust layer height and other parameters for optimal print quality</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Grid3x3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Infill & Settings</h3>
                  <p className="text-gray-600">Customize infill percentage and other advanced settings for your specific needs</p>
                </div>
              </div>
            </div>

            <button className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow duration-300">
              Explore More
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="text-6xl mb-4">🖨️</div>
              <p>3D Printer Customization</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
