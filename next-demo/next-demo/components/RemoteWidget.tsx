// components/RemoteWidget.tsx
'use client';

import React, { useEffect, useState } from 'react';

function injectScript(url: string, scope: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line
    // @ts-ignore
    if (window[scope]) return resolve(); // уже есть

    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) return resolve(); // уже загружен

    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      const checkInterval = setInterval(() => {
        // eslint-disable-next-line
        // @ts-ignore
        if (window[scope]) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 20);

      // если через 3 сек не появился контейнер — ошибка
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error(`🛑 ${scope} не появился в window после загрузки`));
      }, 3000);
    };

    script.onerror = () => reject(new Error(`❌ Ошибка загрузки ${url}`));
    document.head.appendChild(script);
  });
}

const RemoteWidget = () => {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const load = async () => {
      const remoteUrl = 'https://mbdev.alfabank.ru/ona-widgets/assets/remoteEntry.js';
      const scope = 'ONA_WIDGETS';
      const module = './BootstrapV1';

      await injectScript(remoteUrl, scope);

      // @ts-ignore — Webpack runtime
      await __webpack_init_sharing__('default');

      // @ts-ignore
      const container = window[scope];
      if (!container) throw new Error(`Remote container ${scope} не найден в window`);

      // 🔧 если нет shared, передай пустой объект
      // eslint-disable-next-line
      // @ts-ignore
      await container.init(typeof __webpack_share_scopes__ !== 'undefined'
        // eslint-disable-next-line
        // @ts-ignore
        ? __webpack_share_scopes__.default
        : {}
      );

      const factory = await container.get(module);
      const Module = factory();

      setComp(() => Module.default || Module);
    };

    load().catch(console.error);
  }, []);

  if (!Comp) return <div>Загрузка виджета...</div>;
  return <Comp />;
};

export default RemoteWidget;
