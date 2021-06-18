export interface YcScrapeResult<T> {
    results?: T;
    success: boolean;
    errorMessage?: string;
}