"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    FolderOpen,
    Briefcase,
    Image as ImageIcon,
    Settings,
    Mail,
    Plus,
    Trash2,
    Upload,
    Save,
    X,
    LogOut,
    Loader2,
    BarChart3,
    Pencil,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    PieChart as PieChartIcon,
    Calendar
} from "lucide-react";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    status: 'unread' | 'read' | 'archived';
    created_at: string;
}

interface Activity {
    id: string;
    type: 'program' | 'project' | 'gallery' | 'message' | 'resource';
    action: string;
    title: string;
    created_at: string;
}

interface GalleryImage {
    id: string;
    image_url: string;
    alt_text: string;
    created_at: string;
}

interface Program {
    id: string;
    title: string;
    category: string;
    description: string;
    image_url: string | null;
    created_at: string;
}

interface Project {
    id: string;
    title: string;
    status: string;
    description: string;
    image_url: string | null;
    slug: string;
    created_at: string;
}

interface Event {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    venue: string;
    event_date: string;
    start_time: string;
    end_time: string;
    ticket_price: string;
    purchase_methods: { method: string; details: string }[] | null;
    category: string;
    created_at: string;
    updated_at: string;
}

interface Resource {
    id: string;
    title: string;
    slug: string;
    content: string;
    image_url: string | null;
    type: 'article' | 'blog';
    published: boolean;
    created_at: string;
    updated_at: string;
}

import logo from "../../components/assets/logo.png";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"overview" | "programs" | "projects" | "gallery" | "messages" | "settings" | "reviews" | "events" | "resources">("overview");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    // Sidebar navigation
    const navItems = [
        { id: "overview", label: "Dashboard", icon: LayoutDashboard },
        { id: "programs", label: "Programs", icon: FolderOpen },
        { id: "projects", label: "Projects", icon: Briefcase },
        { id: "events", label: "Events", icon: Calendar },
        { id: "resources", label: "Resources", icon: Briefcase }, // Using Briefcase for now, will find a better one if needed or use Lucide BookOpen if available
        { id: "reviews", label: "Reviews", icon: BarChart3 },
        { id: "gallery", label: "Gallery", icon: ImageIcon },
        { id: "messages", label: "Messages", icon: Mail },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    // Animation variants
    const sidebarVariants = {
        expanded: {
            width: "256px", // w-64
            transition: { type: "spring" as const, stiffness: 100, damping: 20 }
        },
        collapsed: {
            width: "80px", // space for icon
            transition: { type: "spring" as const, stiffness: 100, damping: 20 }
        }
    };

    const mainVariants = {
        expanded: {
            marginLeft: "256px",
            transition: { type: "spring" as const, stiffness: 100, damping: 20 }
        },
        collapsed: {
            marginLeft: "80px",
            transition: { type: "spring" as const, stiffness: 100, damping: 20 }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-screen bg-gray-50 flex overflow-x-hidden"
        >
            {/* Sidebar */}
            <motion.aside
                initial="expanded"
                animate={isCollapsed ? "collapsed" : "expanded"}
                variants={sidebarVariants}
                className="bg-white border-r border-gray-200 fixed h-full z-40 shadow-sm"
            >
                <div className={`p-6 border-b border-gray-200 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h1 className="text-xl font-bold text-gray-900">Ignite Kenya</h1>
                            <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
                        </motion.div>
                    )}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`relative w-10 h-10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${isCollapsed ? '' : 'ml-4'}`}
                    >
                        <Image
                            src={logo}
                            alt="IK"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as typeof activeTab)}
                                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-lg transition-colors overflow-hidden ${isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                title={isCollapsed ? item.label : ""}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-medium whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-1">

                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors overflow-hidden`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="font-medium whitespace-nowrap"
                            >
                                Log out
                            </motion.span>
                        )}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <motion.main
                initial="expanded"
                animate={isCollapsed ? "collapsed" : "expanded"}
                variants={mainVariants}
                className="flex-1 p-8"
            >
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === "overview" && <OverviewSection setActiveTab={setActiveTab} />}
                    {activeTab === "programs" && <ProgramsSection />}
                    {activeTab === "projects" && <ProjectsSection />}
                    {activeTab === "events" && <EventsSection />}
                    {activeTab === "reviews" && <ReviewsSection />}
                    {activeTab === "gallery" && <GallerySection />}
                    {activeTab === "messages" && <MessagesSection />}
                    {activeTab === "resources" && <ResourcesSection />}
                    {activeTab === "settings" && <SettingsSection />}
                </motion.div>

                {/* Dashboard Footer */}
                <DashboardFooter />
            </motion.main>
        </motion.div>
    );
}

// Overview Section
function OverviewSection({ setActiveTab }: { setActiveTab: (tab: "overview" | "programs" | "projects" | "gallery" | "messages" | "settings" | "reviews" | "events") => void }) {
    const [counts, setCounts] = useState({
        programs: 0,
        projects: 0,
        gallery: 0,
        unreadMessages: 0,
        resources: 0
    });
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            const [programsRes, projectsRes, galleryRes, messagesRes, resourcesRes] = await Promise.all([
                supabase.from('programs').select('*', { count: 'exact', head: true }),
                supabase.from('projects').select('*', { count: 'exact', head: true }),
                supabase.from('gallery').select('*', { count: 'exact', head: true }),
                supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
                supabase.from('resources').select('*', { count: 'exact', head: true })
            ]);

            setCounts({
                programs: programsRes.count || 0,
                projects: projectsRes.count || 0,
                gallery: galleryRes.count || 0,
                unreadMessages: messagesRes.count || 0,
                resources: resourcesRes.count || 0
            });

            // Fetch recent activities
            const [recentPrograms, recentProjects, recentGallery, recentMessages, recentResources] = await Promise.all([
                supabase.from('programs').select('id, title, created_at').order('created_at', { ascending: false }).limit(3),
                supabase.from('projects').select('id, title, created_at').order('created_at', { ascending: false }).limit(3),
                supabase.from('gallery').select('id, created_at').order('created_at', { ascending: false }).limit(3),
                supabase.from('contacts').select('id, name, created_at').order('created_at', { ascending: false }).limit(3),
                supabase.from('resources').select('id, title, created_at').order('created_at', { ascending: false }).limit(3)
            ]);

            const allActivities: Activity[] = [
                ...(recentPrograms.data || []).map((p: { id: string; title: string; created_at: string }): Activity => ({ id: p.id, type: 'program' as const, action: 'Added program', title: p.title, created_at: p.created_at })),
                ...(recentProjects.data || []).map((p: { id: string; title: string; created_at: string }): Activity => ({ id: p.id, type: 'project' as const, action: 'Added project', title: p.title, created_at: p.created_at })),
                ...(recentGallery.data || []).map((g: { id: string; created_at: string }): Activity => ({ id: g.id, type: 'gallery' as const, action: 'Uploaded image', title: 'New Photo', created_at: g.created_at })),
                ...(recentMessages.data || []).map((m: { id: string; name: string; created_at: string }): Activity => ({ id: m.id, type: 'message' as const, action: 'New message from', title: m.name, created_at: m.created_at })),
                ...(recentResources.data || []).map((r: { id: string; title: string; created_at: string }): Activity => ({ id: r.id, type: 'resource' as const, action: 'Published resource', title: r.title, created_at: r.created_at }))
            ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);

            setActivities(allActivities);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            if (isMounted) await fetchDashboardData();
        };
        init();

        const channels = [
            supabase.channel('overview-live').on('postgres_changes', { event: '*', schema: 'public' }, fetchDashboardData).subscribe()
        ];

        return () => {
            isMounted = false;
            channels.forEach(ch => supabase.removeChannel(ch));
        };
    }, [fetchDashboardData]);

    const stats = [
        { label: "Total Programs", value: counts.programs.toString(), change: "Live data", icon: FolderOpen },
        { label: "Active Projects", value: counts.projects.toString(), change: "Live data", icon: Briefcase },
        { label: "Gallery Items", value: counts.gallery.toString(), change: "Live data", icon: ImageIcon },
        { label: "Unread Messages", value: counts.unreadMessages.toString(), change: counts.unreadMessages > 0 ? "Action required" : "All caught up", icon: Mail, highlight: counts.unreadMessages > 0 },
    ];

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-24">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-600 mt-2">Manage your website content from one place</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className={`bg-white p-6 rounded-2xl border ${stat.highlight ? 'border-primary ring-1 ring-primary/20' : 'border-gray-200'} shadow-sm transition-all hover:shadow-md`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                            <stat.icon className={`w-4 h-4 ${stat.highlight ? 'text-primary' : 'text-gray-400'}`} />
                        </div>
                        <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-xs mt-2 font-medium ${stat.highlight ? 'text-primary' : 'text-gray-400'}`}>{stat.change}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => setActiveTab("programs")}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">Add Program</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("projects")}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">Add Project</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("gallery")}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                        <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">Upload Image</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                        <Settings className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">Edit Settings</span>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {activities.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.type === 'program' ? 'bg-blue-50 text-blue-500' :
                                    item.type === 'project' ? 'bg-green-50 text-green-500' :
                                        item.type === 'gallery' ? 'bg-purple-50 text-purple-500' :
                                            'bg-orange-50 text-orange-500'
                                    }`}>
                                    {item.type === 'program' && <FolderOpen className="w-4 h-4" />}
                                    {item.type === 'project' && <Briefcase className="w-4 h-4" />}
                                    {item.type === 'gallery' && <ImageIcon className="w-4 h-4" />}
                                    {item.type === 'message' && <Mail className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {item.action} <span className="text-gray-500 font-normal">{item.title}</span>
                                    </p>
                                    <p className="text-xs text-gray-400">{getRelativeTime(item.created_at)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (item.type === 'program') setActiveTab("programs");
                                    else if (item.type === 'project') setActiveTab("projects");
                                    else if (item.type === 'gallery') setActiveTab("gallery");
                                    else if (item.type === 'message') setActiveTab("messages");
                                }}
                                className="text-xs font-bold text-primary hover:underline"
                            >
                                View
                            </button>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <p className="text-sm text-gray-400 italic py-4 text-center">No recent activity found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Programs Section
function ProgramsSection() {
    const [view, setView] = useState<"list" | "add" | "edit">("list");
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string, imageUrl: string | null }>({
        isOpen: false,
        id: '',
        imageUrl: null
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPrograms = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('programs')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setPrograms(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const { error } = await supabase.from('programs').delete().eq('id', deleteModal.id);
            if (error) throw error;

            if (deleteModal.imageUrl) {
                const path = deleteModal.imageUrl.split('/').pop();
                if (path) {
                    await supabase.storage.from('ignite-media').remove([`programs/${path}`]);
                }
            }

            setPrograms(programs.filter(p => p.id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: '', imageUrl: null });
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting program");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (program: Program) => {
        setEditingProgram(program);
        setView("edit");
    };

    if (view === "add" || view === "edit") {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setView("list")}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                </button>
                <ProgramForm
                    onSuccess={() => {
                        setView("list");
                        fetchPrograms();
                    }}
                    initialData={editingProgram}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Programs</h2>
                    <p className="text-gray-600 mt-2">Manage your programs and initiatives</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProgram(null);
                        setView("add");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Program
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : programs.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Program</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Category</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Created</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {programs.map((program) => (
                                <tr key={program.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                {program.image_url ? (
                                                    <Image src={program.image_url} alt="" fill className="object-cover" />
                                                ) : (
                                                    <FolderOpen className="w-5 h-5 text-gray-400 m-2.5" />
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-900">{program.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            {program.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(program.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(program)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ isOpen: true, id: program.id, imageUrl: program.image_url })}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ConfirmModal
                        isOpen={deleteModal.isOpen}
                        onClose={() => setDeleteModal({ isOpen: false, id: '', imageUrl: null })}
                        onConfirm={handleDelete}
                        title="Delete Program"
                        message="Are you sure you want to delete this program? This action cannot be undone."
                        isLoading={isDeleting}
                    />
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No programs found</h3>
                    <p className="text-gray-500 mt-1">Start by adding your first program</p>
                    <button
                        onClick={() => setView("add")}
                        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add First Program
                    </button>
                </div>
            )}
        </div>
    );
}

// Projects Section
function ProjectsSection() {
    const [view, setView] = useState<"list" | "add" | "edit">("list");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string, imageUrl: string | null }>({
        isOpen: false,
        id: '',
        imageUrl: null
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setProjects(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const { error } = await supabase.from('projects').delete().eq('id', deleteModal.id);
            if (error) throw error;

            if (deleteModal.imageUrl) {
                const path = deleteModal.imageUrl.split('/').pop();
                if (path) {
                    await supabase.storage.from('ignite-media').remove([`projects/${path}`]);
                }
            }

            setProjects(projects.filter(p => p.id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: '', imageUrl: null });
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting project");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setView("edit");
    };

    if (view === "add" || view === "edit") {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setView("list")}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                </button>
                <ProjectForm
                    onSuccess={() => {
                        setView("list");
                        fetchProjects();
                    }}
                    initialData={editingProject}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
                    <p className="text-gray-600 mt-2">Manage your ongoing and completed projects</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProject(null);
                        setView("add");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Project
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : projects.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Project</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Created</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                {project.image_url ? (
                                                    <Image src={project.image_url} alt="" fill className="object-cover" />
                                                ) : (
                                                    <Briefcase className="w-5 h-5 text-gray-400 m-2.5" />
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-900">{project.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ isOpen: true, id: project.id, imageUrl: project.image_url })}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ConfirmModal
                        isOpen={deleteModal.isOpen}
                        onClose={() => setDeleteModal({ isOpen: false, id: '', imageUrl: null })}
                        onConfirm={handleDelete}
                        title="Delete Project"
                        message="Are you sure you want to delete this project? This action cannot be undone."
                        isLoading={isDeleting}
                    />
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
                    <p className="text-gray-500 mt-1">Showcase your first project</p>
                    <button
                        onClick={() => setView("add")}
                        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add First Project
                    </button>
                </div>
            )}
        </div>
    );
}

// Events Section
function EventsSection() {
    const [view, setView] = useState<"list" | "add" | "edit">("list");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string, imageUrl: string | null }>({
        isOpen: false,
        id: '',
        imageUrl: null
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('event_date', { ascending: false });

        if (!error && data) setEvents(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const { error } = await supabase.from('events').delete().eq('id', deleteModal.id);
            if (error) throw error;

            if (deleteModal.imageUrl) {
                const path = deleteModal.imageUrl.split('/').pop();
                if (path) {
                    await supabase.storage.from('ignite-media').remove([`events/${path}`]);
                }
            }

            setEvents(events.filter(e => e.id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: '', imageUrl: null });
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting event");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setView("edit");
    };

    if (view === "add" || view === "edit") {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setView("list")}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                </button>
                <EventForm
                    onSuccess={() => {
                        setView("list");
                        fetchEvents();
                    }}
                    initialData={editingEvent}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Events</h2>
                    <p className="text-gray-600 mt-2">Manage upcoming and past events</p>
                </div>
                <button
                    onClick={() => {
                        setEditingEvent(null);
                        setView("add");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Event
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : events.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Event</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Venue</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Category</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                {event.image_url ? (
                                                    <Image src={event.image_url} alt="" fill className="object-cover" />
                                                ) : (
                                                    <Calendar className="w-5 h-5 text-gray-400 m-2.5" />
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-900">{event.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(event.event_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {event.venue}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ isOpen: true, id: event.id, imageUrl: event.image_url })}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ConfirmModal
                        isOpen={deleteModal.isOpen}
                        onClose={() => setDeleteModal({ isOpen: false, id: '', imageUrl: null })}
                        onConfirm={handleDelete}
                        title="Delete Event"
                        message="Are you sure you want to delete this event? This action cannot be undone."
                        isLoading={isDeleting}
                    />
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                    <p className="text-gray-500 mt-1">Create your first event to get started</p>
                    <button
                        onClick={() => setView("add")}
                        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add First Event
                    </button>
                </div>
            )}
        </div>
    );
}

// Gallery Section
function GallerySection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Gallery</h2>
                    <p className="text-gray-600 mt-2">Upload and manage your media library</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors">
                    <Plus className="w-5 h-5" />
                    Upload Image
                </button>
            </div>

            <ImageUploadWidget />
        </div>
    );
}

// Settings Section
function SettingsSection() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Website Settings</h2>
                <p className="text-gray-600 mt-2">Update homepage and global content</p>
            </div>

            <SettingsForm />
        </div>
    );
}

// Messages Section
function MessagesSection() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Messages</h2>
                <p className="text-gray-600 mt-2">View and manage contact form submissions</p>
            </div>

            <MessagesList />
        </div>
    );
}

// Reviews & Analytics Section
function ReviewsSection() {
    const [selectedType, setSelectedType] = useState<"projects" | "programs">("projects");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        ratings: [0, 0, 0, 0, 0], // 5 stars to 1 star (percentages)
        pie: [] as { label: string, value: number, color: string }[],
        trends: [] as { label: string, value: number }[],
        totalVotes: 0,
        average: 0
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch Items (Projects/Programs) for Trends & Pie
            const { data: items, error: itemsError } = await supabase
                .from(selectedType)
                .select('*')
                .order('created_at', { ascending: true });

            if (itemsError) throw itemsError;

            // Process Pie Data (Status or Category)
            const pieMap: Record<string, number> = {};
            (items as (Project | Program)[])?.forEach(item => {
                const key = selectedType === "projects" ? (item as Project).status : (item as Program).category;
                pieMap[key] = (pieMap[key] || 0) + 1;
            });

            const totalItems = items?.length || 0;
            const colors = ["#f97316", "#10b981", "#6366f1", "#8b5cf6", "#ec4899"];
            const pieData = Object.keys(pieMap).map((key, i) => ({
                label: key,
                value: totalItems > 0 ? Math.round((pieMap[key] / totalItems) * 100) : 0,
                color: colors[i % colors.length]
            }));

            // Process Trends Data (Group by Month)
            const trendsMap: Record<string, number> = {};
            const last6Months = [...Array(6)].map((_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - (5 - i));
                return d.toLocaleString('default', { month: 'short' });
            });

            // Initialize with 0
            last6Months.forEach(m => trendsMap[m] = 0);

            (items as { created_at: string }[])?.forEach(item => {
                const date = new Date(item.created_at);
                const month = date.toLocaleString('default', { month: 'short' });
                if (trendsMap[month] !== undefined) {
                    trendsMap[month]++;
                }
            });

            const trendsData = last6Months.map(label => ({
                label,
                value: trendsMap[label]
            }));

            // 2. Fetch Ratings
            // We need ratings for ALL items of this type
            // This might be heavy if many items, but for now it's fine.
            // A better way would be to fetch from ratings table directly filtered by target_type
            const { data: ratings, error: ratingsError } = await supabase
                .from('ratings')
                .select('rating')
                .eq('target_type', selectedType === "projects" ? "project" : "program");

            if (ratingsError) throw ratingsError;

            // Process Ratings
            const ratingCounts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5
            let totalRatingSum = 0;
            (ratings as { rating: number }[])?.forEach(r => {
                if (r.rating >= 1 && r.rating <= 5) {
                    ratingCounts[r.rating - 1]++;
                    totalRatingSum += r.rating;
                }
            });

            const totalVotes = ratings?.length || 0;
            const avgRating = totalVotes > 0 ? parseFloat((totalRatingSum / totalVotes).toFixed(1)) : 0;

            // Convert counts to percentages for the bar chart (reversed 5 to 1)
            const ratingPercentages = [
                totalVotes > 0 ? Math.round((ratingCounts[4] / totalVotes) * 100) : 0, // 5 stars
                totalVotes > 0 ? Math.round((ratingCounts[3] / totalVotes) * 100) : 0, // 4 stars
                totalVotes > 0 ? Math.round((ratingCounts[2] / totalVotes) * 100) : 0, // 3 stars
                totalVotes > 0 ? Math.round((ratingCounts[1] / totalVotes) * 100) : 0, // 2 stars
                totalVotes > 0 ? Math.round((ratingCounts[0] / totalVotes) * 100) : 0, // 1 star
            ];

            setData({
                ratings: ratingPercentages,
                pie: pieData,
                trends: trendsData,
                totalVotes,
                average: avgRating
            });

        } catch (error) {
            console.error("Error fetching analytics:", JSON.stringify(error, null, 2));
        } finally {
            setLoading(false);
        }
    }, [selectedType]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Reviews & Analytics</h2>
                    <p className="text-gray-600 mt-2">Real-time performance metrics</p>
                </div>
                <div className="flex p-1 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => setSelectedType("projects")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedType === "projects" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Projects
                    </button>
                    <button
                        onClick={() => setSelectedType("programs")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedType === "programs" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Programs
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 text-yellow-500 rounded-xl">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Average Rating</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-gray-900">{data.average}</h3>
                            <span className="text-yellow-500 font-bold">★</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                        <PieChartIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Votes</p>
                        <h3 className="text-3xl font-bold text-gray-900">{data.totalVotes}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart - Rating Distribution */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Rating Distribution</h3>
                    </div>
                    <div className="space-y-6">
                        {data.ratings.map((val, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 font-medium">{5 - idx} Stars</span>
                                    <span className="text-gray-400">{val}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${val}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-primary rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pie Chart - Category Breakdown */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900">
                            {selectedType === "projects" ? "Status Breakdown" : "Category Breakdown"}
                        </h3>
                    </div>
                    {data.pie.length > 0 ? (
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="relative w-48 h-48">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    {data.pie.map((slice, i) => {
                                        let offset = 0;
                                        for (let j = 0; j < i; j++) offset += data.pie[j].value;
                                        const x1 = Math.cos(2 * Math.PI * offset / 100);
                                        const y1 = Math.sin(2 * Math.PI * offset / 100);
                                        const x2 = Math.cos(2 * Math.PI * (offset + slice.value) / 100);
                                        const y2 = Math.sin(2 * Math.PI * (offset + slice.value) / 100);
                                        const largeArcFlag = slice.value > 50 ? 1 : 0;
                                        // Handle 100% case
                                        const pathData = slice.value === 100
                                            ? "M 50 10 A 40 40 0 1 1 49.99 10" // Full circle approximation
                                            : `M 50 50 L ${50 + 40 * x1} ${50 + 40 * y1} A 40 40 0 ${largeArcFlag} 1 ${50 + 40 * x2} ${50 + 40 * y2} Z`;

                                        return (
                                            <motion.path
                                                key={i}
                                                d={pathData}
                                                fill={slice.color}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                whileHover={{ scale: 1.05 }}
                                                className="cursor-pointer"
                                            />
                                        );
                                    })}
                                    <circle cx="50" cy="50" r="25" fill="white" />
                                </svg>
                            </div>
                            <div className="flex-1 space-y-4">
                                {data.pie.map((slice, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: slice.color }} />
                                        <span className="text-sm font-medium text-gray-700">{slice.label}</span>
                                        <span className="text-sm text-gray-400 ml-auto">{slice.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-400 italic">No data available</div>
                    )}
                </div>
            </div>

            {/* Posting Trends Line Graph (Replaces Recent Feedback) */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{selectedType === 'projects' ? 'Projects' : 'Programs'} Posted Over Time</h3>
                        <p className="text-sm text-gray-500">Last 6 months activity</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary"></div>
                        <span className="text-xs font-medium text-gray-600">New Posts</span>
                    </div>
                </div>

                <div className="h-64 w-full relative">
                    {/* Y-Axis Grid Lines */}
                    {[0, 25, 50, 75, 100].map((val) => (
                        <div key={val} className="absolute w-full border-t border-gray-100 flex items-center" style={{ bottom: `${val}%` }}>
                            {/* <span className="text-xs text-gray-300 -ml-6">{val}</span> */}
                        </div>
                    ))}

                    {/* The Graph */}
                    <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible preserve-3d">
                        {/* Line */}
                        <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            d={`M ${data.trends.map((d, i) => {
                                const x = (i / (data.trends.length - 1)) * 100;
                                const maxVal = Math.max(...data.trends.map(t => t.value), 1); // Avoid div by 0
                                const y = 50 - (d.value / maxVal) * 40; // Scale to fit height
                                return `${x} ${y}`;
                            }).join(' L ')}`}
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-sm"
                        />

                        {/* Points */}
                        {data.trends.map((d, i) => {
                            const x = (i / (data.trends.length - 1)) * 100;
                            const maxVal = Math.max(...data.trends.map(t => t.value), 1);
                            const y = 50 - (d.value / maxVal) * 40;
                            return (
                                <motion.circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r="1.5"
                                    fill="white"
                                    stroke="#f97316"
                                    strokeWidth="1"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                />
                            );
                        })}
                    </svg>

                    {/* X-Axis Labels */}
                    <div className="flex justify-between mt-4">
                        {data.trends.map((d, i) => (
                            <span key={i} className="text-xs text-gray-400 font-medium">{d.label}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Program Form Component
function ProgramForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: Program | null }) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [category, setCategory] = useState(initialData?.category || "School Programs");
    const [description, setDescription] = useState(initialData?.description || "");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            let imageUrl = imagePreview;

            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `programs/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('ignite-media')
                    .upload(filePath, image);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('ignite-media')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            if (initialData) {
                // Update
                const { error: updateError } = await supabase
                    .from('programs')
                    .update({
                        title,
                        category,
                        description,
                        image_url: imageUrl,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', initialData.id);

                if (updateError) throw updateError;
                setMessage({ type: 'success', text: 'Program updated successfully!' });
            } else {
                // Insert
                const { error: insertError } = await supabase
                    .from('programs')
                    .insert([{
                        title,
                        category,
                        description,
                        image_url: imageUrl
                    }]);

                if (insertError) throw insertError;
                setMessage({ type: 'success', text: 'Program saved successfully!' });
                setTitle("");
                setDescription("");
                setImage(null);
                setImagePreview(null);
            }

            if (onSuccess) {
                setTimeout(onSuccess, 1500);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error saving program';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Program Details</h3>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., School Art Initiative"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                        <option>School Programs</option>
                        <option>Community Programs</option>
                        <option>Workshop Series</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the program..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer overflow-hidden relative"
                    >
                        {imagePreview ? (
                            <div className="absolute inset-0">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    unoptimized={imagePreview.startsWith('data:')}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <p className="text-white text-sm font-medium">Click to change image</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Program
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setTitle("");
                            setDescription("");
                            setImagePreview(null);
                            setImage(null);
                        }}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

// Project Form Component
function ProjectForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: Project | null }) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [status, setStatus] = useState(initialData?.status || "Ongoing");
    const [description, setDescription] = useState(initialData?.description || "");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            let imageUrl = imagePreview;

            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `projects/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('ignite-media')
                    .upload(filePath, image);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('ignite-media')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            // Create simple slug from title if not already present
            const slug = initialData?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            if (initialData) {
                // Update
                const { error: updateError } = await supabase
                    .from('projects')
                    .update({
                        title,
                        status,
                        description,
                        image_url: imageUrl,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', initialData.id);

                if (updateError) throw updateError;
                setMessage({ type: 'success', text: 'Project updated successfully!' });
            } else {
                // Insert
                const { error: insertError } = await supabase
                    .from('projects')
                    .insert([{
                        title,
                        status,
                        description,
                        image_url: imageUrl,
                        slug
                    }]);

                if (insertError) throw insertError;
                setMessage({ type: 'success', text: 'Project saved successfully!' });
                setTitle("");
                setDescription("");
                setImage(null);
                setImagePreview(null);
            }

            if (onSuccess) {
                setTimeout(onSuccess, 1500);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error saving project';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Project Details</h3>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Community Mural Project"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                        <option>Ongoing</option>
                        <option>Completed</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the project..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer overflow-hidden relative"
                    >
                        {imagePreview ? (
                            <div className="absolute inset-0">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    unoptimized={imagePreview.startsWith('data:')}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <p className="text-white text-sm font-medium">Click to change image</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Project
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setTitle("");
                            setDescription("");
                            setImagePreview(null);
                            setImage(null);
                        }}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

// Event Form Component
function EventForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: Event | null }) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [venue, setVenue] = useState(initialData?.venue || "");
    const [eventDate, setEventDate] = useState(initialData?.event_date || "");
    const [startTime, setStartTime] = useState(initialData?.start_time || "");
    const [endTime, setEndTime] = useState(initialData?.end_time || "");
    const [ticketPrice, setTicketPrice] = useState(initialData?.ticket_price || "");
    const [category, setCategory] = useState(initialData?.category || "Workshop");
    const [purchaseMethods, setPurchaseMethods] = useState<{ method: string; details: string }[]>(
        initialData?.purchase_methods || [{ method: "", details: "" }]
    );
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddPurchaseMethod = () => {
        setPurchaseMethods([...purchaseMethods, { method: "", details: "" }]);
    };

    const handleRemovePurchaseMethod = (index: number) => {
        setPurchaseMethods(purchaseMethods.filter((_, i) => i !== index));
    };

    const handlePurchaseMethodChange = (index: number, field: 'method' | 'details', value: string) => {
        const updated = [...purchaseMethods];
        updated[index][field] = value;
        setPurchaseMethods(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            let imageUrl = initialData?.image_url || null;

            // Upload image if new one selected
            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('ignite-media')
                    .upload(`events/${fileName}`, image);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('ignite-media')
                    .getPublicUrl(`events/${fileName}`);

                imageUrl = publicUrl;
            }

            const eventData = {
                title,
                description,
                venue,
                event_date: eventDate,
                start_time: startTime,
                end_time: endTime,
                ticket_price: ticketPrice,
                category,
                purchase_methods: purchaseMethods.filter(pm => pm.method && pm.details),
                image_url: imageUrl,
                updated_at: new Date().toISOString()
            };

            if (initialData) {
                // Update existing event
                const { error } = await supabase
                    .from('events')
                    .update(eventData)
                    .eq('id', initialData.id);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Event updated successfully!' });
            } else {
                // Create new event
                const { error } = await supabase
                    .from('events')
                    .insert([eventData]);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Event created successfully!' });
            }

            setTimeout(() => {
                onSuccess?.();
            }, 1000);
        } catch (error: unknown) {
            console.error('Error submitting event:', error);
            console.error('Error type:', typeof error);
            console.error('Error details:', JSON.stringify(error, null, 2));

            let errorMessage = 'An unknown error occurred';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null) {
                // Supabase errors are often plain objects
                const errorObj = error as { message?: string; error_description?: string };
                errorMessage = errorObj.message || errorObj.error_description || JSON.stringify(error);
            }

            setMessage({ type: 'error', text: `Error: ${errorMessage}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {initialData ? 'Edit Event' : 'Create New Event'}
            </h3>

            {message && (
                <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    <div className="flex items-center gap-2">
                        {message.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <p className="font-medium">{message.text}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            required
                            placeholder="e.g., Art Exhibition 2026"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Venue *</label>
                        <input
                            type="text"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            required
                            placeholder="e.g., Nakuru Art Center"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                        <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Price</label>
                        <input
                            type="text"
                            value={ticketPrice}
                            onChange={(e) => setTicketPrice(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="e.g., KES 500 or Free"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            required
                        >
                            <option value="Workshop">Workshop</option>
                            <option value="Exhibition">Exhibition</option>
                            <option value="Community Event">Community Event</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        placeholder="Describe the event..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Purchase Methods</label>
                    <div className="space-y-3">
                        {purchaseMethods.map((pm, index) => (
                            <div key={index} className="flex gap-3 items-start">
                                <input
                                    type="text"
                                    value={pm.method}
                                    onChange={(e) => handlePurchaseMethodChange(index, 'method', e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Method (e.g., M-Pesa, Bank Transfer)"
                                />
                                <input
                                    type="text"
                                    value={pm.details}
                                    onChange={(e) => handlePurchaseMethodChange(index, 'details', e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Details (e.g., 0712345678, Account #)"
                                />
                                {purchaseMethods.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePurchaseMethod(index)}
                                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddPurchaseMethod}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Payment Method
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Event Image</label>
                    <div className="flex items-start gap-4">
                        {imagePreview && (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                        <div className="flex-1">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Upload className="w-5 h-5" />
                                {imagePreview ? 'Change Image' : 'Upload Image'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {initialData ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {initialData ? 'Update Event' : 'Create Event'}
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => onSuccess?.()}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <X className="w-5 h-5" />
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

// Image Upload Widget
function ImageUploadWidget() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        const { data } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(8);

        if (data) setImages(data);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setMessage(null);

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `gallery/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('ignite-media')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('ignite-media')
                    .getPublicUrl(filePath);

                const { error: insertError } = await supabase
                    .from('gallery')
                    .insert([{
                        image_url: publicUrl,
                        alt_text: file.name
                    }]);

                if (insertError) throw insertError;
            }

            setMessage({ type: 'success', text: 'Images uploaded successfully!' });
            fetchGallery();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error uploading images';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        try {
            // Delete from Storage
            const path = imageUrl.split('ignite-media/')[1];
            if (path) {
                await supabase.storage.from('ignite-media').remove([path]);
            }

            // Delete from Database
            const { error } = await supabase.from('gallery').delete().match({ id });
            if (error) throw error;

            fetchGallery();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(errorMessage);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Images</h3>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept="image/*"
                className="hidden"
            />

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50/50 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {uploading ? (
                    <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                ) : (
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                )}
                <p className="text-lg font-medium text-gray-700 mb-2">
                    {uploading ? 'Uploading your magic...' : 'Drop images here or click to browse'}
                </p>
                <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF (max 10MB each)</p>
            </div>

            <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Uploads</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img) => (
                        <div key={img.id} className="aspect-square bg-gray-100 rounded-xl relative group overflow-hidden border border-gray-100">
                            <Image
                                src={img.image_url}
                                alt={img.alt_text}
                                fill
                                className="object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleDelete(img.id, img.image_url)}
                                    className="p-2 bg-white rounded-lg hover:bg-red-50 text-red-600 transition-colors shadow-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && !uploading && (
                        <div className="col-span-full py-12 text-center text-gray-400 italic text-sm">
                            No images uploaded yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Settings Form Component
function SettingsForm() {
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [heroImageUrl, setHeroImageUrl] = useState("");
    const [galleryHeroImageUrl, setGalleryHeroImageUrl] = useState("");
    const [aboutContent, setAboutContent] = useState("");
    const [missionStatement, setMissionStatement] = useState("");
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (data) {
            setHeroTitle(data.hero_title || "");
            setHeroSubtitle(data.hero_subtitle || "");
            setHeroImageUrl(data.hero_image_url || "");
            setGalleryHeroImageUrl(data.gallery_hero_image_url || "");
            setAboutContent(data.about_content || "");
            setMissionStatement(data.mission_statement || "");
        }
    };

    const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingHero(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const fileExt = file.name.split('.').pop();
            const fileName = `hero-image-${Date.now()}.${fileExt}`;

            const { error: uploadError, data } = await supabase.storage
                .from('images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(data.path);

            setHeroImageUrl(publicUrl);
            setMessage({ type: 'success', text: 'Hero image uploaded! Remember to save.' });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Upload error';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setUploadingHero(false);
        }
    };

    const handleGalleryHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingGallery(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const fileExt = file.name.split('.').pop();
            const fileName = `gallery-hero-${Date.now()}.${fileExt}`;

            const { error: uploadError, data } = await supabase.storage
                .from('images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(data.path);

            setGalleryHeroImageUrl(publicUrl);
            setMessage({ type: 'success', text: 'Gallery image uploaded! Remember to save.' });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Upload error';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setUploadingGallery(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from('profiles')
                .update({
                    hero_title: heroTitle,
                    hero_subtitle: heroSubtitle,
                    hero_image_url: heroImageUrl,
                    gallery_hero_image_url: galleryHeroImageUrl,
                    about_content: aboutContent,
                    mission_statement: missionStatement,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error updating settings';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Homepage Settings</h3>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                    <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                    <textarea
                        rows={3}
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image (Free Art Education Tile)</label>
                    {!heroImageUrl ? (
                        <div className="flex gap-4 items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleHeroImageUpload}
                                disabled={uploadingHero}
                                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-50"
                            />
                            {uploadingHero && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="relative inline-block">
                                <Image
                                    src={heroImageUrl}
                                    alt="Hero Preview"
                                    width={160}
                                    height={160}
                                    className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
                                />
                            </div>
                            <div className="flex gap-2">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
                                    <Upload className="w-4 h-4" />
                                    Change Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleHeroImageUpload}
                                        disabled={uploadingHero}
                                        className="hidden"
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setHeroImageUrl("")}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Hero Image</label>
                    {!galleryHeroImageUrl ? (
                        <div className="flex gap-4 items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleGalleryHeroImageUpload}
                                disabled={uploadingGallery}
                                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-50"
                            />
                            {uploadingGallery && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="relative inline-block">
                                <Image
                                    src={galleryHeroImageUrl}
                                    alt="Gallery Preview"
                                    width={160}
                                    height={160}
                                    className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
                                />
                            </div>
                            <div className="flex gap-2">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
                                    <Upload className="w-4 h-4" />
                                    Change Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleGalleryHeroImageUpload}
                                        disabled={uploadingGallery}
                                        className="hidden"
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setGalleryHeroImageUrl("")}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">About Content</label>
                    <textarea
                        rows={5}
                        value={aboutContent}
                        onChange={(e) => setAboutContent(e.target.value)}
                        placeholder="Write about your organization..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                    <textarea
                        rows={3}
                        value={missionStatement}
                        onChange={(e) => setMissionStatement(e.target.value)}
                        placeholder="Your mission statement..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Settings
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={fetchSettings}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

// Premium Dashboard Footer
// Messages List Component
function MessagesList() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error(error);
        if (data) setMessages(data as ContactMessage[]);
        setLoading(false);
    };

    useEffect(() => {
        let isMounted = true;

        const loadMessages = async () => {
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });

            if (isMounted) {
                if (error) console.error(error);
                if (data) setMessages(data as ContactMessage[]);
                setLoading(false);
            }
        };

        loadMessages();

        return () => {
            isMounted = false;
        };
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('contacts')
            .update({ status })
            .eq('id', id);

        if (error) alert(error.message);
        else fetchMessages();
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-medium">
                        <tr>
                            <th className="px-6 py-4">Sender</th>
                            <th className="px-6 py-4">Subject & Message</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {messages.map((msg) => (
                            <tr key={msg.id} className={`hover:bg-gray-50 transition-colors ${msg.status === 'unread' ? 'bg-orange-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {msg.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{msg.name}</p>
                                            <p className="text-xs text-gray-500">{msg.email}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{new Date(msg.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 max-w-md">
                                    <p className="text-sm font-bold text-gray-900">{msg.subject || 'No Subject'}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{msg.message}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${msg.status === 'unread' ? 'bg-orange-100 text-orange-600' :
                                        msg.status === 'read' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {msg.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 text-gray-400">
                                        {msg.status === 'unread' && (
                                            <button
                                                onClick={() => updateStatus(msg.id, 'read')}
                                                className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Mark as Read"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => updateStatus(msg.id, 'archived')}
                                            className="p-2 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Archive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {messages.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                    No messages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


// Resources Section
function ResourcesSection() {
    const [view, setView] = useState<"list" | "add" | "edit">("list");
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string, imageUrl: string | null }>({
        isOpen: false,
        id: '',
        imageUrl: null
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchResources = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setResources(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const { error } = await supabase.from('resources').delete().eq('id', deleteModal.id);
            if (error) throw error;

            if (deleteModal.imageUrl) {
                const path = deleteModal.imageUrl.split('/').pop();
                if (path) {
                    await supabase.storage.from('ignite-media').remove([`resources/${path}`]);
                }
            }

            setResources(resources.filter(r => r.id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: '', imageUrl: null });
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting resource");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (resource: Resource) => {
        setEditingResource(resource);
        setView("edit");
    };

    if (view === "add" || view === "edit") {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setView("list")}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                </button>
                <ResourceForm
                    onSuccess={() => {
                        setView("list");
                        fetchResources();
                    }}
                    initialData={editingResource}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Resources</h2>
                    <p className="text-gray-600 mt-2">Manage articles and blog posts</p>
                </div>
                <button
                    onClick={() => {
                        setEditingResource(null);
                        setView("add");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Resource
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : resources.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Title</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Type</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Created</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {resources.map((resource) => (
                                <tr key={resource.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                {resource.image_url ? (
                                                    <Image src={resource.image_url} alt="" fill className="object-cover" />
                                                ) : (
                                                    <Briefcase className="w-5 h-5 text-gray-400 m-2.5" />
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-900">{resource.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${resource.type === 'article' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {resource.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${resource.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {resource.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(resource.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(resource)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ isOpen: true, id: resource.id, imageUrl: resource.image_url })}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ConfirmModal
                        isOpen={deleteModal.isOpen}
                        onClose={() => setDeleteModal({ isOpen: false, id: '', imageUrl: null })}
                        onConfirm={handleDelete}
                        title="Delete Resource"
                        message="Are you sure you want to delete this resource? This action cannot be undone."
                        isLoading={isDeleting}
                    />
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
                    <p className="text-gray-500 mt-1">Start by adding your first article or blog post</p>
                    <button
                        onClick={() => setView("add")}
                        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add First Resource
                    </button>
                </div>
            )}
        </div>
    );
}

// Resource Form Component
function ResourceForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: Resource | null }) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [type, setType] = useState<'article' | 'blog'>(initialData?.type || "article");
    const [content, setContent] = useState(initialData?.content || "");
    const [published, setPublished] = useState(initialData?.published || false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            let imageUrl = imagePreview;

            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `resources/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('ignite-media')
                    .upload(filePath, image);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('ignite-media')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            const slug = generateSlug(title);

            if (initialData) {
                // Update
                const { error: updateError } = await supabase
                    .from('resources')
                    .update({
                        title,
                        type,
                        content,
                        published,
                        image_url: imageUrl,
                        slug,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', initialData.id);

                if (updateError) throw updateError;
                setMessage({ type: 'success', text: 'Resource updated successfully!' });
            } else {
                // Insert
                const { error: insertError } = await supabase
                    .from('resources')
                    .insert([{
                        title,
                        type,
                        content,
                        published,
                        image_url: imageUrl,
                        slug
                    }]);

                if (insertError) throw insertError;
                setMessage({ type: 'success', text: 'Resource saved successfully!' });
            }

            if (onSuccess) {
                setTimeout(onSuccess, 1500);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error saving resource';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resource Details</h3>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Resource title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'article' | 'blog')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        >
                            <option value="article">Article</option>
                            <option value="blog">Blog Post</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your content here..."
                        rows={10}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 py-2">
                    <input
                        type="checkbox"
                        id="published"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Publish this resource
                    </label>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Feature Image</label>
                    <div className="flex items-start gap-4">
                        <div className="relative w-32 h-32 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-gray-300" />
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mb-2"
                            >
                                <Upload className="w-4 h-4" />
                                {imagePreview ? 'Change Image' : 'Upload Image'}
                            </button>
                            <p className="text-xs text-gray-500">Recommended size: 1200x630px. Max 5MB.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {initialData ? 'Update Resource' : 'Save Resource'}
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => onSuccess?.()}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <X className="w-5 h-5" />
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

function DashboardFooter() {
    return (
        <footer className="mt-12 py-6 border-t border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 ring-1 ring-gray-200 bg-white px-3 py-1.5 rounded-full shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">System Live</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                        &copy; {new Date().getFullYear()} Ignite Kenya. Internal Admin System
                    </p>
                </div>

                <div className="flex items-center gap-6 text-xs font-semibold text-gray-400">
                    <a href="#" className="hover:text-primary transition-colors">Documentation</a>
                    <a href="#" className="hover:text-primary transition-colors">Support</a>
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                </div>
            </div>
        </footer>
    );
}



