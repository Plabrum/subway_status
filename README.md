# Subway Status

This App uses the GTFS feeds from the MTA to display system alerts by route. Motivated by getting blindsided by the L train being out of service. Visit the live site: [https://subway.plabrum.com](https://subway.plabrum.com)

<img src="https://github.com/user-attachments/assets/d29eb3ef-1a9a-4078-becd-b16e437dce47" alt="Home Screen" width="300">

<img src="https://github.com/user-attachments/assets/52d04141-13f6-4760-96aa-4cf936188390" alt="Home Screen" width="300">

## Developing

This project has a Nextjs 14 frontend with a Python [`litestar`](https://litestar.dev) backend. Developing locally requires both to be simultaneously run. The python server runs on port `8000` while the Next server runs on port `3000`. The `concurrently` package helps running both from the cli clearly, with a `[0]`prepending backend logs and a `[1]` prepending frontend logs.

The project runs on `node 20.x.x`

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Generating Types

Litestar provides openApi schema generation, which can be consumed by openapi-typescript to generate tyepscript types. 

To generate types you can run:

```bash
yarn generate-types
```

### NextJS

Next provies built-in Static site generation (SSG) as well as incremental static re-rendering (ISR). This is particularily helpful for this project as the underlying data fetched from the backend is universal but temporally bound - fresh data for one user is a helpful update for all users. Using the next `fetch( ..., {revalidate: limit})` we can set a universal limit on data staleness. 

#### TailwindCss + Shadcn

This styling combo allows for rapid, component-driven development.


## Deployment

This project is auto deployed on Vercel using the free "Hobby" tier see: [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
The python backend is also deployed as a serverless function on vercel.

The project is hosted on the domain [subway.plabrum.com](https://subway.plabrum.com)

## Design

[See the Figma Design](https://www.figma.com/design/U2J9fya2ZgzxatMKzBNIrJ/Subway-App?m=auto&t=09nwsIhiQxAvlFp5-6)
