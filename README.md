## Overview

NextAuth.js is a complete open source authentication solution.

This is an example application that shows how to "Sign-in With Ethereum" using RainbowKit and NextAuth. It's based off the [NextAuth-example app](https://github.com/nextauthjs/next-auth/tree/main/apps/example-nextjs), as well as the [RainbowKit Docs](https://www.rainbowkit.com/docs). 

This specific example shows how you can create your own [custom authentication](https://www.rainbowkit.com/docs/custom-authentication) with RainbowKit. In the case of this example, this was necessary in order to redirect the user to a different sub-page once the signature is verified. The [out-of-the-box SIWE](https://www.rainbowkit.com/docs/authentication) implementation with RainbowKit is even simpler!

We've provided a couple sample protected routes and some further config options so you can figure out how to get started customizing your SIWE auth experience.

There also exists a `wagmi/ethers-only` SIWE implementation, so you can compare and contrast to `RainbowKit`

[Next-Logger](https://github.com/atkinchris/next-logger) has also been added to display logs within the dev console :)

## Getting Started

### 1. Clone the repository and install dependencies

```
npm install
```

### 2. Configure your local environment

IMPORTANT! Make sure you fill in the RPC Provider Config with your own API key in `_app.tsx`! In this example, we used Alchemy:
```js
const { chains, provider } = configureChains(
  [chain.polygon, chain.mainnet],
  [alchemyProvider({ apiKey: '<YOUR-API-KEY>' })]
);
```

Copy the .env.local.example file in this directory to .env.local (which will be ignored by Git):

```
cp .env.local.example .env.local
```

#### Database

A database is needed to persist user accounts and to support email sign in. However, you can still use NextAuth.js for authentication without a database. If you do not specify a database, [JSON Web Tokens](https://jwt.io/introduction) will be enabled by default.

SIWE uses JWT!

* Docs: [next-auth.js.org/adapters/overview](https://next-auth.js.org/adapters/overview)

### 4. Start the application

To run your site locally, use:

```
npm run dev
```

To run it in production mode, use:

```
npm run build
npm run start
```

### 5. Preparing for Production

Follow the [Deployment documentation](https://next-auth.js.org/deployment)


