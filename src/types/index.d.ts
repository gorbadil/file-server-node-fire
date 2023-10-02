declare global {
  namespace Express {
    interface Request {
      authUser: any;
      clientIp: string;
    }
  }
}

export interface Request<T> extends Express.Request {
  body: T
}

