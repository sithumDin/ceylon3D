export function Gallery() {
  const galleryImages = [
    { id: 1, alt: '3D printed part 1' },
    { id: 2, alt: '3D printed part 2' },
    { id: 3, alt: '3D printed part 3' },
    { id: 4, alt: '3D printed part 4' },
    { id: 5, alt: '3D printed part 5' },
    { id: 6, alt: '3D printed part 6' },
    { id: 7, alt: '3D printed part 7' },
    { id: 8, alt: '3D printed part 8' },
    { id: 9, alt: '3D printed part 9' },
    { id: 10, alt: '3D printed part 10' },
    { id: 11, alt: '3D printed part 11' },
    { id: 12, alt: '3D printed part 12' }
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-gray-900">Awesome 3D Prints</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Here are some of our finest 3D printing projects
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden relative">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  🖨️
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <div className="p-3 text-center">
                <p className="text-sm text-gray-600">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow duration-300">
            View More
          </button>
        </div>
      </div>
    </section>
  );
}
