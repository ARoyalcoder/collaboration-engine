import { useEffect, useState } from 'react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import {
    getWorkspace,
    listMembers,
} from './workspace.service';
import {
    joinWorkspace,
} from '../../services/socket';
import type {
    Workspace,
    WorkspaceMember,
} from './workspace.types';
import { PresenceList } from '../presence/PresenceList';
import { usePresence } from '../presence/usePresence';

export default function WorkspacePage() {
    const { workspaceId } = useParams<{
        workspaceId: string;
    }>();

    const navigate = useNavigate();

    const { accessToken } = useAuth();

    const [workspace, setWorkspace] =
        useState<Workspace | null>(null);

    const [members, setMembers] =
        useState<WorkspaceMember[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const onlineUsers =
        usePresence(workspaceId as string );


    useEffect(() => {
        if (!workspaceId || !accessToken) {
            return;
        }

        const token = accessToken;

        async function loadWorkspace() {
            try {
                const joinResult =
                    await joinWorkspace(workspaceId as string);

                if (!joinResult.success) {
                    throw new Error(
                        joinResult.message ??
                        'Unable to join workspace',
                    );
                }

                const [
                    workspaceData,
                    membersData,
                ] = await Promise.all([
                    getWorkspace(
                        workspaceId as string,
                        token,
                    ),
                    listMembers(
                        workspaceId as string,
                        token,
                    ),
                ]);

                setWorkspace(workspaceData);
                setMembers(membersData);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to load workspace',
                );
            } finally {
                setLoading(false);
            }
        }

        loadWorkspace();
    }, [workspaceId, accessToken]);

    if (loading) {
        return <p>Loading workspace...</p>;
    }

    if (error) {
        return (
            <main>
                <p role="alert">{error}</p>

                <button
                    onClick={() =>
                        navigate('/dashboard')
                    }
                >
                    Back
                </button>
            </main>
        );
    }

    if (!workspace) {
        return <p>Workspace not found.</p>;
    }

    return (
        <main>
            <button
                onClick={() =>
                    navigate('/dashboard')
                }
            >
                ← Workspaces
            </button>

            <h1>{workspace.name}</h1>

            <PresenceList users={onlineUsers} />

            <section>
                <h2>Members</h2>

                {members.map((member) => (
                    <article key={member.id}>
                        <strong>
                            {member.user.name}
                        </strong>

                        <p>
                            {member.user.email}
                        </p>

                        <p>
                            Role: {member.role}
                        </p>
                    </article>
                ))}
            </section>
        </main>
    );
}