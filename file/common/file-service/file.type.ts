export type FileServiceInitType = {
  readonly localStoredDir: string;
  readonly remoteStoredPath: string;
  readonly extention: string;
  /**
   * Indicates that file will be overwritten, if file with same name exist
   * @default true
   */
  isReplaceable?: boolean;
};

export type FileCreatePayload<BaseT> = BaseT & { isReplaceable?: boolean };
