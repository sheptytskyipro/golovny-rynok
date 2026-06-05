export default function LoadingSpinner({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        className="rounded-full border-2 animate-spin"
        style={{
          width: size,
          height: size,
          borderColor: 'rgba(244,128,26,0.2)',
          borderTopColor: '#F4801A',
        }}
      />
    </div>
  );
}
