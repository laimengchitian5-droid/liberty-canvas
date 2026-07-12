import {
  getActiveStorageMode,
  readJsonStore,
  writeJsonStore,
} from "@/lib/storage/jsonStore";

export interface JsonRepositoryPort {
  read<T>(key: string, fallback: T): Promise<T>;
  write<T>(key: string, value: T): Promise<void>;
  mode: "blob" | "local";
}

export const jsonRepository: JsonRepositoryPort = {
  read: readJsonStore,
  write: writeJsonStore,
  mode: getActiveStorageMode(),
};
