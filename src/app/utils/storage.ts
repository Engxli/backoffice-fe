export class StorageService {
  private static readonly TOKEN_KEY = 'userToken';

  static storeToken(token: string): void {
    localStorage.setItem(StorageService.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(StorageService.TOKEN_KEY);
  }

  static deleteToken(): void {
    localStorage.removeItem(StorageService.TOKEN_KEY);
  }
}
