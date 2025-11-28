import { useTheme } from '../components/ThemeProvider'

export default function Privacy() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const textColor = isDark ? '#E5E7EB' : '#111827'
  const mutedColor = isDark ? '#9CA3AF' : '#718096'
  const headingColor = isDark ? '#60A5FA' : '#3B82F6'

  return (
    <div style={{
      padding: '24px 16px',
      maxWidth: 800,
      margin: '0 auto',
      color: textColor
    }}>
      <h1 style={{
        fontSize: 28,
        marginBottom: 8,
        color: headingColor,
        fontWeight: 700
      }}>
        Privacy Policy
      </h1>

      <p style={{ color: mutedColor, marginBottom: 24, fontSize: 14 }}>
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          1. Introduction
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          Top Holidays ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Progressive Web Application.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          2. Information We Collect
        </h2>

        <h3 style={{ fontSize: 16, marginBottom: 8, marginTop: 16, fontWeight: 600 }}>
          2.1 Personal Information
        </h3>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          We may collect the following personal information:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 12, lineHeight: 1.8 }}>
          <li>Name and email address (for account creation)</li>
          <li>Shipping and billing addresses</li>
          <li>Payment information (processed securely through third-party providers)</li>
          <li>Order history and preferences</li>
          <li>Communication preferences</li>
        </ul>

        <h3 style={{ fontSize: 16, marginBottom: 8, marginTop: 16, fontWeight: 600 }}>
          2.2 Automatically Collected Information
        </h3>
        <ul style={{ paddingLeft: 24, marginBottom: 12, lineHeight: 1.8 }}>
          <li>Device information (type, operating system, browser)</li>
          <li>Usage data (pages visited, features used, time spent)</li>
          <li>IP address and location data</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          3. How We Use Your Information
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          We use your information to:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 12, lineHeight: 1.8 }}>
          <li>Process and fulfill your orders</li>
          <li>Communicate with you about your account and orders</li>
          <li>Provide customer support</li>
          <li>Improve and personalize your experience</li>
          <li>Send promotional communications (with your consent)</li>
          <li>Detect and prevent fraud and security threats</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          4. Data Storage and Security
        </h2>

        <h3 style={{ fontSize: 16, marginBottom: 8, marginTop: 16, fontWeight: 600 }}>
          4.1 Local Storage
        </h3>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          Most of your data is stored locally on your device using encrypted browser storage (localStorage and IndexedDB). This includes:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 12, lineHeight: 1.8 }}>
          <li>Account credentials (encrypted)</li>
          <li>Shopping cart contents</li>
          <li>Favorites and preferences</li>
          <li>Saved addresses and payment methods</li>
        </ul>

        <h3 style={{ fontSize: 16, marginBottom: 8, marginTop: 16, fontWeight: 600 }}>
          4.2 Security Measures
        </h3>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          We implement industry-standard security measures including:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 12, lineHeight: 1.8 }}>
          <li>End-to-end encryption for sensitive data</li>
          <li>Secure HTTPS connections</li>
          <li>Regular security audits and updates</li>
          <li>Access controls and authentication</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          5. Data Sharing and Disclosure
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          We do not sell your personal information. We may share your data with:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 12, lineHeight: 1.8 }}>
          <li><strong>Service Providers:</strong> Payment processors, shipping companies, and hosting services</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          6. Your Privacy Rights
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          You have the right to:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 12, lineHeight: 1.8 }}>
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Correction:</strong> Update or correct inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your data (via Account settings)</li>
          <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
          <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
          <li><strong>Withdraw Consent:</strong> Revoke consent for data processing</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          7. Cookies and Tracking
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          We use cookies and similar technologies to:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 12, lineHeight: 1.8 }}>
          <li>Remember your preferences and settings</li>
          <li>Analyze usage patterns and improve our service</li>
          <li>Provide personalized content and recommendations</li>
        </ul>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          You can control cookies through your browser settings.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          8. Children's Privacy
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          Our service is not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          9. International Data Transfers
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          10. Data Retention
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          11. Changes to This Policy
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          12. Contact Us
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us through the Customer Care section of the App.
        </p>
      </section>

      <div style={{
        marginTop: 32,
        padding: 16,
        background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        borderRadius: 8,
        border: `1px solid ${isDark ? '#10B981' : '#6EE7B7'}`
      }}>
        <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          <strong>🔒 Your Privacy Matters:</strong> We are committed to transparency and protecting your personal information. You can delete all locally stored data at any time through Account Settings → Privacy → Delete Local Account & Data.
        </p>
      </div>
    </div>
  )
}
