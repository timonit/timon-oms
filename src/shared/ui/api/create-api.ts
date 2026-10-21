import { Axios } from 'axios';

export interface API<R, B> {
  (body: B): Promise<R>;
}

export interface APIHandler<R, B> {
  (body: B, client: Axios): Promise<R>;
}

export function createAPI<R, B>(url: string): API<R, B>;
export function createAPI<R, B>(handler: APIHandler<R, B>): API<R, B>;
export function createAPI<R, B>(handlerOrURL: APIHandler<R, B> | string): API<R, B> {
  const client = new Axios();

  if (typeof handlerOrURL === 'string') {
    const url = handlerOrURL;

    return async (): Promise<R> => {
      const res = await client.get(url);
      return res.data;
    };
  }

  const handler = handlerOrURL;
  return (body: B): Promise<R> => {
    return handler(body, client);
  };
}
