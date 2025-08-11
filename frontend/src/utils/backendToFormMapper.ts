// src/utils/backendToFormMapper.ts
import { reverseFieldMappings } from "./fieldMappings";

export function mapBackendDataToFormFields(
    backendData: Record<string, string>
): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(backendData)) {
        const frontendKey = reverseFieldMappings[key];
        if (frontendKey) {
            result[frontendKey] = String(value ?? "");
        }
    }

    // Special case for "term_syllabus"
    if (!backendData.year_syllabus && typeof backendData.term_syllabus === "string") {
        const parts = backendData.term_syllabus.split(/[-_\s]+/).map(p => p.trim()).filter(Boolean);
        if (parts.length === 2) {
            const [a, b] = parts;
            const isYear = (s: string) => /^\d{4}$/.test(s);
            if (!result["Year"] && (isYear(a) || isYear(b))) {
                result["Year"] = isYear(a) ? a : b;
                result["Semester"] = result["Semester"] ?? (isYear(a) ? b : a);
            }
        }
    }

    return result;
}