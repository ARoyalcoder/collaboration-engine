export interface StorageService {
  createUploadUrl(
    storageKey: string,
    contentType: string,
  ): Promise<string>;

  createDownloadUrl(
    storageKey: string,
  ): Promise<string>;

  deleteObject(
    storageKey: string,
  ): Promise<void>;
}

