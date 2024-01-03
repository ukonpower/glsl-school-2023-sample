declare module '*.json'{
	const value: any;
	export default value;
}

declare module '*.glsl'{
	const value: string;
	export default value;
}
declare module '*.vs'{
	const value: string;
	export default value;
}
declare module '*.fs'{
	const value: string;
	export default value;
}

declare const BASE_PATH: string;
