export interface InputParams {
  companyName: string;
  startDate: string;
  endDate: string;
  source: string;
  companyCode?: string;
}

export interface Review {
  reviewerName?: string;
  title: string;
  content: string;
  rating?: number;
  time?: string;
  source: string;
  date?: string;
}
