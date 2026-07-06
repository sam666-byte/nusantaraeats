import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — NusantaraEats",
  description: "Privacy Policy for NusantaraEats. Learn how we collect, use, and protect your information.",
  alternates: { canonical: "https://nusantaraeats.com/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — NusantaraEats",
    description: "Privacy Policy for NusantaraEats. Learn how we collect, use, and protect your information.",
    url: "https://nusantaraeats.com/privacy-policy",
    siteName: "NusantaraEats",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy — NusantaraEats",
    description: "Privacy Policy for NusantaraEats. Learn how we collect, use, and protect your information.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <article className="relative z-10 mx-auto max-w-4xl px-4 py-28 sm:px-6">
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-zinc-300">Privacy Policy</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-serif text-4xl font-black text-white sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-zinc-500">Last updated: June 29, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-zinc-300">
        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Introduction</h2>
          <p className="leading-relaxed">
            Welcome to NusantaraEats (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website nusantaraeats.com.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Information We Collect</h2>
          <p className="leading-relaxed">
            We may collect information about you in a variety of ways, including:
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-6">
            <li>Personal Data: Name, email address when you subscribe to our newsletter or contact us.</li>
            <li>Derivative Data: Information automatically collected when you access the site, such as IP address, browser type, operating system, and browsing patterns.</li>
            <li>Cookies: We use cookies to enhance your experience and analyze site traffic.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">How We Use Your Information</h2>
          <p className="leading-relaxed">We may use the information we collect to:</p>
          <ul className="mt-4 space-y-2 list-disc pl-6">
            <li>Operate and maintain our website.</li>
            <li>Improve user experience and personalize content.</li>
            <li>Analyze usage trends and website performance.</li>
            <li>Send newsletters and updates (only if you opt in).</li>
            <li>Respond to your comments, questions, and requests.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Third-Party Services</h2>
          <p className="leading-relaxed">
            We may use third-party services such as Google Analytics to collect and analyze usage data. These services have their own privacy policies governing how they use information.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Data Security</h2>
          <p className="leading-relaxed">
            We use appropriate administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Your Rights</h2>
          <p className="leading-relaxed">
            You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at the email below.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Contact Us</h2>
          <p className="leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at: contact@nusantaraeats.com
          </p>
        </section>
      </div>
    </article>
  );
}
