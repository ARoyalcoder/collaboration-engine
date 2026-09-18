import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { listProjects } from './project.service';
import type { Project } from './project.types';
import ProjectCard from './ProjectCard';

type Props = {
    workspaceId: string;
};

export default function ProjectList({
    workspaceId,
}: Props) {
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        const token = accessToken;

        async function loadProjects() {
            try {
                const data =
                    await listProjects(
                        workspaceId,
                        token,
                    );

                setProjects(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to load projects',
                );
            } finally {
                setLoading(false);
            }
        }

        loadProjects();
    }, [workspaceId, accessToken]);

    if (loading) {
        return <p>Loading projects...</p>;
    }

    if (error) {
        return (
            <p role="alert">
                {error}
            </p>
        );
    }

    if (projects.length === 0) {
        return (
            <p>
                No projects in this workspace.
            </p>
        );
    }

    return (
        <section>
            <h2>Projects</h2>

            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={(projectId: string) =>
                        navigate(
                            `/workspaces/${workspaceId}/projects/${projectId}`,
                        )
                    }
                />
            ))}
        </section>
    );
}