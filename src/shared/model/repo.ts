export abstract class Repo<D> {
  abstract storage_name: string;

  private static async getFileHandle(storageName: string): Promise<FileSystemFileHandle> {
    const dir = await navigator.storage.getDirectory();
    return dir.getFileHandle(storageName, { create: true });
  }

  private static async saveData(storageName: string, data: string): Promise<void> {
    const fileHandle = await Repo.getFileHandle(storageName);
    const stream = await fileHandle.createWritable();

    await stream.write(data);
    await stream.close();
  }

  private static async getData(storageName: string): Promise<string> {
    const fileHandle = await Repo.getFileHandle(storageName);
    const file = await fileHandle.getFile();

    return file.text();
  }

  protected async saveStorage(data: D[]): Promise<void> {
    const stringifyData = JSON.stringify(data);

    await Repo.saveData(this.storage_name, stringifyData);
  }

  protected async getStorage(): Promise<D[]> {
    const stringifyData = await Repo.getData(this.storage_name);
    if (!stringifyData) return [];

    return JSON.parse(stringifyData);
  }
}
