export const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // emove special chars
        .replace(/\s+/g, "-") // space -> hyphen
        .replace(/-+/g, "-") // multiple hyphens -> single hyphen
        .substring(0, 100);
};

export const generateUniqueSlug = (name: string, suffix?: string): string => {
    const base = generateSlug(name);
    return suffix ? `${base}-${suffix}` : base;
};
