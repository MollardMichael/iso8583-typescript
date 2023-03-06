# iso8583-typescript

A TypeScript implementation of an ISO 8583 parser.

![license](https://img.shields.io/github/license/MollardMichael/iso8583-typescript.svg)
[![codecov](https://codecov.io/gh/MollardMichael/iso8583-typescript/branch/master/graph/badge.svg?token=TocNp9fvi2)](https://codecov.io/gh/MollardMichael/iso8583-typescript)
![Build Status](https://github.com/MollardMichael/iso8583-typescript/actions/workflows/push.yml/badge.svg)

## Introduction

ISO 8583 is a messaging standard used by financial institutions to exchange data between systems. It is widely used for electronic payment transactions, such as ATM withdrawals and credit card purchases. The standard defines a message format and communication protocol for exchanging financial transaction data, and is used by thousands of financial institutions worldwide.

## Description

`iso8583-typescript` is a TypeScript implementation of an ISO 8583 parser that provides a few codec and examples on how to handle different types of data. The library is fully typed, making it easy to integrate with TypeScript-based applications and libraries.

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Requirements

To use this library, you'll need the following:

- Node.js version 16 or later
- npm or yarn package manager

## Getting Started

To get started with iso8583-typescript, follow these steps:

1. Install the library using npm or yarn:

```shell
npm install @micham/iso8583
```

```shell
yarn add @micham/iso8583
```

2. Create a MessageDefinition object that describes the fields present in your ISO 8583 messages and serves as the base of the parser:

```typescript
import { createFieldDefinition } from '@micham/iso8583';
import { N, LLVAR_N } from '@micham/iso8583/lib/fields';

export const IsoDefinition = createFieldDefinition({
  fields: {
    '2': { name: 'PAN', field: LLVAR_N },
  },
  mtiField: N({ length: 4 }),
});
```

The above example represents an ISO message that only consists of one field (Field 2). That is encoded as a LLVAR_N. This is a 2-byte variable-length numeric field. This means that in the ISO message, you will have two bytes that should be parsed as an integer first to understand the length of the field itself as x. The succeeding x bytes are then parsed as a number (padded on the right with zeros).

3. Use the MessageDefinition object to parse and write ISO messages:

```typescript
import { parse, prepare, printMessage } from '@micham/iso8583';

const buffer = Buffer.from('xxxxx'); // A buffer to your ISO message
const message = parse(IsoDefinition, buffer);
console.log(printMessage(message));
const result = prepare(IsoDefinition, message);
```

Alternatively, you can use the MessageDefinition object directly to parse and write ISO messages:

```typescript
const buffer = Buffer.from('xxxxx'); // A buffer to your ISO message
const message = IsoDefinition.parse(buffer);
console.log(message.show());
const result = IsoDefinition.prepare(message);
```

For more information, check out the [documentation](https://mollardmichael.github.io/iso8583-typescript/).

## Contributing

Contributions are welcome! If you have an improvement or feature you'd like to see added to this library, please follow these steps:

- Fork this repository and create a new branch.
- Make your changes and write tests to ensure they work as expected.
- Ensure all tests pass by running npm test.
- Update the README.md with any new features or changes to the library's behavior.
- Submit a pull request with your changes.

### Development

To get started with development, clone the repository and install the dependencies with npm install.

```bash
git clone https://github.com/MollardMichael/iso8583-typescript.git
cd iso8583-typescript
npm install
```

To build the project, run `npm run build`. This will build the project to the dist directory.

To run the tests, run `npm test`. This will run the test suite and output the results to the console.

### Reporting Bugs

If you find a bug or issue with the library, please open an issue on the [GitHub repository](https://github.com/MollardMichael/iso8583-typescript/issues) with a clear and detailed description of the problem. Please include any relevant code or logs that can help reproduce the issue.

### Pull Requests

When submitting a pull request, please ensure that your code adheres to the project's coding standards and that all tests pass. If your pull request adds new functionality, please also include tests for that functionality.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/MollardMichael/iso8583-typescript/blob/master/LICENSE) file for details.
