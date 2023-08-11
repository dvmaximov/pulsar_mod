export interface ApiResult {
  result: any; //string | Array<any> | null;
  error: string | null;
}

export const initResult: ApiResult = {
  result: null,
  error: null,
};
