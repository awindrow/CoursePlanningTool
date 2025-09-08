// Import Papa Parse for CSV parsing
import Papa from 'papaparse';
// Define the type for a field in the Syllabus Contents.
export interface SyllabusContent {
    section: string;
    row: number;
    layoutRow: number;
    content: string;
    type: string;
    placeholder: string;
    required: boolean;
    options?: string[];
    iconPath?: string;
    backendKey?: string;
}

/**
 * Loads syllabus content from a CSV file.
 * @param path - Path to the CSV file
 * @returns Promise resolving to parsed syllabus content array
 */
export async function loadSyllabusContent(path: string): Promise<SyllabusContent[]> {
    const res = await fetch(path);
    const text = await res.text();

    return new Promise((resolve, reject) => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results: { data: any[] }) => {
                const parsed: SyllabusContent[] = results.data.map((row: any) => ({
                    section: row.section,
                    row: row.row ? parseInt(row.row, 10) : 0,
                    layoutRow: row.layoutRow ? parseInt(row.layoutRow, 10) : 0,
                    content: row.content,
                    type: row.type,
                    placeholder: row.placeholder,
                    required: row.required === "true",
                    iconPath: row.iconPath || undefined,
                    backendKey: row.backendKey || undefined,
                    options: row.options
                        ? row.options.split(/[,|]/).map((opt: string) => opt.trim()).filter((opt: string) => opt !== '') // Parse options from CSV if provided
                        : (row.type === "select"
                            ? row.placeholder.split(',').map((opt: string) => opt.trim()) // Use placeholder as fallback for select options
                            : undefined) // Otherwise, undefined
                }));
                resolve(parsed);
            },
            error: reject,
        });
    });
}