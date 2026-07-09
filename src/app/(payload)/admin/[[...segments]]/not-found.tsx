import { NotFoundPage } from "@payloadcms/next/views";
import config from "@payload-config";
import { importMap } from "@/app/(payload)/importMap";

export default function NotFound() {
  const params = Promise.resolve({ segments: [] });
  const searchParams = Promise.resolve({});
  return NotFoundPage({ config, importMap, params, searchParams });
}
