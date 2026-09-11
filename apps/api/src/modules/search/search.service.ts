import { prisma } from '@collaboration-engine/database';
import type { SearchInput } from './search.schema.js';

export async function searchTasks(
  workspaceId: string,
  input: SearchInput,
) {
  const searchTerm = input.q;

  const tasks = await prisma.$queryRaw<
    Array<{
      id: string;
      projectId: string;
      title: string;
      description: string | null;
      status: string;
      priority: string;
      createdAt: Date;
      relevance: number;
    }>
  >`
    SELECT
      t.id,
      t.project_id AS projectId,
      t.title,
      t.description,
      t.status,
      t.priority,
      t.created_at AS createdAt,
      MATCH(t.title, t.description)
        AGAINST(${searchTerm} IN NATURAL LANGUAGE MODE)
        AS relevance
    FROM tasks t
    INNER JOIN projects p
      ON p.id = t.project_id
    WHERE
      p.workspace_id = ${workspaceId}
      AND MATCH(t.title, t.description)
        AGAINST(${searchTerm} IN NATURAL LANGUAGE MODE)
    ORDER BY relevance DESC
    LIMIT ${input.limit}
  `;

  return tasks;
}