export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="var(--panel)" stroke="var(--olive)" strokeWidth="2.5" />
      {/* sun */}
      <circle cx="32" cy="27" r="7.5" fill="var(--sun)" />
      <path d="M24 27h16" stroke="var(--panel)" strokeWidth="1.6" />
      <path d="M25 30.5h14" stroke="var(--panel)" strokeWidth="1.6" />
      {/* waves */}
      <path d="M12 40c4 0 4-3 8-3s4 3 8 3 4-3 8-3 4 3 8 3 4-3 8-3"
        stroke="var(--olive)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M12 46c4 0 4-3 8-3s4 3 8 3 4-3 8-3 4 3 8 3 4-3 8-3"
        stroke="var(--clay)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={compact ? 30 : 38} />
      {!compact && (
        <div className="leading-none">
          <div className="script text-[19px] text-ink" style={{ lineHeight: 1 }}>Golden Beach</div>
          <div className="text-[9.5px] font-bold tracking-[0.28em] text-muted uppercase mt-0.5">
            Restaurant · Midigama
          </div>
        </div>
      )}
    </div>
  );
}
