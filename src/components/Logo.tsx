export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="14" fill="#2563eb"/>
        <polygon points="32,10 56,30 8,30" fill="white"/>
        <rect x="12" y="28" width="40" height="24" fill="white"/>
        <rect x="24" y="34" width="16" height="18" rx="3" fill="#2563eb"/>
        <text
          x="32" y="49"
          textAnchor="middle"
          fill="white"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="16"
          fontWeight="bold"
        >
          3
        </text>
      </svg>
      <div>
        <div className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">יד3</div>
        <div className="text-xs text-gray-400 leading-none">חיפוש דירות להשכרה</div>
      </div>
    </div>
  );
}
