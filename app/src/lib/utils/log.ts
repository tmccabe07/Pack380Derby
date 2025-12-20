type LogLevel = "debug" | "log" | "error" | "silent";

const envLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL || process.env.LOG_LEVEL || "log").toLowerCase() as LogLevel;

function allows(level: Exclude<LogLevel, "silent">): boolean {
	if (envLevel === "silent") return false;
	if (envLevel === "debug") return true;
	if (envLevel === "log") return level !== "debug";
	if (envLevel === "error") return level === "error";
	return true;
}

function format(namespace: string | undefined, args: unknown[]): unknown[] {
	return namespace ? [`[${namespace}]`, ...args] : args;
}

export function debug(namespace: string | undefined, ...args: unknown[]): void {
	if (allows("debug")) console.debug(...format(namespace, args));
}

export function log(namespace: string | undefined, ...args: unknown[]): void {
	if (allows("log")) console.log(...format(namespace, args));
}

export function error(namespace: string | undefined, ...args: unknown[]): void {
	if (allows("error")) console.error(...format(namespace, args));
}

export const logger = {
	debug: (ns?: string, ...args: unknown[]) => debug(ns, ...args),
	log: (ns?: string, ...args: unknown[]) => log(ns, ...args),
	error: (ns?: string, ...args: unknown[]) => error(ns, ...args),
};

export default logger;
