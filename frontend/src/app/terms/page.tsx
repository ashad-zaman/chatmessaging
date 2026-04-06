import Link from 'next/link';
import { MessageCircle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - ChatMessaging',
  description: 'ChatMessaging Terms of Service and acceptable use policy.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <MessageCircle className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">ChatMessaging</span>
              </Link>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Last updated: April 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using ChatMessaging services, you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by these 
                terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                ChatMessaging provides real-time chat and messaging services to facilitate 
                communication between users. Our services include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>One-to-one messaging</li>
                <li>Group conversations</li>
                <li>File and media sharing</li>
                <li>User presence and status updates</li>
                <li>API access for developers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">When creating an account, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not share your account with others</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be at least 13 years of age</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-600 mb-4">You agree not to use our services to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Transmit any unlawful, harmful, threatening, or abusive content</li>
                <li>Harass, abuse, or harm another person</li>
                <li>Send spam or unsolicited messages</li>
                <li>Impersonate any person or entity</li>
                <li>Distribute viruses or malware</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content Ownership</h2>
              <p className="text-gray-600 mb-4">
                You retain ownership of all content you submit to our services. By using ChatMessaging, 
                you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and 
                distribute your content solely for the purpose of providing our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment Terms</h2>
              <p className="text-gray-600 mb-4">
                For paid plans, you agree to pay all fees associated with your subscription. All payments 
                are non-refundable unless otherwise specified. We reserve the right to modify our pricing 
                at any time with 30 days notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-gray-600 mb-4">
                Our services are provided &quot;as is&quot; without warranty of any kind. We do not guarantee 
                that our services will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                ChatMessaging shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use or inability to use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to terminate or suspend your account at any time for violation 
                of these terms or for any other reason at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We may modify these terms at any time. We will provide notice of material changes. 
                Your continued use of our services after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: legal@chatmessaging.com<br />
                Address: 123 Tech Street, San Francisco, CA 94105
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} ChatMessaging. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
