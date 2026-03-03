import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Navbar } from './components/Navbar';
import { STLUploadPage } from './components/STLUploadPage';

export default function App() {
  const isUploadPage = window.location.pathname === '/upload';

  if (isUploadPage) {
    return <STLUploadPage />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Portfolio />
      <Services />
      <About />
      <Contact />
    </div>
  );
}
