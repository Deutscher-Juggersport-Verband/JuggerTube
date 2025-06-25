export function convertFileToBase64Rule(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(reader.result?.toString().split(',')[1] ?? '');
    reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei.'))
    reader.readAsDataURL(file);
  });
}
