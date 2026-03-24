import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q");
    if (!q || q.trim() === "") {
        return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
    }

    const url = new URL("https://geo.api.gouv.fr/communes");
    url.searchParams.set("nom", q);
    url.searchParams.set("boost", "population");// Boost les résultats par population pour favoriser les communes plus grandes
    url.searchParams.set("fields", "nom,code,codeDepartement,codeRegion,codesPostaux,population,type");
    url.searchParams.set("format", "geojson");
    url.searchParams.set("geometry", "centre");

    try {

        const response = await fetch(url.toString(), {
            headers: {
                "Accept": "application/json"
            },
            next: { revalidate: 3600 } // Cache la réponse pendant 1 heure
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.log("Error fetching communes:", error);
        return NextResponse.json({ error: `Failed to fetch communes: ${error}` }, { status: 500 });
    }
}