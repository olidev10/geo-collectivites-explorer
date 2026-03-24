export async function searchCommunes(query: string) {
    const res = await fetch(`/api/communes?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
        throw new Error(`Failed to search communes: ${res.statusText}`);
    }
    return res.json() as Promise<import("./types").CommuneCollection>;
}