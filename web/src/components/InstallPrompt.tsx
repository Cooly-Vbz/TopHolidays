import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice?: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function InstallPrompt({ show }: { show: boolean }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault?.()
      setDeferred(e as BeforeInstallPromptEvent)
      if (show) setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler as any)
    return () => window.removeEventListener('beforeinstallprompt', handler as any)
  }, [show])

  if (!visible || !deferred) return null
  return (
    <div role="region" aria-label="Install app" style={{ position: 'sticky', top: 64, zIndex: 900, background: '#F3F4F6', borderBottom: '1px solid #E5E7EB' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center', padding: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600 }}>Install Top Holidays</div>
          <div style={{ color: '#6B7280', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Add the app to your device for faster access.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={async () => { await deferred.prompt(); setVisible(false) }} style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px' }}>Install</button>
          <button onClick={() => setVisible(false)} style={{ border: '1px solid #D1D5DB', background: '#fff', color: '#374151', borderRadius: 8, padding: '8px 12px' }}>Not now</button>
        </div>
      </div>
    </div>
  )
}