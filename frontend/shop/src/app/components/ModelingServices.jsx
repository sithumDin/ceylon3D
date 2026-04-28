import { PenTool, Lightbulb } from 'lucide-react';

export function ModelingServices() {
  return (
    <section id="modeling" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl h-96 flex items-center justify-center order-2 lg:order-1">
            <div className="text-center text-gray-600">
              <div className="text-6xl mb-4">📐</div>
              <p>3D Modeling Services</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-4xl sm:text-5xl mb-6 text-gray-900">3D Modeling</h2>
            <p className="text-xl text-gray-600 mb-8">
              If you don't have a 3D model file, we can design it for you. Just send us a sketch with all dimensions of the 3D model you require.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Professional Design</h3>
                  <p className="text-gray-600">Our expert designers will transform your sketches into precise 3D models</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Optimization</h3>
                  <p className="text-gray-600">We optimize designs for perfect 3D printing results and structural integrity</p>
                </div>
              </div>
            </div>

            <button className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow duration-300">
              Explore More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
