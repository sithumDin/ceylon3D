import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Navbar } from './components/Navbar';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CustomizePrint } from './components/CustomizePrint';
import { ModelingServices } from './components/ModelingServices';
import { Testimonials } from './components/Testimonials';
import { Gallery } from './components/Gallery';
import { PaymentMethods } from './components/PaymentMethods';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <CustomizePrint />
      <ModelingServices />
      <Testimonials />
      <Gallery />
      <Services />
      <PaymentMethods />
      <About />
      <Contact />
    </div>
  );
}
