import { z } from 'zod';

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/json',
];

export const createUploadSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1)
    .max(255),

  contentType: z
    .string()
    .trim()
    .refine(
      (value) =>
        ALLOWED_CONTENT_TYPES.includes(value),
      'Unsupported file type',
    ),

  size: z
    .number()
    .int()
    .positive()
    .max(
      MAX_FILE_SIZE,
      'File exceeds the 25 MB limit',
    ),
});

export type CreateUploadInput =
  z.infer<typeof createUploadSchema>;