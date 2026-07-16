// @ts-nocheck
import { ApiResponse } from "./ApiResponse";

export interface Presenter<ResultType, ResponseType> {
  present(result: ResultType): ApiResponse<ResponseType>;
}
