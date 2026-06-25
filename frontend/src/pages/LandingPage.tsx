import { Button } from "@/components/common/Button";
import { ArrowRight, Layers, Users, Zap } from "lucide-react";
import { Link } from "react-router";

function KanbanColumnPreview({ label, count, color, highlight }: { label: string; count: number; color: string; highlight?: boolean }) {
    return (
        <div className={`border border-surface-200 bg-white p-2 ${highlight ? "ring-1 ring-brand-600" : ""}`}>
            <div className="mb-2 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 ${color}`} />
                <span className="text-[10px] font-medium text-surface-500">{label}</span>
            </div>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="mb-1 h-3 w-full bg-surface-100 last:mb-0" />
            ))}
        </div>
    );
}

function Feature({ icon: Icon, title, description }: { icon: typeof Layers; title: string; description: string }) {
    return (
        <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center bg-brand-50">
                <Icon className="h-5 w-5 text-brand-600" />
            </div>
            <h3 className="mb-2 font-semibold text-surface-900">{title}</h3>
            <p className="text-sm text-surface-500">{description}</p>
        </div>
    );
}
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Nav */}
            <header className="border-b border-surface-200">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center bg-brand-600">
                            <Layers className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-lg font-semibold text-surface-900">TaskFlow Pro</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                Log In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm">
                                Get started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="mx-auto max-w-6xl px-6 py-20">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-600">Built for teams that ship</p>
                        <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-surface-900">
                            Work tracked.
                            <br />
                            Teams aligned.
                        </h1>
                        <p className="mt-6 max-w-md text-lg text-surface-500">Organizations, projects, and tasks in one board. No clutter, no setup ceremony — just a Kanban that keeps everyone moving.</p>
                        <div className="mt-8 flex items-center gap-4">
                            <Link to="/register">
                                <Button variant="primary" size="lg">
                                    Start for free
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="secondary" size="lg">
                                    Log in
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Signature element: a miniature live-looking Kanban board */}
                    <div className="border border-surface-200 bg-surface-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wide text-surface-500">Sprint Board</span>
                            <span className="text-xs text-surface-300">Q3 Launch</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            <KanbanColumnPreview label="Backlog" count={3} color="bg-surface-300" />
                            <KanbanColumnPreview label="In Progress" count={2} color="bg-brand-600" highlight />
                            <KanbanColumnPreview label="Review" count={1} color="bg-amber-600" />
                            <KanbanColumnPreview label="Done" count={4} color="bg-green-600" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature strip */}
            <section className="border-t border-surface-200 bg-surface-50">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <div className="grid gap-10 sm:grid-cols-3">
                        <Feature icon={Layers} title="Kanban that just works" description="Drag tasks across backlog, in progress, review, and done. Filter by assignee or priority in one click." />
                        <Feature icon={Users} title="Built for organizations" description="Roles for owners, admins, and members. Project-level permissions so the right people see the right boards." />
                        <Feature icon={Zap} title="Everything stays current" description="Comments, attachments, and notifications sync in real time across your whole team." />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-6xl px-6 py-20 text-center">
                <h2 className="text-3xl font-bold text-surface-900">Set up your first project in minutes</h2>
                <p className="mt-3 text-surface-500">No credit card. No setup calls. Just a board.</p>
                <div className="mt-8 flex justify-center">
                    <Link to="/register">
                        <Button variant="primary" size="lg">
                            Create your account
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            <footer className="border-t border-surface-200 py-8">
                <p className="text-center text-sm text-surface-300">© {new Date().getFullYear()} TaskFlow Pro</p>
            </footer>
        </div>
    );
}
