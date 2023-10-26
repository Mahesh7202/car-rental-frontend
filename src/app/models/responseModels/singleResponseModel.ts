import { ResponseModel } from "./responseModel";

export interface SingleResponseModel<T> extends ResponseModel{
    userId(userId: any): unknown;
    data:T;
}
