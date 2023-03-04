# iso8583-typescript

![license](https://img.shields.io/github/license/MollardMichael/iso8583-typescript.svg)
[![codecov](https://codecov.io/gh/MollardMichael/iso8583-typescript/branch/master/graph/badge.svg?token=TocNp9fvi2)](https://codecov.io/gh/MollardMichael/iso8583-typescript)
![Build Status](https://github.com/MollardMichael/iso8583-typescript/actions/workflows/push.yml/badge.svg)

This repository is yet another implementation of an iso8583 parser in typescript

## Why should I use this library?

At the time I created this lib, I could not find a javascript implementation of a iso8583 parser that satisfied those criteria:

- Written in typescript (fully typed) for seamless integration in typescript based applications and libraries
- Provide a few codec and example on how to handle different type of data
- Documented enough that I would be able to write my own parser

## What is ISO 8583?

[Wikipedia](https://en.wikipedia.org/wiki/ISO_8583) describe ISO 8583 as an international standard for financial transaction card originated interchange messaging.

It was the de facto standard to talk with Card Scheme (MCD, VISA) but is slowly being replaced by [ISO 20022](https://en.wikipedia.org/wiki/ISO_20022).

While a bit old, the ISO 8583 format is still quite used today (2023). This repository aim to provide an implementation of the standard.

## Use cases

Here are some use cases in which this library can help you

- Parse/Write ISO 8583 messages
- Communicate with ISO 8583 during End 2 End Test Pipelines
- Understand how ISO 8583 works before implementing it in your own stack

## Installation

### Using NPM

```shell
npm install iso8583-typescript
```

### Using Yarn

```shell
yarn add iso8583-typescript
```

## API

In order to use the library, you first need to create a MessageDefinition object that describe the fields present in your ISO 8583 messages and will serve as the base of the parser.

You can learn more about the type and function of the library [here](https://mollardmichael.github.io/iso8583-typescript/)

```typescript
import { createFieldDefinition } from 'iso8583-typescript';
import { N, LLVAR_N } from 'iso8583-typescript/lib/fields';

export const IsoDefinition = createFieldDefinition({
  fields: {
    '2': { name: 'PAN', field: LLVAR_N },
  },
  mtiField: N({ length: 4 }),
});
```

Once you have your Iso Definition on hand you can use it to parse and write ISO messages

```typescript
const buffer = Buffer.from('xxxxx'); // A buffer to your ISO message
const message = IsoDefinition.parse(buffer);
const result = IsoDefinition.prepare(message);
```

Don't hesitate to look at the [examples](./src/examples/) and the test fils for inspiration
