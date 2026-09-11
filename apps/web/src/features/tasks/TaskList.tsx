import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { listTasks } from './task.service';
import type { Task } from './task.types';

type Props = {
    workspaceId: string;
    projectId: string;
};

export default function TaskList({
    workspaceId,
    projectId,
}: Props) {
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] =
        useState<Task[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        const token = accessToken;

        async function loadTasks() {
            try {
                const data =
                    await listTasks(
                        workspaceId,
                        projectId,
                        token,
                    );

                setTasks(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to load tasks',
                );
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, [
        workspaceId,
        projectId,
        accessToken,
    ]);

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    if (error) {
        return (
            <p role="alert">
                {error}
            </p>
        );
    }

    if (tasks.length === 0) {
        return (
            <p>
                No tasks yet.
            </p>
        );
    }

    return (
        <section>
            <h2>Tasks</h2>

            {tasks.map((task) => (
                <article key={task.id}>
                    <h3>{task.title}</h3>

                    <p>
                        Status: {task.status}
                    </p>

                    <p>
                        Priority: {task.priority}
                    </p>

                    {task.assignedTo && (
                        <p>
                            Assigned to:{' '}
                            {task.assignedTo.name}
                        </p>
                    )}

                    <button
                        onClick={() =>
                            navigate(
                                `/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`,
                            )
                        }
                    >
                        Open Task
                    </button>
                </article>
            ))}
        </section>
    );
}