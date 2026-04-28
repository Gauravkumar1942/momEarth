// import React from 'react'
// import { useEffect } from 'react';

// const ContactUs = () => {

  
//     //  scroll to top on component mount
//     useEffect(() => {
//         window.scrollTo({
//           top: 0,
//           behavior: 'smooth'
//         });
//       }, []);


//   return (
//     <div>ContactUs</div>
//   )
// }

// export default ContactUs


import { useState, useEffect } from "react";
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Clock from 'lucide-react/dist/esm/icons/clock';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import Copy from 'lucide-react/dist/esm/icons/copy';
import Check from 'lucide-react/dist/esm/icons/check';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import Youtube from 'lucide-react/dist/esm/icons/youtube';
import Send from 'lucide-react/dist/esm/icons/send';

const TikTokSVG = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

const PinterestSVG = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const WhatsAppSVG = ({ big = false }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={big ? 30 : 20} height={big ? 30 : 20}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const PHONE   = "7091861823";
const EMAIL   = "anandkumar9473182722@gmail.com";
const ADDRESS = "Westend Marg, Saket, New Delhi - 110030";
const HOURS   = "Mon – Fri  ·  9 AM – 6 PM EST";
const WA_NUM  = "7091861823";

const SOCIALS = [
  { name:"Facebook",    url:"https://facebook.com/yourpage",    Icon:<Facebook size={20} />,   bg:"#1877F2" },
  { name:"Instagram",   url:"https://instagram.com/yourhandle", Icon:<Instagram size={20} />,  bg:"#E1306C" },
  { name:"Twitter",     url:"https://twitter.com/yourhandle",   Icon:<Twitter size={20} />,    bg:"#000000" },
  { name:"YouTube",     url:"https://youtube.com/@yourchannel", Icon:<Youtube size={20} />,    bg:"#FF0000" },
  { name:"TikTok",      url:"https://tiktok.com/@yourhandle",   Icon:<TikTokSVG size={20} />,     bg:"#010101" },
  { name:"Pinterest",   url:"https://pinterest.com/yourhandle", Icon:<PinterestSVG size={20} />,  bg:"#E60023" },
  { name:"WhatsApp",    url:`https://wa.me/${WA_NUM}`,           Icon:<WhatsAppSVG />,   bg:"#25D366" },
];

const S = {
  section: {
    fontFamily: "'Outfit', sans-serif",
    minHeight: "100vh",
    background: "#f7f3ee",
    padding: "clamp(40px, 8vw, 72px) clamp(16px, 4vw, 20px)",
    position: "relative",
    overflow: "hidden"
  },
  blob1: {
    position: "absolute",
    top: -160,
    right: -160,
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: "rgba(251, 191, 36, 0.22)",
    filter: "blur(80px)",
    pointerEvents: "none"
  },
  blob2: {
    position: "absolute",
    bottom: -160,
    left: -100,
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "rgba(252, 165, 165, 0.18)",
    filter: "blur(80px)",
    pointerEvents: "none"
  },
  inner: {
    maxWidth: 1080,
    margin: "0 auto",
    position: "relative"
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: "clamp(9px, 2vw, 11px)",
    fontWeight: 600,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: "#92400e",
    background: "#fef3c7",
    border: "1px solid #fde68a",
    padding: "6px 16px",
    borderRadius: 999,
    marginBottom: 20
  },
  h1: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(36px, 8vw, 80px)",
    fontWeight: 900,
    lineHeight: 1.0,
    color: "#1c1917",
    letterSpacing: -2,
    marginBottom: 14
  },
  sub: {
    color: "#78716c",
    fontSize: "clamp(14px, 4vw, 17px)",
    fontWeight: 300,
    maxWidth: 380,
    margin: "0 auto",
    lineHeight: 1.7
  }
};

export default function ContactUs() {
  const [copied, setCopied] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, []);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const waUrl = `https://wa.me/${WA_NUM}?text=Hi!%20I%20have%20a%20question%20about%20my%20order.`;

  const InfoRow = ({ icon, label, value, href, copyId }) => {
    const [rowHover, setRowHover] = useState(false);
    const content = (
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 14px)", width: "100%" }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          background: rowHover ? "#fef3c7" : "#f5f5f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: rowHover ? "#d97706" : "#78716c",
          flexShrink: 0,
          transition: "all .22s"
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "clamp(8px, 2vw, 10px)", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#a8a29e", marginBottom: 3 }}>
            {label}
          </div>
          <div style={{ fontSize: "clamp(13px, 3vw, 15px)", fontWeight: 600, color: "#1c1917", wordBreak: "break-word" }}>
            {value}
          </div>
        </div>
        {copyId && (
          <div
            onClick={e => { e.preventDefault(); copy(value, copyId) }}
            style={{ marginLeft: "auto", color: copied === copyId ? "#10b981" : "#d4d4d4", cursor: "pointer", flexShrink: 0 }}
          >
            {copied === copyId ? <Check size={15} /> : <Copy size={15} />}
          </div>
        )}
        {href && !copyId && (
          <ExternalLink size={15} style={{ marginLeft: "auto", color: rowHover ? "#fbbf24" : "#d4d4d4", flexShrink: 0 }} />
        )}
      </div>
    );
    const boxStyle = {
      display: "flex",
      alignItems: "center",
      gap: 14,
      background: "#fff",
      border: `1.5px solid ${rowHover ? "#fbbf24" : "#e7e5e4"}`,
      borderRadius: 18,
      padding: "clamp(10px, 3vw, 14px) clamp(12px, 3vw, 18px)",
      cursor: "pointer",
      transition: "all .22s",
      textDecoration: "none",
      color: "inherit",
      marginBottom: 10,
      boxShadow: rowHover ? "0 8px 28px rgba(0,0,0,.08)" : "0 1px 3px rgba(0,0,0,.04)",
      transform: rowHover ? "translateY(-2px)" : "none"
    };
    return href ? (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        style={boxStyle}
        onMouseEnter={() => setRowHover(true)}
        onMouseLeave={() => setRowHover(false)}
      >
        {content}
      </a>
    ) : (
      <div
        style={boxStyle}
        onMouseEnter={() => setRowHover(true)}
        onMouseLeave={() => setRowHover(false)}
      >
        {content}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wabob {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-9px) rotate(3deg); }
        }
        .f1 { animation: fadeUp 0.55s ease both 0s; }
        .f2 { animation: fadeUp 0.55s ease both 0.1s; }
        .f3 { animation: fadeUp 0.55s ease both 0.2s; }
        .f4 { animation: fadeUp 0.55s ease both 0.3s; }
        .f5 { animation: fadeUp 0.55s ease both 0.4s; }
        .wa-float { animation: wabob 3.6s ease-in-out infinite; }
        
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section style={S.section}>
        <div style={S.blob1}/>
        <div style={S.blob2}/>

        <div style={S.inner}>
          {/* Heading */}
          <div className="f1" style={{ textAlign: "center", marginBottom: "clamp(32px, 8vw, 52px)" }}>
            <div style={S.badge}>
              <MessageCircle size={13} /> Customer Support
            </div>
            <h1 style={S.h1}>
              Let's <em style={{ color: "#d97706", fontStyle: "italic" }}>Talk</em>
            </h1>
            <p style={S.sub}>Real people, real replies. Reach us however feels easiest.</p>
          </div>

          {/* Grid */}
          <div
            className="contact-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr min(340px, 100%)",
              gap: "clamp(24px, 6vw, 32px)",
              alignItems: "start"
            }}
          >

            {/* LEFT */}
            <div>
              <p className="f2" style={{ fontSize: "clamp(8px, 2vw, 10px)", fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#a8a29e", marginBottom: 12 }}>
                Direct Contact
              </p>

              <div className="f2">
                <InfoRow icon={<Phone size={18} />} label="Phone" value={PHONE} href={`tel:${PHONE.replace(/\D/g, "")}`} copyId="phone" />
              </div>
              <div className="f2">
                <InfoRow icon={<Mail size={18} />} label="Email" value={EMAIL} href={`mailto:${EMAIL}`} copyId="email" />
              </div>
              <div className="f3">
                <InfoRow icon={<MapPin size={18} />} label="Address" value={ADDRESS} href={`https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`} />
              </div>
              <div className="f3">
                <InfoRow icon={<Clock size={18} />} label="Business Hours" value={HOURS} copyId="hours" />
              </div>

              {/* Socials */}
              <div className="f4" style={{ marginTop: "clamp(20px, 5vw, 28px)" }}>
                <p style={{ fontSize: "clamp(8px, 2vw, 10px)", fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#a8a29e", marginBottom: 14 }}>
                  Follow Us
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {SOCIALS.map(({ name, url, Icon, bg }) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      title={name}
                      aria-label={name}
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${hovered === name ? bg : "#e7e5e4"}`,
                        background: hovered === name ? bg : "#fff",
                        color: hovered === name ? "#fff" : "#78716c",
                        cursor: "pointer",
                        textDecoration: "none",
                        transition: "all .25s ease",
                        transform: hovered === name ? "translateY(-3px) scale(1.1)" : "none",
                        boxShadow: hovered === name ? "0 10px 24px rgba(0,0,0,.16)" : "0 1px 3px rgba(0,0,0,.05)"
                      }}
                      onMouseEnter={() => setHovered(name)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {Icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Email bar */}
              <div className="f5" style={{ marginTop: "clamp(16px, 4vw, 24px)", borderRadius: 20, border: "1.5px solid #fde68a", background: "#fffbeb", padding: "clamp(14px, 4vw, 20px) clamp(16px, 4vw, 24px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontWeight: 600, color: "#1c1917", fontSize: "clamp(12px, 3vw, 14px)" }}>
                    Prefer email?
                  </p>
                  <p style={{ color: "#78716c", fontSize: "clamp(11px, 3vw, 13px)", marginTop: 3 }}>
                    We reply within 24 hours.
                  </p>
                </div>
                <a
                  href={`mailto:${EMAIL}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#1c1917",
                    color: "#fff",
                    fontSize: "clamp(11px, 3vw, 13px)",
                    fontWeight: 600,
                    padding: "10px 20px",
                    borderRadius: 12,
                    textDecoration: "none",
                    transition: "all .2s",
                    whiteSpace: "nowrap"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#d97706")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#1c1917")}
                >
                  <Mail size={15} />
                  {EMAIL}
                </a>
              </div>
            </div>

            {/* RIGHT: WhatsApp Card */}
            <div className="f3" style={{ borderRadius: 28, overflow: "hidden", border: "1.5px solid #e7e5e4", boxShadow: "0 20px 60px rgba(0,0,0,.1)", background: "#fff", height: "fit-content" }}>
              {/* Green header */}
              <div style={{ background: "linear-gradient(135deg, #075E54 0%, #128C7E 100%)", padding: "clamp(28px, 6vw, 36px) clamp(20px, 5vw, 28px) clamp(32px, 8vw, 52px)", position: "relative", textAlign: "center" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 32, background: "#fff", borderRadius: "28px 28px 0 0" }} />
                <div className="wa-float" style={{ width: 72, height: 72, borderRadius: 22, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 30px rgba(0,0,0,.2)" }}>
                  <span style={{ color: "#25D366" }}>
                    <WhatsAppSVG big />
                  </span>
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 30px)", fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  WhatsApp Us
                </div>
                <div style={{ color: "#a7f3d0", fontSize: "clamp(12px, 3vw, 14px)", fontWeight: 300 }}>
                  Fastest way to reach us
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "clamp(20px, 5vw, 28px)" }}>
                <p style={{ color: "#78716c", fontSize: "clamp(13px, 3vw, 14px)", lineHeight: 1.7, textAlign: "center", marginBottom: 22 }}>
                  No bots, no queues — just us. Ask anything about your order, products, or returns.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 24 }}>
                  {[
                    "Average reply under 5 minutes",
                    "Real team members, no bots",
                    "Order tracking & returns help",
                    "Available Mon – Sat, 9 AM – 8 PM"
                  ].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "clamp(12px, 3vw, 14px)", color: "#44403c" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#d1fae5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={12} />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    background: "#25D366",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "clamp(13px, 3vw, 15px)",
                    padding: "clamp(12px, 3vw, 16px)",
                    borderRadius: 16,
                    textDecoration: "none",
                    boxShadow: "0 6px 24px rgba(37, 211, 102, .35)",
                    transition: "all .22s",
                    marginBottom: 14
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#1ebe5d";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#25D366";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <WhatsAppSVG /> Open WhatsApp Chat <Send size={14} style={{ opacity: 0.75 }} />
                </a>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#f5f5f4", borderRadius: 14, padding: "12px 16px", fontSize: "clamp(12px, 3vw, 14px)", flexWrap: "wrap" }}>
                  <Phone size={15} style={{ color: "#a8a29e" }} />
                  <span style={{ color: "#a8a29e" }}>or call us:</span>
                  <a
                    href={`tel:${PHONE.replace(/\D/g, "")}`}
                    style={{ color: "#1c1917", fontWeight: 600, textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#d97706")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#1c1917")}
                  >
                    {PHONE}
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}