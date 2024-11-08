## Getting Started

This project has a Nextjs frontend with a Python Flask backend. Developing locally requires both to be simultaneously run. The python server runs on port `8000` while the Next server runs on port `3000`. The `concurrently` package helps running both from the cli clearly, with a `[0]`prepending backend logs and a `[1]` prepending frontend logs.

The project runs on `node 20.x.x`

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### NextJS

We are using the app router on Next14. Next15 will not be considered until React 19 points to a stable version (currently pointing at a canary release candidate).

#### TailwindCss + Shadcn

This styling combo allows for rapid, component-driven development.

### Generating Open Api Types

To allow a type-safe api interface between the python backend and the typescript frontend, we can utilize open-api type generation.

```bash
yarn run generate
```

This will generate typescript types in the `/types/` directory.

https://fastapi.tiangolo.com/advanced/generate-clients/#generate-client-code

## Deployment

This project is auto deployed on Vercel using the free "Hobby" tier see: [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
The python backend is also deployed as a serverless function on vercel.

The project is hosted on the domain [subway.plabrum.com](https://subway.plabrum.com)

## Design

[See the Figma Design](https://www.figma.com/design/U2J9fya2ZgzxatMKzBNIrJ/Subway-App?m=auto&t=09nwsIhiQxAvlFp5-6)
