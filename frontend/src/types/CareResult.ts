export interface CareResult {
    wash_temperature: string | null;
    dryer_safe: boolean | null;
    dry_clean_only: boolean | null;
    bleach_safe: boolean | null;
    iron_safe: boolean | null;
    special_instructions: string | null;
    material: string | null;
    confidence: string | null;
    raw_summary: string;
}