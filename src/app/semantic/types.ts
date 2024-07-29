export type Message = {
  text: string;
  timestamp: Date;
  direction: 'incoming' | 'outgoing';
};

export type ErrorMessage = {
  error: Error;
  timestamp: Date;
}