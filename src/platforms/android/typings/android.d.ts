/// <reference path="android-declarations.d.ts"/>

declare module io {
	export module tus {
		export module android {
			export module client {
				export class BuildConfig {
					public static class: java.lang.Class<io.tus.android.client.BuildConfig>;
					public static DEBUG: boolean;
					public static APPLICATION_ID: string;
					public static BUILD_TYPE: string;
					public static FLAVOR: string;
					public static VERSION_CODE: number;
					public static VERSION_NAME: string;
					public constructor();
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module android {
			export module client {
				export class TusAndroidUpload extends io.tus.java.client.TusUpload {
					public static class: java.lang.Class<io.tus.android.client.TusAndroidUpload>;
					public constructor(param0: globalAndroid.net.Uri, param1: globalAndroid.content.Context);
					public constructor();
					public constructor(param0: java.io.File);
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module android {
			export module client {
				export class TusPreferencesURLStore extends io.tus.java.client.TusURLStore {
					public static class: java.lang.Class<io.tus.android.client.TusPreferencesURLStore>;
					public set(param0: string, param1: java.net.URL): void;
					public remove(param0: string): void;
					public get(param0: string): java.net.URL;
					public constructor(param0: globalAndroid.content.SharedPreferences);
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module java {
			export module client {
				export class FingerprintNotFoundException {
					public static class: java.lang.Class<io.tus.java.client.FingerprintNotFoundException>;
					public constructor(param0: string);
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module java {
			export module client {
				export class ProtocolException {
					public static class: java.lang.Class<io.tus.java.client.ProtocolException>;
					public getCausingConnection(): java.net.HttpURLConnection;
					public constructor(param0: string);
					public constructor(param0: string, param1: java.net.HttpURLConnection);
					public shouldRetry(): boolean;
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module java {
			export module client {
				export class ResumingNotEnabledException {
					public static class: java.lang.Class<io.tus.java.client.ResumingNotEnabledException>;
					public constructor();
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module java {
			export module client {
				export class TusClient {
					public static class: java.lang.Class<io.tus.java.client.TusClient>;
					public static TUS_VERSION: string;
					public disableRemoveFingerprintOnSuccess(): void;
					public getHeaders(): java.util.Map<string,string>;
					public resumeUpload(param0: io.tus.java.client.TusUpload): io.tus.java.client.TusUploader;
					public uploadFinished(param0: io.tus.java.client.TusUpload): void;
					public prepareConnection(param0: java.net.HttpURLConnection): void;
					public createUpload(param0: io.tus.java.client.TusUpload): io.tus.java.client.TusUploader;
					public disableResuming(): void;
					public getUploadCreationURL(): java.net.URL;
					public enableResuming(param0: io.tus.java.client.TusURLStore): void;
					public constructor();
					public resumingEnabled(): boolean;
					public removeFingerprintOnSuccessEnabled(): boolean;
					public beginOrResumeUploadFromURL(param0: io.tus.java.client.TusUpload, param1: java.net.URL): io.tus.java.client.TusUploader;
					public resumeOrCreateUpload(param0: io.tus.java.client.TusUpload): io.tus.java.client.TusUploader;
					public enableRemoveFingerprintOnSuccess(): void;
					public getConnectTimeout(): number;
					public setUploadCreationURL(param0: java.net.URL): void;
					public setHeaders(param0: java.util.Map<string,string>): void;
					public setConnectTimeout(param0: number): void;
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module java {
			export module client {
				export abstract class TusExecutor {
					public static class: java.lang.Class<io.tus.java.client.TusExecutor>;
					public setDelays(param0: native.Array<number>): void;
					public constructor();
					public getDelays(): native.Array<number>;
					public makeAttempt(): void;
					public makeAttempts(): boolean;
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module java {
			export module client {
				export class TusInputStream {
					public static class: java.lang.Class<io.tus.java.client.TusInputStream>;
					public read(param0: native.Array<number>, param1: number): number;
					public seekTo(param0: number): void;
					public constructor(param0: java.io.InputStream);
					public close(): void;
					public mark(param0: number): void;
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module java {
			export module client {
				export class TusURLMemoryStore extends io.tus.java.client.TusURLStore {
					public static class: java.lang.Class<io.tus.java.client.TusURLMemoryStore>;
					public set(param0: string, param1: java.net.URL): void;
					public remove(param0: string): void;
					public get(param0: string): java.net.URL;
					public constructor();
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module java {
			export module client {
				export class TusURLStore {
					public static class: java.lang.Class<io.tus.java.client.TusURLStore>;
					/**
					 * Constructs a new instance of the io.tus.java.client.TusURLStore interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						set(param0: string, param1: java.net.URL): void;
						get(param0: string): java.net.URL;
						remove(param0: string): void;
					});
					public constructor();
					public set(param0: string, param1: java.net.URL): void;
					public remove(param0: string): void;
					public get(param0: string): java.net.URL;
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module java {
			export module client {
				export class TusUpload {
					public static class: java.lang.Class<io.tus.java.client.TusUpload>;
					public setSize(param0: number): void;
					public getFingerprint(): string;
					public getEncodedMetadata(): string;
					public constructor();
					public getMetadata(): java.util.Map<string,string>;
					public setFingerprint(param0: string): void;
					public getInputStream(): java.io.InputStream;
					public setMetadata(param0: java.util.Map<string,string>): void;
					public getSize(): number;
					public constructor(param0: java.io.File);
					public setInputStream(param0: java.io.InputStream): void;
				}
			}
		}
	}
}

declare module io {
	export module tus {
		export module java {
			export module client {
				export class TusUploader {
					public static class: java.lang.Class<io.tus.java.client.TusUploader>;
					public uploadChunk(): number;
					public getRequestPayloadSize(): number;
					/** @deprecated */
					public uploadChunk(param0: number): number;
					public getChunkSize(): number;
					public setRequestPayloadSize(param0: number): void;
					public setChunkSize(param0: number): void;
					public constructor(param0: io.tus.java.client.TusClient, param1: io.tus.java.client.TusUpload, param2: java.net.URL, param3: io.tus.java.client.TusInputStream, param4: number);
					public finish(): void;
					public getOffset(): number;
					public getUploadURL(): java.net.URL;
				}
			}
		}
	}
}

//Generics information:

