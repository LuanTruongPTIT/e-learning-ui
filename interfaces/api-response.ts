/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPaging } from "./paging";

//----------------------------------------------------------------------------

export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
  paging?: IPaging;
  total?: number;
  filter?: Record<string, any>;
  detail?: string;
}
