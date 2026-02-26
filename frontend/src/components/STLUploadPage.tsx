import { ArrowLeft, CheckCircle, FileText, ShoppingCart, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export function STLUploadPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('PLA');
  const [quantity, setQuantity] = useState(1);

  const basePrice = 29.99;
  const materialPrices: Record<string, number> = {
    PLA: 0,
    ABS: 10,
    PETG: 15,
    Resin: 25,
  };
  const totalPrice = (basePrice + materialPrices[selectedMaterial]) * quantity;

  const goHome = () => {
    window.location.href = '/';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const isStlFile = (file: File) => file.name.toLowerCase().endsWith('.stl');

  const selectFile = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!isStlFile(file)) {
      setSelectedFile(null);
      setStatusMessage('Please choose a valid .stl file.');
      return;
    }

    setSelectedFile(file);
    setStatusMessage('');
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0] || null;
    selectFile(file);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    selectFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setStatusMessage('Please upload your STL file first.');
      return;
    }

    const payload = new FormData();
    payload.append('file', selectedFile);
    payload.append('name', 'Website User');
    payload.append('email', 'not-provided@ceylon3d.local');
    payload.append('phone', '');
    payload.append('message', `Material: ${selectedMaterial}, Quantity: ${quantity}, Estimated Total: $${totalPrice.toFixed(2)}`);

    try {
      setIsUploading(true);
      setStatusMessage('Uploading STL and order details...');

      const response = await fetch(`${API_BASE_URL}/api/uploads/stl`, {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(responseText || 'Upload failed');
      }

      setStatusMessage('STL uploaded successfully. Your order request is received.');
      setSelectedFile(null);
      setSelectedMaterial('PLA');
      setQuantity(1);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('Upload failed. Make sure backend is running on port 8080.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={goHome}
          className="mb-8 inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Upload & Order Your Print
        </h1>

        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 p-8 md:p-12 shadow-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Upload className="w-7 h-7 text-blue-600" />
                Send Your STL File
              </h2>

              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/60 shadow-lg shadow-blue-100'
                    : selectedFile
                      ? 'border-green-300 bg-green-50/50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileInputClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".stl"
                  onChange={handleInputFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-100/60">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="max-w-md mx-auto rounded-2xl bg-white/80 border border-green-100 p-4 text-left">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{selectedFile.name}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{formatFileSize(selectedFile.size)}</span>
                            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">.STL</span>
                            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700">Ready</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleFileInputClick();
                        }}
                        className="px-4 py-2 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        Replace File
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors inline-flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto ring-4 ring-blue-100/60">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">Drop your STL file here</p>
                    <p className="text-sm text-gray-600">or click to browse from your device</p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleFileInputClick();
                      }}
                      className="mt-1 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Browse File
                    </button>
                  </div>
                )}

                {isDragging && (
                  <div className="pointer-events-none absolute inset-2 rounded-xl border border-blue-300 bg-blue-100/40 flex items-center justify-center text-blue-700 font-semibold">
                    Release to upload STL
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600">Supported format: .STL</span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600">Single file upload</span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-8"></div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <ShoppingCart className="w-7 h-7 text-purple-600" />
                Order Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select Material</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['PLA', 'ABS', 'PETG', 'Resin'].map(material => (
                      <button
                        type="button"
                        key={material}
                        onClick={() => setSelectedMaterial(material)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedMaterial === material
                            ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 text-gray-700'
                        }`}
                      >
                        <div className="font-semibold">{material}</div>
                        <div className="text-sm">
                          {materialPrices[material] === 0 ? 'Standard' : `+$${materialPrices[material]}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={event => setQuantity(Math.max(1, parseInt(event.target.value, 10) || 1))}
                      className="w-20 h-12 text-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Base Price:</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Material ({selectedMaterial}):</span>
                    <span>+${materialPrices[selectedMaterial].toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Quantity:</span>
                    <span>×{quantity}</span>
                  </div>
                  <div className="border-t border-gray-300 my-3"></div>
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                    selectedFile && !isUploading
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isUploading ? 'Submitting...' : selectedFile ? 'Buy Now' : 'Upload STL File First'}
                </button>
              </div>
            </div>

            {statusMessage && <p className="text-sm text-gray-700 mt-6">{statusMessage}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}
