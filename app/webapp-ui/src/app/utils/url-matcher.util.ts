export class UrlMatcherUtil {
  public static match(url: string, patterns: RegExp[]): boolean {
    return patterns
      .map(pattern => pattern.test(url))
      .reduce((res, cur) => res && cur, true);
  }
}
