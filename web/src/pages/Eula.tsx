import { useTheme } from '../components/ThemeProvider'

export default function Eula() {
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
        End User License Agreement (EULA)
      </h1>

      <p style={{ color: mutedColor, marginBottom: 24, fontSize: 14 }}>
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          1. Agreement to Terms
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          By installing, accessing, or using the Top Holidays application ("App"), you agree to be bound by this End User License Agreement. If you do not agree to these terms, do not install or use the App.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          2. License Grant
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          Subject to your compliance with this Agreement, we grant you a limited, non-exclusive, non-transferable, revocable license to:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 12, lineHeight: 1.8 }}>
          <li>Install and use the App on your personal devices</li>
          <li>Access and use the App for personal, non-commercial purposes</li>
          <li>Receive automatic updates and upgrades to the App</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          3. Restrictions
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          You agree NOT to:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 12, lineHeight: 1.8 }}>
          <li>Reverse engineer, decompile, or disassemble the App</li>
          <li>Modify, adapt, or create derivative works of the App</li>
          <li>Remove, alter, or obscure any proprietary notices</li>
          <li>Use the App for any illegal or unauthorized purpose</li>
          <li>Distribute, sell, lease, or sublicense the App</li>
          <li>Use the App to transmit viruses or malicious code</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          4. Intellectual Property Rights
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          The App and all related intellectual property rights are owned by Top Holidays or its licensors. This Agreement does not grant you any ownership rights to the App.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          5. User Accounts and Data
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          You are responsible for maintaining the confidentiality of your account credentials. All data is stored locally on your device using encryption. You may delete your data at any time through the App settings.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          6. Purchases and Payments
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          All purchases made through the App are subject to our refund and return policies. Prices and availability are subject to change without notice. Payment processing is handled securely through third-party providers.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          7. Disclaimer of Warranties
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          8. Limitation of Liability
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, TOP HOLIDAYS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE APP.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          9. Termination
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          This license is effective until terminated. Your rights under this license will terminate automatically if you fail to comply with any of its terms. Upon termination, you must cease all use of the App and delete all copies.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          10. Updates and Modifications
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          We reserve the right to modify this Agreement at any time. Continued use of the App after changes constitutes acceptance of the modified terms.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          11. Governing Law
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          This Agreement shall be governed by and construed in accordance with the laws of your jurisdiction, without regard to conflict of law principles.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: headingColor }}>
          12. Contact Information
        </h2>
        <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
          For questions about this Agreement, please contact us through the Customer Care section of the App.
        </p>
      </section>

      <div style={{
        marginTop: 32,
        padding: 16,
        background: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        borderRadius: 8,
        border: `1px solid ${isDark ? '#3B82F6' : '#93C5FD'}`
      }}>
        <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          <strong>Important:</strong> By using Top Holidays, you acknowledge that you have read, understood, and agree to be bound by this End User License Agreement.
        </p>
      </div>
    </div>
  )
}
