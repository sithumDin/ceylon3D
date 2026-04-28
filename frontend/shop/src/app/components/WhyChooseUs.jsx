import { Sun, Leaf, Zap, Crosshair, Settings, Truck, Users, Lock } from 'lucide-react';

const whyChooseUsList = [
  {
    icon: Zap,
    title: '24x7 Running 3D Print Farm',
    description: 'Our 3D print farm operates 24x7 without any power interruptions, ensuring consistent and efficient production for your projects'
  },
  {
    icon: Leaf,
    title: 'Green and Sustainable Practices',
    description: 'Xydder 3D is committed to sustainability. Our printing farm is entirely solar-powered, reducing our environmental footprint and contributing to a greener future'
  },
  {
    icon: Crosshair,
    title: 'Extensive Experience',
    description: 'With over five years of experience in the 3D printing industry, we bring a wealth of knowledge and expertise to every project'
  },
  {
    icon: Settings,
    title: 'High Precision and Quality',
    description: 'Our 3D printers are calibrated and maintained to the highest standards, ensuring the precision and quality of every printed model'
  },
  {
    icon: Zap,
    title: 'Customization and Personalization',
    description: 'We understand that each project is unique. Xydder 3D offers customization and personalization options, allowing you to tailor your 3D prints to your specific requirements'
  },
  {
    icon: Truck,
    title: 'Reliable and Timely Delivery',
    description: 'Xydder 3D is committed to delivering projects on time. Our efficient production processes and reliable scheduling ensure that you receive your 3D prints when you need them'
  },
  {
    icon: Users,
    title: 'Client-Centric Approach',
    description: 'We prioritize our clients\' satisfaction. Xydder 3D maintains open communication, provides regular updates, and works closely with clients to understand and fulfill their unique requirements'
  },
  {
    icon: Lock,
    title: 'Secure and Confidential',
    description: 'Your intellectual property and project details are secure with us. Xydder 3D adheres to strict confidentiality standards to protect your designs and data'
  }
];

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-gray-900">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Industry-leading 3D printing services with a commitment to excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUsList.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-purple-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
