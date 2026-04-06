import Link from 'next/link';
import { MessageCircle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - ChatMessaging',
  description: 'Learn how ChatMessaging protects your data and privacy.',
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Last updated: April 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                At ChatMessaging, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our chat platform services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Account Information:</strong> Email, username, display name, and profile picture</li>
                <li><strong>Message Content:</strong> Text, images, files, and other media you send through our platform</li>
                <li><strong>Usage Data:</strong> Device information, IP address, browser type, and interaction patterns</li>
                <li><strong>Communication Metadata:</strong> Timestamps, delivery status, and read receipts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide and maintain our chat services</li>
                <li>Send you messages and notifications</li>
                <li>Improve and personalize your experience</li>
                <li>Detect and prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational security measures to protect your 
                personal data against unauthorized access, alteration, disclosure, or destruction. All data 
                is encrypted in transit and at rest using industry-standard encryption protocols.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your personal data only for as long as necessary to fulfill the purposes we 
                collected it for. You can request deletion of your account and associated data at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">Under applicable data protection laws, you have the right to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: privacy@chatmessaging.com<br />
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
