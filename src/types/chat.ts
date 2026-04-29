export type Source = {
  title: string;
  reference: string;
};

export type Message = {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  sources?: Source[];
  timestamp: string;
};

export type ChatResponse = {
  answer: string;
  sources: Source[];
};

