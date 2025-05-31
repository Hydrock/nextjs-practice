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

📦 7. Динамический роут для пользователя по ID

```sh
app/
 └── users/
     ├── page.tsx         ← список всех пользователей
     └── [id]/
         └── page.tsx     ← динамический роут: /users/1, /users/5 и т.д.
```

`app/users/page.tsx` — список

```js
import Link from 'next/link';

export default async function UsersPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await res.json();

  return (
    <main>
      <h1>Пользователи</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

`app/users/[id]/page.tsx` — динамическая страница

```js
interface Params {
  params: { id: string };
}

export default async function UserPage({ params }: Params) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`);
  const user = await res.json();

  return (
    <main>
      <h1>Пользователь: {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Город: {user.address.city}</p>
    </main>
  );
}
```

🧠 Пояснение:
• [id] в имени папки создаёт динамический маршрут /users/:id
• params.id берётся из URL
• Запрос данных делается на стороне сервера (SSR по умолчанию)

🧪 8. SSG (generateStaticParams)

Цель урока
• Создать список постов /blog
• Сгенерировать отдельные страницы для каждого поста /blog/[slug]
• Использовать generateStaticParams() для SSG

```sh
app/
 └── blog/
     ├── page.tsx           ← список постов
     └── [slug]/
         └── page.tsx       ← одна статья
```

`lib/posts.ts`

```js
export const posts = [
  { slug: 'hello-next', title: 'Привет, Next.js', content: 'Это первая статья.' },
  { slug: 'about-ssg', title: 'Что такое SSG?', content: 'SSG — это Static Site Generation.' },
  { slug: 'next-advanced', title: 'Продвинутый Next.js', content: 'Хаки, фичи и ISR.' },
];
```

`app/blog/page.tsx` — список статей

```js
import Link from 'next/link';
import { posts } from '@/lib/posts';

export default function BlogPage() {
  return (
    <main>
      <h1>Блог</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

`app/blog/[slug]/page.tsx` — отдельная статья

```js
import { posts } from '@/lib/posts';

interface Props {
  params: { slug: string };
}

/**
 * Если в файле есть функция generateStaticParams, то она запускается на этапе builds проекта и генерирует 
 * массив будущих статических параметров. 
 * Параметры - это значения переданные в url - /posts/[id]
 * А тут как будто мы формируем массив всех введенных параметров заранее для генерации статических страниц
 */
export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }));
}

/**
 * Переменная params обычно содержит введенные в url параметры, но так как мы генерируем статику на этапе build
 * данная функция будет вызвана столько раз сколько элементов в массиве вернувшимся из generateStaticParams
 * Как буд-то мы несколько раз открывает url с разными параметрами
 * Далее эта функция генерирует статические страницы и в будущем если параметры введенные пользователем в url совпадут с сгенерированными на этапе build - то пользователю отдастся статика. Если же параметр будет другой то отработает SSR
 */
export default function BlogPostPage({ params }: Props) {
  const post = posts.find(p => p.slug === params.slug);

  if (!post) return <p>Пост не найден</p>;

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  );
}
```

