This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

## how to start from sctrach
1 first step take clone from git
2 take clone and use command cd fitness-blog
3 after in fitness-blog use command npm i or npm install
4 after installation use command npm run dev 
5 the blog will show on localhost:3000

## Notes
1 use next js built in feature
 -  getStaticProps() - Blog post static data
 -  getStaticPaths() - Dynamic routes /blog/[slug]

2 use react hook 
  - useEffect() for - Comments client-side fetch
  - useState - to store data  

3 use css architecture 
  - BEM naming: .blog__title, .layout__header
  - CSS Grid: blog__content-grid, blog__related-grid  
  - Flexbox: layout__header, form-footer
  - use Media queries for different screensize
  - also use custom properties

4 for dynamic edit content
 - next/dynamic() - EditModal lazy loaded
 - SSR: false for client-only editor

5 for comment section
 - Client-side fetch via useEffect
 - Error handling - all field blank in comment section and click send show validation
 - Emoji rating system

6 use font icon for icon in button and display via css and json also.
7 use markdown editor 
