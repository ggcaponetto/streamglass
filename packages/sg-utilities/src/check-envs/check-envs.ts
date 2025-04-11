export function checkRequiredEnvVars(requiredVars: string[]) {
    for (const key of requiredVars) {
        if (process.env[key] === undefined) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    }
}
