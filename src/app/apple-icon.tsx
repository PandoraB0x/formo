import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #a8cd87 0%, #6f9850 55%, #2d3d1f 100%)',
          fontWeight: 900,
          color: 'white',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
          letterSpacing: '-15px',
          fontSize: 134,
          lineHeight: 1,
          paddingBottom: 10,
        }}
      >
        rm
      </div>
    ),
    { ...size },
  );
}
