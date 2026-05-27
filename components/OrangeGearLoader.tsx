interface OrangeGearLoaderProps {
  size?: number;
  className?: string;
  label?: string;
}

export const OrangeGearLoader = ({ size = 48, className = '', label = 'Loading' }: OrangeGearLoaderProps) => (
  <div
    className={`orange-gear-loader ${className}`.trim()}
    role="status"
    aria-label={label}
    style={{ width: size, height: size }}
  >
    <svg
      className="orange-gear-loader__gear"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden
    >
      <path
        className="gear-fill"
        d="M24 4l2.2 6.8h7.1l-5.7 4.2 2.2 6.8L24 17.6l-5.8 4.2 2.2-6.8-5.7-4.2h7.1L24 4zm0 10.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6z"
      />
      <circle className="gear-cutout" cx="24" cy="24" r="5.5" />
    </svg>
  </div>
);
