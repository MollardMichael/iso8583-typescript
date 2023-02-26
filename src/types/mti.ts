type Digit9 = Digit8 | 9;
type Digit8 = Digit7 | 8;
export type Digit7 = Digit4 | 5 | 6 | 7;
type Digit4 = Digit2 | 3 | 4;
type Digit2 = Digit1 | 2;
type Digit1 = 0 | 1;

type HexDigit = Digit9 | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

export type HexByte = `${HexDigit}${HexDigit}`;

export type MTI = `${Digit2}${Digit8}${Digit7}${Digit4}`;
