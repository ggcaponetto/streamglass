export function checkRequiredEnvVars(requiredVars: string[]) {
    console.log(
        `Running with process.env.NODE_ENV set to ${process.env.NODE_ENV}.`
    );
    if (process.env.NODE_ENV === 'production') {
        console.log(
            'Production mode detected. Skipping environment variable checks.'
        );
        for (const key of requiredVars) {
            if (process.env[key] === undefined) {
                console.log(
                    `Using baked in variable: ${key} - ${process.env[key]}`
                );
            }
        }
        return true;
    }
    for (const key of requiredVars) {
        if (process.env[key] === undefined) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    }
}
