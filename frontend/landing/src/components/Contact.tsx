import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [stlFile, setStlFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stlFile) {
      alert('Please select an STL file before submitting.');
      return;
    }

    const payload = new FormData();
    payload.append('file', stlFile);
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    payload.append('message', formData.message);

    try {
      setIsUploading(true);

      const response = await fetch(`${API_BASE_URL}/api/uploads/stl`, {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      alert('STL uploaded successfully! We will review your request and contact you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setStlFile(null);
    } catch (error) {
      alert('STL upload failed. Please make sure the backend is running and try again.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setStlFile(file);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-gray-900">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to start your project? Contact us today for a free consultation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-900 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="stlFileInput" className="block text-gray-900 mb-2">
                  STL File
                </label>
                <input
                  type="file"
                  id="stlFileInput"
                  name="stlFile"
                  accept=".stl,model/stl,application/sla,application/vnd.ms-pki.stl"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                {stlFile && (
                  <p className="mt-2 text-sm text-gray-600">Selected: {stlFile.name}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full hover:scale-105 hover:from-pink-600 hover:to-purple-600 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-2xl hover:shadow-purple-500/30"
              >
                {isUploading ? 'Uploading...' : 'Upload STL & Send'}
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-semibold">Email</h3>
              <p className="text-gray-700">contact@ceylon3d.com</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-semibold">Phone</h3>
              <p className="text-gray-700">+1 (555) 123-4567</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-semibold">Location</h3>
              <p className="text-gray-700">123 Innovation Drive<br />Tech City, TC 12345</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center text-gray-600 border-t border-gray-200 pt-8">
        <p>© 2026 Ceylon3D. All rights reserved.</p>
      </div>
    </section>
  );
}
