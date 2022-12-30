export interface IFlowPage {
  name: string;
  description: string;
  component: React.ReactNode; // forms, summary. etc
}

export interface SummaryItem {
  name: string;
  value: string | number;
}
