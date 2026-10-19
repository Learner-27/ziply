'use client'

import { FormEvent, useState } from 'react'
import QRCode from 'qrcode'

const steps = [
  ['01', 'Paste your URL', 'Drop in any long link you want to make more shareable.'],
  ['02', 'Make it yours', 'Add a custom alias or let Ziply create one for you.'],
  ['03', 'Share anywhere', 'Copy your new link and watch your clicks roll in.'],
]

export default function Page() {
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [result, setResult] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [dark, setDark] = useState(false)

  async function shorten(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!url.trim()) return
    const cleanAlias = alias.trim().replace(/[^a-zA-Z0-9-_]/g, '')
    const generated = cleanAlias || Math.random().toString(36).slice(2, 8)
    const response = await fetch(`/${generated}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url.trim(), slug: generated }),
    })

    if (!response.ok) return

    const hostname = window.location.hostname.replace(/^www\./, '')
    const shortLink = `${hostname}${window.location.port ? `:${window.location.port}` : ''}/${generated}`
    const fullLink = `${window.location.protocol}//${shortLink}`
    setResult(shortLink)
    setQrCode(await QRCode.toDataURL(fullLink, {
      width: 220,
      margin: 2,
      color: { dark: '#161616', light: '#ffffff' },
    }))
    setCopied(false)
    try {
      await navigator.clipboard.writeText(`${window.location.protocol}//${shortLink}`)
      setCopied(true)
    } catch {
      // Clipboard access can be unavailable in embedded previews.
    }
  }

  return (
    <main className={dark ? 'site-shell dark-mode' : 'site-shell'}>
      <header className="nav container">
        <a className="brand" href="#top" aria-label="Ziply home">ziply</a>
        <nav aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
          <button className="theme-toggle" type="button" onClick={() => setDark(!dark)} aria-label="Toggle theme">◐</button>
        </nav>
      </header>

      <section id="top" className="hero container">
        <div className="eyebrow">A faster way to share</div>
        <h1>Short links.<br /><em>Big impact.</em></h1>
        <p className="hero-copy">Turn long, messy URLs into clean, memorable links in a single click. Built for speed, designed for the way you share.</p>
        <form className="shortener" onSubmit={shorten}>
          <div className="url-row">
            <label className="sr-only" htmlFor="long-url">Long URL</label>
            <input id="long-url" type="url" required placeholder="Paste your long URL here..." value={url} onChange={(event) => setUrl(event.target.value)} />
            <button type="submit">Shorten URL <span aria-hidden="true">→</span></button>
          </div>
          <div className="alias-row">
            <span aria-hidden="true">univotechain.xyz/</span>
            <label className="sr-only" htmlFor="alias">Custom alias</label>
            <input id="alias" placeholder="Custom alias" value={alias} onChange={(event) => setAlias(event.target.value)} />
            <small>Optional custom alias</small>
          </div>
          {result && (
            <output className="result" aria-live="polite">
              <div className="result-copy">
                <span>Your short link: <strong>{result}</strong></span>
                <div className="result-actions">
                  <button type="button" onClick={async () => {
                    await navigator.clipboard.writeText(`https://${result}`)
                    setCopied(true)
                  }}>
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                  <a href={qrCode} download={`ziply-${result.split('/').pop()}.png`} className="download-qr">Download QR</a>
                </div>
              </div>
              {qrCode && <img className="qr-code" src={qrCode} alt={`QR code for ${result}`} />}
            </output>
          )}
        </form>
        <div className="trust-row"><span>No sign-up required</span><span>Lightning fast redirects</span><span>Simple analytics</span></div>
      </section>

      <section id="how-it-works" className="how container">
        <div className="eyebrow">Simple by design</div>
        <h2>Share smarter, <em>not harder.</em></h2>
        <div className="steps">{steps.map(([number, title, copy]) => <article key={number}><div className="step-number">{number}</div><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <footer className="footer container"><a className="brand" href="#top">ziply</a><p>Shorten the internet, one link at a time.<br /><span>© 2026 Ziply</span></p></footer>
    </main>
  )
}
