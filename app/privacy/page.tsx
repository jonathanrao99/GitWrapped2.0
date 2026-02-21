import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for GitWrapped — how we handle data and analytics.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 md:p-10 max-w-3xl mx-auto">
      <Link
        href="/"
        className="inline-block text-zinc-400 hover:text-white mb-8 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
      >
        ← Back to GitWrapped
      </Link>
      <h1 className="text-2xl font-bold text-white mb-6">Privacy Policy</h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString("en-US")}</p>

      <section className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-white">Overview</h2>
        <p className="text-zinc-300">
          GitWrapped is a GitHub stats dashboard. We do not collect personal data from you directly. When you enter a
          GitHub username, we request that user’s public data from the GitHub API to display their stats. We do not
          store usernames or stats on our servers beyond what is needed to show the page.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-white">Data we use</h2>
        <ul className="list-disc list-inside text-zinc-300 space-y-2">
          <li>
            <strong>GitHub username:</strong> You provide it to load that user’s public GitHub stats. It may appear in
            the URL when you share a link (e.g. <code className="bg-zinc-800 px-1 rounded">?user=username</code>).
          </li>
          <li>
            <strong>Analytics:</strong> If this site is deployed on Vercel, Vercel Analytics may collect anonymized
            usage data (e.g. page views). See{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Vercel’s Privacy Policy
            </a>{" "}
            for details.
          </li>
        </ul>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-white">Cookies</h2>
        <p className="text-zinc-300">
          GitWrapped does not set cookies for tracking. The hosting provider (e.g. Vercel) or analytics may use cookies
          or similar technologies as described in their privacy policy.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-white">Third parties</h2>
        <p className="text-zinc-300">
          We use the GitHub API to fetch public profile and contribution data. Use of GitHub is subject to{" "}
          <a
            href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            GitHub’s Privacy Statement
          </a>
          . We do not sell or share your data with third parties for advertising.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-white">Contact</h2>
        <p className="text-zinc-300">
          For questions about this policy, open an issue or contact the maintainer via{" "}
          <a
            href="https://github.com/jonathanrao99"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </section>
    </div>
  );
}
