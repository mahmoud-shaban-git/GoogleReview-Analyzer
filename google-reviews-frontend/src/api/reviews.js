const BASE_URL = "http://localhost:8080/api";

async function fetchWithErrors(url, options = {}) {
    const res = await fetch(url, {
        headers: { 'Accept': 'application/json', ...options.headers },
        ...options
    });

    if (!res.ok) {
        let errorMessage = `Error ${res.status}`;
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
            const text = await res.text();
            if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
    }
    return await res.json();
}

export async function importReviews(placeId) {
    // Corrected endpoint
    return fetchWithErrors(`${BASE_URL}/reviews/import/${placeId}`, { method: 'POST' });
}

export async function loadAnalysis(placeId) {
    return fetchWithErrors(`${BASE_URL}/analysis/${placeId}`);
}

export async function loadTrends(placeId) {
    return fetchWithErrors(`${BASE_URL}/analysis/${placeId}/trends`);
}



export async function loadReviews(placeId, category = null) {
    let url = `${BASE_URL}/reviews/${placeId}`;
    if (category) {
        url += `?category=${encodeURIComponent(category)}`;
    }
    return fetchWithErrors(url);
}
