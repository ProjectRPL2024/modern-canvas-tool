import mammoth from 'mammoth';
import { createReport } from 'docx-templates';

export interface TemplateVariables {
  KOTA: string;
  TANGGAL: string;
  NOMORSURAT: string;
  NAMAPERUSAHAAN: string;
  ALAMATPERUSAHAAN: string;
  COL_NO: string;
  COL_NAMA: string;
  COL_KELAS: string;
  COL_HP: string;
  // Data tabel siswa
  siswaData?: Array<{
    no: number;
    nama: string;
    kelas: string;
    hp: string;
  }>;
}

export class TemplateProcessor {
  /**
   * Process Word template with variables
   */
  static async processWordTemplate(
    templateFile: File, 
    variables: TemplateVariables
  ): Promise<Blob> {
    try {
      const templateBuffer = await templateFile.arrayBuffer();
      
      // Process template with docx-templates
      const report = await createReport({
        template: new Uint8Array(templateBuffer),
        data: {
          ...variables,
          // Format tanggal menjadi format Indonesia
          TANGGAL: this.formatDateIndonesian(variables.TANGGAL),
          // Process siswa data untuk tabel
          SISWA_LIST: variables.siswaData || [],
          // Tambahan data yang mungkin diperlukan
          CURRENT_DATE: this.formatDateIndonesian(new Date().toISOString()),
        },
        additionalJsContext: {
          // Helper functions yang bisa digunakan dalam template
          formatNumber: (num: number) => num.toString().padStart(2, '0'),
          upperCase: (text: string) => text.toUpperCase(),
          formatDate: (date: string) => this.formatDateIndonesian(date),
        },
      });

      return new Blob([report], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
    } catch (error) {
      console.error('Error processing Word template:', error);
      throw new Error('Gagal memproses template Word');
    }
  }

  /**
   * Convert Word template to HTML for preview
   */
  static async convertWordToHtml(templateFile: File): Promise<string> {
    try {
      const arrayBuffer = await templateFile.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('Error converting Word to HTML:', error);
      throw new Error('Gagal mengkonversi template Word');
    }
  }

  /**
   * Extract variables from Word template
   */
  static async extractVariablesFromTemplate(templateFile: File): Promise<string[]> {
    try {
      const arrayBuffer = await templateFile.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      
      // Extract variables in format ${VARIABLE_NAME}
      const variableRegex = /\$\{([^}]+)\}/g;
      const variables: string[] = [];
      let match;
      
      while ((match = variableRegex.exec(text)) !== null) {
        if (!variables.includes(match[1])) {
          variables.push(match[1]);
        }
      }
      
      return variables;
    } catch (error) {
      console.error('Error extracting variables:', error);
      throw new Error('Gagal mengekstrak variabel dari template');
    }
  }

  /**
   * Get available template variables
   */
  static getAvailableVariables(): { name: string; description: string }[] {
    return [
      { name: 'KOTA', description: 'Nama kota untuk surat' },
      { name: 'TANGGAL', description: 'Tanggal surat' },
      { name: 'NOMORSURAT', description: 'Nomor surat pengajuan' },
      { name: 'NAMAPERUSAHAAN', description: 'Nama perusahaan tujuan PKL' },
      { name: 'ALAMATPERUSAHAAN', description: 'Alamat perusahaan tujuan PKL' },
      { name: 'COL_NO', description: 'Kolom nomor urut dalam tabel' },
      { name: 'COL_NAMA', description: 'Kolom nama siswa dalam tabel' },
      { name: 'COL_KELAS', description: 'Kolom kelas siswa dalam tabel' },
      { name: 'COL_HP', description: 'Kolom nomor HP siswa dalam tabel' },
    ];
  }

  /**
   * Format date to Indonesian format
   */
  private static formatDateIndonesian(dateString: string): string {
    const date = new Date(dateString);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  }

  /**
   * Validate template file
   */
  static validateTemplateFile(file: File): boolean {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    return validTypes.includes(file.type) || file.name.endsWith('.docx') || file.name.endsWith('.doc');
  }
}