export class TransformHelper {
  public static toLowerCase({ value }: { value: string }): string {
    return value ? value.toString().toLowerCase() : value;
  } // Приводить переданий рядок до нижнього регістру
  // {value}: {value: string} - Це деструктуризація об'єкта з властивістю value
  // *якщо value не існує або дорівнює null/undefined,
  // повертається саме це значення (тобто ніякого перетворення не відбувається)

  public static trim({ value }: { value: string }): string {
    return value ? value.toString().trim() : value;
  } // Видаляє пробіли з початку та кінця рядка

  public static trimArray({ value }) {
    return Array.isArray(value) ? value.map((item) => item.trim()) : value;
  } // якщо нам приходить масив, то ми його перебираємо і крізь прибираємо пробіли

  public static uniqueItems({ value }) {
    return value ? Array.from(new Set(value)) : value;
  } // видаляє дублікати з масиву
  // Приймає параметр { value }, який очікується як масив
  // Якщо value існує тоді:
  // Set(value) створює новий набір (Set), видаляючи дублікати з value
  // Array.from(...) конвертує цей набір знову в масив
  // Якщо value не існує, метод просто повертає його таким, яким він є

  public static toLowerCaseArray({ value }) {
    return Array.isArray(value)
      ? value.map((item) => item.toLowerCase())
      : value.toLowerCase();
  } // toLowerCaseArray приймає об'єкт із полем value.
  // Якщо value — масив, він перетворює всі його елементи на нижній регістр
  // і повертає змінений масив. Якщо value не масив,
  // метод повертає value без змін
}
