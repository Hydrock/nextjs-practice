// components/RemoteWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const RemoteWidget = dynamic(() => import('./RemoteWidget'), {
  ssr: false,
});

export default function RemoteWrapper() {
  return <RemoteWidget />;
}
