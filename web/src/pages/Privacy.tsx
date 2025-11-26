export default function Privacy() {
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#718096', marginBottom: 12 }}>
        This demo app stores your data only on this device. No data is sent to a remote server.
      </p>
      <ul style={{ paddingLeft: 16, color: '#4B5563', fontSize: 14 }}>
        <li>Login information and profile are encrypted before being stored.</li>
        <li>Payment methods and addresses are stored locally for your convenience.</li>
        <li>You can clear all local data from the Account &gt; Privacy tab.</li>
      </ul>
    </div>
  )
}


