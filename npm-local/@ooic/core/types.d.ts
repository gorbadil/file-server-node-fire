import cors from "cors";
import morgan from "morgan";
import http from "http";
import cookieParser from "cookie-parser";
type Disabled<M> = Partial<Omit<M, "enabled">> & {
  enabled?: false;
};
type SSLEnabled = {
  enabled: true;
  key: Buffer | string;
  cert: Buffer | string;
};
type MorganEnabled<
  MorganReq extends http.IncomingMessage = http.IncomingMessage,
  MorganRes extends http.ServerResponse = http.ServerResponse
> = {
  enabled: true;
  format: string | "combined" | "common" | "dev" | "short" | "tiny";
  options?: morgan.Options<MorganReq, MorganRes>;
};
type MorganDisabled = Disabled<MorganEnabled>;
type SSLDisabled = Disabled<SSLEnabled>;

export declare interface OoicConfig<CorsReq extends cors.CorsRequest = cors.CorsRequest> {
  allowedVersions: string[];
  cors?: {
    enabled: boolean;
    options?: cors.CorsOptions | cors.CorsOptionsDelegate<CorsReq>;
  };
  morgan?: MorganEnabled | MorganDisabled;
  cookieParser?: {
    enabled: boolean;
    secret?: string | string[];
    options?: cookieParser.CookieParseOptions;
  };
  ssl?: SSLEnabled | SSLDisabled;
}
