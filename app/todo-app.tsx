"use client";

import { FormEvent, useMemo, useState } from "react";
import { getCompletionRate, getNextRankProgress, getRank, ranks } from "./todo-progress";

type Task = {
	id: string;
	title: string;
	completed: boolean;
};

const initialTasks: Task[] = [
	{ id: "setup", title: "Preparar a base do projeto", completed: true },
	{ id: "daily", title: "Planejar as missoes do dia", completed: false },
	{ id: "focus", title: "Finalizar uma tarefa importante", completed: false },
];

function createTaskId() {
	return typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function TodoApp() {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [draft, setDraft] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingTitle, setEditingTitle] = useState("");

	const completedCount = tasks.filter((task) => task.completed).length;
	const totalCount = tasks.length;
	const completionRate = getCompletionRate(completedCount, totalCount);
	const xp = completedCount * 40 + totalCount * 5;

	const rank = useMemo(() => {
		return getRank(xp);
	}, [xp]);

	const nextRank = ranks.find((item) => item.minXp > xp);
	const nextRankProgress = getNextRankProgress(xp, rank);

	function addTask(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const title = draft.trim();
		if (!title) {
			return;
		}

		setTasks((currentTasks) => [
			{ id: createTaskId(), title, completed: false },
			...currentTasks,
		]);
		setDraft("");
	}

	function toggleTask(taskId: string) {
		setTasks((currentTasks) =>
			currentTasks.map((task) =>
				task.id === taskId ? { ...task, completed: !task.completed } : task,
			),
		);
	}

	function startEditing(task: Task) {
		setEditingId(task.id);
		setEditingTitle(task.title);
	}

	function saveTask(taskId: string) {
		const title = editingTitle.trim();
		if (!title) {
			return;
		}

		setTasks((currentTasks) =>
			currentTasks.map((task) => (task.id === taskId ? { ...task, title } : task)),
		);
		setEditingId(null);
		setEditingTitle("");
	}

	function cancelEditing() {
		setEditingId(null);
		setEditingTitle("");
	}

	function deleteTask(taskId: string) {
		setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
	}

	return (
		<main className="app-shell">
			<section className="hero">
				<div>
					<p className="eyebrow">Painel de missoes</p>
					<h1>To-do</h1>
					<p className="hero-copy">
						Organize pequenas missoes, conclua tarefas e acompanhe seu progresso de foco.
					</p>
				</div>

				<div className="rank-panel" aria-label="Resumo de progresso">
					<div>
						<span className="panel-label">Rank atual</span>
						<strong>{rank.name}</strong>
					</div>
					<div className="xp-row">
						<span>{xp} XP</span>
						<span>{nextRank ? `Proximo: ${nextRank.name}` : "Rank maximo"}</span>
					</div>
					<div className="progress-track" aria-label={`Progresso de rank: ${nextRankProgress}%`}>
						<div className="progress-fill" style={{ width: `${nextRankProgress}%` }} />
					</div>
				</div>
			</section>

			<section className="stats-grid" aria-label="Indicadores">
				<div>
					<span className="panel-label">Missoes</span>
					<strong>{totalCount}</strong>
				</div>
				<div>
					<span className="panel-label">Concluidas</span>
					<strong>{completedCount}</strong>
				</div>
				<div>
					<span className="panel-label">Progresso</span>
					<strong>{completionRate}%</strong>
				</div>
			</section>

			<section className="task-workspace" aria-label="Lista de tarefas">
				<form className="task-form" onSubmit={addTask}>
					<label htmlFor="task-title">Nova missao</label>
					<div className="task-input-row">
						<input
							id="task-title"
							type="text"
							value={draft}
							onChange={(event) => setDraft(event.currentTarget.value)}
							placeholder="Ex: Revisar o backlog"
						/>
						<button type="submit">Criar</button>
					</div>
				</form>

				<div className="task-list">
					{tasks.length === 0 ? (
						<p className="empty-state">Sem missoes ativas. Crie a primeira para comecar.</p>
					) : (
						tasks.map((task) => (
							<article className={task.completed ? "task-card is-complete" : "task-card"} key={task.id}>
								<label className="task-check">
									<input
										type="checkbox"
										checked={task.completed}
										onChange={() => toggleTask(task.id)}
									/>
									<span>{task.completed ? "+40 XP" : "Pendente"}</span>
								</label>

								{editingId === task.id ? (
									<div className="edit-row">
										<input
											type="text"
											value={editingTitle}
											onChange={(event) => setEditingTitle(event.currentTarget.value)}
											aria-label="Editar tarefa"
											autoFocus
										/>
										<button type="button" onClick={() => saveTask(task.id)}>
											Salvar
										</button>
										<button className="secondary-button" type="button" onClick={cancelEditing}>
											Cancelar
										</button>
									</div>
								) : (
									<div className="task-content">
										<p>{task.title}</p>
										<div className="task-actions">
											<button type="button" onClick={() => startEditing(task)}>
												Editar
											</button>
											<button className="danger-button" type="button" onClick={() => deleteTask(task.id)}>
												Excluir
											</button>
										</div>
									</div>
								)}
							</article>
						))
					)}
				</div>
			</section>
		</main>
	);
}
