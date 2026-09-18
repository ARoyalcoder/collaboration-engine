import type { Project } from './project.types';

type Props = {
  project: Project;
  onSelect: (projectId: string) => void;
};

export default function ProjectCard({
  project,
  onSelect,
}: Props) {
  return (
    <article>
      <h3>{project.name}</h3>

      {project.description && (
        <p>
          {project.description}
        </p>
      )}

      <p>
        Status: {project.status}
      </p>

      <button
        onClick={() =>
          onSelect(project.id)
        }
      >
        Open Project
      </button>
    </article>
  );
}