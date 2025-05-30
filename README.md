# nextjs-practice

## Следуй за белым кроликом 🐇

🛠 1. Инициализация проекта

```sh
npx create-next-app@latest next-demo --typescript --app
cd next-demo
npm run dev
```

⸻

📄 2. Создание страниц

`app/page.tsx` (главная страница)

```js
export default function HomePage() {
  return (
    <main>
      <h1>Главная</h1>
      <a href="/about">Перейти на About</a>
    </main>
  );
}
```

`app/about/page.tsx`

```js
export default function AboutPage() {
  return (
    <main>
      <h1>О проекте</h1>
    </main>
  );
}
```

⸻

🌐 3. SSR / fetch данных (на сервере)

`app/users/page.tsx`

```js
export default async function UsersPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await res.json();

  return (
    <main>
      <h1>Пользователи</h1>
      <ul>
        {users.map((u: any) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </main>
  );
}
```

⸻

🧱 4. Layout + metadata

`app/layout.tsx`

```js
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Next Demo',
  description: 'Пример базовых фич',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <nav>
          <a href="/">Home</a> | <a href="/about">About</a> | <a href="/users">Users</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
```

⸻

⚙️ 5. API-роут

`app/api/hello/route.ts`

```js
export async function GET() {
  return Response.json({ message: 'Привет из API!' });
}
```

⸻

Использование на клиенте (добавьте в любую страницу):

```js
'use client';

import { useEffect, useState } from 'react';

export default function HelloClient() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

  return <p>{msg}</p>;
}
```

⸻

🖼 6. Оптимизация изображений

Вставьте в `app/page.tsx`:

```js
import Image from 'next/image';

export default function HomePage() {
  return (
    <main>
      <h1>Главная</h1>
      <Image src="/next.svg" width={150} height={150} alt="Next.js logo" />
    </main>
  );
}
```
