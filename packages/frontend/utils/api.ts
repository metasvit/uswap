export async function fetchTokens() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/tokens`
    );
    return response.ok
        ? await response.json()
        : Promise.reject(new Error("Not found"));
}

export async function fetchIdentities(address: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/identities?address=${address}`
    );
    return response.ok
        ? await response.json()
        : Promise.reject(new Error("Not found"));
}

export async function fetchQuotes(tokenFrom: string, tokenTo: string, amount: number) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/quotes?from=${tokenFrom}&to=${tokenTo}&amount=${amount}`
    );
    return response.ok
        ? await response.json()
        : Promise.reject(new Error("Not found"));
}