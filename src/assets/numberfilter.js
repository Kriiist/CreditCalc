export default function numFilter(value, format = "num") {
  value = Number(value);
  if (value.toFixed(2) === "0.00") {
    return " ";
  }
  if (format.includes("dot") && value.toFixed(2) != "0.00") {
    let a = value.toFixed(2) + "...";
    return a;
  }
  value = value.toFixed(2);
  return value;
}
