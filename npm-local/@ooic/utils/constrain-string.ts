export type ConstrainString<Min extends number, Max extends number> = string & {
  __brand: "ConstrainedString";
  __minLength: Min;
  __maxLength: Max;
};

function isConstrainedString<Min extends number, Max extends number>(
  input: string,
  min: Min,
  max: Max
): input is ConstrainString<Min, Max> {
  return input.length >= min && input.length <= max;
}
