import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Tharuja Ranasinghe',
    text: 'I have a Topeak quick track luggage. I wanted to fix a retainer part to my luggage bag so I can easily slide in the bag to the luggage. Found a 3D file on thingiverse and Xydder printed it for me within 12 hours. It perfectly fits and the finishing is amazing. Thank you Xydder 3D ❤️👌🏻 Highly recommended 🫡',
    rating: 5,
    timeAgo: '3 years ago'
  },
  {
    name: 'dilan chanuka',
    text: 'Good',
    rating: 5,
    timeAgo: '3 years ago'
  },
  {
    name: 'shan',
    text: 'Good service, delivered on time, Good quality, precision and finishing. Recommended!!',
    rating: 5,
    timeAgo: '3 years ago'
  },
  {
    name: 'Tanuli Guhaneson',
    text: 'Good place for a quality 3D print !',
    rating: 5,
    timeAgo: '3 years ago'
  },
  {
    name: 'Sri Prathap Wijayasooriya',
    text: 'Excellent service .............',
    rating: 5,
    timeAgo: '3 years ago'
  },
  {
    name: 'dumindra ratnayaka',
    text: 'Got a bracket printed for my Echo Dot. Excellent job done by Xydder 3D, fast service, quality work and good customer service. Will recommend for your 3D printing requirements',
    rating: 5,
    timeAgo: '3 years ago'
  },
  {
    name: 'Chenura Fernando',
    text: 'Good Quality Materials & Fast Delivery',
    rating: 5,
    timeAgo: '3 years ago'
  },
  {
    name: 'Kaveen R',
    text: 'I got some parts 3D printed to fix my headphones, Xydder 3D were great, both in service and product!',
    rating: 5,
    timeAgo: '3 years ago'
  },
  {
    name: 'udara amarasinghe',
    text: 'my headset hinge was cracked, and some plastic welder ruined the damage. somehow I\'m able to get the 3d design via google and send it to xydder and they provided reasonable price that I have compared to several other 3d printing services around colombo. on next day morning I got printed part and with small sharpens and clearing, it will perfectly fit to the headset. xydder save my headset and thanks for high quality fast service.!',
    rating: 5,
    timeAgo: '3 years ago'
  },
  {
    name: 'Lahiru De Silva',
    text: 'Superb service for 3D prints. Got several done and all done within 24 hours with great precision and surface finish. Super responsive and helpful owner as well. Highly recommended.',
    rating: 5,
    timeAgo: '3 years ago'
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-gray-900">Customer Testimonials</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our satisfied clients have to say about our services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-4">{testimonial.text}</p>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="https://maps.app.goo.gl/PuMKLxvnr3KQPPUb7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow duration-300"
          >
            Read More Reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
