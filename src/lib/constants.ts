export const Tag = {
  New: 1,
  Hot: 2,
  BestSale: 3,
} as const;

export const TestDriveStatus = {
  Pending: 1,
  Contacted: 2,
  Completed: 3,
} as const;

export const PriceQuoteStatus = {
  Pending: 1,
  Contacted: 2,
  Quoted: 3,
} as const;

export const TagLabels: Record<number, string> = {
  [Tag.New]: 'New',
  [Tag.Hot]: 'Hot',
  [Tag.BestSale]: 'Best Sale',
};

export const TestDriveStatusLabels: Record<number, string> = {
  [TestDriveStatus.Pending]: 'Pending',
  [TestDriveStatus.Contacted]: 'Contacted',
  [TestDriveStatus.Completed]: 'Completed',
};

export const PriceQuoteStatusLabels: Record<number, string> = {
  [PriceQuoteStatus.Pending]: 'Pending',
  [PriceQuoteStatus.Contacted]: 'Contacted',
  [PriceQuoteStatus.Quoted]: 'Quoted',
};

export type TagType = (typeof Tag)[keyof typeof Tag];
export type TestDriveStatusType = (typeof TestDriveStatus)[keyof typeof TestDriveStatus];
export type PriceQuoteStatusType = (typeof PriceQuoteStatus)[keyof typeof PriceQuoteStatus];
