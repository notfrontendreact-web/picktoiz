// Persian digit convertor
export const toPersianDigits = (num: number | string): string => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

// Currency formatter in Toman
export const toToman = (priceInToman: number): string => {
  if (isNaN(priceInToman) || priceInToman === 0) return 'رایگان';
  const formatted = priceInToman.toLocaleString('en-US');
  return `${toPersianDigits(formatted)} تومان`;
};
