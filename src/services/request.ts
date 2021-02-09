export interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

interface HttpRequestArgs {
  url: string;
  method: "GET"|"POST";
  queryParams: {
    [param: string]: string;
  };
}

export async function fetcher<T>(args: HttpRequestArgs): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(
    `${args.url}?${new URLSearchParams(args.queryParams)}`, {
      method: args.method
    });

  response.parsedBody = await response.json();

  return response;
}
