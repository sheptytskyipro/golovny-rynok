interface AppleLogoProps {
  size?: number;
  className?: string;
}

export default function AppleLogo({ size = 40, className = '' }: AppleLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-float ${className}`}
    >
      {/* Apple body */}
      <path
        d="M20 8C20 8 18 4 14 4C14 4 14 8 17 9C17 9 13 9 10 13C7 17 7 22 9 26C11 30 14 35 17 35C19 35 19 33 20 33C21 33 21 35 23 35C26 35 29 30 31 26C33 22 33 17 30 13C27 9 23 9 23 9C26 8 26 4 26 4C22 4 20 8 20 8Z"
        fill="#7CB342"
      />
      {/* Apple shine */}
      <path
        d="M15 13C15 13 12 15 12 19"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Leaf */}
      <path
        d="M20 8C20 8 21 5 24 4"
        stroke="#558B2F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
