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

## FE-07 — AI Study Progress Tool

The AI Study Assistant includes a server-side `getStudyProgress`
tool that returns structured study progress data.

### Tool name

`getStudyProgress`

### Purpose

The tool provides the student's current study progress instead of
allowing the AI to guess progress information.

### Input schema

The tool currently accepts an empty object because the study progress
belongs to the current student.

```ts
z.object({})
Return Shape
{
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  subjects: {
    name: string;
    completed: number;
    total: number;
  }[];
}
example:
{
  "completedTasks": 18,
  "totalTasks": 25,
  "completionRate": 72,
  "subjects": [
    {
      "name": "Data Structures & Algorithms",
      "completed": 8,
      "total": 10
    },
    {
      "name": "Web Development",
      "completed": 6,
      "total": 8
    },
    {
      "name": "Information Security",
      "completed": 4,
      "total": 7
    }
  ]
}

Tool States
Input streaming — preparing the tool request
Input available — tool request is ready
Output available — successful result displayed as a Study Progress card
Output error — error message displayed if the tool fails