export function convertFileToBase64Rule(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(reader.result?.toString().split(',')[1] || '');
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
