import { CreditCard, Banknote, Wallet } from 'lucide-react';

const paymentMethods = [
  {
    icon: CreditCard,
    name: 'Credit/Debit Card',
    description: 'All major credit and debit cards accepted'
  },
  {
    icon: Wallet,
    name: 'Digital Wallets',
    description: 'Apple Pay, Google Pay, and other digital payment options'
  },
  {
    icon: Banknote,
    name: 'Bank Transfer',
    description: 'Direct bank transfer available for all accounts'
  }
];

export function PaymentMethods() {
  return (
    <section id="payment" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-gray-900">Payment Methods</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We support several payment methods, which are mostly used in Sri Lanka
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300 border border-gray-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{method.name}</h3>
                <p className="text-gray-600">{method.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 text-center border border-purple-200">
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Bank transfers are also available</span> for all your convenience
          </p>
        </div>
      </div>
    </section>
  );
}
