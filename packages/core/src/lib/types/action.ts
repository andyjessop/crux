export interface Action<Payload = unknown> {
  payload: Payload;
  type: string;
}