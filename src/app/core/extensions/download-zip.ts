import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export class FileExporter {
  static async downloadFilesAsZip(fileUrls:string[]) {
    const zip = new JSZip();
    for (const url of fileUrls) {
      const fileName = this.extractFileName(url);
      const response = await fetch(url);
      const blob = await response.blob();
      zip.file(fileName, blob);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'Materials.zip');
  }
  private static extractFileName(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
  }

  static async downloadFilesIndividually(fileUrl: string): Promise<void> {
    const fileName = this.extractFileName(fileUrl);
    const blob = await this.fetchFileBlob(fileUrl);
    saveAs(blob, fileName);
  }

  private static async fetchFileBlob(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.blob();
  }
}
