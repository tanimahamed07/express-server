import type { Response } from "express";

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;              // 👈 লজিক: ডেটা যাই হোক না কেন, তার টাইপ হবে এই 'T'
    error?: any;          // (ঐচ্ছিক)
}


const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error
  });
};

export default sendResponse;
