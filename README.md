This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Development with Mock API

To enable the mock API server in development (useful for frontend development without a backend):

1. Create `.env.local`:

```bash
NEXT_PUBLIC_ENABLE_MOCKS=true
```

2. Initialize MSW service worker:

```bash
npx msw init public/ --save
```

3. Restart the dev server

See [docs/MOCK_SERVER.md](docs/MOCK_SERVER.md) for full mock API documentation.

## Testing

Run all tests:

```bash
npm test
```

Run unit tests only:

```bash
npm run test:unit
```

Run tests in watch mode:

```bash
npm run test:watch
```

Default test credentials:

- Email: `test@archer.app`
- Password: `testpassword123`

## Project Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler checks
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run storybook` - Start Storybook component development
- `npm run build-storybook` - Build Storybook for deployment

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
